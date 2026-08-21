export type QmsServiceType = 'tms' | 'wms';

export type QmsExtent = [
  west: number,
  south: number,
  east: number,
  north: number,
];

export interface QmsRequestOptions {
  signal?: AbortSignal;
}

export interface QmsSearchOptions extends QmsRequestOptions {
  type: QmsServiceType;
  limit?: number;
  offset?: number;
}

export interface QmsSearchService {
  id: number;
  name: string;
  desc: string;
  type: QmsServiceType;
  icon: number | null;
  extent?: string | null;
}

export interface QmsCatalogServiceBase {
  id: string;
  type: QmsServiceType;
  name: string;
  group: string;
  copyrightText?: string;
  copyrightUrl?: string;
  termsOfUseUrl?: string;
}

export interface QmsCatalogTmsService extends QmsCatalogServiceBase {
  type: 'tms';
  url: string;
  minZoom?: number;
  maxZoom?: number;
  yOriginTop: boolean;
}

export interface QmsCatalogWmsService extends QmsCatalogServiceBase {
  type: 'wms';
  url: string;
  layers: string;
  params: string;
}

export type QmsCatalogService = QmsCatalogTmsService | QmsCatalogWmsService;

export interface QmsCatalogGroup {
  id: string;
  name: string;
  services: QmsCatalogService[];
}

export interface QmsCatalog {
  groups: QmsCatalogGroup[];
  revision: string;
}

export interface QmsServiceBase {
  id: string | number;
  guid: string;
  name: string;
  desc: string;
  type: QmsServiceType;
  epsg: number | null;
  icon: number | null;

  license_name: string | null;
  license_url: string | null;
  copyright_text: string | null;
  copyright_url: string | null;
  terms_of_use_url: string | null;

  source?: string;
  source_url?: string | null;
  extent?: string | null;
  boundary?: string | null;
  boundary_area?: number | null;
  cumulative_status?: string;
  cors_status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QmsTmsService extends QmsServiceBase {
  type: 'tms';
  url: string;
  origin_url: string;
  alt_urls: string[];
  z_min: number | null;
  z_max: number | null;
  y_origin_top: boolean;
}

export interface QmsWmsService extends QmsServiceBase {
  type: 'wms';
  url: string;
  params: string | null;
  layers: string;
  turn_over: boolean;
  format: string | null;
}

export type QmsService = QmsTmsService | QmsWmsService;

export interface QmsLayerBase {
  name: string;
  attribution?: string;
  extent?: QmsExtent;
}

export interface QmsTmsLayer extends QmsLayerBase {
  service: QmsTmsService;
  type: 'tms';
  url: string;
  subdomains: string[];
  scheme: 'xyz' | 'tms';
  minZoom?: number;
  maxZoom?: number;
}

export interface QmsWmsLayer extends QmsLayerBase {
  service: QmsWmsService;
  type: 'wms';
  url: string;
  layers: string;
  format: string;
  version: string;
  params: Record<string, string>;
}

export type QmsLayer = QmsTmsLayer | QmsWmsLayer;
