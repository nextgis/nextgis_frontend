import { RequestOptions } from '../interfaces';
import { NgwError } from '../errors/NgwError';
import { NetworkError } from '../errors/NetworkError';

export default function loadDataBrowser(
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
    if ([404, 500].indexOf(xhr.status) !== -1) {
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
}
