import { ImageOverlay as LImageOverlay, Util } from 'leaflet';

import { callAjax } from '../../utils/callAjax';

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
    const src = img.src;

    if (headers) {
      img.src = '';
      this._aborter = callAjax(
        src,
        (response) => {
          img.src = response;
        },
        headers,
      );
    } else {
      this._aborter = () => {
        img.setAttribute('src', Util.emptyImageUrl);
      };
    }
  }
}
