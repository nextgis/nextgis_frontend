import NgwMap from '@nextgis/ngw-leaflet';

import type { NgwIdentify } from '@nextgis/ngw-kit';

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

let abortController: AbortController | undefined;

const clean = () => {
  if (abortController) {
    abortController.abort();
    abortController = undefined;
  }
  ngwMap.removeLayer('highlight');
};

const drawLayer = (identify: NgwIdentify | null) => {
  clean();
  if (!identify) return;
  abortController = new AbortController();
  console.log(identify);
  ngwMap
    .fetchIdentifyGeoJson(identify, { signal: abortController.signal })
    .then((geojson) => {
      abortController = undefined;
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
