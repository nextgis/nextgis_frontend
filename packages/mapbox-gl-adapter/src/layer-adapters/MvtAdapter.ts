import mapboxgl from 'mapbox-gl';

export class MvtAdapter {
  addLayer(map: mapboxgl.Map, name: string, options) {
    // read about https://blog.mapbox.com/vector-tile-specification-version-2-whats-changed-259d4cd73df6
    const idString = String(name);
    map.addLayer({
      'id': idString,
      'type': 'fill',
      'source-layer': idString,
      'source': {
        type: 'vector',
        tiles: [options.url]
      },
      'layout': {
        visibility: 'none'
      },
      'paint': {
        'fill-color': 'red',
        'fill-opacity': 0.8,
        'fill-opacity-transition': {
          duration: 0
        },
        'fill-outline-color': '#8b0000' // darkred
      }
    });
    return name;
  }
}
