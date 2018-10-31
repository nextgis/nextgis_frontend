import { NgwConnector } from '@nextgis/ngw-connector';

export default class NgwUploader {

  constructor(options) {
    this.options = { ...this.options, ...options };
    this.connector = new NgwConnector(options);
  }

  createInput(options) {
    options = {...this.options.inputOptions, ...options};
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.innerHTML = options.html;

    input.addEventListener('change', (event) => {
      console.log(event);
      // this.uploadFile(event.srcElement.files);
    });

    return input;
  }

  uploadRaster(file, options) {
    return Promise.resolve({});
  }
}
