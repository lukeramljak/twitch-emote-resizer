import type { ResizedImage } from '$lib/types';
import JSZip from 'jszip';

export const bytesToKilobytes = (bytes: number): string => {
  return (bytes / 1024).toFixed(2);
};

export const stripFileExtension = (fileName: string): string => {
  return fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
};

export const generateFileName = (image: ResizedImage): string => {
  const extension = image.type === 'image' ? 'png' : 'gif';
  return `${stripFileExtension(image.metadata.name)}@${image.metadata.width}.${extension}`;
};

export const downloadImage = (image: ResizedImage): void => {
  const link = document.createElement('a');
  link.href = image.content;
  link.download = generateFileName(image);
  link.click();
};

export const downloadImagesToZip = async (images: ResizedImage[]) => {
  if (!images.length) return;

  const zip = new JSZip();

  for (const image of images) {
    const imgBuffer = await (await fetch(image.content)).arrayBuffer();
    const fileName = generateFileName(image);

    zip.file(fileName, imgBuffer);
  }

  const gen = await zip.generateAsync({ type: 'uint8array' });
  const blob = new Blob([gen as BlobPart], { type: 'application/zip' });

  const zipUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = zipUrl;
  link.download = `${stripFileExtension(images[0].metadata.name)}.zip`;
  link.click();

  URL.revokeObjectURL(zipUrl);
};
