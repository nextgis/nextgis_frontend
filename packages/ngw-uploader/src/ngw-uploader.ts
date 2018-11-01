// import { NgwConnector } from '../../../nextgisweb_frontend/packages/ngw-connector/src/ngw-connector';
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
}

export interface RespError {
  exception: 'ValidationError';
  message: string;
  serializer: string;
}

interface EmitterStatus {
  status: 'upload' | 'create-resource' | 'create-style' | 'create-wms';
  state: 'begin' | 'end' | 'progress' | 'error';
  message?: string;
  data?: any;
}

export default class NgwUploader {

  options: NgwUploadOptions = {
    inputOptions: {
      html: 'Upload file',
    },
  };

  emitter = new EventEmitter();
  connector: NgwConnector;

  constructor(options: NgwUploadOptions) {
    this.options = { ...this.options, ...options };
    this.connector = new NgwConnector(options);
  }

  createInput(options: UploadInputOptions = {}): HTMLElement {
    options = { ...this.options.inputOptions, ...options };
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.innerHTML = options.html;

    input.addEventListener('change', () => {
      this.uploadRaster(input.files[0], options);
    });

    return input;
  }

  uploadRaster(file: File, options: RasterUploadOptions): Promise<any> {
    return this._fileUpload(file, options)
      .then((resp) => {
        if (resp && resp.upload_meta) {

          const meta = resp.upload_meta[0];
          let name = options.name || meta.name;
          if (options.addTimestampToName) {
            name += '_' + new Date().toISOString();
          }
          return this._createResource(name, meta, options).then((newRes) => {
            if (newRes) {
              return this._createStyle(name, newRes).then((newStyle) => {
                return this._createWms(name, newStyle);
              });
            }
            return Promise.reject('No resource');
          });
        }
      }).catch((er: RespError) => {
        console.error(er.message);
      });
  }

  private _createResource(name: string, meta, options: RasterUploadOptions) {

    const eventBegin: EmitterStatus = {
      status: 'create-resource',
      state: 'begin',
      message: 'resource creation start',
      data: meta
    };
    this.emitter.emit('status:change', eventBegin);

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

    return this.connector.post('resource.collection', { data, headers: { Accept: '*/*' } }).then((resp) => {
      const eventEnd: EmitterStatus = {
        status: 'create-resource',
        state: 'end',
        message: 'resource creation complete',
        data: resp
      };
      this.emitter.emit('status:change', eventEnd);
      return resp;
    }).catch((error) => {
      const eventError: EmitterStatus = {
        status: 'create-resource',
        state: 'error',
        message: 'resource creation error',
        data: error
      };
      this.emitter.emit('status:change', eventError);
      throw error;
    });
  }

  private _createStyle(name: string, newRes) {

    const eventBegin: EmitterStatus = {
      status: 'create-style',
      state: 'begin',
      message: `style creation for resource ${newRes.id} start`,
      data: newRes
    };
    this.emitter.emit('status:change', eventBegin);

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
    return this.connector.post('resource.collection', { data: styleData }).then((resp) => {
      const eventEnd: EmitterStatus = {
        status: 'create-style',
        state: 'end',
        message: `style creation for resource ${newRes.id} complete`,
        data: resp
      };
      this.emitter.emit('status:change', eventEnd);
      return resp;
    }).catch((error) => {
      const eventError: EmitterStatus = {
        status: 'create-style',
        state: 'error',
        message: `style creation for resource ${newRes.id} failed`,
        data: error
      };
      this.emitter.emit('status:change', eventError);
      throw error;
    });
  }

  private _createWms(name: string, newStyle) {

    const eventBegin: EmitterStatus = {
      status: 'create-wms',
      state: 'begin',
      message: `wms creation for resource ${newStyle.id} start`,
      data: newStyle
    };
    this.emitter.emit('status:change', eventBegin);

    const wmsData = {
      resource: {
        cls: 'wmsserver_service',
        parent: {
          id: 0
        },
        display_name: 'WMS_' + name,
        keyname: null,
        description: null
      },
      resmeta: {
        items: {}
      },
      wmsserver_service: {
        layers: [
          {
            keyname: 'image1',
            display_name: name,
            resource_id: newStyle.id,
            min_scale_denom: null,
            max_scale_denom: null
          }
        ]
      }
    };
    return this.connector.post('resource.collection', { data: wmsData }).then((resp) => {
      const eventEnd: EmitterStatus = {
        status: 'create-wms',
        state: 'end',
        message: `wms creation for style ${newStyle.id} complete`,
        data: resp
      };
      this.emitter.emit('status:change', eventEnd);
      return resp;
    }).catch((error) => {
      const eventError: EmitterStatus = {
        status: 'create-wms',
        state: 'error',
        message: `wms creation for style ${newStyle.id} failed`,
        data: error
      };
      this.emitter.emit('status:change', eventError);
      throw error;
    });
  }

  private _fileUpload(file: File, options: RasterUploadOptions = {}) {
    const eventBegin: EmitterStatus = {
      status: 'upload',
      state: 'begin',
      message: 'file upload start',
      data: {
        file
      }
    };
    this.emitter.emit('status:change', eventBegin);
    return this.connector.post('file_upload.upload', {
      file,
      onProgress: (percentComplete) => {
        const message = percentComplete + '% uploaded';
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
      const eventEnd: EmitterStatus = {
        status: 'upload',
        state: 'end',
        message: 'file upload finish',
        data: meta
      };
      this.emitter.emit('status:change', eventEnd);
      return resp;
    }).catch((error) => {
      const eventError: EmitterStatus = {
        status: 'upload',
        state: 'error',
        message: 'file upload error',
        data: error
      };
      this.emitter.emit('status:change', eventError);
      throw error;
    });
  }
}
