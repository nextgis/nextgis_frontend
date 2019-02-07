
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

const defAddImgOpt = {
  width: 12,
  height: 12,
  x: 0,
  y: 0,
  sdf: undefined,
  pixelRatio: 2
};

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

// // from /mapbox-gl/src/util/browser.js
export function getImageData(img: string | HTMLImageElement, opt: GetImgOpt): ImageData {
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
    canvg(canvas, img);
  }
  return context.getImageData(0, 0, opt.width, opt.height);
}
