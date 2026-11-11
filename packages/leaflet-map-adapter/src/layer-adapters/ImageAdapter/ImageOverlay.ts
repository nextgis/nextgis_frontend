import { ImageOverlay as LImageOverlay, Util } from 'leaflet';

import { callAjax } from '../../utils/callAjax';

import imageQueue from './imageQueue';

import type { LayerRequestOptions } from '@nextgis/webmap';
import type { ImageOverlayOptions, LatLngBoundsExpression } from 'leaflet';

const transparentImage =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAIBAAA=';

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
    imageQueue.remove(Util.stamp(this));
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
    imageQueue.add(
      ({ signal }) => {
        const [promise, abortFunc] = callAjax({
          src,
          headers,
          request,
          withCredentials,
        });
        void promise
          .then((imgUrl) => {
            if (!signal.aborted) img.src = imgUrl || transparentImage;
          })
          .catch((error) => {
            if (!signal.aborted) {
              console.error(error);
              img.src = transparentImage;
            }
          });
        this._aborter = abortFunc;
        return [promise, abortFunc];
      },
      { id: Util.stamp(this) },
    );
  }
}
