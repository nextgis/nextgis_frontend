import Queue from '@nextgis/queue';
import ImageLayer from 'ol/layer/Image';
import CanvasImageLayerRenderer from 'ol/renderer/canvas/ImageLayer';
import ImageWMS from 'ol/source/ImageWMS';

import { resolutionOptions } from '../utils/gerResolution';
import { setTileLoadFunction } from '../utils/setTileLoadFunction';
import { objectToQuery, queryToObject } from '../utils/utils';

import { BaseAdapter } from './BaseAdapter';

import type {
  ImageAdapterOptions,
  MainLayerAdapter,
  UpdateLayerAdapterOptions,
} from '@nextgis/webmap';
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

export class ImageAdapter
  extends BaseAdapter<ImageLayer<ImageWMS>>
  implements MainLayerAdapter
{
  static queue = new Queue({ concurrency: 6, delay: 200 });
  layer?: ImageLayer<ImageWMS>;

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

      const layerOptions: BaseImageOptions<ImageWMS> = {
        opacity: options.opacity ?? undefined,
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

  updateLayer(options?: UpdateLayerAdapterOptions): void {
    if (this.layer) {
      if (options?.params) {
        this.layer.getSource()?.updateParams(options.params);
      } else {
        this.layer.getSource()?.refresh();
      }
    }
  }

  private constructImageLoadFunction(
    options: ImageAdapterOptions,
  ): ImageWMSOptions['imageLoadFunction'] {
    const updateWmsParams = options.updateWmsParams;

    return (image, src) => {
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
      const { headers, withCredentials } = options;

      const _src = url + '?' + queryString;

      // The queue is cleared in OlMapAdapter at each movestart event
      ImageAdapter.queue.add(() => {
        return setTileLoadFunction({
          tile: image,
          src: _src,
          headers,
          withCredentials,
        });
      });
    };
  }
}
