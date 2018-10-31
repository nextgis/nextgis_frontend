import { NgwConnectorOptions } from '@nextgis/ngw-connector';

export interface UploadInputOptions {
  html?: string;
  name?: string;
  parentId?: number;
}

export interface NgwUploadOptions extends NgwConnectorOptions {
  baseUrl?: string;
  inputOptions?: UploadInputOptions;
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
}
