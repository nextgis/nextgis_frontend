import type ImageWrapper from 'ol/Image';
import type Tile from 'ol/Tile';

export function setTileLoadFunction(
  tile: Tile | ImageWrapper,
  src: string,
  headers?: Record<string, any>,
): [Promise<void>, () => void] {
  let abort = () => {
    //
  };
  // @ts-expect-error Property 'getImage' does not exist on type 'Tile | ImageWrapper'.
  const img = tile.getImage() as HTMLImageElement;
  const promise = new Promise<void>((resolve, reject) => {
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
      img.src = imageUrl;
      resolve();
    };
    xhr.onerror = () => {
      reject();
    };
    xhr.send();
    abort = () => {
      xhr.abort();
      resolve();
    };
  });

  return [promise, abort];
}
