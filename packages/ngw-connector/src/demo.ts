var ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  bounds: [0, -90, 180, 90],
  resources: [
    // 1 basemap resource
    1665,
    // add a non-base layer in the middle, it will be higher than any base layer
    {
      resource: 1734,
      fit: true,
    },
    // 2 basemap with opacity parameter
    {
      resource: 466,
      opacity: 0.8,
    },
    // 3 basemap resource
    4142,
  ],
  controls: ['ZOOM', 'ATTRIBUTION', 'switch_basemap'],
  controlsOptions: {
    switch_basemap: {
      control: 'BUTTON',
      html: '>>',
      title: 'Switch basemap layer',
      onClick: function () {
        const activeBaseLayer = ngwMap.getActiveBaseLayer();
        const baseLayers = ngwMap.getBaseLayersIds();
        const index = baseLayers.indexOf(activeBaseLayer.id);
        const nextBaseLayer = baseLayers[(index + 1) % baseLayers.length];
        ngwMap.showLayer(nextBaseLayer);
      },
    },
  },
});

ngwMap.onLoad().then(function () {
  //
});
