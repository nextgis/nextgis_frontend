import { ImageOverlay as LImageOverlay } from 'leaflet';

import { callAjax } from '../../utils/callAjax';

import imageQueue from './imageQueue';

import type { LayerRequestOptions } from '@nextgis/webmap';
import type { ImageOverlayOptions, LatLngBoundsExpression } from 'leaflet';

type IOptions = ImageOverlayOptions & {
  /** @deprecated use request.headers instead. */
  headers?: any;
  request?: LayerRequestOptions;
  /** @deprecated use request.credentials instead. */
  withCredentials?: boolean;
};

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

    const { headers, request, withCredentials } = this.options as IOptions;
    // @ts-expect-error _image is a private property
    const img: HTMLImageElement = this._image;
    const src = img.src;
    img.src = '';
    // The queue is cleared in LeafletMapAdapter at each movestart and zoomstart event
    imageQueue.add(() => {
      const [promise, abortFunc] = callAjax({
        src,
        headers,
        request,
        withCredentials,
      });
      promise.then((imgUrl) => {
        img.src = imgUrl;
      });
      this._aborter = abortFunc;
      return promise;
    });
  }
}
