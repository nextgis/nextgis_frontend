/// <reference types="node" />
import { NgwConnector, NgwConnectorOptions } from '@nextgis/ngw-connector';
import { EventEmitter } from 'events';
export interface UploadInputOptions {
    html?: string;
    name?: string;
    parentId?: number;
    addTimestampToName?: boolean;
    success?: (newRes: ResourceCreateResp) => void;
    error?: (er: Error) => void;
    createName?: (name: string) => string;
}
interface ResourceCreateResp {
    id: number;
    name?: string;
    parent?: {
        id: number;
    };
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
    createName?: (name: string) => string;
}
export interface RespError {
    exception: 'ValidationError';
    message: string;
    serializer: string;
}
export declare type AvailableStatus = 'upload' | 'create-resource' | 'create-style' | 'create-wms';
export interface EmitterStatus {
    status: AvailableStatus;
    state: 'begin' | 'end' | 'progress' | 'error';
    message?: string;
    data?: any;
}
export default class NgwUploader {
    options: NgwUploadOptions;
    emitter: EventEmitter;
    connector: NgwConnector;
    constructor(options: NgwUploadOptions);
    createInput(options?: UploadInputOptions): HTMLElement;
    uploadRaster(file: File, options: RasterUploadOptions): Promise<any>;
    createResource(meta: any, name: string, options: RasterUploadOptions): Promise<{
        [x: string]: any;
    }>;
    createStyle(newRes: any, name?: string): Promise<{
        [x: string]: any;
    }>;
    createWms(newStyle: any, name?: string): Promise<{
        [x: string]: any;
    }>;
    fileUpload(file: File, options?: RasterUploadOptions): Promise<any>;
}
export {};
