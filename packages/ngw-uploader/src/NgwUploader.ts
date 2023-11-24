import { EventEmitter } from 'events';

import CancelablePromise from '@nextgis/cancelable-promise';
import NgwConnector from '@nextgis/ngw-connector';
import { fixUrlStr, isObject } from '@nextgis/utils';

import { createStyleName, nameFromOpt } from './utils/createName';
import { createResourceOptions } from './utils/createResourceOptions';
import { evented, onLoad } from './utils/decorators';
import { mapserverStyle } from './utils/mapserverStyle';

import type {
  CreateRasterOptions,
  CreateStyleOptions,
  CreateVectorOptions,
  CreateWmsConnectedLayerOptions,
  CreateWmsConnectionOptions,
  CreateWmsOptions,
  CreatedRes,
  EmitterStatus,
  FileUploadOptions,
  GroupOptions,
  NgwUploadOptions,
  RasterUploadOptions,
  VectorUploadOptions,
} from './interfaces';
import type { ResourceCls } from '@nextgis/ngw-connector';
import type { CreatedResource, ResourceItem } from '@nextgis/ngw-connector';
import type {
  FileMeta,
  WmsClientConnection,
  WmsClientLayer,
  WmsServerServiceLayer,
} from '@nextgis/ngw-connector';
import type { Upload } from 'tus-js-client';

type FileType = File | Buffer | { file: File | Buffer; name: string };

let TusUpload: typeof Upload | undefined;
try {
  const tus = require('tus-js-client');
  TusUpload = tus.Upload;
} catch (er) {
  // console.log('tus not founded');
}

const DEFAULT_CHUNK_SIZE = 16 * 2 ** 20; // 16Mb

export class NgwUploader {
  options: NgwUploadOptions = {
    baseUrl: '',
  };

  emitter = new EventEmitter();
  isLoaded = false;
  connector!: NgwConnector;

  constructor(options: NgwUploadOptions) {
    this.options = { ...this.options, ...options };
    this._initialize();
  }

  @evented({ status: 'create-group', template: 'group creation' })
  createGroup(
    nameOrOptions: string | GroupOptions,
    opt: GroupOptions = {},
  ): CancelablePromise<CreatedResource> {
    if (!this.connector) {
      throw new Error('Connector is not set yet');
    }
    if (typeof nameOrOptions === 'string') {
      opt.name = nameOrOptions;
    } else {
      opt = nameOrOptions;
    }
    const data = {
      resource: {
        ...createResourceOptions('resource_group', opt),
      },
      resmeta: opt.resmeta || {
        items: {},
      },
    };
    return this.connector.post('resource.collection', {
      data,
      headers: { Accept: '*/*' },
    });
  }

  @onLoad()
  uploadRaster<F extends FileType = FileType>(
    file: F,
    options: RasterUploadOptions,
  ): Promise<CreatedRes> {
    return this.fileUpload(file, options).then((source) => {
      return this.createRaster({
        source,
        ...options,
      }).then((newRes) => {
        return this.createStyle({
          ...options.style,
          displayName: createStyleName({ source, ...options }, options.style),
          parentId: newRes.id,
        });
      });
    });
  }

  @onLoad()
  uploadVector<F extends FileType = FileType>(
    file: F,
    options: VectorUploadOptions,
  ): Promise<CreatedResource> {
    return this.fileUpload(file, options).then((source) => {
      return this.createVector({
        source,
        ...options,
      }).then((newRes) => {
        return this.connector.getResourceOrFail(newRes.id).then((v) => {
          if (!v.vector_layer) {
            throw new Error('Vector resource creation error');
          }
          const styleOptions = options.style || {};
          if (!styleOptions.style) {
            const geometryType = v.vector_layer.geometry_type;
            styleOptions.style = mapserverStyle({
              geometryType,
              paint: options.paint,
            });
          }
          const styleName = createStyleName(
            { source, ...options },
            styleOptions,
          );
          return this.createStyle({
            ...styleOptions,
            cls: 'mapserver_style',
            displayName: styleName,
            parentId: newRes.id,
          });
        });
      });
    });
  }

  @evented({ status: 'create-vector', template: 'vector creation' })
  createVector(
    options: CreateVectorOptions,
  ): CancelablePromise<CreatedResource> {
    return this._createResource('vector_layer', options);
  }

  @evented({ status: 'create-raster', template: 'raster creation' })
  createRaster(
    options: CreateRasterOptions,
  ): CancelablePromise<CreatedResource> {
    return this._createResource('raster_layer', options);
  }

  @evented({
    status: 'create-style',
    template: 'style creation for resource ID {id}',
  })
  createStyle(
    opt: CreateStyleOptions,
    name?: string | number,
  ): CancelablePromise<CreatedRes> {
    if (!this.connector) {
      throw new Error('Connector is not set yet');
    }
    // for backward compatibility, use always displayName from opt
    if (name) {
      opt.displayName = String(name);
    }
    const cls = opt.cls || 'raster_style';
    const styleData: Record<string, unknown> = {
      resource: {
        ...createResourceOptions(cls, opt),
      },
      resmeta: opt.resmeta || {
        items: {},
      },
    };
    if (opt.style) {
      styleData[cls] = opt.style;
    }
    return this.connector
      .post('resource.collection', { data: styleData })
      .then((newStyle) => {
        return newStyle;
      });
  }

  @evented({
    status: 'create-wms',
    template: 'wms creation for resource ID {id}',
  })
  createWms(
    opt: CreateWmsOptions,
    name?: string,
  ): CancelablePromise<CreatedResource> | undefined {
    let layers: WmsServerServiceLayer[] = opt.layers || [
      {
        keyname: [opt.keyname, 'image1'].filter(Boolean).join('-'),
        display_name: name,
        resource_id: opt.resourceId ?? opt.id,
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
        ...createResourceOptions('wmsserver_service', { name, ...opt }),
        display_name: 'WMS_' + name,
      },
      resmeta: opt.resmeta || {
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
    opt: CreateWmsConnectionOptions,
    name?: string,
  ): CancelablePromise<CreatedResource> | undefined {
    const { url, password, username, version, capcache } = opt;

    const wmsclient_connection: WmsClientConnection = {
      url,
      username,
      password,
      version,
      capcache: capcache || 'query',
    };

    const wmsData = {
      resource: {
        ...createResourceOptions('wmsclient_connection', { name, ...opt }),
      },
      resmeta: opt.resmeta || {
        items: {},
      },
      wmsclient_connection,
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
    opt: CreateWmsConnectedLayerOptions,
    name?: string,
  ): CancelablePromise<CreatedResource> | undefined {
    const { id, vendor_params, imgformat, srs, connection } = opt;
    const wmslayers =
      opt.wmslayers && Array.isArray(opt.wmslayers)
        ? opt.wmslayers.join(',')
        : opt.wmslayers;

    const wmsClientLayer: WmsClientLayer = {
      connection: connection || {
        id,
      },
      srs: srs || {
        id: 3857,
      },
      wmslayers,
      imgformat: imgformat || 'image/png',
      vendor_params,
    };
    const wmsData = {
      resource: {
        ...createResourceOptions('wmsclient_layer', { name, ...opt }),
      },
      resmeta: opt.resmeta || {
        items: {},
      },
      wmsclient_layer: wmsClientLayer,
    };
    return (
      this.connector &&
      this.connector.post('resource.collection', { data: wmsData })
    );
  }

  @evented({ status: 'upload', template: 'file upload' })
  fileUpload(
    file: FileType,
    options: FileUploadOptions = {},
  ): CancelablePromise<FileMeta> {
    const connector = this.connector;
    if (!connector) {
      throw new Error('Connector is not set yet');
    }

    const onProgress = (percentComplete: number) => {
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
    };
    const TU = TusUpload;

    if (TU) {
      return connector.connect().then((routers) => {
        const endpoint = routers['file_upload.collection'];

        const fileName = 'name' in file ? file.name : nameFromOpt(options);
        if (!fileName) {
          throw new Error('File `name` is not defined');
        }
        if (isObject(file) && 'file' in file) {
          file = file.file;
        }

        return new CancelablePromise<FileMeta>((resolve, reject, onCancel) => {
          const headers = connector.getAuthorizationHeaders() as Record<
            string,
            string
          >;
          const baseUrl = connector.options.baseUrl || '';
          const url = baseUrl + endpoint[0];

          const uploader = new TU(file as File, {
            endpoint: fixUrlStr(url),
            storeFingerprintForResuming: false,
            chunkSize: DEFAULT_CHUNK_SIZE,
            metadata: { name: fileName },
            headers: headers ? headers : {},

            onProgress: function (bytesUploaded, bytesTotal) {
              onProgress((bytesUploaded / bytesTotal) * 100);
            },

            onError: (err: unknown) => {
              reject(err);
            },

            onSuccess: () => {
              if (uploader.url) {
                connector
                  .makeQuery<FileMeta>(
                    uploader.url.replace(baseUrl, ''),
                    null,
                    {
                      method: 'GET',
                    },
                  )
                  .then((createdFile) => {
                    resolve(createdFile);
                  });
              } else {
                reject('Tus upload problem');
              }
            },
          });
          uploader.start();
          onCancel(() => {
            uploader.abort();
          });
        });
      });
    } else {
      const request = options.put
        ? this.connector.put('file_upload.upload', {
            file: file as File,
            onProgress,
          })
        : this.connector.post('file_upload.upload', {
            file: file as File,
            onProgress,
          });
      return request.then((resp) => {
        if (resp) {
          if (resp.upload_meta) {
            return resp.upload_meta[0];
          } else if (options.put) {
            return resp;
          }
        }
      });
    }
  }

  /**@deprecated - use {@link createRaster} instead */
  createResource(
    meta: FileMeta,
    name: string,
    options: RasterUploadOptions,
  ): CancelablePromise<CreatedResource> | undefined {
    return this.createRaster({ source: meta, display_name: name, ...options });
  }

  getResource(
    id: number,
  ): CancelablePromise<ResourceItem | undefined> | undefined {
    return this.connector && this.connector.getResource(id);
  }

  protected async _initialize() {
    if (this.options.connector) {
      this.connector = this.options.connector;
    } else {
      this.connector = new NgwConnector(this.options);
    }
    this.isLoaded = true;
    this.emitter.emit('load');
  }

  private _createResource(
    cls: ResourceCls,
    opt: CreateRasterOptions,
  ): CancelablePromise<CreatedResource> {
    if (!this.connector) {
      throw new Error('Connector is not set yet');
    }
    const { source } = opt;
    const data = {
      resource: {
        ...createResourceOptions(cls, opt),
      },
      resmeta: opt.resmeta || {
        items: {},
      },
      [cls]: {
        source: {
          id: source.id,
          mime_type: source.mime_type,
          size: source.size,
        },
        srs: opt.srs || { id: 3857 },
      },
    };

    return this.connector.post('resource.collection', {
      data,
      headers: { Accept: '*/*' },
    });
  }
}
