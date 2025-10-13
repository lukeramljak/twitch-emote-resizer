import type { FileUploadEvent, ImageMetadata } from './types';
import { parseGifFile, parseImageFile, parseSvgFile } from './utils/file-processing';
import { compressImageIfNeeded } from './utils/image-compression';

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

  private processFile = async (file: File) => {
    const isGif = file.type === 'image/gif';
    const isSvg = file.type === 'image/svg+xml';

    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      if (isGif) {
        alert(
          `GIF file "${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)}MB. Large GIFs may fail to process. Consider reducing file size or frame count.`
        );
      }
    }

    const processedFile: ProcessedFile = {
      imageContent: '',
      rawContent: '',
      imageMetadata: undefined
    };

    if (isSvg) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        processedFile.rawContent = content;
        const { content: svgContent, metadata } = parseSvgFile(content, file.name);
        processedFile.imageContent = svgContent;
        processedFile.imageMetadata = metadata;
        this.processedFiles.push(processedFile);
      };
      reader.readAsText(file);
    } else if (isGif) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        processedFile.rawContent = content;
        const { content: gifContent, metadata } = await parseGifFile(content, file.name);
        processedFile.imageContent = gifContent;
        processedFile.imageMetadata = metadata;
        this.processedFiles.push(processedFile);
      };
      reader.readAsDataURL(file);
    } else {
      const { content, wasCompressed } = await compressImageIfNeeded(file, 2);
      processedFile.rawContent = content;
      const { content: imgContent, metadata } = await parseImageFile(content, file.name);
      processedFile.imageContent = imgContent;
      processedFile.imageMetadata = metadata;

      if (wasCompressed) {
        console.log(`Compressed ${file.name} to fit upload limits`);
      }

      this.processedFiles.push(processedFile);
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
