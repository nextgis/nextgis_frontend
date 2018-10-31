import { NgwConnector } from '@nextgis/ngw-connector';
import { NgwUploadOptions, UploadInputOptions, RasterUploadOptions } from './interfaces';

export default class NgwUploader {

  options: NgwUploadOptions = {
    inputOptions: {
      html: 'Upload file',
    },
  };

  connector: NgwConnector;

  constructor(options: NgwUploadOptions) {
    this.options = { ...this.options, ...options };
    this.connector = new NgwConnector(options);
  }

  createInput(options: UploadInputOptions): HTMLElement {
    options = {...this.options.inputOptions, ...options};
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.innerHTML = options.html;

    input.addEventListener('change', () => {
      this.uploadRaster(input.files[0], options);
    });

    return input;
  }

  uploadRaster(file: File, options: RasterUploadOptions): Promise<any> {
    return this.connector.post('file_upload.upload', {data: file}).then((resp) => {
      console.log(resp);
    });

  }
}
