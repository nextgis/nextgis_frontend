// import { NgwConnector } from '../ngw-connector/src/ngw-connector';
import { NgwConnector, NgwConnectorOptions } from '@nextgis/ngw-connector';
import { EventEmitter } from 'events';
import { evented } from './decorators';

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
  parent?: { id: number };
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
  createName?: (name: string) => string;
}

export interface RespError {
  exception: 'ValidationError';
  message: string;
  serializer: string;
}

export type AvailableStatus = 'upload' | 'create-resource' | 'create-style' | 'create-wms';

export interface EmitterStatus {
  status: AvailableStatus;
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
      const uploadPromise = this.uploadRaster(input.files[0], options);
      if (options.success) {
        uploadPromise.then(options.success);
      }
      if (options.error) {
        uploadPromise.then(options.error);
      }
      // .then((newStyle) => {
      //   this.createWms(newStyle, options.name);
      // });
    });

    return input;
  }

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
  createWms(newStyle, name?: string) {
    name = name || newStyle.name || newStyle.id;
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
}
