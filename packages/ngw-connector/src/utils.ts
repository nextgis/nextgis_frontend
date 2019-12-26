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

import { RequestOptions } from './interfaces';

export function loadJSON(
  url: string,
  callback: (...args: any[]) => any,
  options: RequestOptions = {},
  error: (reason?: any) => void,
  onCancel: (() => void)[]
) {
  options.method = options.method || 'GET';

  const xhr = new XMLHttpRequest();
  xhr.open(options.method || 'GET', url, true); // true for asynchronous

  if (options.responseType === 'blob') {
    xhr.responseType = options.responseType;
  }

  const processingResponce = (forError = false) => {
    const cb = forError ? error : callback;
    if (options.responseType === 'blob') {
      cb(xhr.response);
    } else {
      if (xhr.responseText) {
        try {
          cb(JSON.parse(xhr.responseText));
        } catch (er) {
          cb(xhr.responseText);
        }
      } else {
        error({ message: '' });
      }
    }
  };

  xhr.onreadystatechange = () => {
    if (
      (xhr.readyState === 4 && xhr.status === 200) ||
      (xhr.readyState === 3 && xhr.status === 201)
    ) {
      processingResponce();
    } else if (xhr.readyState === 3 && xhr.status === 400) {
      processingResponce();
    } else if (xhr.readyState === 4 && xhr.status === 500) {
      processingResponce();
    } else if (xhr.readyState === 4 && xhr.status === 401) {
      error(xhr.statusText);
    } else if (xhr.readyState === 4) {
      error('request error');
    }
  };

  xhr.onerror = er => {
    error(er);
  };

  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
      const percentComplete = (e.loaded / e.total) * 100;
      if (options.onProgress) {
        options.onProgress(percentComplete);
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
    onCancel.push(() => {
      xhr.abort();
    });
  }
  xhr.send(data);
}

// https://github.com/Leaflet/Leaflet/blob/b507e21c510b53cd704fb8d3f89bb46ea925c8eb/src/core/Util.js#L165
const templateRe = /\{ *([\w_-]+) *\}/g;

export function template(str: string, data: { [param: string]: any }) {
  return str.replace(templateRe, (s, key) => {
    let value = data[key];

    if (value === undefined) {
      throw new Error('No value provided for letiable ' + s);
    } else if (typeof value === 'function') {
      value = value(data);
    }
    return value;
  });
}
