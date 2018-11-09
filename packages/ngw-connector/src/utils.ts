import { RequestOptions } from './interfaces';

export function loadJSON(url, callback, options: RequestOptions = {}, error) {
  options.method = options.method || 'GET';
  let xhr: XMLHttpRequest;

  xhr = new XMLHttpRequest();
  xhr.open(options.method || 'GET', url, true); // true for asynchronous

  xhr.onreadystatechange = () => {
    if ((xhr.readyState === 4 && xhr.status === 200) || (xhr.readyState === 3 && xhr.status === 201)) {
      if (xhr.responseText) {
        try {
          callback(JSON.parse(xhr.responseText));
        } catch (er) {
          error();
        }
      }
    } else if (xhr.readyState === 3 && xhr.status === 400) {
      if (xhr.responseText) {
        try {
          error(JSON.parse(xhr.responseText));
        } catch (er) {
          error({ message: '' });
        }
      } else {
        error({ message: '' });
      }
    }
  };

  xhr.onerror = (er) => {
    error(er);
  };

  xhr.upload.onprogress = function (e) {
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
      if (headers.hasOwnProperty(h)) {
        xhr.setRequestHeader(h, headers[h]);
      }
    }
  }
  xhr.withCredentials = true;

  let data;
  if (options.file) {
    data = new FormData();
    data.append('file', options.file);
    if (options.data) {
      for (const d in data) {
        if (data.hasOwnProperty(d)) {
          data.append(d, data[d]);
        }
      }
    }
  } else {
    data = options.data ? JSON.stringify(options.data) : null;
  }

  xhr.send(data);
}

// https://github.com/Leaflet/Leaflet/blob/b507e21c510b53cd704fb8d3f89bb46ea925c8eb/src/core/Util.js#L165
const templateRe = /\{ *([\w_-]+) *\}/g;

export function template(str, data) {
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
