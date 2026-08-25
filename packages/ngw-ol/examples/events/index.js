import NgwMap from '@nextgis/ngw-ol';
const log = document.createElement('div');
log.className = 'log';

const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: [448, 'baselayer'],
});

ngwMap.onLoad().then(() => {
  ngwMap.setZoom(0);
  ngwMap.setCenter([0, 0]);

  const eventControl = ngwMap.createControl(
    {
      onAdd: () => log,
      onRemove: () => {},
    },
    { bar: true },
  );

  const addLayerControl = ngwMap.createButtonControl({
    html: 'A',
    onClick: () => {
      const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      ngwMap.addLayer('GEOJSON', {
        data: /** @type {import('geojson').Point} */ ({
          type: 'Point',
          coordinates: [
            Math.round(Math.random() * 180),
            Math.round(Math.random() * 90 * plusOrMinus),
          ],
        }),
        paint: (feature) => ({ color: randomRgb() }),
      });
    },
  });

  const removeLayersControl = ngwMap.createButtonControl({
    html: 'R',
    title: 'Remove all layer',
    onClick: () => {
      // Use callback to disallow remove base layer
      ngwMap.removeLayers((x) => x !== 'baselayer');
    },
  });

  const hideLayersControl = ngwMap.createButtonControl({
    html: 'H',
    title: 'Hide all layers',
    onClick: () => {
      toggleLayers(false);
    },
  });

  const showLayersControl = ngwMap.createButtonControl({
    html: 'S',
    title: 'Show all hidden layers',
    onClick: () => {
      toggleLayers(true);
    },
  });

  ngwMap.addControl(addLayerControl, 'top-left');
  ngwMap.addControl(hideLayersControl, 'top-left');
  ngwMap.addControl(showLayersControl, 'top-left');
  ngwMap.addControl(removeLayersControl, 'top-left');

  ngwMap.addControl(eventControl, 'top-right');

  function toggleLayers(status) {
    const layers = ngwMap.getLayers();
    for (let l = 0; l < layers.length; l++) {
      // Base layer is always ON
      if (layers[l] !== 'baselayer') {
        ngwMap.toggleLayer(layers[l], status);
      }
    }
  }
});

const events = [
  'create',
  'zoomstart',
  'zoom',
  'zoomend',
  'movestart',
  'move',
  'moveend',
  'mousemove',
  'mouseout',
  'mouseover',
  'click',
  'layer:preadd',
  'layer:add',
  'layer:preremove',
  'layer:remove',
  'layer:preshow',
  'layer:show',
  'layer:prehide',
  'layer:hide',
];

for (let fry = 0; fry < events.length; fry++) {
  const event = events[fry];
  const element = document.createElement('div');
  element.innerHTML = event;
  element.id = event;
  element.className = 'event-log';
  log.appendChild(element);
  addListener(event, element);
}

const timeout = {};
function addListener(event, el) {
  ngwMap.emitter.on(event, (data) => {
    el.classList.add('ok');
    el.classList.add('action');
    const timeoutId = timeout[event];
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeout[event] = setTimeout(() => {
      el.classList.remove('action');
    }, 750);
    console.log(event, data);
  });
}

function randomRgb() {
  const o = Math.round;
  const r = Math.random;
  const s = 255;
  return `rgb(${o(r() * s)},${o(r() * s)},${o(r() * s)})`;
}
