export function callAjax(
  src: string,
  headers: Record<string, any>,
): [Promise<string>, () => void] {
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
