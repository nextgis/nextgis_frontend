// import { NgwConnector } from '../../../nextgisweb_frontend/packages/ngw-connector/src/ngw-connector';
import { NgwConnector } from '@nextgis/ngw-connector';
import { NgwUploadOptions, UploadInputOptions, RasterUploadOptions } from './interfaces';

export interface RespError {
  exception: 'ValidationError';
  message: string;
  serializer: string;
}

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
    return this.connector.post('file_upload.upload', {
      file,
      onProgress: (percentComplete) => {
        if (options.onProgress) {
          options.onProgress(percentComplete);
        } else {
          console.log(percentComplete + '% uploaded');
        }
      },
    }).then((resp) => {
      if (resp && resp.upload_meta) {

        const meta = resp.upload_meta[0];
        const name = options.name || meta.name;
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
        return this.connector.post('resource.collection', { data, headers: { Accept: '*/*' } }).then((newRes) => {
          console.log(newRes);
          const styleData = {
            resource: {
              cls: 'raster_style',
              description: null,
              display_name: name + ' style',
              keyname: null,
              parent: {
                id: newRes.id,
              },
            },
          };
          return this.connector.post('resource.collection', { data: styleData });
        }).catch((er: RespError) => {
          console.log(er.message);
        });
      }
    });
  }
}
