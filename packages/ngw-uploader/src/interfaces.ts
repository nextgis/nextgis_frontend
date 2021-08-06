import type NgwConnector from '@nextgis/ngw-connector';
import type { NgwConnectorOptions } from '@nextgis/ngw-connector';

export type ImageTypes = 'image/tif' | 'image/tiff' | '.tif';

export interface UploadInputOptions {
  html?: string;
  name?: string;
  parentId?: number;
  addTimestampToName?: boolean;
  success?: (newRes: ResourceCreateResp) => void;
  error?: (er: Error) => void;
  createName?: (name: string) => string;
  element?: string | HTMLElement;
  image?: boolean;
  vector?: boolean;
}

export interface ResourceCreateOptions {
  name?: string;
  id?: number;
  parentId?: number;
}

export interface GroupOptions extends ResourceCreateOptions {
  keyname?: string;
  description?: string;
}

export interface CreateWmsConnectionOptions extends ResourceCreateOptions {
  /** WMS service url */
  url: string;
  /** User name to connect to service */
  username?: string;
  /** Password to connect to service */
  password?: string;
  /** WMS version */
  version?: string;
  /** If equal query - query capabilities from service */
  capcache?: string;
}

export interface CreateWmsConnectedLayerOptions extends ResourceCreateOptions {
  connection: {
    id: 18;
  };
  srs?: {
    id: number; // 3857
  };
  wmslayers: string | string[]; // '1,2'
  imgformat?: string; // 'image/png'
  vendor_params?: { [paramName: string]: string };
}

interface ResourceCreateResp {
  id: number;
  name?: string;
  parent?: { id: number };
}

export interface NgwUploadOptions extends NgwConnectorOptions {
  inputOptions?: UploadInputOptions;
  loginDialog?: boolean;
  connector?: NgwConnector;
}

export interface RasterUploadResp {
  status?: number;
}

export interface RasterRequestResourceOptions {
  cls: 'raster_layer';
  display_name: string;
  parent: { id: number };
}

export interface RasterLayerSourceOptions {
  id: string;
  mime_type: string;
  size: number;
}

export interface RasterRequestLayerOptions {
  source: RasterLayerSourceOptions;
  srs: { id: 3857 };
}

export interface RasterRequestOptions {
  resource: RasterRequestResourceOptions;
  raster_layer: RasterRequestLayerOptions;
}

export interface RasterUploadOptions {
  name?: string;
  parentId?: number;
  onProgress?: (percentComplete: number) => void;
  addTimestampToName?: boolean;
  createName?: (name: string) => string;
}

export interface RespError {
  exception: 'ValidationError';
  message: string;
  serializer: string;
}

export type AvailableStatus =
  | 'upload'
  | 'create-resource'
  | 'create-style'
  | 'create-wms'
  | 'create-wms-connection'
  | 'create-wms-connected-layer'
  | 'create-group';

export interface EmitterStatus {
  status: AvailableStatus;
  state: 'begin' | 'end' | 'progress' | 'error';
  message?: string;
  data?: any;
}
