import { invoke } from '@tauri-apps/api/core';
import type { ProcessedFile } from './file-uploader.svelte';
import type { ResizedImage } from './types';

export interface Converted {
  name: string;
  type: 'image' | 'gif';
  badges?: ResizedImage[];
  emotes: ResizedImage[];
}

export class EmoteConverter {
  converting = $state(false);
  error = $state('');
  converted = $state<Converted[]>([]);

  convert = async (file: ProcessedFile): Promise<void> => {
    this.converting = true;
    this.error = '';

    const meta = file.imageMetadata;
    if (!meta) {
      this.error = 'Missing image metadata';
      this.converting = false;
      return;
    }

    const name = meta.name;
    const gif = name.toLowerCase().endsWith('.gif');

    try {
      if (gif) {
        if (!file.rawContent) {
          throw new Error('No GIF data');
        }

        const emotes = await invoke<ResizedImage[]>('resize_gif', {
          file: file.rawContent,
          metadata: meta
        });
        this.converted.push({ name, type: 'gif', emotes });
      } else {
        if (!file.imageContent) {
          throw new Error('No image data');
        }

        const resized = await invoke<{ emotes: ResizedImage[]; badges: ResizedImage[] }>(
          'resize_image',
          {
            file: file.imageContent,
            metadata: meta
          }
        );
        this.converted.push({
          name,
          type: 'image',
          emotes: resized.emotes,
          badges: resized.badges
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        this.error = `Failed to resize ${name}: ${error.message}`;
      } else if (typeof error === 'string') {
        this.error = `Failed to resize ${name}: ${error}`;
      } else {
        this.error = 'Failed to resize image: Unexpected error';
      }
    } finally {
      this.converting = false;
    }
  };

  reset = () => {
    this.converted = [];
    this.error = '';
    this.converting = false;
  };
}
