use anyhow::{anyhow, Result};
use base64::{engine::general_purpose, Engine};
use fast_image_resize as fr;
use gif::SetParameter;
use image::{ImageReader, RgbaImage};
use std::io::Cursor;

use super::shared::{
    calculate_cover_crop, strip_data_url, ImageMetadata, ResizedImage, ResizedImageMetadata,
};

#[tauri::command]
pub async fn resize_gif(
    file: String,
    metadata: ImageMetadata,
) -> Result<Vec<ResizedImage>, String> {
    tokio::task::spawn_blocking(move || {
        _resize_gif_sync(file, metadata)
    })
    .await
    .map_err(|e| e.to_string())?
    .map_err(|e| e.to_string())
}

fn _resize_gif_sync(file: String, metadata: ImageMetadata) -> Result<Vec<ResizedImage>> {
    let cleaned = strip_data_url(&file);
    let bytes = general_purpose::STANDARD
        .decode(cleaned)
        .map_err(|e| anyhow!("Failed to decode base64: {}", e))?;

    let emote_sizes = [112u32, 56, 28];

    let results = emote_sizes
        .iter()
        .map(|&sz| resize_gif_to_size(&bytes, sz, &metadata.name))
        .collect::<Result<Vec<_>>>()?;

    Ok(results)
}

fn resize_gif_to_size(bytes: &[u8], target_size: u32, filename: &str) -> Result<ResizedImage> {
    let mut decoder = gif::Decoder::new(Cursor::new(bytes));
    let mut reader = decoder
        .read_info()
        .map_err(|e| anyhow!("Failed to read GIF: {}", e))?;

    let width = reader.width() as u32;
    let height = reader.height() as u32;
    let crop = calculate_cover_crop(width, height, target_size);

    // Decode all frames
    let mut frames = Vec::new();
    let mut delays = Vec::new();

    while let Ok(Some(frame)) = reader.read_next_frame() {
        delays.push(frame.delay);
        frames.push(frame.buffer.to_vec());
    }

    if frames.is_empty() {
        return Err(anyhow!("GIF has no frames"));
    }

    // Resize frames using quantization with up to 256 colors
    let resized_frames = frames
        .iter()
        .zip(delays.iter())
        .map(|(frame_data, delay)| {
            resize_gif_frame(
                frame_data,
                width as usize,
                height as usize,
                crop.scale as u32,
                crop.crop_x,
                crop.crop_y,
                target_size,
                *delay,
            )
        })
        .collect::<Result<Vec<_>>>()?;

    // Encode to GIF
    let gif_bytes = encode_gif(&resized_frames, target_size)?;

    let file_size = format!("{:.2}", gif_bytes.len() as f64 / 1024.0);

    Ok(ResizedImage {
        content: format!("data:image/gif;base64,{}", general_purpose::STANDARD.encode(&gif_bytes)),
        file_size,
        metadata: ResizedImageMetadata {
            width: target_size,
            height: target_size,
            name: filename.to_string(),
        },
        image_type: "gif".to_string(),
    })
}

struct GifFrame {
    data: Vec<u8>,
    delay: u16,
}

fn resize_gif_frame(
    indexed_data: &[u8],
    src_width: usize,
    src_height: usize,
    scale: u32,
    crop_x: u32,
    crop_y: u32,
    target_size: u32,
    delay: u16,
) -> Result<GifFrame> {
    // Convert indexed pixels to RGBA using a standard palette
    // This is a simplified approach - in production, we'd extract the actual GIF palette
    let rgba_frame = create_rgba_from_indexed(indexed_data, src_width as u32, src_height as u32);

    // Resize frame
    let resized_width = (src_width as f32 * (scale as f32)) as u32;
    let resized_height = (src_height as f32 * (scale as f32)) as u32;

    let mut src_image = fr::Image::from_vec_u8(
        std::num::NonZeroU32::new(src_width as u32).unwrap(),
        std::num::NonZeroU32::new(src_height as u32).unwrap(),
        rgba_frame.to_vec(),
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
        .map_err(|e| anyhow!("Failed to resize frame: {}", e))?;

    // Crop to target size
    let cropped = crop_image_rgba(&dst_image, crop_x, crop_y, target_size);

    // Quantize to 256 colors for GIF
    let quantized = quantize_to_indexed(&cropped, 256)?;

    Ok(GifFrame {
        data: quantized,
        delay,
    })
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

fn quantize_to_indexed(img: &image::RgbaImage, max_colors: usize) -> Result<Vec<u8>> {
    let (width, height) = img.dimensions();

    let rgb_data: Vec<u8> = img
        .pixels()
        .flat_map(|p| vec![p[0], p[1], p[2]])
        .collect();

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

    let (_palette, pixels) = res
        .remapped()
        .map_err(|e| anyhow!("Failed to remap image: {}", e))?;

    Ok(pixels)
}

fn create_rgba_from_indexed(indexed: &[u8], width: u32, height: u32) -> image::RgbaImage {
    // Use a simple RGB(3,3,2) palette (216 colors) + grayscale for other indices
    let mut img = image::RgbaImage::new(width, height);

    for (i, &idx) in indexed.iter().enumerate() {
        let x = (i as u32) % width;
        let y = (i as u32) / width;

        let (r, g, b) = if idx < 216 {
            // RGB 3-3-2 palette
            let r = ((idx / 36) % 6) as u8 * 51;
            let g = ((idx / 6) % 6) as u8 * 51;
            let b = (idx % 6) as u8 * 85;
            (r, g, b)
        } else {
            // Grayscale for remaining indices
            let gray = 255 - ((idx as u16 - 216) * 255 / 40) as u8;
            (gray, gray, gray)
        };

        img.put_pixel(x, y, image::Rgba([r, g, b, 255]));
    }

    img
}

fn encode_gif(frames: &[GifFrame], size: u32) -> Result<Vec<u8>> {
    let mut gif_data = Vec::new();

    {
        let mut encoder = gif::Encoder::new(&mut gif_data, size as u16, size as u16, &[])
            .map_err(|e| anyhow!("Failed to create GIF encoder: {}", e))?;

        encoder
            .set(gif::Repeat::Infinite)
            .map_err(|e| anyhow!("Failed to set repeat: {}", e))?;

        for frame in frames {
            let mut gif_frame = gif::Frame::default();
            gif_frame.width = size as u16;
            gif_frame.height = size as u16;
            gif_frame.delay = frame.delay;
            gif_frame.buffer = std::borrow::Cow::Borrowed(&frame.data);

            encoder
                .write_frame(&gif_frame)
                .map_err(|e| anyhow!("Failed to write GIF frame: {}", e))?;
        }
    }

    Ok(gif_data)
}
