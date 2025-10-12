export const parseSvgFile = (content: string, fileName: string) => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(content, 'image/svg+xml');
  const svgElement = svgDoc.documentElement;
  const width = Number.parseInt(svgElement.getAttribute('width') ?? '300');
  const height = Number.parseInt(svgElement.getAttribute('height') ?? '150');

  // Convert SVG content to a data URL
  const svgBlob = new Blob([content], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgBlob);

  return {
    content: svgUrl,
    metadata: {
      width,
      height,
      name: fileName
    }
  };
};

export const parseImageFile = (
  content: string,
  fileName: string
): Promise<{
  content: string;
  metadata: { width: number; height: number; name: string };
}> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        content,
        metadata: {
          width: img.width,
          height: img.height,
          name: fileName
        }
      });
    };
    img.src = content;
  });
};

export const parseGifFile = (
  content: string,
  fileName: string
): Promise<{
  content: string;
  metadata: { width: number; height: number; name: string };
}> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        content,
        metadata: {
          width: img.width,
          height: img.height,
          name: fileName
        }
      });
    };
    img.src = content;
  });
};
