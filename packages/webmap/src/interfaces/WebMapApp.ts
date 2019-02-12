import { MapAdapter } from './MapAdapter';
import { StarterKit } from './StarterKit';
import { MapControl } from './MapControl';
import { MapCenter, LayerExtent } from './BaseTypes';

export interface MapOptions {
  target?: string | HTMLElement;
  logo?: string;
  controls?: Array<string | MapControl>;
  controlsOptions?: {[controlName: string]: any};
  minZoom?: number;
  maxZoom?: number;
  /** lat lng */
  center?: MapCenter;
  /** top, left, bottom, right */
  bounds?: LayerExtent;
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
}

export interface GetAttributionsOptions {
  onlyVisible?: boolean;
  onlyBasemap?: boolean;
}
