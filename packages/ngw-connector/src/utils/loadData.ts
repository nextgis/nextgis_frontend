import {
  RequestOptions as NgwRequestOptions,
  RequestMethods,
} from '../interfaces';
import { NgwError } from '../errors/NgwError';
import { NetworkError } from '../errors/NetworkError';

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
      if ([401, 403, 404, 500].indexOf(xhr.status) !== -1) {
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
        for (const d in data) {
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
    const request = new Promise((resolve, reject) => {
      const adapter = adapterFor(url);
      if (adapter) {
        const requestOpt = {
          headers: options.headers || {},
          method: options.method,
        };
        const body =
          typeof options.data === 'string'
            ? options.data
            : JSON.stringify(options.data);
        // https://stackoverflow.com/questions/35589109/node-http-delete-request-no-longer-works-after-upgrading-from-0-10-40
        if (body !== undefined && options.method !== 'POST') {
          Object.assign(requestOpt.headers, {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          });
        }
        const req = adapter.request(url, requestOpt, (resp: any) => {
          let data = '';
          resp.on('data', (chunk: any) => {
            data += chunk;
          });
          resp.on('end', () => {
            if (data) {
              let json: Record<string, any> | undefined;
              try {
                json = JSON.parse(data);
                if (json && json.status_code && json.status_code) {
                  reject(json.message);
                }
              } catch (er) {
                reject(er);
                // throw new Error(er);
              }
              if (json !== undefined) {
                resolve(json);
              }
            }
            reject('no data');
          });
        });
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
