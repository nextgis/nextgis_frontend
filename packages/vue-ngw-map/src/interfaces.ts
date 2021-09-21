import { MapAdapter } from '@nextgis/webmap';
import { NgwMap, NgwMapOptions } from '@nextgis/ngw-map';

import NgwConnector from '@nextgis/ngw-connector';

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
