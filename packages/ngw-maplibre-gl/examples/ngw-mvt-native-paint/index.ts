import NgwMap from '@nextgis/ngw-maplibre-gl';

import type { VectorAdapterOptions } from '@nextgis/webmap';

NgwMap.create({
  target: 'map',
  baseUrl: 'https://demo.nextgis.com',
  osm: true,
  center: [-87.6355, 41.8818],
  minZoom: 17,
}).then((ngwMap) => {
  ngwMap.addNgwLayer({
    resource: 6101,
    adapter: 'MVT',
    adapterOptions: {
      selectable: true,
      selectedPaint: {
        'fill-color': 'black',
        'fill-opacity': 1,
      } as unknown as NonNullable<VectorAdapterOptions['paint']>,
      paint: {
        'fill-color': [
          'case',
          [
            'all',
            ['!=', ['get', 'BUILDING'], 'commercial'],
            ['!=', ['get', 'BUILDING'], 'train_station'],
            ['!=', ['get', 'BUILDING'], 'industrial'],
          ],
          '#ba0003',
          '#177771',
        ],
        'fill-opacity': [
          'case',
          ['==', ['get', 'BUILDING'], 'commercial'],
          0,
          0.7,
        ],
        'fill-outline-color': 'black',
      } as unknown as NonNullable<VectorAdapterOptions['paint']>,
      // Set this parameter to use native Maplibre GL JS style for both paint and selected paint
      nativePaint: true,
    },
  });
});
