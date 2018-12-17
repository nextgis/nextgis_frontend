import NgwMap, { MapOptions, NgwLayerOptions } from '@nextgis/ngw-map';
import MapboxglMapAdapter from '@nextgis/mapboxgl-map-adapter';
// import { RGBAImage } from 'mapbox-gl/src/util/browser';

import 'mapbox-gl/dist/mapbox-gl.css';

export default class NgwLeaflet extends NgwMap {

  constructor(options: MapOptions) {
    super(new MapboxglMapAdapter(), options);
    // this.emitter.once('map:created', () => this._onMapCreated());
  }

  addNgwLayer(options: NgwLayerOptions, adapterOptions?) {
    // TODO: still no way to add NGW IMAGE to mapbox-gl
    // always use tile adapter
    if (options.adapter === 'IMAGE') {
      options.adapter = 'TILE';
    }
    return super.addNgwLayer(options, adapterOptions);
  }

  // private _onMapCreated() {
  //   const svg = `
  //   <svg width="12" height="12" version="1.1" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
  //   <circle cx="6" cy="6" r="6" fill="#00f" stroke-width="1.4217"/>
  //   </svg>
  //   `;
  //   const svgImage = new Image();
  //   svgImage.src = 'data:image/svg+xml,' + escape(svg);

  //   const imageData = this._getImageData(svgImage);
  //   const map = this.webMap.mapAdapter.map;
  //   const { width, height, x, y, sdf, pixelRatio } = {
  //     width: 12,
  //     height: 12,
  //     x: 0,
  //     y: 0,
  //     sdf: null,
  //     pixelRatio: 1
  //   };
  //   const data = new RGBAImage({ width, height });
  //   RGBAImage.copy(imageData, data, { x, y }, { x: 0, y: 0 }, { width, height });
  //   map.style.imageManager.images.test = { data, pixelRatio, sdf };
  // }

  // // from /mapbox-gl/src/util/browser.js
  // private _getImageData(img: CanvasImageSource): ImageData {
  //   const canvas = window.document.createElement('canvas');
  //   const context = canvas.getContext('2d');
  //   if (!context) {
  //     throw new Error('failed to create canvas 2d context');
  //   }
  //   // @ts-ignore
  //   canvas.width = img.width;
  //   // @ts-ignore
  //   canvas.height = img.height;
  //   // @ts-ignore
  //   context.drawImage(img, 0, 0, img.width, img.height);
  //   // @ts-ignore
  //   return context.getImageData(0, 0, img.width, img.height);
  // }

}
