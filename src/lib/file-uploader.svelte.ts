import type { FileUploadEvent, ImageMetadata } from './types';
import { parseGifFile, parseImageFile, parseSvgFile } from './utils/file-processing';

interface ProcessedFile {
  /** The processed image content as a data URL (for regular images) or object URL (for SVGs) */
  imageContent: string;
  /** The raw file content as a string */
  rawContent: string;
  /** Metadata about the uploaded image including dimensions and filename */
  imageMetadata: ImageMetadata | undefined;
}

export class FileUploader {
  processedFiles = $state<ProcessedFile[]>([]);

  private processFile = (file: File) => {
    const reader = new FileReader();
    const processedFile: ProcessedFile = {
      imageContent: '',
      rawContent: '',
      imageMetadata: undefined
    };

    reader.onload = async (e) => {
      const content = e.target?.result as string;
      processedFile.rawContent = content;

      if (file.type === 'image/svg+xml') {
        const { content: svgContent, metadata } = parseSvgFile(content, file.name);
        processedFile.imageContent = svgContent;
        processedFile.imageMetadata = metadata;
      } else if (file.type === 'image/gif') {
        const { content: gifContent, metadata } = await parseGifFile(content, file.name);
        processedFile.imageContent = gifContent;
        processedFile.imageMetadata = metadata;
      } else {
        const { content: imgContent, metadata } = await parseImageFile(content, file.name);
        processedFile.imageContent = imgContent;
        processedFile.imageMetadata = metadata;
      }

      this.processedFiles.push(processedFile);
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
    const files = e.currentTarget.files;

    for (const file of files) {
      this.processFile(file);
    }
  };

  /** Resets the upload state */
  reset = () => {
    this.processedFiles = [];
  };
}
