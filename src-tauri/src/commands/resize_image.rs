use anyhow::{anyhow, Result};
use base64::{engine::general_purpose, Engine};
use fast_image_resize as fr;
use image::{ImageReader, RgbaImage};
use imagequant::QuantizationError;
use std::io::Cursor;

use super::shared::{
    calculate_cover_crop, strip_data_url, ImageMetadata, ResizedImage, ResizedImageMetadata,
};

#[derive(serde::Serialize)]
pub struct ResizeImageResult {
    pub emotes: Vec<ResizedImage>,
    pub badges: Vec<ResizedImage>,
}

#[tauri::command]
pub async fn resize_image(
    file: String,
    metadata: ImageMetadata,
) -> Result<ResizeImageResult, String> {
    tokio::task::spawn_blocking(move || {
        _resize_image_sync(file, metadata)
    })
    .await
    .map_err(|e| e.to_string())?
    .map_err(|e| e.to_string())
}

fn _resize_image_sync(file: String, metadata: ImageMetadata) -> Result<ResizeImageResult> {
    let cleaned = strip_data_url(&file);
    let bytes = general_purpose::STANDARD
        .decode(cleaned)
        .map_err(|e| anyhow!("Failed to decode base64: {}", e))?;

    let img = ImageReader::new(Cursor::new(&bytes))
        .map_err(|e| anyhow!("Failed to read image: {}", e))?
        .decode()
        .map_err(|e| anyhow!("Failed to decode image: {}", e))?
        .into_rgba8();

    let emote_sizes = [112u32, 56, 28];
    let badge_sizes = [72u32, 36, 18];
    let max_kb = 25usize;

    let emotes = emote_sizes
        .iter()
        .map(|&sz| resize_and_quantize(&img, sz, max_kb, &metadata.name, "image/png"))
        .collect::<Result<Vec<_>>>()?;

    let badges = badge_sizes
        .iter()
        .map(|&sz| resize_and_quantize(&img, sz, max_kb, &metadata.name, "image/png"))
        .collect::<Result<Vec<_>>>()?;

    Ok(ResizeImageResult { emotes, badges })
}

fn resize_and_quantize(
    img: &RgbaImage,
    target_size: u32,
    max_kb: usize,
    filename: &str,
    mime_type: &str,
) -> Result<ResizedImage> {
    let (width, height) = img.dimensions();
    let crop = calculate_cover_crop(width, height, target_size);

    // Resize with Lanczos3
    let resized_width = (width as f32 * crop.scale) as u32;
    let resized_height = (height as f32 * crop.scale) as u32;

    let mut src_image = fr::Image::from_vec_u8(
        std::num::NonZeroU32::new(width).unwrap(),
        std::num::NonZeroU32::new(height).unwrap(),
        img.to_vec(),
        fr::PixelType::U8x4,
    )
    .map_err(|e| anyhow!("Failed to create image for resizing: {}", e))?;

    let mut dst_image = fr::Image::new(
        std::num::NonZeroU32::new(resized_width).unwrap(),
        std::num::NonZeroU32::new(resized_height).unwrap(),
        fr::PixelType::U8x4,
    );

    let mut resizer = fr::Resizer::new(fr::ResizeAlg::Convolution(fr::FilterType::Lanczos3));
    resizer
        .resize(&src_image, &mut dst_image)
        .map_err(|e| anyhow!("Failed to resize image: {}", e))?;

    // Crop to target size
    let cropped = crop_image_rgba(&dst_image, crop.crop_x, crop.crop_y, target_size);

    // Quantize and encode with size constraints
    let mut colors = 256u8;
    loop {
        let result = quantize_and_encode_png(&cropped, colors as usize)?;

        if result.len() <= max_kb * 1024 || colors <= 2 {
            let file_size = format!("{:.2}", result.len() as f64 / 1024.0);
            return Ok(ResizedImage {
                content: format!("data:{};base64,{}", mime_type, general_purpose::STANDARD.encode(&result)),
                file_size,
                metadata: ResizedImageMetadata {
                    width: target_size,
                    height: target_size,
                    name: filename.to_string(),
                },
                image_type: "image".to_string(),
            });
        }

        colors = (colors / 2).max(2);
    }
}

fn crop_image_rgba(
    image: &fr::Image<u8>,
    x: u32,
    y: u32,
    size: u32,
) -> image::RgbaImage {
    let width = image.width().get();
    let height = image.height().get();
    let data = image.buffer();

    let mut cropped = image::RgbaImage::new(size, size);

    for crop_y in 0..size {
        for crop_x in 0..size {
            let src_x = (x + crop_x).min(width - 1);
            let src_y = (y + crop_y).min(height - 1);
            let src_idx = ((src_y * width + src_x) * 4) as usize;

            if src_idx + 3 < data.len() {
                cropped.put_pixel(
                    crop_x,
                    crop_y,
                    image::Rgba([
                        data[src_idx],
                        data[src_idx + 1],
                        data[src_idx + 2],
                        data[src_idx + 3],
                    ]),
                );
            }
        }
    }

    cropped
}

fn quantize_and_encode_png(
    img: &image::RgbaImage,
    max_colors: usize,
) -> Result<Vec<u8>> {
    let (width, height) = img.dimensions();

    // Convert RGBA to RGB for quantization
    let rgb_data: Vec<u8> = img
        .pixels()
        .flat_map(|p| vec![p[0], p[1], p[2]])
        .collect();

    // Create attribute and quantizer
    let mut liq = imagequant::new();
    liq.set_max_colors(max_colors)
        .map_err(|e| anyhow!("Failed to set max colors: {:?}", e))?;

    let image = liq
        .new_image(&rgb_data, width as usize, height as usize, 0.0)
        .map_err(|e| anyhow!("Failed to create image for quantization: {}", e))?;

    let mut res = liq
        .quantize(&image)
        .map_err(|e| anyhow!("Failed to quantize image: {}", e))?;

    res.set_dithering_level(1.0)
        .map_err(|e| anyhow!("Failed to set dithering: {}", e))?;

    let (palette, pixels) = res
        .remapped()
        .map_err(|e| anyhow!("Failed to remap image: {}", e))?;

    // Encode to PNG with indexed color
    let mut png_bytes = Vec::new();
    {
        use image::ImageEncoder;
        let encoder = image::codecs::png::PngEncoder::new(&mut png_bytes);

        // Create an indexed image
        let indexed_img = image::DynamicImage::ImageRgba8(create_indexed_rgba(
            &palette,
            &pixels,
            width as usize,
            height as usize,
        ));

        encoder
            .write_image(
                indexed_img.as_bytes(),
                width,
                height,
                image::ColorType::Rgba8,
            )
            .map_err(|e| anyhow!("Failed to encode PNG: {}", e))?;
    }

    Ok(png_bytes)
}

fn create_indexed_rgba(
    palette: &imagequant::Palette,
    pixels: &[u8],
    width: usize,
    height: usize,
) -> image::RgbaImage {
    let mut img = image::RgbaImage::new(width as u32, height as u32);

    for (i, &pixel_idx) in pixels.iter().enumerate() {
        let color = palette.entry(pixel_idx as usize);
        img.put_pixel(
            (i % width) as u32,
            (i / width) as u32,
            image::Rgba([color.red, color.green, color.blue, color.alpha]),
        );
    }

    img
}
