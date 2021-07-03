import { Map } from 'mapbox-gl';
import { MainLayerAdapter, AdapterOptions } from '@nextgis/webmap';
import { TLayer } from '../MapboxglMapAdapter';

let ID = 0;

export abstract class BaseAdapter<O extends AdapterOptions = AdapterOptions>
  implements MainLayerAdapter<Map, TLayer, O>
{
  layer?: TLayer;
  map?: Map;
  protected readonly _layerId: string;

  constructor(map: Map, public options: O) {
    this.map = map;
    this._layerId = `layer-${ID++}`;
  }

  beforeRemove(): void {
    Object.assign(this, { map: undefined });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  abstract addLayer(options: O): TLayer | Promise<TLayer> | undefined;
}
