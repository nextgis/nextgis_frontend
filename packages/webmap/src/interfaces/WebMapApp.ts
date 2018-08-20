import { WebLayerEntry } from '../entities/WebLayerEntry';
import { MapAdapter } from './MapAdapter';
import { StarterKit } from './AppSettings';

export interface MapOptions {
  target: string | HTMLElement;
  logo?: string;
  controls?: any[];
  minZoom?: number;
}

export interface AppOptions {
  mapAdapter: MapAdapter;
  starterKits?: StarterKit[];
  // displayConfig?: DisplayConfig;
  // [configName: string]: any;
}

export interface WebMapAppEvents {
  'build-map': MapAdapter;
  'add-layers': WebLayerEntry;
}
