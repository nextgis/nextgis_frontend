import NgwMap from '@nextgis/ngw-ol';

const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
});

ngwMap
  .addNgwLayer({
    resource: 6114,
    fit: true,
    adapterOptions: {
      multiselect: true,
      unselectOnClick: false,
      selectedPaint: { color: 'red' },
    },
  })
  .then(() => {
    ngwMap.emitter.on('layer:click', (e) => {
      const layer =
        /** @type {import('@nextgis/webmap').VectorLayerAdapter} */ (e.layer);
      if (layer?.select) {
        const idsForSelect = [e.feature.id];
        if (ngwMap.keys.pressed('ctrl')) {
          const alreadySelected = layer.getSelected();
          idsForSelect.push(...alreadySelected.map((s) => s.feature.id));
        }
        layer.select(({ feature }) => idsForSelect.includes(feature.id));
      }
    });
  });

ngwMap.addControl(
  ngwMap.createControl(
    {
      onAdd: () => {
        const info = document.createElement('div');
        info.innerHTML =
          'Press CTRL with click to add new feature in selection';
        return info;
      },
      onRemove: () => {},
    },
    { bar: true },
  ),
  'top-right',
);
