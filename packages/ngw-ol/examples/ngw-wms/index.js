import NgwMap from '@nextgis/ngw-ol';

NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
  resources: [
    {
      resource: 7264,
      adapterOptions: { layers: 'sat_geotiff_z14_example_en' },
    },
  ],
}).then((ngwMap) => {
  // Resource used to form WMS layer
  ngwMap.fitResource(6056);
});
