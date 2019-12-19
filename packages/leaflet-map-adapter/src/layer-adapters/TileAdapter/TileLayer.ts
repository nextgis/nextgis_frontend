import { TileLayer as TL, TileLayerOptions } from 'leaflet';
import { callAjax } from '../layersUtility';

type TLOptions = TileLayerOptions & { headers: any };

export class TileLayer extends TL {
  constructor(urlTemplate: string, options?: TLOptions) {
    super(urlTemplate, options);
  }

  _removeTile(key: any) {
    // @ts-ignore
    super._removeTile(key);
  }

  createTile(
    coords: object,
    done: (error: any, tile: HTMLImageElement) => void
  ) {
    // @ts-ignore
    const url = this.getTileUrl(coords);

    const tile = document.createElement('img');
    callAjax(
      url,
      response => {
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
