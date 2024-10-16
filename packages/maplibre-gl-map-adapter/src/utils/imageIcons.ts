interface GetImgOpt {
  width: number;
  height: number;
  x?: number;
  y?: number;
  sdf?: string;
  pixelRatio?: number;
}

export function getImageData(
  img: string | HTMLImageElement,
  opt: GetImgOpt,
): ImageData {
  const canvas = window.document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('failed to create canvas 2d context');
  }
  canvas.setAttribute('width', String(opt.width));
  canvas.setAttribute('height', String(opt.height));
  if (img instanceof HTMLImageElement) {
    context.drawImage(img, 0, 0, opt.width, opt.height);
  }

  return context.getImageData(0, 0, opt.width, opt.height);
}

export function getImage(svgStr: string, opt: GetImgOpt): Promise<ImageData> {
  return new Promise((resolve) => {
    const svgImage = new Image();
    svgImage.crossOrigin = 'Anonymous';
    svgImage.src = 'data:image/svg+xml;base64,' + btoa(svgStr);

    svgImage.onload = () => {
      const imageData = getImageData(svgImage, opt);
      resolve(imageData);
    };
  });
}
