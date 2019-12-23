/**
 * @module mapboxgl-map-adapter
 */
import { Map } from 'mapbox-gl';
import { BaseLayerAdapter, AdapterOptions } from '@nextgis/webmap';
import { TLayer } from '../MapboxglMapAdapter';

let ID = 0;

export abstract class BaseAdapter<O extends AdapterOptions = AdapterOptions>
  implements BaseLayerAdapter<Map, TLayer, O> {
  layer?: TLayer;
  protected readonly _layerId: string;

  constructor(public map: Map, public options: O) {
    this._layerId = `layer-${ID++}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  abstract addLayer(options: O): TLayer | Promise<TLayer> | undefined;
}
