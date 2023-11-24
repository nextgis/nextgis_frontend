import type {
  MainLayerAdapter,
  RasterAdapterOptions,
  WebMap,
} from '@nextgis/webmap';

export interface QmsOptions {
  url: string;
}

export type QmsLayerType = 'tms';

export interface QmsAdapterOptions extends RasterAdapterOptions {
  url: string;
  qmsId?: number;
  name?: string;

  qms?: QmsBasemap;
}

export interface GeoserviceInList {
  id: number;
  guid: string;
  name: string;
  desc: string;
  type: string;
  epsg: number;
}

export interface QmsAdapter extends MainLayerAdapter {
  qms?: QmsBasemap;
}

export interface QmsBasemap {
  id: number;
  guid: string;
  name: string;
  desc: string;
  type: QmsLayerType;
  epsg: number;
  license_name: string;
  license_url: string;
  copyright_text: string;
  copyright_url: string;
  terms_of_use_url: string;
  url: string;
  z_min: any;
  z_max: any;
  y_origin_top: boolean;
  icon: number;

  alt_urls?: string[];
  boundary?: any;
  boundary_area?: any;

  created_at?: Date; // "2016-11-14T18:08:04.486371Z";
  cumulative_status?: string; // "works";

  extent?: number[];

  last_status?: number;

  origin_url?: string;
  source?: string;
  source_url?: string;
  submitter?: string;

  updated_at?: Date;
}

export interface CreateQmsAdapterOptions extends Partial<QmsAdapterOptions> {
  webMap: WebMap;
  url?: string;
}
