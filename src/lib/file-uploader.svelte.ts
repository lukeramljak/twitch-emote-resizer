import type { FileUploadEvent, ImageMetadata } from './types';
import { parseGifFile, parseImageFile, parseSvgFile } from './utils/file-processing';

export class FileUploader {
  /** The processed image content as a data URL (for regular images) or object URL (for SVGs) */
  imageContent = $state('');
  /** The raw file content as a string */
  rawContent = $state('');
  /** Metadata about the uploaded image including dimensions and filename */
  imageMetadata = $state<ImageMetadata | undefined>(undefined);

  private processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      this.rawContent = content;

      if (file.type === 'image/svg+xml') {
        const { content: svgContent, metadata } = parseSvgFile(content, file.name);
        this.imageContent = svgContent;
        this.imageMetadata = metadata;
      } else if (file.type === 'image/gif') {
        const { content: gifContent, metadata } = await parseGifFile(content, file.name);
        this.imageContent = gifContent;
        this.imageMetadata = metadata;
      } else {
        const { content: imgContent, metadata } = await parseImageFile(content, file.name);
        this.imageContent = imgContent;
        this.imageMetadata = metadata;
      }
    };

    if (file.type === 'image/svg+xml') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  /** Handler for file input change events */
  handleFileUpload = (file: File) => {
    return this.processFile(file);
  };

  /** Handler for file input change events */
  handleFileUploadEvent = (e: FileUploadEvent) => {
    if (!e.currentTarget || !e.currentTarget.files) return;
    const file = e.currentTarget.files[0];
    if (file) {
      this.processFile(file);
    }
  };

  /** Resets the upload state */
  reset = () => {
    this.imageContent = '';
    this.imageMetadata = undefined;
  };
}
