import NgwMap from '@nextgis/ngw-maplibre-gl';

const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  resources: [
    { resource: 7003, fit: true, adapterOptions: { selectable: true } },
  ],
});
// Stop all current identification requests on each click before making new requests
ngwMap.emitter.on('click', (e) => {
  ngwMap.cancelPromises('select', 'identify');
  ngwMap.removeLayer('geojson');
  identifyPanel.innerHTML = '...loading';
});

// Identify panel control
const identifyPanel = document.createElement('div');
identifyPanel.className = 'identify-panel';
identifyPanel.innerHTML = 'Click on the map for webmap identify';

const fillIdentifyPanel = (items) => {
  identifyPanel.innerHTML = '';

  const info = document.createElement('div');

  const select = document.createElement('select');
  items.forEach((item, i) => {
    const option = document.createElement('option');
    option.innerHTML = item.label;
    option.setAttribute('value', i);
    select.appendChild(option);
  });
  select.addEventListener('change', (event) => {
    setSelected(
      items[Number(/** @type {HTMLSelectElement} */ (event.target).value)],
      info,
    );
  });
  identifyPanel.appendChild(select);
  identifyPanel.appendChild(info);

  setSelected(items[0], info);
};
const setSelected = (item, info) => {
  info.innerHTML = '...loading';
  ngwMap.removeLayer('geojson');

  item.geojson().then((feature) => {
    ngwMap.addGeoJsonLayer({ data: feature, id: 'geojson' });
    item.resource().then((resource) => {
      info.innerHTML = '';
      resource.fields.forEach((field) => {
        const prop =
          '<div>' +
          field.display_name +
          ': ' +
          feature.properties[field.keyname] +
          '</div>';
        info.innerHTML += prop;
      });
    });
  });
};
const identifyControl = ngwMap.createControl(
  {
    onAdd: () => identifyPanel,
    onRemove: () => {},
  },
  { bar: true },
);
ngwMap.addControl(identifyControl, 'top-right');

// Handle map click
ngwMap.emitter.on('ngw:select', (e) => {
  if (e) {
    fillIdentifyPanel(e.getIdentifyItems());
  }
});
