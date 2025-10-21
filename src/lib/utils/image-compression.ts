/**
 * Compresses an image to fit within body size limit
 */
export const compressImageIfNeeded = async (
  file: File,
  maxSizeMB: number = 2
): Promise<{ content: string; wasCompressed: boolean }> => {
  const maxBytes = maxSizeMB * 1024 * 1024;

  if (file.size <= maxBytes) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          content: e.target?.result as string,
          wasCompressed: false
        });
      };
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      let quality = 0.9;
      let attempts = 0;
      const maxAttempts = 5;

      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            if (blob.size <= maxBytes || attempts >= maxAttempts) {
              const finalReader = new FileReader();
              finalReader.onload = (e) => {
                resolve({
                  content: e.target?.result as string,
                  wasCompressed: true
                });
              };
              finalReader.readAsDataURL(blob);
            } else {
              quality -= 0.1;
              attempts++;
              tryCompress();
            }
          },
          'image/jpeg',
          quality
        );
      };

      tryCompress();
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };

    reader.readAsDataURL(file);
  });
};
