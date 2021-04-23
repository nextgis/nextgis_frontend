import './ngw-uploader.css';

import NgwConnector, {
  Credentials,
  CreatedResource,
  ResourceItem,
} from '@nextgis/ngw-connector';
import CancelablePromise from '@nextgis/cancelable-promise';
import Dialog from '@nextgis/dialog';
import { EventEmitter } from 'events';
import { evented, onLoad } from './decorators';
import {
  NgwUploadOptions,
  UploadInputOptions,
  RasterUploadOptions,
  CreateWmsConnectionOptions,
  CreateWmsConnectedLayerOptions,
  EmitterStatus,
  GroupOptions,
} from './interfaces';

type ImageTypes = 'image/tif' | 'image/tiff' | '.tif';

const imageTypesAccept: { [format: string]: ImageTypes[] } = {
  tiff: ['image/tif', 'image/tiff', '.tif'],
};

export class NgwUploader {
  options: NgwUploadOptions = {
    baseUrl: '',
    inputOptions: {
      html: 'Upload file',
    },
  };

  emitter = new EventEmitter();
  isLoaded = false;
  connector?: NgwConnector;

  constructor(options: NgwUploadOptions) {
    this.options = { ...this.options, ...options };
    this._initialize();
  }

  @onLoad()
  uploadRaster(
    file: File,
    options: RasterUploadOptions,
  ): Promise<any> | undefined {
    const fileUpload = this.fileUpload(file, options);
    if (fileUpload) {
      return fileUpload.then((meta) => {
        if (meta) {
          let name = options.name || meta.name;
          if (options.createName) {
            name = options.createName(name);
          } else if (options.addTimestampToName) {
            name += '_' + new Date().toISOString();
          }
          options.name = name;
          const createResource = this.createResource(meta, name, options);
          if (createResource) {
            return createResource.then<any>((newRes: any) => {
              if (newRes) {
                newRes.name = newRes.name || options.name;
                return this.createStyle(newRes);
              }
              return Promise.reject('No resource');
            });
          }
        }
      });
    }
  }

  @evented({ status: 'create-group', template: 'group creation' })
  createGroup(
    name: string,
    options: GroupOptions = {},
  ): CancelablePromise<CreatedResource> | undefined {
    const data = {
      resource: {
        cls: 'resource_group',
        parent: {
          id: options.parentId !== undefined ? options.parentId : 0,
        },
        display_name: name,
        keyname: options.keyname,
        description: options.description,
      },
    };

    return (
      this.connector &&
      this.connector.post('resource.collection', {
        data,
        headers: { Accept: '*/*' },
      })
    );
  }

  @evented({ status: 'create-resource', template: 'resource creation' })
  createResource(
    meta: Record<string, any>,
    name: string,
    options: RasterUploadOptions,
  ): CancelablePromise<CreatedResource> | undefined {
    const data = {
      resource: {
        cls: 'raster_layer',
        display_name: name,
        parent: {
          id: options.parentId !== undefined ? options.parentId : 0,
        },
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

    return (
      this.connector &&
      this.connector.post('resource.collection', {
        data,
        headers: { Accept: '*/*' },
      })
    );
  }

  @evented({
    status: 'create-style',
    template: 'style creation for resource ID {id}',
  })
  createStyle(
    newRes: Record<string, any>,
    name?: string,
  ): CancelablePromise<CreatedResource & { name: string }> | undefined {
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
    return (
      this.connector &&
      this.connector
        .post('resource.collection', { data: styleData })
        .then((newStyle) => {
          // newStyle.name = newStyle.name || name;
          return {
            ...newStyle,
            // FIXME: check `name` exist in response for all resource created
            name: (newStyle as any).name || name,
          };
        })
    );
  }

  @evented({
    status: 'create-wms',
    template: 'wms creation for resource ID {id}',
  })
  createWms(
    options: Record<string, any>,
    name?: string,
  ): CancelablePromise<CreatedResource> | undefined {
    name = name || options.name || options.id;
    let layers = options.layers || [
      {
        keyname: 'image1',
        display_name: name,
        resource_id: options.id,
      },
    ];
    layers = layers.map((x: any) => {
      return {
        ...{
          min_scale_denom: null,
          max_scale_denom: null,
        },
        ...x,
      };
    });
    const wmsData = {
      resource: {
        cls: 'wmsserver_service',
        parent: {
          id: options.parentId || 0,
        },
        display_name: 'WMS_' + name,
        keyname: null,
        description: null,
      },
      resmeta: {
        items: {},
      },
      wmsserver_service: {
        layers,
      },
    };
    return (
      this.connector &&
      this.connector.post('resource.collection', { data: wmsData })
    );
  }

  @evented({
    status: 'create-wms-connection',
    template: 'create wms connection',
  })
  createWmsConnection(
    options: CreateWmsConnectionOptions,
    name?: string,
  ): CancelablePromise<CreatedResource> | undefined {
    name = name || options.name || String(options.id);
    const wmsData = {
      resource: {
        cls: 'wmsclient_connection',
        parent: {
          id: options.parentId !== undefined ? options.parentId : 0,
        },
        display_name: name,
        keyname: null,
        description: null,
      },
      resmeta: {
        items: {},
      },
      wmsclient_connection: {
        url: options.url,
        username: options.password,
        password: options.password,
        version: options.version,
        capcache: options.capcache || 'query',
      },
    };
    return (
      this.connector &&
      this.connector.post('resource.collection', { data: wmsData })
    );
  }

  @evented({
    status: 'create-wms-connected-layer',
    template: 'create WMS layer for conected resource ID {id}',
  })
  createWmsConnectedLayer(
    options: CreateWmsConnectedLayerOptions,
    name?: string,
  ): CancelablePromise<CreatedResource> | undefined {
    name = name || options.name || String(options.id);
    const wmslayers =
      options.wmslayers && Array.isArray(options.wmslayers)
        ? options.wmslayers.join(',')
        : options.wmslayers;
    const wmsData = {
      resource: {
        cls: 'wmsclient_layer',
        parent: {
          id: options.parentId || 0,
        },
        display_name: options.name,
        keyname: null,
        description: null,
      },
      resmeta: {
        items: {},
      },
      wmsclient_layer: {
        connection: {
          id: options.id,
        },
        srs: {
          id: 3857,
        },
        wmslayers,
        imgformat: options.imgformat || 'image/png',
        vendor_params: options.vendor_params,
      },
    };
    return (
      this.connector &&
      this.connector.post('resource.collection', { data: wmsData })
    );
  }

  @evented({ status: 'upload', template: 'file upload' })
  fileUpload(
    file: File,
    options: RasterUploadOptions = {},
  ): CancelablePromise<Record<string, any>> | undefined {
    return (
      this.connector &&
      this.connector
        .post('file_upload.upload', {
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
                percentComplete,
              },
            };
            this.emitter.emit('status:change', eventProgress);
          },
        })
        .then((resp) => {
          let meta;
          if (resp && resp.upload_meta) {
            meta = resp.upload_meta[0];
          }
          return meta;
        })
    );
  }

  createInput(opt: UploadInputOptions = {}): HTMLElement {
    opt = { ...this.options.inputOptions, ...opt };
    const allowImage = opt.image || true;
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    let accept: ImageTypes[] = [];
    if (allowImage) {
      accept = Object.keys(imageTypesAccept).reduce((a: ImageTypes[], b) => {
        const imageTypes = imageTypesAccept[b];
        return a.concat(imageTypes);
      }, []);
    }
    input.setAttribute('accept', accept.join(','));
    if (opt.html) {
      input.innerHTML = opt.html;
    }
    input.addEventListener('change', () => {
      const file = input && input.files && input.files[0];
      if (file) {
        const uploadPromise = this.uploadRaster(file, opt);
        if (uploadPromise) {
          if (opt.success) {
            uploadPromise.then(opt.success);
          }
          if (opt.error) {
            uploadPromise.then(opt.error);
          }
        }
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

  getResource(
    id: number,
  ): CancelablePromise<ResourceItem | undefined> | undefined {
    return this.connector && this.connector.getResource(id);
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

  private _showLoginDialog(defAuth?: Credentials): Promise<Credentials> {
    return new Promise((resolve, reject) => {
      const dialog = new Dialog();
      const onResolve = (auth: Credentials) => {
        dialog.close();
        resolve(auth);
      };
      const onReject = (er: Error) => {
        dialog.close();
        reject(er);
      };
      if (defAuth) {
        const html = this._createDialogHtml(defAuth, onResolve, onReject);
        dialog.updateContent(html);
        dialog.show();
      }
    });
  }

  private _createDialogHtml(
    defAuth: Credentials,
    resolve: (cred: Credentials) => void,
    reject: (...args: any[]) => void,
  ): HTMLElement | undefined {
    if (defAuth && defAuth.login && defAuth.password) {
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
      const loginElement = form.getElementsByClassName(
        'name',
      )[0] as HTMLInputElement;
      const passwordElement = form.getElementsByClassName(
        'password',
      )[0] as HTMLInputElement;
      const loginBtn = form.getElementsByClassName(
        'login',
      )[0] as HTMLButtonElement;
      const cancelBtn = form.getElementsByClassName(
        'cancel',
      )[0] as HTMLButtonElement;
      const getAuthOpt: () => Credentials = () => {
        return {
          login: loginElement.value,
          password: passwordElement.value,
        };
      };
      const validate = () => {
        const auth = getAuthOpt();
        if (auth.login && auth.password) {
          loginBtn.disabled = false;
        } else {
          loginBtn.disabled = true;
        }
      };
      const onInputChange = () => {
        validate();
      };

      const addEventListener = () => {
        [loginElement, passwordElement].forEach((x) => {
          ['change', 'input'].forEach((y) =>
            x.addEventListener(y, onInputChange),
          );
        });
      };
      const removeEventListener = () => {
        [loginElement, passwordElement].forEach((x) => {
          ['change', 'input'].forEach((y) =>
            x.removeEventListener(y, onInputChange),
          );
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
}
