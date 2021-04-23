export function callAjax(
  src: string,
  callback: (resp: any) => any,
  headers: Record<string, any>,
): () => void {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', src);
  xhr.responseType = 'arraybuffer';
  for (const h in headers) {
    xhr.setRequestHeader(h, headers[h]);
  }
  xhr.onload = function () {
    const arrayBufferView = new Uint8Array(this.response);
    const blob = new Blob([arrayBufferView], { type: 'image/png' });
    // @ts-ignore for typedoc
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(blob);
    callback(imageUrl);
  };
  xhr.send();
  return () => {
    xhr.abort();
  };
}
