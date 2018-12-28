import { MapClickEvent } from './MapAdapter';
import { MapOptions} from './WebMapApp';
import WebMap from '../index';

export interface StarterKit {

  onLoadSync?(webMap: WebMap): Promise<void>;

  getSettings?(webMap?: WebMap): Promise<MapOptions>;
  getLayerAdapters?(): Promise<any>;
  onMapClick?(evt: MapClickEvent, webMap?: WebMap): void;

}
