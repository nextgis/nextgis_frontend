import { ImageOverlay as LImageOverlay } from 'leaflet';

import { callAjax } from '../../utils/callAjax';

import imageQueue from './imageQueue';

import type { ImageOverlayOptions, LatLngBoundsExpression } from 'leaflet';

type IOptions = ImageOverlayOptions & { headers?: any };

export class ImageOverlay extends LImageOverlay {
  private _aborter?: () => void;

  constructor(
    imageUrl: string,
    bounds: LatLngBoundsExpression,
    options?: IOptions,
  ) {
    super(imageUrl, bounds, options);
  }

  cancelLoad(): void {
    if (this._aborter) {
      this._aborter();
      this._aborter = undefined;
    }
  }

  _initImage(): void {
    // @ts-expect-error extend private method
    super._initImage();

    const headers = (this.options as IOptions).headers;
    // @ts-expect-error _image is a private property
    const img: HTMLImageElement = this._image;

    img.src = '';
    // The queue is cleared in LeafletMapAdapter at each movestart and zoomstart event
    imageQueue.add(() => {
      const [promise, abortFunc] = callAjax(img.src, headers);
      promise.then((imgUrl) => {
        img.src = imgUrl;
      });
      this._aborter = abortFunc;
      return promise;
    });
  }
}
