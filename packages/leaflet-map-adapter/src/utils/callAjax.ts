export function callAjax({
  src,
  headers,
  withCredentials,
}: {
  src: string;
  headers?: Record<string, any>;
  withCredentials?: boolean;
}): [Promise<string>, () => void] {
  let abortFunc = () => {
    // void
  };
  const promise = new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', src);
    xhr.responseType = 'arraybuffer';
    for (const h in headers) {
      xhr.setRequestHeader(h, headers[h]);
    }
    if (withCredentials) {
      xhr.withCredentials = withCredentials;
    }
    xhr.onload = function () {
      const arrayBufferView = new Uint8Array(this.response);
      const blob = new Blob([arrayBufferView], { type: 'image/png' });
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(blob);
      resolve(imageUrl);
    };
    xhr.onerror = reject;
    xhr.send();
    abortFunc = () => {
      xhr.abort();
      resolve('');
    };
  });
  return [promise, abortFunc];
}
