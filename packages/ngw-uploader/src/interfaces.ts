import type NgwConnector from '@nextgis/ngw-connector';
import type {
  FileMeta,
  ResourceCls,
  GeometryType,
  WmsClientLayer,
  CreatedResource,
  NgwConnectorOptions,
  WmsClientConnection,
  WmsServerServiceLayer,
} from '@nextgis/ngw-connector';
import type { GeometryPaint } from '@nextgis/paint';

export type ImageTypes = 'image/tif' | 'image/tiff' | '.tif';

export interface ResourceCreateOptions {
  id?: number;
  parentId?: number;
  keyname?: string;
  displayName?: string;
  description?: string;
  /** @deprecated - use {@link ResourceCreateOptions.displayName} instead */
  name?: string;
  /** @deprecated - use {@link ResourceCreateOptions.displayName} instead */
  display_name?: string;
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
  source: Record<string, any>;
  srs?: {
    id: number;
  };
}

export interface RasterUploadOptions {
  name?: string;
  parentId?: number;
  srs?: {
    id: number;
  };
  put?: boolean;
  onProgress?: (percentComplete: number) => void;
  addTimestampToName?: boolean;
  createName?: (name: string) => string;
}

export interface VectorUploadOptions extends RasterUploadOptions {
  paint: GeometryPaint;
}

export type CreatedRes = CreatedResource & { name: string };

export interface UploadedFile {
  meta: FileMeta;
  name: string;
}

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
