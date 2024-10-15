import type NgwConnector from '@nextgis/ngw-connector';
import type {
  CreatedResource,
  FileMeta,
  GeometryType,
  NgwConnectorOptions,
  Resmeta,
  WmsClientConnection,
  WmsClientLayer,
  WmsServerServiceLayer,
} from '@nextgis/ngw-connector';
import type { GeometryPaint } from '@nextgis/paint';
import type { ResourceCls } from '@nextgisweb/resource/type/api';

export type ImageTypes = 'image/tif' | 'image/tiff' | '.tif';

export interface ResourceCreateOptions {
  id?: number;
  parentId?: number;
  keyname?: string;
  displayName?: string;
  description?: string;
  srs?: {
    id: number;
  };
  resmeta?: Resmeta;
  addTimestampToName?: boolean;
  /** @deprecated - use {@link ResourceCreateOptions.displayName} instead */
  name?: string;
  /** @deprecated - use {@link ResourceCreateOptions.displayName} instead */
  display_name?: string;

  createName?: (name: string) => string;
}

export interface FileUploadOptions extends ResourceCreateOptions {
  onProgress?: (percentComplete: number) => void;
  put?: boolean;
  signal?: AbortSignal;
}

export type GroupOptions = ResourceCreateOptions;

export interface CreateWmsOptions extends ResourceCreateOptions {
  /** @deprecated use {@link CreateWmsOptions.resourceId} instead */
  id?: number;
  resourceId?: number;
  layers: WmsServerServiceLayer[];
}

export interface CreateMapserverStyleOptions extends ResourceCreateOptions {
  paint?: GeometryPaint;
  geometryType: GeometryType;
}

export type CreateWmsConnectionOptions = ResourceCreateOptions &
  WmsClientConnection;

export type CreateWmsConnectedLayerOptions = ResourceCreateOptions &
  WmsClientLayer;

export interface NgwUploadOptions extends NgwConnectorOptions {
  connector?: NgwConnector;
  /**
   * Flag to indicate whether to use the TUS protocol for uploading files in chunks.
   * @default true
   * */
  useTus?: boolean;
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

export interface CreateRasterOptions extends ResourceCreateOptions {
  source: FileMeta;
  srs?: {
    id: number;
  };
}

export type CreateVectorOptions = CreateRasterOptions;

export interface RasterUploadOptions extends FileUploadOptions {
  style?: ResourceCreateOptions;
}

export interface VectorUploadOptions extends FileUploadOptions {
  paint: GeometryPaint;
  style?: CreateStyleOptions;
}

export type CreatedRes = CreatedResource;

export interface RespError {
  exception: 'ValidationError';
  message: string;
  serializer: string;
}

export type AvailableStatus =
  | 'upload'
  | 'create-vector'
  | 'create-raster'
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

export interface CreateStyleOptions extends ResourceCreateOptions {
  cls?: ResourceCls;
  style?: unknown;
}
