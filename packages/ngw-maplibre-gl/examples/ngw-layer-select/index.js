import NgwMap from '@nextgis/ngw-maplibre-gl';
const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
});

ngwMap.addNgwLayer({
  resource: 1733,
  fit: true,
  adapterOptions: {
    selectable: true,
    selectedPaint: { color: 'red' },
  },
});

let abortController;

const clean = () => {
  if (abortController) {
    abortController.abort();
    abortController = undefined;
  }
  ngwMap.removeLayer('highlight');
};

const drawLayer = (identify) => {
  clean();
  if (!identify) {
    return;
  }
  abortController = new AbortController();

  ngwMap
    .fetchIdentifyGeoJson(identify, { signal: abortController.signal })
    .then((geojson) => {
      abortController = null;
      ngwMap.addLayer('GEOJSON', {
        id: 'highlight',
        data: geojson,
        paint: { color: 'green', stroke: true, fillOpacity: 0.8 },
      });
    })
    .catch((e) => {
      if (e.name !== 'AbortError') {
        console.error(e);
      }
    });
};

ngwMap.emitter.on('ngw:select', drawLayer);
