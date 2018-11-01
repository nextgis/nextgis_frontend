/// <reference types="node" />
import { NgwConnector } from '@nextgis/ngw-connector';
import { NgwUploadOptions, UploadInputOptions, RasterUploadOptions } from './interfaces';
import { EventEmitter } from 'events';
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
    private _fileUpload;
}
