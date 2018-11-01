import { NgwConnector } from '@nextgis/ngw-connector';
import { NgwUploadOptions, UploadInputOptions, RasterUploadOptions } from './interfaces';
export default class NgwUploader {
    options: NgwUploadOptions;
    connector: NgwConnector;
    constructor(options: NgwUploadOptions);
    createInput(options?: UploadInputOptions): HTMLElement;
    uploadRaster(file: File, options: RasterUploadOptions): Promise<any>;
}
