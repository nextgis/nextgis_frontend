import { isError } from '../errors/isError';
import { NetworkError } from '../errors/NetworkError';
import { NgwError } from '../errors/NgwError';

import { isObject } from './isObject';

import type {
  RequestMethods,
  RequestOptions as NgwRequestOptions,
} from '../interfaces';

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

function createHttpError(
  status: number,
  statusText: string,
  response: unknown,
): NgwError {
  const details = isObject(response) ? response : {};
  const message =
    typeof details.message === 'string' && details.message
      ? details.message
      : typeof response === 'string' && response.trim()
        ? response
        : statusText || `HTTP ${status}`;

  return new NgwError({
    ...details,
    status_code: status,
    title:
      typeof details.title === 'string' && details.title
        ? details.title
        : `HTTP ${status}`,
    message,
  });
}

let loadData: LoadData;

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
      } catch {
        return xhr.responseText;
      }
    };
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        const response =
          options.responseType === 'blob' || !xhr.responseText
            ? undefined
            : getResponseText();
        error(createHttpError(xhr.status, xhr.statusText, response));
        return;
      }
      if (xhr.status === 204 || xhr.status === 205) {
        callback(undefined);
        return;
      }

      if (options.responseType === 'blob') {
        callback(xhr.response);
      } else {
        // 204/205 and other empty successful responses have no JSON body.
        callback(xhr.responseText ? getResponseText() : undefined);
      }
    };

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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const url = require('url');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const http = require('http');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const https = require('https');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
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
            const status = resp.statusCode ?? 0;
            const statusText = resp.statusMessage ?? '';
            if (status < 200 || status >= 300) {
              let response: unknown = data || undefined;
              if (data) {
                try {
                  response = JSON.parse(data);
                } catch {
                  // Non-JSON error bodies still carry the HTTP status.
                }
              }
              reject(createHttpError(status, statusText, response));
              return;
            }

            if (!data) {
              resolve(undefined);
              return;
            }
            if (responseType === 'blob') {
              resolve(data);
              return;
            }
            try {
              const json: unknown = JSON.parse(data);
              if (
                isError(json) ||
                (isObject(json) &&
                  typeof json.status_code === 'number' &&
                  json.status_code >= 400)
              ) {
                reject(
                  createHttpError(
                    isObject(json) ? json.status_code : status,
                    statusText,
                    json,
                  ),
                );
              } else {
                resolve(json);
              }
            } catch (er) {
              reject(er);
            }
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
