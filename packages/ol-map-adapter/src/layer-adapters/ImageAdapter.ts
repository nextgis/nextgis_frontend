import ImageLayer from 'ol/layer/Image';
import CanvasImageLayerRenderer from 'ol/renderer/canvas/ImageLayer';
import ImageWMS from 'ol/source/ImageWMS';

import { resolutionOptions } from '../utils/gerResolution';
import { setTileLoadFunction } from '../utils/setTileLoadFunction';
import { objectToQuery, queryToObject } from '../utils/utils';

import { BaseAdapter } from './BaseAdapter';

import type { ImageAdapterOptions, MainLayerAdapter } from '@nextgis/webmap';
import type Map from 'ol/Map';
import type { Extent } from 'ol/extent';
import type { Options as BaseImageOptions } from 'ol/layer/BaseImage';
import type { Options as ImageWMSOptions } from 'ol/source/ImageWMS';

class ImageLayerExtended extends ImageLayer<ImageWMS> {
  constructor(
    options: BaseImageOptions<ImageWMS>,
    private ratio: number,
  ) {
    super(options);
  }
  createRenderer() {
    return new CanvasILRendererExtended(this, this.ratio);
  }
}

class ImageWMSExtended extends ImageWMS {
  constructor(
    options: ImageWMSOptions,
    private ratio: number,
  ) {
    super(options);
  }

  getImageInternal(
    extent: Extent,
    resolution: number,
    _pixelRatio: number,
    projection: any,
  ) {
    return super.getImageInternal(extent, resolution, this.ratio, projection);
  }
}

class CanvasILRendererExtended extends CanvasImageLayerRenderer {
  constructor(
    layer: any,
    private ratio: number,
  ) {
    super(layer);
  }

  renderFrame(frameState: any, target: any) {
    frameState.pixelRatio = this.ratio;
    return super.renderFrame(frameState, target);
  }
}

export class ImageAdapter extends BaseAdapter implements MainLayerAdapter {
  layer: any;

  constructor(
    public map: Map,
    public options: ImageAdapterOptions,
  ) {
    super(map, options);
  }

  addLayer(options: ImageAdapterOptions): ImageLayer<ImageWMS> | undefined {
    Object.assign(this.options, options);
    if (options.url) {
      const ratio = options.ratio !== undefined ? options.ratio : 1;
      const imageOptions: ImageWMSOptions = {
        url: options.url,
        params: {
          ...options.params,
        },
        projection: undefined,
        imageLoadFunction: this.constructImageLoadFunction(options),
      };

      // const updateWmsParams = options.updateWmsParams;
      // imageOptions.imageLoadFunction = (image, src) => {
      //   const url = src.split('?')[0];
      //   const query = src.split('?')[1];
      //   const { resource, BBOX, WIDTH, HEIGHT, ...params } =
      //     queryToObject(query);

      //   const queryParams = {
      //     resource,
      //     bbox: BBOX,
      //     width: WIDTH,
      //     height: HEIGHT,
      //     ...params,
      //   };
      //   const queryString = objectToQuery(
      //     updateWmsParams ? updateWmsParams(queryParams) : params,
      //   );
      //   const headers = options.headers;

      //   const _src = url + '?' + queryString;

      //   if (headers) {
      //     setTileLoadFunction(image, _src, headers);
      //   } else {
      //     // @ts-ignore
      //     image.getImage().src = _src;
      //   }
      // };

      const layerOptions: BaseImageOptions<ImageWMS> = {
        opacity: options.opacity,
        ...resolutionOptions(this.map, options),
        ...options.nativeOptions,
      };

      if (ratio > 1) {
        imageOptions.ratio = ratio;
        imageOptions.serverType = 'mapserver';

        const source = new ImageWMSExtended(imageOptions, ratio);
        const layer = new ImageLayerExtended(
          {
            source,
            ...layerOptions,
          },
          ratio,
        );
        this.layer = layer;
      } else {
        const source = new ImageWMS(imageOptions);
        const layer = new ImageLayer({
          source,
          ...layerOptions,
        });
        this.layer = layer;
      }
      return this.layer;
    }
  }

  private constructImageLoadFunction(
    options: ImageAdapterOptions,
  ): ImageWMSOptions['imageLoadFunction'] {
    const updateWmsParams = options.updateWmsParams;
    let _abortFunc: (() => void) | undefined = undefined;

    const abort = () => {
      if (_abortFunc) {
        _abortFunc();
        _abortFunc = undefined;
      }
    };

    return (image, src) => {
      abort();
      const url = src.split('?')[0];
      const query = src.split('?')[1];
      const { resource, BBOX, WIDTH, HEIGHT, ...params } = queryToObject(query);

      const queryParams = {
        resource,
        bbox: BBOX,
        width: WIDTH,
        height: HEIGHT,
        ...params,
      };
      const queryString = objectToQuery(
        updateWmsParams ? updateWmsParams(queryParams) : params,
      );
      const headers = options.headers;

      const _src = url + '?' + queryString;

      if (headers) {
        _abortFunc = setTileLoadFunction(image, _src, headers);
      } else {
        // @ts-ignore
        image.getImage().src = _src;
        _abortFunc = () => {
          // @ts-ignore
          image.getImage().src = '';
        };
      }
    };
  }
}
