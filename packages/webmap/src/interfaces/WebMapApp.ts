import { WebLayerItem } from '../WebLayerItem';
import { MapAdapter } from './MapAdapter';
import { StarterKit } from './AppSettings';
import { MapControl } from './MapControl';

export interface MapOptions {
  target: string | HTMLElement;
  logo?: string;
  controls?: Array<string | MapControl>;
  controlsOptions?: {[controlName: string]: any};
  minZoom?: number;
  /** lat lng */
  center?: [number, number];
  /** top, left, bottom, right */
  bounds?: [number, number, number, number];
  zoom?: number;
}

export interface AppOptions {
  mapAdapter: MapAdapter;
  starterKits?: StarterKit[];
  // displayConfig?: DisplayConfig;
  // [configName: string]: any;
}

export interface WebMapAppEvents {
  'build-map': MapAdapter;
  'add-layers': WebLayerItem;
}
