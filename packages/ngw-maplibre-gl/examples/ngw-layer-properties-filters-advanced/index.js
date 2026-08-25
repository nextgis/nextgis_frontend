import NgwMap from '@nextgis/ngw-maplibre-gl';
const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com/',
  target: 'map',
  qmsId: 448,
});

ngwMap.addNgwLayer({
  resource: 1733,
  adapter: 'GEOJSON',
  fit: true,
  adapterOptions: {
    propertiesFilter: [['id', 'eq', 1]],
    paint: { color: 'red', radius: 10 },
  },
});

ngwMap.addNgwLayer({
  resource: 1733,
  adapter: 'GEOJSON',
  fit: true,
  adapterOptions: {
    propertiesFilter: [
      [
        'any',
        ['NAME', 'ilike', 'Papa John%'],
        ['NAME', 'ilike', 'Papa Murph%'],
      ],
    ],
    paint: { color: 'blue', radius: 8 },
  },
});

ngwMap.addNgwLayer({
  resource: 1733,
  adapter: 'GEOJSON',
  fit: true,
  adapterOptions: {
    propertiesFilter: [
      'any',
      [
        ['AMENITY', 'eq', 'restaurant'],
        ['NAME', 'ilike', 'Subway%'],
      ],
      [
        ['AMENITY', 'eq', 'cafe'],
        ['any', ['NAME', 'ilike', 'Caribou%'], ['NAME', 'ilike', 'Starbucks%']],
      ],
    ],
    paint: (e) => {
      const name = e.properties.NAME.toLowerCase();
      const color =
        name.indexOf('subway') !== -1
          ? 'green'
          : name.indexOf('caribou') !== -1
            ? 'orange'
            : 'gray';
      return { color: color, radius: 4 };
    },
  },
});
