import { RequestOptions } from '../interfaces';

export default function loadJSONBrowser(
  url: string,
  callback: (...args: any[]) => any,
  options: RequestOptions = {},
  error: (reason?: any) => void,
  onCancel: (cancelHandler: () => void) => void
): void {
  options.method = options.method || 'GET';

  const xhr = new XMLHttpRequest();
  xhr.open(options.method || 'GET', url, true); // true for asynchronous

  if (options.responseType === 'blob') {
    xhr.responseType = options.responseType;
  }

  const processingResponse = (forError = false) => {
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
      processingResponse();
    } else if (xhr.readyState === 3 && xhr.status === 400) {
      processingResponse();
    } else if (xhr.readyState === 4 && xhr.status === 500) {
      processingResponse();
    } else if (xhr.readyState === 4 && xhr.status === 401) {
      error(xhr.statusText);
    } else if (xhr.readyState === 4) {
      console.log(xhr.status);
      error('request error');
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
}
