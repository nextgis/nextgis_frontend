import { Settings } from './AppSettings';
import { NgwConfig } from './NgwConfig';
import { WebLayerEntry } from '../entities/WebLayerEntry';
import { MapAdapter } from './MapAdapter';

export interface DisplayConfigRootItemChildren {
  children: any[];
  expanded: boolean;
  type: string;
  id: number;
  label: string;
}

export interface DisplayConfigRootItem {
  children: DisplayConfigRootItemChildren[];
  expanded: any;
  type: string;
  id: number;
  label: any;
}

export interface DisplayConfig {
  rootItem?: DisplayConfigRootItem;
  tinyDisplayUrl?: string;
  mid?: {
    adapter: any[];
    basemap: any[];
    plugin: any[];
  };
  drawOrderEnabled?: any;
  extent?: [number, number, number, number];
  testEmbeddedMapUrl?: string;
  webmapTitle?: string;
  webmapDescription?: string;
  webmapPlugin?: {};
  measurementSystem?: string;
  bookmarkLayerId?: any;
}

export interface AppOptions {
  target: string | HTMLElement;
  ngwConfig?: NgwConfig;
  // displayConfig?: DisplayConfig;
  [configName: string]: any;
}

export interface WebMapAppEvents {
  'load-settings': Settings;
  'build-map': MapAdapter;
  'add-layers': WebLayerEntry;
}
