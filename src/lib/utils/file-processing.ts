import type { ImageMetadata } from '$lib/types';

export const parseSvgFile = (
  content: string,
  fileName: string
): Promise<{
  content: string;
  metadata: ImageMetadata;
}> => {
  return new Promise((resolve) => {
    const svgBlob = new Blob([content], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');
      ctx.drawImage(img, 0, 0);
      const pngDataUrl = canvas.toDataURL('image/png');
      URL.revokeObjectURL(svgUrl);

      resolve({
        content: pngDataUrl,
        metadata: {
          width: img.width,
          height: img.height,
          name: fileName
        }
      });
    };
    img.src = svgUrl;
  });
};

export const parseImageFile = (
  content: string,
  fileName: string
): Promise<{
  content: string;
  metadata: ImageMetadata;
}> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        content,
        metadata: {
          width: img.width,
          height: img.height,
          name: fileName
        }
      });
    };
    img.src = content;
  });
};

export const parseGifFile = (
  content: string,
  fileName: string
): Promise<{
  content: string;
  metadata: ImageMetadata;
}> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        content,
        metadata: {
          width: img.width,
          height: img.height,
          name: fileName
        }
      });
    };
    img.src = content;
  });
};
