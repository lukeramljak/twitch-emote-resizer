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

    for (const size of sizes) {
      const resizedGif = await sharp(buffer, { animated: true })
        .resize({
          width: size,
          height: size,
          fit: 'cover',
          position: 'center'
        })
        .gif()
        .toBuffer();

      const fileSize = (Buffer.byteLength(resizedGif) / 1024).toFixed(2); // File size in KB

      const base64WithPrefix = `data:image/gif;base64,${resizedGif.toString('base64')}`;

      resizedImages.push({
        content: base64WithPrefix,
        fileSize,
        metadata: {
          width: size,
          height: size,
          name: metadata?.name ?? 'animated'
        },
        type: 'gif'
      });
    }

    return json(resizedImages, { status: 200 });
  } catch {
    return json({ error: 'Error resizing GIF' }, { status: 500 });
  }
};
