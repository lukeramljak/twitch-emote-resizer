import { command } from '$app/server';
import type { ResizedImage } from '$lib/types';
import sharp from 'sharp';
import * as v from 'valibot';

const imageSchema = v.object({
  file: v.string(),
  metadata: v.object({
    width: v.number(),
    height: v.number(),
    name: v.string()
  })
});

export const resizeImage = command(imageSchema, async ({ file, metadata }) => {
  const cleanedBase64 = file.replace(/^data:image\/(png|gif|jpeg|jpg|webp);base64,/, '');
  const buffer = Buffer.from(cleanedBase64, 'base64');

  const emoteSizes = [112, 56, 28];
  const badgeSizes = [72, 36, 18];

  const resizeAndConstrain = async (size: number): Promise<ResizedImage> => {
    const maxKB = 25;
    let colors = 256;

    let out = await sharp(buffer)
      .rotate()
      .resize({
        width: size,
        height: size,
        fit: 'cover',
        position: 'center'
      })
      .png({ compressionLevel: 0, palette: true, colors })
      .toBuffer();

    while (out.length > maxKB * 1024 && colors > 2) {
      colors = Math.floor(colors / 2);
      out = await sharp(buffer)
        .rotate()
        .resize(size, size, { fit: 'cover', position: 'center' })
        .png({ compressionLevel: 0, palette: true, colors })
        .toBuffer();
    }

    const base64 = `data:image/png;base64,${out.toString('base64')}`;

    return {
      content: base64,
      fileSize: (out.length / 1024).toFixed(2),
      metadata: {
        width: size,
        height: size,
        name: metadata?.name ?? 'image'
      },
      type: 'image'
    };
  };

  const resizeToSizes = async (sizes: number[]) => Promise.all(sizes.map(resizeAndConstrain));

  const [emotes, badges] = await Promise.all([
    resizeToSizes(emoteSizes),
    resizeToSizes(badgeSizes)
  ]);

  return { emotes, badges };
});

export const resizeGif = command(imageSchema, async ({ file, metadata }) => {
  const cleanedBase64 = file.replace(/^data:image\/(png|gif|jpeg);base64,/, '');
  const buffer = Buffer.from(cleanedBase64, 'base64');

  const sizes = [112, 56, 28];

  const resizedImages: ResizedImage[] = [];

  const resizeAndConstrain = async (size: number): Promise<ResizedImage> => {
    const maxKB = 1000;
    let colors = 256;

    let out = await sharp(buffer, { animated: true })
      .resize({
        width: size,
        height: size,
        fit: 'cover',
        position: 'center'
      })
      .gif({ colors })
      .toBuffer();

    while (out.length < maxKB * 1024 && colors < 2) {
      colors = Math.floor(colors / 2);
      out = await sharp(buffer, { animated: true })
        .resize({
          width: size,
          height: size,
          fit: 'cover',
          position: 'center'
        })
        .gif({ colors })
        .toBuffer();
    }

    const base64 = `data:image/gif;base64,${out.toString('base64')}`;

    return {
      content: base64,
      fileSize: (out.length / 1024).toFixed(2),
      metadata: {
        width: size,
        height: size,
        name: metadata?.name ?? 'animated'
      },
      type: 'gif'
    };
  };

  for (const size of sizes) {
    const resized = await resizeAndConstrain(size);
    resizedImages.push(resized);
  }

  return resizedImages;
});
