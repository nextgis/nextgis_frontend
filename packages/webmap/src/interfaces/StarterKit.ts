/**
 * @module webmap
 */

import { MapClickEvent } from './MapAdapter';
import { MapOptions } from './WebMapApp';
import WebMap, { Type, LayerAdapter } from '../index';

export interface LayerAdapterCreators {
  name: string;
  createAdapter: (webmap: WebMap) => Promise<Type<LayerAdapter>>;
}

export interface StarterKit {
  onLoadSync?(webMap: WebMap): Promise<any>;

  getSettings?(webMap?: WebMap): Promise<MapOptions>;
  getLayerAdapters?(): Promise<LayerAdapterCreators[]>;
  onMapClick?(evt: MapClickEvent, webMap?: WebMap): void;
}
