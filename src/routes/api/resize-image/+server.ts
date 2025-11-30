import type { ImageMetadata, ResizedImage } from '$lib/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import sharp from 'sharp';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const base64String = formData.get('file') as string;
    const metadata = JSON.parse(formData.get('metadata') as string) as ImageMetadata;

    const cleanedBase64 = base64String.replace(/^data:image\/(png|gif|jpeg|jpg|webp);base64,/, '');

    const buffer = Buffer.from(cleanedBase64, 'base64');

    const emoteSizes = [112, 56, 28];
    const badgeSizes = [72, 36, 18];

    const resizeAndConstrain = async (size: number): Promise<ResizedImage> => {
      const maxKB = 25;
      let colors = 256;

      let out = await sharp(buffer)
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

    return json({ emotes, badges }, { status: 200 });
  } catch (error) {
    console.error('Error resizing image:', error);
    return json({ error: 'Error resizing image' }, { status: 500 });
  }
};
