import Map from 'ol/Map';
import ImageLayer from 'ol/layer/Image';
import CanvasImageLayerRenderer from 'ol/renderer/canvas/ImageLayer';
import ImageWMS, { Options as ImageWMSOptions } from 'ol/source/ImageWMS';

import { MainLayerAdapter, ImageAdapterOptions } from '@nextgis/webmap';

import { resolutionOptions } from '../utils/gerResolution';
import { queryToObject, objectToQuery } from '../utils/utils';
import { setTileLoadFunction } from '../utils/setTileLoadFunction';
import { Extent } from 'ol/extent';
import WMSServerType from 'ol/source/WMSServerType';

export class ImageAdapter implements MainLayerAdapter {
  layer: any;

  constructor(public map: Map, public options: ImageAdapterOptions) {}

  addLayer(options: ImageAdapterOptions): ImageLayer | undefined {
    if (options.url) {
      const ratio = options.ratio !== undefined ? options.ratio : 1;
      const imageOptions: ImageWMSOptions = {
        url: options.url,
        params: {
          ...options.params,
        },
        projection: undefined,
      };
      if (ratio > 1) {
      }
      const updateWmsParams = options.updateWmsParams;

      imageOptions.imageLoadFunction = (image, src) => {
        const url = src.split('?')[0];
        const query = src.split('?')[1];
        const { resource, BBOX, WIDTH, HEIGHT, ...params } = queryToObject(
          query
        );

        const queryParams = {
          resource,
          bbox: BBOX,
          width: WIDTH,
          height: HEIGHT,
          ...params,
        };
        const queryString = objectToQuery(
          updateWmsParams ? updateWmsParams(queryParams) : params
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
        class CanvasImageLayerRendererExtended extends CanvasImageLayerRenderer {
          renderFrame(frameState: any, target: any) {
            frameState.pixelRatio = ratio;
            // @ts-ignore
            return super.renderFrame(frameState, target);
          }
        }
        class ImageLayerExtended extends ImageLayer {
          // @ts-ignore
          createRenderer() {
            return new CanvasImageLayerRendererExtended(this);
          }
        }
        ImLayer = ImageLayerExtended;

        class ImageWmsExtended extends ImageWMS {
          getImageInternal(
            extent: Extent,
            resolution: number,
            pixelRatio: number,
            projection: any
          ) {
            return super.getImageInternal(
              extent,
              resolution,
              ratio,
              projection
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
      });
      this.layer = layer;
      return layer;
    }
  }
}
