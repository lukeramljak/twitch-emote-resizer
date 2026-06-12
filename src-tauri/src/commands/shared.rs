use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct ImageMetadata {
    pub width: u32,
    pub height: u32,
    pub name: String,
}

#[derive(Serialize, Clone)]
pub struct ResizedImage {
    pub content: String,
    #[serde(rename = "fileSize")]
    pub file_size: String,
    pub metadata: ResizedImageMetadata,
    #[serde(rename = "type")]
    pub image_type: String,
}

#[derive(Serialize, Clone)]
pub struct ResizedImageMetadata {
    pub width: u32,
    pub height: u32,
    pub name: String,
}

pub fn strip_data_url(data_url: &str) -> &str {
    if let Some(pos) = data_url.find(',') {
        &data_url[pos + 1..]
    } else {
        data_url
    }
}

pub struct CoverCrop {
    pub scale: f32,
    pub crop_x: u32,
    pub crop_y: u32,
}

pub fn calculate_cover_crop(src_width: u32, src_height: u32, target_size: u32) -> CoverCrop {
    let src_w = src_width as f32;
    let src_h = src_height as f32;
    let target = target_size as f32;

    let scale = (target / src_w).max(target / src_h);
    let scaled_w = (src_w * scale) as u32;
    let scaled_h = (src_h * scale) as u32;

    let crop_x = if scaled_w > target_size {
        (scaled_w - target_size) / 2
    } else {
        0
    };
    let crop_y = if scaled_h > target_size {
        (scaled_h - target_size) / 2
    } else {
        0
    };

    CoverCrop { scale, crop_x, crop_y }
}
