import Map from 'ol/Map';
import ImageLayer from 'ol/layer/Image';
import ImageWMS, { Options as ImageWMSOptions } from 'ol/source/ImageWMS';

import { BaseLayerAdapter, ImageAdapterOptions } from '@nextgis/webmap';

import { resolutionOptions } from '../utils/gerResolution';
import { queryToObject, objectToQuery } from '../utils/utils';
import { setTileLoadFunction } from '../utils/setTileLoadFunction';

export class ImageAdapter implements BaseLayerAdapter {
  layer: any;

  constructor(public map: Map, public options: ImageAdapterOptions) {}

  addLayer(options: ImageAdapterOptions) {
    const imageOptions: ImageWMSOptions = {
      url: options.url,
      params: {
        resource: options.resourceId || options.id
      },
      ratio: 1,
      projection: undefined
    };

    const updateWmsParams = options.updateWmsParams;
    if (updateWmsParams) {
      imageOptions.imageLoadFunction = (image, src) => {
        const url = src.split('?')[0];
        const query = src.split('?')[1];
        const { resource, BBOX, WIDTH, HEIGHT } = queryToObject(query);
        const queryString = objectToQuery(
          updateWmsParams({
            resource,
            bbox: BBOX,
            width: WIDTH,
            height: HEIGHT
          })
        );
        const headers = options.headers;
        const _src = url + '?' + queryString;
        if (headers) {
          setTileLoadFunction(image, _src, headers);
        } else {
          // @ts-ignore
          image.getImage().src = _src;
        }
      };
    }

    const source = new ImageWMS(imageOptions);

    const layer = new ImageLayer({
      source,
      ...resolutionOptions(this.map, options)
    });
    this.layer = layer;
    return layer;
  }
}
