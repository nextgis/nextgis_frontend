import { DomUtil, GridLayer, Util } from 'leaflet';

import { debounce } from '../../../utils/src';

import { callAjax } from './callAjax';

type Constructor = new (...args: any[]) => any;

export function makeRemote<TBase extends Constructor>(Base: TBase): TBase {
  return class RemoteTileLayer extends Base {
    constructor(...args: any[]) {
      super(...args);
      if (this.options.setViewDelay) {
        this._update = debounce((...a: any[]) => {
          // @ts-expect-error Property '_update' does not exist on type 'GridLayer'.
          GridLayer.prototype._update.call(this, ...a);
        }, this.options.setViewDelay);
      }
    }

    createTile(
      coords: Record<string, unknown>,
      done: (error: any, tile: HTMLImageElement) => void,
    ): HTMLImageElement {
      const src = this.getTileUrl(coords);

      const tile = document.createElement('img');
      const [promise, abortFunc] = callAjax({
        src,
        withCredentials: this.options.withCredentials,
        headers: this.options.headers,
      });
      promise.then((response) => {
        tile.src = response;
        done(null, tile);
      });
      (tile as any).abort = abortFunc;

      if (this.options.crossOrigin || this.options.crossOrigin === '') {
        tile.crossOrigin =
          this.options.crossOrigin === true ? '' : this.options.crossOrigin;
      }

      tile.alt = '';
      tile.setAttribute('role', 'presentation');

      return tile;
    }

    _abortLoading() {
      const tiles = this._tiles;

      const tileZoom = this._tileZoom;
      for (const i in tiles) {
        if (tiles[i].coords.z !== tileZoom) {
          const tile = tiles[i].el;

          tile.onload = Util.falseFn;
          tile.onerror = Util.falseFn;
          if (!tile.complete) {
            if (tile.abort) {
              tile.abort();
            }
            tile.src = Util.emptyImageUrl;
            DomUtil.remove(tile);
            delete tiles[i];
          }
        }
      }
    }
  };
}
