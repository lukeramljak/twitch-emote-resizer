export type FileUploadEvent = Event & { currentTarget: EventTarget & HTMLInputElement };

export interface ResizedImage {
  content: string;
  fileSize: string;
  metadata: {
    width: number;
    height: number;
    name: string;
  };
  type: 'image' | 'gif';
}

export interface ImageMetadata {
  width: number;
  height: number;
  name: string;
}
