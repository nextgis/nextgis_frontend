import NgwMap from '@nextgis/ngw-ol';

const amenityList = [];

const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com/',
  target: 'map',
  qmsId: 448,
});

const filterInput = document.createElement('select');
const filterLabel = document.createElement('label');
filterLabel.appendChild(document.createTextNode('Filter by amenity: '));
filterLabel.appendChild(filterInput);

const controlPanel = document.createElement('div');
controlPanel.className = 'control-panel';
controlPanel.appendChild(filterLabel);

filterInput.onchange = () => {
  setLayerFilter();
};

const filterFunction = (e) => {
  return e.feature.properties.AMENITY === filterInput.value;
};

const filterControl = ngwMap.createControl(
  {
    onAdd: () => {
      return controlPanel;
    },
    onRemove: () => {},
  },
  { margin: true },
);

ngwMap.addControl(filterControl, 'top-right');

ngwMap
  .addNgwLayer({
    id: 'geojson',
    resource: 1733,
    adapter: 'GEOJSON',
    adapterOptions: {
      limit: 500,
      paint: {
        color: [
          'match',
          ['get', 'AMENITY'],
          'cafe',
          'blue',
          'restaurant',
          'red',
          'gray', // last item is default value
        ],
        fillOpacity: 0.8,
        stroke: true,
        radius: 6,
      },
    },
  })
  .then((layer) => {
    const adapter =
      /** @type {import('@nextgis/ngw-kit').ResourceAdapter & { emitter: import('events').EventEmitter }} */ (
        /** @type {unknown} */ (layer)
      );
    const updateFilter = () => {
      const features = adapter.getLayers();
      for (let f = 0; f < features.length; f++) {
        const amenity = features[f].feature.properties.AMENITY;
        if (amenityList.indexOf(amenity) === -1) {
          amenityList.push(amenity);
        }
      }
      updateSelectOptions();
      setLayerFilter();
    };
    ngwMap.zoomToLayer(adapter);
    adapter.emitter.on('updated', updateFilter);
    updateFilter();
  });

function setLayerFilter() {
  ngwMap.filterLayer('geojson', filterFunction);
}

function updateSelectOptions() {
  for (let fry = 0; fry < amenityList.length; fry++) {
    const option = document.createElement('option');
    option.innerHTML = amenityList[fry];
    filterInput.appendChild(option);
  }
}
