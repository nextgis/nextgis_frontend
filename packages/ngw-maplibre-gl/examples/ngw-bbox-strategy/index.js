import NgwMap from '@nextgis/ngw-maplibre-gl';
const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  center: [-87, 44],
  zoom: 7,
  resources: [
    {
      resource: 1733,
      adapterOptions: {
        // set this option to enable bbox strategy for this layer
        strategy: 'BBOX',
        // it is good practice to enable 'limit' option when using a boxing strategy
        limit: 100,
      },
    },
  ],
});
