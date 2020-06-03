import { TileLayerOptions } from 'leaflet';
import { callAjax } from './layersUtility';

export class RemoteTileLayer<O extends TileLayerOptions = TileLayerOptions> {
  options!: O;

  // _removeTile(key: any) {
  //   // @ts-ignore
  //   super._removeTile(key);
  // }

  createTile(
    coords: Record<string, unknown>,
    done: (error: any, tile: HTMLImageElement) => void
  ): HTMLImageElement {
    // @ts-ignore
    const url = this.getTileUrl(coords);

    const tile = document.createElement('img');
    callAjax(
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
}
