import NgwMap from '@nextgis/ngw-leaflet';

import type { NgwIdentify } from '@nextgis/ngw-kit';

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
  if (!identify) {
    return;
  }
  abortController = new AbortController();

  ngwMap
    .fetchIdentifyGeoJson(identify, { signal: abortController.signal })
    .then((geojson) => {
      abortController = undefined;

      ngwMap.addLayer('GEOJSON', {
        id: 'highlight',
        data: geojson,
        paint: { color: 'green', stroke: true, fillOpacity: 0.8 },
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
