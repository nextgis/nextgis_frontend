import NgwConnector from '@nextgis/ngw-connector';
import NgwUploader from '@nextgis/ngw-uploader';

import { showLoginDialog } from './utils/dialog';
import { createInput } from './utils/input';

import type { NgwUploadInputOptions, UploadInputOptions } from './interfaces';

import './ngw-uploader.css';

export class NgwUploaderInput extends NgwUploader {
  inputOptions: UploadInputOptions = {
    html: 'Upload file',
  };
  loginDialog = false;

  constructor(options: NgwUploadInputOptions) {
    super(options);
    if (options.inputOptions) {
      Object.assign(this.inputOptions, options.inputOptions);
    }
    this.loginDialog = !!options.loginDialog;
    this._initialize();
  }

  createInput(opt: UploadInputOptions = {}): HTMLElement {
    opt = { ...this.inputOptions, ...opt };
    return createInput(opt, (file, opt_) => this.uploadRaster(file, opt_));
  }

  protected async _initialize() {
    if (this.options.connector) {
      this.connector = this.options.connector;
    } else {
      if (this.loginDialog) {
        try {
          const loginOpt = await showLoginDialog(this.options.auth);
          this.options.auth = loginOpt;
        } catch {
          // ignore
        }
      }
      this.connector = new NgwConnector(this.options);
    }
    this.isLoaded = true;
    this.emitter.emit('load');
  }
}
