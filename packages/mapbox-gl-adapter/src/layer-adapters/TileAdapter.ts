import mapboxgl from 'mapbox-gl';

export class TileAdapter {

  addLayer(map: mapboxgl.Map, name: string, options) {

    let tiles;
    if (options && options.subdomains) {
      tiles = options.subdomains.split('').map((x) => {
        const subUrl = options.url.replace('{s}', x);
        return subUrl;
      });
    } else {
      tiles = [options.url];
    }

    map.addLayer({
      id: name,
      type: 'raster',
      layout: {
        visibility: 'none'
      },
      source: {
        type: 'raster',
        // point to our third-party tiles. Note that some examples
        // show a "url" property. This only applies to tilesets with
        // corresponding TileJSON (such as mapbox tiles).
        tiles,
        tileSize: options && options.tileSize || 256
      }
    });
    return name;
  }
}
