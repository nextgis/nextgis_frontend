import type NgwConnector from '@nextgis/ngw-connector';
import type { NgwMap, NgwMapOptions } from '@nextgis/ngw-map';
import type { MapAdapter } from '@nextgis/webmap';

export interface VueNgwMapData<M = any> {
  ngwMap: NgwMap<M>;
  ready: boolean;
}

// interface Methods {}
// interface Computed {}
export interface VueNgwMapProps {
  mapAdapter: MapAdapter;
  fullFilling: boolean;
  connector: NgwConnector;
  baseUrl: string;
  qmsId: string;
  webMapId: string;
  mapOptions: NgwMapOptions;
}
