import NgwMap from '@nextgis/ngw-leaflet';

import type { NgwGeoJsonLayerAdapter } from '@nextgis/ngw-kit';

const config = {
  interval: { value: 500, type: 'number' },
  selectableLayer: { value: 'toys', type: 'string' },
};

let _intervalId: ReturnType<typeof setInterval> | undefined;

// initialize webmap
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
  center: [50.0113, 19.9845],
  zoom: 10,
}).then((ngwMap) => {
  // tree
  ngwMap.addNgwLayer({
    id: 'tree',
    resource: 4069,
    adapter: 'GEOJSON',
    adapterOptions: {
      paint: { color: ['get', 'color'] },
    },
  });

  // toys
  ngwMap.addNgwLayer({
    id: 'toys',
    resource: 4061,
    adapter: 'GEOJSON',
    adapterOptions: {
      paint: { color: ['get', 'color'], opacity: 0.5 },
      selectedPaint: { color: ['get', 'selcolor'], opacity: 1 },
      selectable: true,
      selectOnHover: true,
      popupOnSelect: true,
      popupOptions: {
        fromProperties: true,
      },
    },
  });

  // star
  ngwMap.addNgwLayer({
    id: 'star',
    resource: 4059,
    adapter: 'GEOJSON',
    adapterOptions: {
      paint: NgwMap.getIcon({
        shape: 'star',
        color: 'darkred',
        strokeColor: 'darkred',
        size: 30,
      }),
      selectedPaint: NgwMap.getIcon({
        shape: 'star',
        color: 'red',
        strokeColor: 'orange',
        size: 60,
      }),
      selectable: true,
    },
  });

  // Animation control creation
  const animationControl = ngwMap.createToggleControl({
    onClick: (status) => {
      if (status) {
        startRandomSelection();
      } else {
        stopRandomSelection();
      }
    },

    html: {
      on: '<i class="material-icons">pause</i>',
      off: '<i class="material-icons">play_arrow</i>',
    },
  });
  ngwMap.addControl(animationControl, 'top-left');

  // Create configuration control
  const configElement = document.createElement('div');
  configElement.className = 'config-panel';
  configElement.innerHTML =
    '<label>Animation delay: <input type="number" name="interval"></input></label>';
  const intervalInput = configElement.querySelector(
    'input',
  ) as HTMLInputElement;
  intervalInput.value = String(config.interval.value);
  intervalInput.addEventListener('change', onConfigUpdate);
  intervalInput.addEventListener('input', onConfigUpdate);

  const configControl = ngwMap.createControl(
    {
      onAdd: () => configElement,
      onRemove: () => {},
    },
    { bar: true },
  );

  ngwMap.addControl(configControl, 'top-right');

  ngwMap.emitter.on('layer:select', (e) => {
    console.log(e);
  });

  // helper functions
  function startRandomSelection() {
    const selectableLayer = ngwMap.getLayer(
      config.selectableLayer.value,
    ) as NgwGeoJsonLayerAdapter;
    const layers = selectableLayer.getLayers();
    _intervalId = setInterval(() => {
      const randomLayer = layers[Math.floor(Math.random() * layers.length)];
      const id = randomLayer.feature.id;
      if (id !== undefined) {
        selectLayerFeatureById(selectableLayer, id);
      }
    }, config.interval.value);
  }

  function stopRandomSelection() {
    if (_intervalId !== undefined) {
      clearInterval(_intervalId);
      _intervalId = undefined;
    }
  }

  function selectLayerFeatureById(
    layer: NgwGeoJsonLayerAdapter,
    id: string | number,
  ) {
    layer.select((e) => {
      return e.feature.id === id;
    });
  }

  function onConfigUpdate() {
    config.interval.value = Number(intervalInput.value);
    // update current animation config
    if (_intervalId) {
      stopRandomSelection();
      startRandomSelection();
    }
  }
});
