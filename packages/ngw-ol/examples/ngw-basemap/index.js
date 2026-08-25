import NgwMap from '@nextgis/ngw-ol';
const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  bounds: [0, -90, 180, 90],
  resources: [
    // First basemap resource
    1665,
    // Add a non-base layer in the middle, it will be higher than any base layer
    {
      resource: 1734,
      fit: true,
    },
    // Second basemap resource with opacity parameter
    {
      resource: 4721,
      adapterOptions: { opacity: 0.8 },
    },
    // Third basemap resource
    4142,
  ],
  controls: ['ZOOM', 'ATTRIBUTION', 'switch_basemap'],
  controlsOptions: {
    switch_basemap: {
      control: 'BUTTON',
      html: '>>',
      title: 'Switch basemap layer',
      onClick: () => {
        const activeBaseLayer = ngwMap.getActiveBaseLayer();
        const baseLayers = ngwMap.getBaseLayersIds();
        const index = baseLayers.indexOf(activeBaseLayer.id);
        const nextBaseLayer = baseLayers[(index + 1) % baseLayers.length];
        ngwMap.showLayer(nextBaseLayer);
      },
    },
  },
});
