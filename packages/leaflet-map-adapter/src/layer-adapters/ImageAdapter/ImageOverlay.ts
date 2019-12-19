/**
 * @module leaflet-map-adapter
 */
import L, { LatLngBoundsExpression, ImageOverlayOptions } from 'leaflet';
import { callAjax } from '../layersUtility';

type IOptions = ImageOverlayOptions & { headers?: any };

export class ImageOverlay extends L.ImageOverlay {
  constructor(
    imageUrl: string,
    bounds: LatLngBoundsExpression,
    options?: IOptions
  ) {
    super(imageUrl, bounds, options);
  }

  _initImage() {
    // @ts-ignore
    super._initImage();
    // @ts-ignore
    const headers = this.options.headers;
    if (headers) {
      // @ts-ignore
      const img: HTMLImageElement = this._image;
      const src = img.src;
      img.src = '';
      callAjax(
        src,
        response => {
          img.src = response;
        },
        headers
      );
    }
  }
}
