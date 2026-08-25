import NgwMap from '@nextgis/ngw-ol';

NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
  resources: [{ resource: 5246, id: 'webmap', fit: true }],
}).then((ngwMap) => {
  const toggleControl = ngwMap.createToggleControl({
    getStatus: () => {
      return ngwMap.isLayerVisible('webmap');
    },

    onClick: (status) => {
      ngwMap.toggleLayer('webmap', status);
    },

    html: {
      on: 'ON',
      off: 'OFF',
    },
    // html: 'W'
    // html: {
    //   on: '<span style="color:green;">ON</span>',
    //   off: '<span style="color: red">OFF</span>'
    // },

    title: {
      on: 'Turn webmap off',
      off: 'Turn webmap on',
    },
    // title: 'Toggle webmap visibility'

    addClassOn: 'toggle-button--on',
    addClassOff: 'toggle-button--off',
  });

  ngwMap.addControl(toggleControl, 'top-right');
});
