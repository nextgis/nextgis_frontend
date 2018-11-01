/// <reference types="node" />
import { NgwConnector, NgwConnectorOptions } from '@nextgis/ngw-connector';
import { EventEmitter } from 'events';
export interface UploadInputOptions {
    html?: string;
    name?: string;
    parentId?: number;
    addTimestampToName?: boolean;
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
    parent: {
        id: number;
    };
}
export interface RasterLayerSourceOptions {
    id: string;
    mime_type: string;
    size: number;
}
export interface RasterRequestLayerOptions {
    source: RasterLayerSourceOptions;
    srs: {
        id: 3857;
    };
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
}
export interface RespError {
    exception: 'ValidationError';
    message: string;
    serializer: string;
}
export default class NgwUploader {
    options: NgwUploadOptions;
    emitter: EventEmitter;
    connector: NgwConnector;
    constructor(options: NgwUploadOptions);
    createInput(options?: UploadInputOptions): HTMLElement;
    uploadRaster(file: File, options: RasterUploadOptions): Promise<any>;
    private _createResource;
    private _createStyle;
    private _createWms;
    private _fileUpload;
}
