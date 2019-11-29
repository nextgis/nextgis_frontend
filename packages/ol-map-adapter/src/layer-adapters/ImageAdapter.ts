import { BaseLayerAdapter, ImageAdapterOptions } from '@nextgis/webmap';
import ImageWMS, { Options as ImageWMSOptions } from 'ol/source/ImageWMS';
import ImageLayer from 'ol/layer/Image';
import Map from 'ol/Map';
import { queryToObject, objectToQuery } from '../utils/utils';
import { setTileLoadFunction } from '../utils/setTileLoadFunction';
import { getResolution } from '../utils/gerResolution';

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
      minResolution:
        (this.options.maxScale &&
          getResolution(this.map, this.options.maxScale)) ||
        undefined,
      maxResolution:
        (this.options.minScale &&
          getResolution(this.map, this.options.minScale)) ||
        undefined
    });
    this.layer = layer;
    return layer;
  }
}
