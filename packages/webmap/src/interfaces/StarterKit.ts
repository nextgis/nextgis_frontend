import { MapClickEvent } from './MapAdapter';
import { MapOptions } from './WebMapApp';
import WebMap, { Type, LayerAdapter } from '../index';

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
