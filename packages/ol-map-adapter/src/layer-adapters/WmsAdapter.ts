import { getLayerRequestOptions } from '@nextgis/webmap';
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
      params: {
        LAYERS: options.layers,
        FORMAT: options.format,
        VERSION: options.version,
        TRANSPARENT: options.transparent ?? true,
        TILED: true,
        ...options.params,
      },
      projection: undefined,
    };

    const updateWmsParams = options.updateWmsParams;
    const request = getLayerRequestOptions(options);
    const hasRequest = !!request;
    if (updateWmsParams || hasRequest) {
      wmsOptions.tileLoadFunction = (image, src) => {
        let _src = src;
        if (updateWmsParams) {
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
          _src = url + '?' + queryString;
        }
        if (hasRequest) {
          setTileLoadFunction({
            tile: image,
            src: _src,
            request,
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
      opacity: options.opacity ?? undefined,
      ...resolutionOptions(this.map, options),
      ...options.nativeOptions,
    });
    this.layer = layer;
    return layer;
  }
}
