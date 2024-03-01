let canvg: any;
try {
  canvg = require('canvg');
} catch (er) {
  // ignore
}
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
  if (!canvg && img instanceof HTMLImageElement) {
    context.drawImage(img, 0, 0, opt.width, opt.height);
  } else if (typeof img === 'string') {
    if (canvg.Canvg) {
      // for canvg v.3.x.x
      const v = canvg.Canvg.fromString(context, img);
      v.start();
    } else {
      // for canvg v.2.x.x
      canvg(canvas, img);
    }
  }
  return context.getImageData(0, 0, opt.width, opt.height);
}

export function getImage(svgStr: string, opt: GetImgOpt): Promise<ImageData> {
  return new Promise((resolve) => {
    if (canvg) {
      resolve(getImageData(svgStr, opt));
    } else {
      const svgImage = new Image();
      svgImage.crossOrigin = 'Anonymous';
      svgImage.src = 'data:image/svg+xml;base64,' + btoa(svgStr);

      svgImage.onload = () => {
        const imageData = getImageData(svgImage, opt);
        resolve(imageData);
      };
    }
  });
}
