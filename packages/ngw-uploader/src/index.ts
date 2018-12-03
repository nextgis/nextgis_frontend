// import NgwConnector, { NgwConnectorOptions, AuthOptions } from '../../ngw-connector/src/ngw-connector';
import NgwConnector, { NgwConnectorOptions, AuthOptions } from '@nextgis/ngw-connector';
import { EventEmitter } from 'events';
import { evented, onLoad } from './decorators';
import Dialog from '@nextgis/dialog';
import './ngw-uploader.css';

export interface UploadInputOptions {
  html?: string;
  name?: string;
  parentId?: number;
  addTimestampToName?: boolean;
  success?: (newRes: ResourceCreateResp) => void;
  error?: (er: Error) => void;
  createName?: (name: string) => string;
  element?: string | HTMLElement;
  image?: boolean;
  vector?: boolean;
}

interface ResourceCreateOptions {
  name?: string;
  id?: number;
  parendId?: number;
}

export interface CreateWmsConnectionOptions extends ResourceCreateOptions {
  /** WMS service url */
  url: string;
  /** User name to connect to service */
  username?: string;
  /** Password to connect to service */
  password?: string;
  /** WMS version */
  version?: string;
  /** If equal query - query capabilities from service */
  capcache?: string;
}

export interface CreateWmsConnectedLayerOptions extends ResourceCreateOptions {
  connection: {
    id: 18
  };
  srs?: {
    id: number // 3857
  };
  imgformat?: string; // 'image/png'
  wmslayers: string; // '1,2'
}

interface ResourceCreateResp {
  id: number;
  name?: string;
  parent?: { id: number };
}

export interface NgwUploadOptions extends NgwConnectorOptions {
  inputOptions?: UploadInputOptions;
  loginDialog?: boolean;
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
  onProgress?: (percentComplete: number) => void;
  addTimestampToName?: boolean;
  createName?: (name: string) => string;
}

export interface RespError {
  exception: 'ValidationError';
  message: string;
  serializer: string;
}

export type AvailableStatus = 'upload' |
  'create-resource' |
  'create-style' |
  'create-wms' |
  'create-wms-connection' |
  'create-wms-connected-layer';

export interface EmitterStatus {
  status: AvailableStatus;
  state: 'begin' | 'end' | 'progress' | 'error';
  message?: string;
  data?: any;
}

const imageTypesAccept = {
  tiff: ['image/tif', 'image/tiff', '.tif'],
};

export default class NgwUploader {

  options: NgwUploadOptions = {
    inputOptions: {
      html: 'Upload file',
    },
  };

  emitter = new EventEmitter();
  connector: NgwConnector;
  isLoaded: boolean = false;

  constructor(options: NgwUploadOptions) {
    this.options = { ...this.options, ...options };
    this._initialize();
  }

  createInput(opt: UploadInputOptions = {}): HTMLElement {
    opt = { ...this.options.inputOptions, ...opt };
    const allowImage = opt.image || true;
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    let accept = [];
    if (allowImage) {
      accept = accept.concat(
        Object.keys(imageTypesAccept).reduce((a, b) => {
          return a.concat(imageTypesAccept[b]);
        }, [])
      );
    }
    input.setAttribute('accept', accept.join(','));
    input.innerHTML = opt.html;

    input.addEventListener('change', () => {
      const uploadPromise = this.uploadRaster(input.files[0], opt);
      if (opt.success) {
        uploadPromise.then(opt.success);
      }
      if (opt.error) {
        uploadPromise.then(opt.error);
      }
    });
    if (opt.element) {
      let element;
      if (typeof opt.element === 'string') {
        element = document.getElementById(opt.element);
      } else if (opt.element instanceof HTMLElement) {
        element = opt.element;
      }
      if (element) {
        element.appendChild(input);
      } else {
        throw new Error('target element not founded');
      }
    }
    return input;
  }

  getResource(id: number) {
    return this.connector.request('resource.item', { id });
  }

  @onLoad()
  uploadRaster(file: File, options: RasterUploadOptions): Promise<any> {
    return this.fileUpload(file, options).then((meta) => {
      let name = options.name || meta.name;
      if (options.createName) {
        name = options.createName(name);
      } else if (options.addTimestampToName) {
        name += '_' + new Date().toISOString();
      }
      options.name = name;
      return this.createResource(meta, name, options).then((newRes) => {
        if (newRes) {
          newRes.name = newRes.name || options.name;
          return this.createStyle(newRes);
        }
        return Promise.reject('No resource');
      });
    });
  }

  @evented({ status: 'create-resource', template: 'resource creation' })
  createResource(meta, name: string, options: RasterUploadOptions) {

    const data = {
      resource: {
        cls: 'raster_layer',
        display_name: name,
        parent: { id: options.parentId !== undefined ? options.parentId : 0 },
      },
      raster_layer: {
        source: {
          id: meta.id,
          mime_type: meta.mime_type,
          size: meta.size,
        },
        srs: { id: 3857 },
      },
    };

    return this.connector.post('resource.collection', { data, headers: { Accept: '*/*' } });
  }

  @evented({ status: 'create-style', template: 'style creation for resource ID {id}' })
  createStyle(newRes, name?: string) {
    name = name || newRes.name || newRes.id;
    const styleData = {
      resource: {
        cls: 'raster_style',
        description: null,
        display_name: name + '_style',
        keyname: null,
        parent: {
          id: newRes.id,
        },
      },
    };
    return this.connector.post('resource.collection', { data: styleData }).then((newStyle) => {
      newStyle.name = newStyle.name || name;
      return newStyle;
    });
  }

  @evented({ status: 'create-wms', template: 'wms creation for resource ID {id}' })
  createWms(options, name?: string) {
    name = name || options.name || options.id;
    let layers = options.layers || [{
      keyname: 'image1',
      display_name: name,
      resource_id: options.id,
    }];
    layers = layers.map((x) => {
      return {
        ...{
          min_scale_denom: null,
          max_scale_denom: null
        }, ...x
      };
    });
    const wmsData = {
      resource: {
        cls: 'wmsserver_service',
        parent: {
          id: options.parentId || 0
        },
        display_name: 'WMS_' + name,
        keyname: null,
        description: null
      },
      resmeta: {
        items: {}
      },
      wmsserver_service: {
        layers
      }
    };
    return this.connector.post('resource.collection', { data: wmsData });
  }

  @evented({ status: 'create-wms-connection', template: 'create wms connection' })
  createWmsConnection(options: CreateWmsConnectionOptions, name?: string) {
    name = name || options.name || String(options.id);
    const wmsData = {
      resource: {
        cls: 'wmsclient_connection',
        parent: {
          id: 0
        },
        display_name: name,
        keyname: null,
        description: null
      },
      resmeta: {
        items: {}
      },
      wmsclient_connection: {
        url: options.url,
        username: options.password,
        password: options.password,
        version: options.version,
        capcache: options.capcache || 'query'
      }
    };
    return this.connector.post('resource.collection', { data: wmsData });
  }

  @evented({ status: 'create-wms-connected-layer', template: 'create WMS layer for conected resource ID {id}' })
  createWmsConnectedLayer(options: CreateWmsConnectedLayerOptions, name?: string) {
    name = name || options.name || String(options.id);
    const wmsData = {
      resource: {
        cls: 'wmsclient_layer',
        parent: {
          id: options.parendId || 0
        },
        display_name: options.name,
        keyname: null,
        description: null
      },
      resmeta: {
        items: {}
      },
      wmsclient_layer: {
        connection: {
          id: options.id
        },
        srs: {
          id: 3857
        },
        imgformat: options.imgformat || 'image/png',
        wmslayers: options.wmslayers
      }
    };
    return this.connector.post('resource.collection', { data: wmsData });
  }

  @evented({ status: 'upload', template: 'file upload' })
  fileUpload(file: File, options: RasterUploadOptions = {}) {
    return this.connector.post('file_upload.upload', {
      file,
      onProgress: (percentComplete) => {
        const message = percentComplete.toFixed(2) + '% uploaded';
        if (options.onProgress) {
          options.onProgress(percentComplete);
        }
        const eventProgress: EmitterStatus = {
          status: 'upload',
          state: 'progress',
          message,
          data: {
            percentComplete
          }
        };
        this.emitter.emit('status:change', eventProgress);
      },
    }).then((resp) => {
      let meta;
      if (resp && resp.upload_meta) {
        meta = resp.upload_meta[0];
      }
      return meta;
    });
  }

  private async _initialize() {
    if (this.options.loginDialog) {
      try {
        const loginOpt = await this._showLoginDialog(this.options.auth);
        this.options.auth = loginOpt;
      } catch (er) {
        // ignore
      }
    }
    this.connector = new NgwConnector(this.options);
    this.isLoaded = true;
    this.emitter.emit('load');
  }

  private _showLoginDialog(defAuth?: AuthOptions): Promise<AuthOptions> {
    return new Promise((resolve, reject) => {
      const dialog = new Dialog();
      const onResolve = (auth: AuthOptions) => {
        dialog.close();
        resolve(auth);
      };
      const onReject = (er: Error) => {
        dialog.close();
        reject(er);
      };
      const html = this._createDialogHtml(defAuth, onResolve, onReject);
      dialog.updateContent(html);
      dialog.show();
    });
  }

  private _createDialogHtml(defAuth: AuthOptions = {}, resolve, reject): HTMLElement {
    const { login, password } = defAuth;
    const form = document.createElement('div');
    form.className = 'ngw-uploader__login-dialog--form';
    const formHtml = `
      <div><label><div>Name:</div>
        <input value=${login} class="ngw-uploader__login-dialog--input name"></input>
      </label></div>
      <div><label><div>Password:</div>
        <input value=${password} type="password" class="ngw-uploader__login-dialog--input password"></input>
      </label></div>
      <button class="ngw-uploader__login-dialog--button login">Login</button>
      <button class="ngw-uploader__login-dialog--button cancel">Cancel</button>
    `;
    form.innerHTML = formHtml;
    const loginElement = form.getElementsByClassName('name')[0] as HTMLInputElement;
    const passwordElement = form.getElementsByClassName('password')[0] as HTMLInputElement;
    const loginBtn = form.getElementsByClassName('login')[0] as HTMLButtonElement;
    const cancelBtn = form.getElementsByClassName('cancel')[0] as HTMLButtonElement;
    const getAuthOpt: () => AuthOptions = () => {
      return {
        login: loginElement.value,
        password: passwordElement.value
      };
    };
    const onInputChange = () => {
      validate();
    };
    const validate = () => {
      const auth = getAuthOpt();
      if (auth.login && auth.password) {
        loginBtn.disabled = false;
      } else {
        loginBtn.disabled = true;
      }
    };
    const addEventListener = () => {
      [loginElement, passwordElement].forEach((x) => {
        ['change', 'input'].forEach((y) => x.addEventListener(y, onInputChange));
      });
    };
    const removeEventListener = () => {
      [loginElement, passwordElement].forEach((x) => {
        ['change', 'input'].forEach((y) => x.removeEventListener(y, onInputChange));
      });
    };
    loginBtn.onclick = () => {
      removeEventListener();
      resolve(getAuthOpt());
    };
    cancelBtn.onclick = () => {
      removeEventListener();
      reject('Login cancel');
    };
    validate();
    addEventListener();
    return form;
  }

}
