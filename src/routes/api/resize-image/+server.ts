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

    const resizeToSizes = async (sizes: number[]): Promise<ResizedImage[]> => {
      return await Promise.all(
        sizes.map(async (size) => {
          const resizedImage = await sharp(buffer)
            .resize({
              width: size,
              height: size,
              fit: 'cover',
              position: 'center'
            })
            .png({ compressionLevel: 0 })
            .toBuffer();

          const fileSize = (Buffer.byteLength(resizedImage) / 1024).toFixed(2); // File size in KB
          const base64WithPrefix = `data:image/png;base64,${resizedImage.toString('base64')}`;

          return {
            content: base64WithPrefix,
            fileSize,
            metadata: {
              width: size,
              height: size,
              name: metadata?.name ?? 'image'
            },
            type: 'image'
          };
        })
      );
    };

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
