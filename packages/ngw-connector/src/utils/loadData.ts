import {
  RequestOptions as NgwRequestOptions,
  RequestMethods,
} from '../interfaces';
import { NetworkError } from '../errors/NetworkError';
import { NgwError } from '../errors/NgwError';
import { isError } from '../errors/isError';
import { isObject } from './isObject';

// readyState
// Holds the status of the XMLHttpRequest.
// 0: request not initialized
// 1: server connection established
// 2: request received
// 3: processing request
// 4: request finished and response is ready

// status
// 200: "OK"
// 201 "Created"	The request has been fulfilled, and a new resource is created
// 403: "Forbidden"
// 404: "Page not found"
// 500: "Internal Server Error"
// For a complete list go to the Http Messages Reference

type LoadData = (
  url: string,
  callback: (...args: any[]) => any,
  options: NgwRequestOptions<RequestMethods> | undefined,
  error: (reason?: any) => void,
  onCancel: (cancelHandler: () => void) => void,
) => void;

let loadData: LoadData;
// @ts-ignore
if (__BROWSER__) {
  loadData = (
    url: string,
    callback: (...args: any[]) => any,
    options: NgwRequestOptions = {},
    error: (reason?: any) => void,
    onCancel: (cancelHandler: () => void) => void,
  ): void => {
    options.method = options.method || 'GET';

    const xhr = new XMLHttpRequest();
    xhr.open(options.method || 'GET', url, true); // true for asynchronous

    if (options.responseType === 'blob') {
      xhr.responseType = options.responseType;
    }
    const getResponseText = () => {
      try {
        return JSON.parse(xhr.responseText);
      } catch (er) {
        return xhr.responseText;
      }
    };
    const processingResponse = (forError = false) => {
      const cb = forError ? error : callback;
      if (options.responseType === 'blob') {
        cb(xhr.response);
      } else {
        if (xhr.responseText) {
          cb(getResponseText());
        } else {
          error({ message: '' });
        }
      }
    };
    xhr.onload = () => {
      if ([401, 403, 404, 422, 500].indexOf(xhr.status) !== -1) {
        error(new NgwError(getResponseText()));
      }
      processingResponse();
    };

    // xhr.onreadystatechange = () => {
    //   if (
    //     (xhr.readyState === 4 && xhr.status === 200) ||
    //     (xhr.readyState === 3 && xhr.status === 201)
    //   ) {
    //     processingResponse();
    //   } else if (xhr.readyState === 3 && xhr.status === 400) {
    //     processingResponse();
    //   } else if (xhr.readyState === 4 && xhr.status === 500) {
    //     processingResponse();
    //   } else if (xhr.readyState === 4 && xhr.status === 401) {
    //     error(xhr.statusText);
    //   } else if (xhr.readyState === 4) {
    //     error('request error');
    //   }
    // };

    xhr.onerror = (er) => {
      if (xhr.status === 0) {
        error(new NetworkError(url));
      } else {
        error(er);
      }
    };

    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        if (options.onProgress) {
          options.onProgress(percentComplete, e);
        }
        // console.log(percentComplete + '% uploaded');
      }
    };

    const headers = options.headers;
    if (headers) {
      for (const h in headers) {
        const header = headers[h];
        if (typeof header === 'string') {
          xhr.setRequestHeader(h, header);
        }
      }
    }
    if (options.withCredentials !== undefined) {
      xhr.withCredentials = options.withCredentials;
    }

    let data: FormData | any;
    if (options.file) {
      data = new FormData();
      data.append('file', options.file);
      if (options.data) {
        for (const d in options.data) {
          data.append(d, data[d]);
        }
      }
    } else {
      data = options.data
        ? typeof options.data === 'string'
          ? options.data
          : JSON.stringify(options.data)
        : null;
    }
    if (onCancel) {
      onCancel(() => {
        xhr.abort();
      });
    }
    xhr.send(data);
  };
} else {
  const url = require('url');
  const http = require('http');
  const https = require('https');
  const FormData = require('form-data');

  const adapterFor = (inputUrl: string) => {
    const adapters: Record<string, any> = {
      'http:': http,
      'https:': https,
    };
    const protocol = url.parse(inputUrl).protocol || 'https:';
    return adapters[protocol];
  };

  loadData = (
    url: string,
    callback: (...args: any[]) => any,
    options: NgwRequestOptions<RequestMethods> = {},
    error: (reason?: any) => void,
    onCancel: (cancelHandler: () => void) => void,
  ): Promise<unknown> => {
    const { file, headers, method, data, responseType } = options;

    const request = new Promise((resolve, reject) => {
      const adapter = adapterFor(url);
      if (adapter) {
        const requestOpt = {
          headers: headers || {},
          method,
        };
        const body = typeof data === 'string' ? data : JSON.stringify(data);
        // https://stackoverflow.com/questions/35589109/node-http-delete-request-no-longer-works-after-upgrading-from-0-10-40
        let form;
        let uploadedFile = file;
        if (file) {
          const fileMeta = {};
          if (
            isObject(file) &&
            'file' in file &&
            ('filename' in file || 'name' in file)
          ) {
            const {
              file: file_,
              name,
              ...fileMeta_
            } = file as Record<string, any>;
            if (name && !fileMeta_.filename) {
              fileMeta_.filename = name;
            }
            Object.assign(fileMeta, fileMeta_);
            uploadedFile = file_ as File;
          }
          form = new FormData();
          form.append('file', uploadedFile, fileMeta);
          if (data) {
            for (const d in data) {
              form.append(d, data[d]);
            }
          }
          Object.assign(requestOpt.headers, {
            // 'content-length': form.getLengthSync(),
            ...form.getHeaders(),
          });
        }

        if (body !== undefined) {
          Object.assign(requestOpt.headers, {
            'content-type': 'application/json',
            'content-length': Buffer.byteLength(body),
          });
        }
        const req = adapter.request(url, requestOpt, (resp: any) => {
          let data = '';
          resp.on('data', (chunk: any) => {
            data += chunk;
          });
          resp.on('end', () => {
            if (data) {
              if (responseType === 'blob') {
                resolve(data);
              } else {
                let json: Record<string, any> | undefined;
                try {
                  json = JSON.parse(data);
                  if (json && json.status_code && json.status_code) {
                    reject(json.message);
                  }
                } catch (er) {
                  reject(er);
                }
                if (json !== undefined) {
                  if (isError(json)) {
                    reject('extractError(json)');
                  } else {
                    resolve(json);
                  }
                }
              }
            }
            reject('no data');
          });
        });
        if (form) {
          form.pipe(req);
        }
        req.on('error', (err: any) => {
          reject(err);
        });
        if (body) {
          req.write(body);
        }
        onCancel(() => {
          req.abort();
        });
        req.end();
      } else {
        throw new Error(`Given URL '${url}' is not correct`);
      }
    });
    return request
      .then((data) => {
        if (callback) {
          callback(data);
        }
        return data;
      })
      .catch((er) => {
        if (error) {
          error(er);
        } else {
          throw new Error(er);
        }
      });
  };
}

export { loadData };
