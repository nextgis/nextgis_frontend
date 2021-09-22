import ImageLayer from 'ol/layer/Image';
import CanvasImageLayerRenderer from 'ol/renderer/canvas/ImageLayer';
import ImageWMS from 'ol/source/ImageWMS';
import WMSServerType from 'ol/source/WMSServerType';

import { resolutionOptions } from '../utils/gerResolution';
import { queryToObject, objectToQuery } from '../utils/utils';
import { setTileLoadFunction } from '../utils/setTileLoadFunction';
import { BaseAdapter } from './BaseAdapter';

import type { Extent } from 'ol/extent';
import type Map from 'ol/Map';
import type { Options as ImageWMSOptions } from 'ol/source/ImageWMS';
import type { MainLayerAdapter, ImageAdapterOptions } from '@nextgis/webmap';

export class ImageAdapter extends BaseAdapter implements MainLayerAdapter {
  layer: any;

  constructor(public map: Map, public options: ImageAdapterOptions) {
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
      };
      const updateWmsParams = options.updateWmsParams;

      imageOptions.imageLoadFunction = (image, src) => {
        const url = src.split('?')[0];
        const query = src.split('?')[1];
        const { resource, BBOX, WIDTH, HEIGHT, ...params } =
          queryToObject(query);

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
          setTileLoadFunction(image, _src, headers);
        } else {
          // @ts-ignore
          image.getImage().src = _src;
        }
        // const im = image.getImage();
        // im.addEventListener('load', () => {
        //   console.log(im);
        //   return true;
        // });
      };

      let ImLayer = ImageLayer;
      let ImWms = ImageWMS;
      if (ratio > 1) {
        imageOptions.ratio = ratio;
        imageOptions.serverType = WMSServerType.MAPSERVER;
        class CanvasILRendererExtended extends CanvasImageLayerRenderer {
          renderFrame(frameState: any, target: any) {
            frameState.pixelRatio = ratio;
            // @ts-ignore
            return super.renderFrame(frameState, target);
          }
        }
        class ImageLayerExtended extends ImageLayer<ImageWMS> {
          // @ts-ignore
          createRenderer() {
            return new CanvasILRendererExtended(this);
          }
        }
        // @ts-ignore
        ImLayer = ImageLayerExtended;

        class ImageWmsExtended extends ImageWMS {
          getImageInternal(
            extent: Extent,
            resolution: number,
            pixelRatio: number,
            projection: any,
          ) {
            return super.getImageInternal(
              extent,
              resolution,
              ratio,
              projection,
            );
          }
        }
        ImWms = ImageWmsExtended;
      }

      const source = new ImWms(imageOptions);
      const layer = new ImLayer({
        source,
        opacity: options.opacity,
        ...resolutionOptions(this.map, options),
        ...options.nativeOptions,
      });
      this.layer = layer;
      return layer;
    }
  }
}
