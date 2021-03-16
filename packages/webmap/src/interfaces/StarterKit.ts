import type { MapClickEvent } from './MapAdapter';
import type { MapOptions } from './MapOptions';
import type { WebMap, Type, LayerAdapter } from '../index';

/**
 * @public
 */
export interface LayerAdapterCreators {
  name: string;
  createAdapter: (webMap: WebMap) => Promise<Type<LayerAdapter>>;
}

/**
 * @public
 */
export interface StarterKit {
  onLoadSync?(webMap: WebMap): Promise<any>;

  getSettings?(webMap?: WebMap): Promise<MapOptions>;
  getLayerAdapters?(): Promise<LayerAdapterCreators[]>;
  onMapClick?(evt: MapClickEvent, webMap?: WebMap): void;
}
