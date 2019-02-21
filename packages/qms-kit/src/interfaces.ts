/**
 * @module qms-kit
 */

import { AdapterOptions } from '@nextgis/webmap';
export interface QmsOptions {
  url: string;
}

export type QmsLayerType = 'tms';

export interface QmsAdapterOptions extends AdapterOptions {
  qmsId: number;
  name?: string;
}

export interface GeoserviceInList {
  id: number;
  guid: string;
  name: string;
  desc: string;
  type: string;
  epsg: number;
}

export interface Geoservice {
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
}
