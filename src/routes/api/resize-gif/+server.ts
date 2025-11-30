import type { ImageMetadata, ResizedImage } from '$lib/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import sharp from 'sharp';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const base64String = formData.get('file') as string;
    const metadata = JSON.parse(formData.get('metadata') as string) as ImageMetadata;
    const cleanedBase64 = base64String.replace(/^data:image\/(png|gif|jpeg);base64,/, '');

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

    return json(resizedImages, { status: 200 });
  } catch {
    return json({ error: 'Error resizing GIF' }, { status: 500 });
  }
};
