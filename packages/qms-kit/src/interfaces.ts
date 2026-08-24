import type { QmsRequestOptions, QmsService } from '@nextgis/qms-core';
import type {
  MainLayerAdapter,
  RasterAdapterOptions,
  WebMap,
} from '@nextgis/webmap';

export interface QmsAdapterOptions
  extends RasterAdapterOptions, QmsRequestOptions {
  qmsId?: number;
  name?: string;
  format?: string;
  version?: string;
  params?: Record<string, string>;

  qms?: QmsService;
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
  qms?: QmsService;
}

/**
 * @deprecated Use `QmsService` from `@nextgis/qms-core` instead.
 */
export type QmsBasemap = QmsService;

export interface CreateQmsAdapterOptions extends Partial<QmsAdapterOptions> {
  webMap: WebMap;
}
