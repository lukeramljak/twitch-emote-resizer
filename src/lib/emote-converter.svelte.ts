import type { ImageMetadata, ResizedImage } from './types';

export class EmoteConverter {
  converting = $state(false);
  error = $state('');
  emotes = $state<ResizedImage[]>([]);
  badges = $state<ResizedImage[]>([]);

  private convertGif = async (base64: string, metadata: ImageMetadata) => {
    const formData = new FormData();
    formData.append('file', base64);
    formData.append('metadata', JSON.stringify(metadata));

    const response = await fetch('/api/resize-gif', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to resize GIF. Please try again');
    }

    const result: ResizedImage[] = await response.json();
    return result || [];
  };

  private convertImageAPI = async (base64: string, metadata: ImageMetadata) => {
    const formData = new FormData();
    formData.append('file', base64);
    formData.append('metadata', JSON.stringify(metadata));

    const response = await fetch('/api/resize-image', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to resize image. Please try again');
    }

    const result: { emotes: ResizedImage[]; badges: ResizedImage[] } = await response.json();
    return result;
  };

  convertImage = async (imageContent: string, imageMetadata: ImageMetadata) => {
    this.converting = true;
    this.error = '';

    try {
      const { emotes, badges } = await this.convertImageAPI(imageContent, imageMetadata);

      this.emotes = emotes;
      this.badges = badges;

      return true;
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Failed to convert images. Please try again';
      return false;
    } finally {
      this.converting = false;
    }
  };

  convertAnimated = async (base64: string, metadata: ImageMetadata) => {
    this.converting = true;
    this.error = '';

    try {
      this.emotes = await this.convertGif(base64, metadata);
      return true;
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'An unexpected error occurred';
      return false;
    } finally {
      this.converting = false;
    }
  };

  reset = () => {
    this.emotes = [];
    this.badges = [];
    this.error = '';
  };
}
