import NgwMap from '@nextgis/ngw-ol';

const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  webmapId: [146, 'webmap'],
});

ngwMap.onLoad().then(function () {
  const toggleControl = ngwMap.createToggleControl({
    getStatus: function () {
      return ngwMap.isLayerVisible('webmap');
    },

    onClick: function (status) {
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
