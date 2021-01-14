import { DomUtil, TileLayerOptions, Util } from 'leaflet';
import { callAjax } from './layersUtility';

type Constructor = new (...args: any[]) => {};

export function makeRemote<
  TBase extends Constructor,
  O extends TileLayerOptions = TileLayerOptions
>(Base: TBase) {
  return class RemoteTileLayer extends Base {
    options!: O;

    createTile(
      coords: Record<string, unknown>,
      done: (error: any, tile: HTMLImageElement) => void
    ): HTMLImageElement {
      // @ts-ignore
      const url = this.getTileUrl(coords);

      const tile = document.createElement('img');
      (tile as any).abort = callAjax(
        url,
        (response) => {
          tile.src = response;
          done(null, tile);
        },
        // @ts-ignore
        this.options.headers
      );

      if (this.options.crossOrigin || this.options.crossOrigin === '') {
        tile.crossOrigin =
          this.options.crossOrigin === true ? '' : this.options.crossOrigin;
      }

      tile.alt = '';
      tile.setAttribute('role', 'presentation');

      return tile;
    }

    _abortLoading() {
      // @ts-ignore
      const tiles = this._tiles;
      // @ts-ignore
      const tileZoom = this._tileZoom;
      for (let i in tiles) {
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
