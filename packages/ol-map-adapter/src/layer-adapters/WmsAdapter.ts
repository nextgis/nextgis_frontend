import { BaseLayerAdapter, WmsAdapterOptions } from '@nextgis/webmap';
import TileWMS, { Options as TileWMSOptions } from 'ol/source/TileWMS';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import { queryToObject, objectToQuery } from '../utils/utils';
import { setTileLoadFunction } from '../utils/setTileLoadFunction';
import { resolutionOptions } from '../utils/gerResolution';

export class WmsAdapter implements BaseLayerAdapter {
  layer: any;

  constructor(public map: Map, public options: WmsAdapterOptions) {}

  addLayer(options: WmsAdapterOptions) {
    const wmsOptions: TileWMSOptions = {
      url: options.url,
      params: { LAYERS: options.layers, VERSION: options.version },
      projection: undefined
    };

    const updateWmsParams = options.updateWmsParams;
    if (updateWmsParams) {
      wmsOptions.tileLoadFunction = (image, src) => {
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

    const source = new TileWMS(wmsOptions);

    const layer = new TileLayer({
      source,
      ...resolutionOptions(this.map, options)
    });
    this.layer = layer;
    return layer;
  }
}
