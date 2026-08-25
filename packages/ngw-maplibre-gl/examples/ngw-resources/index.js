import NgwMap from '@nextgis/ngw-maplibre-gl';
const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  resources: [
    {
      resource: 10069,
      id: 'availability',
      adapterOptions: {
        selectable: true,
        opacity: 0.8,
        paint: { color: 'red' },
      },
    },
    [10063, 'Ambulance stations'],
    {
      resource: 10067,
      id: 'border',
      fit: true,
      adapterOptions: {
        selectable: true,
        paint: { fillOpacity: 0.3, stroke: true },
      },
    },
  ],
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
  abortController = new AbortController();
  console.log(identify);
  ngwMap
    .fetchIdentifyGeoJson(identify, { signal: abortController.signal })
    .then((geojson) => {
      abortController = null;
      ngwMap.addLayer('GEOJSON', {
        id: 'highlight',
        data: geojson,
        type: 'polygon',
        paint: { color: 'red', stroke: true, fillOpacity: 0.5 },
      });
      console.log(geojson);
    })
    .catch((e) => {
      if (e.name !== 'AbortError') {
        console.error(e);
      }
    });
};

ngwMap.emitter.on('ngw:select', drawLayer);
