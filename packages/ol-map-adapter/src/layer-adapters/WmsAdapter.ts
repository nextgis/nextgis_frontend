import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

import { resolutionOptions } from '../utils/gerResolution';
import { setTileLoadFunction } from '../utils/setTileLoadFunction';
import { objectToQuery, queryToObject } from '../utils/utils';

import { BaseAdapter } from './BaseAdapter';

import type { MainLayerAdapter, WmsAdapterOptions } from '@nextgis/webmap';
import type Map from 'ol/Map';
import type { Options as TileWMSOptions } from 'ol/source/TileWMS';

export class WmsAdapter extends BaseAdapter implements MainLayerAdapter {
  layer: any;

  constructor(
    public map: Map,
    public options: WmsAdapterOptions,
  ) {
    super(map, options);
  }

  addLayer(options: WmsAdapterOptions): TileLayer<TileWMS> {
    Object.assign(this.options, options);
    const wmsOptions: TileWMSOptions = {
      url: options.url,
      params: { LAYERS: options.layers, VERSION: options.version },
      projection: undefined,
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
            height: HEIGHT,
          }),
        );
        const { headers, withCredentials } = options;
        const _src = url + '?' + queryString;
        if (headers || withCredentials) {
          setTileLoadFunction({
            tile: image,
            src: _src,
            headers,
            withCredentials,
          });
        } else {
          // @ts-expect-error Property 'getImage' does not exist on type 'Tile'.
          image.getImage().src = _src;
        }
      };
    }

    const source = new TileWMS(wmsOptions);
    const layer = new TileLayer({
      source,
      opacity: options.opacity,
      ...resolutionOptions(this.map, options),
      ...options.nativeOptions,
    });
    this.layer = layer;
    return layer;
  }
}
