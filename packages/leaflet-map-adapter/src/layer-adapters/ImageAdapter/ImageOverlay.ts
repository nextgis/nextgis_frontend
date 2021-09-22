import {
  ImageOverlay as LImageOverlay,
  LatLngBoundsExpression,
  ImageOverlayOptions,
} from 'leaflet';
import { callAjax } from '../../utils/callAjax';

type IOptions = ImageOverlayOptions & { headers?: any };

export class ImageOverlay extends LImageOverlay {
  private _abort: (() => void)[] = [];

  constructor(
    imageUrl: string,
    bounds: LatLngBoundsExpression,
    options?: IOptions,
  ) {
    super(imageUrl, bounds, options);
  }

  cancelLoad(): void {
    if (this._abort) {
      this._abort.forEach((x) => x());
      this._abort = [];
    }
  }

  _initImage(): void {
    // @ts-ignore
    super._initImage();
    // @ts-ignore
    const headers = this.options.headers;
    if (headers) {
      // @ts-ignore
      const img: HTMLImageElement = this._image;
      const src = img.src;
      img.src = '';
      this._abort.push(
        callAjax(
          src,
          (response) => {
            img.src = response;
          },
          headers,
        ),
      );
    }
  }
}
