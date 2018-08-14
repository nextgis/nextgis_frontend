import mapboxgl from 'mapbox-gl';

export class TileAdapter {

  private map: mapboxgl.Map;

  constructor(map: mapboxgl.Map) {
    this.map = map;
  }

  addLayer(name: string, options) {

    let tiles;
    if (options && options.subdomains) {
      tiles = options.subdomains.split('').map((x) => {
        const subUrl = options.url.replace('{s}', x);
        return subUrl;
      });
    } else {
      tiles = [options.url];
    }

    this.map.addLayer({
      id: name,
      type: 'raster',
      source: {
        type: 'raster',
        // point to our third-party tiles. Note that some examples
        // show a "url" property. This only applies to tilesets with
        // corresponding TileJSON (such as mapbox tiles).
        tiles,
        tileSize: options && options.tileSize || 256
      }
    });
  }
}
