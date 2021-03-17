import type Tile from 'ol/Tile';
import type ImageWrapper from 'ol/Image';

export function setTileLoadFunction(
  tile: Tile | ImageWrapper,
  src: string,
  headers: Record<string, any>,
): void {
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
    // @ts-ignore
    tile.getImage().src = imageUrl;
  };
  xhr.send();
}
