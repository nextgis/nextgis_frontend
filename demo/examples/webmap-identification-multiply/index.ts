import NgwMap from '@nextgis/ngw-leaflet';

import type { IdentifyItem } from '@nextgis/ngw-kit';

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

const fillIdentifyPanel = (items: IdentifyItem[]) => {
  identifyPanel.innerHTML = '';

  const info = document.createElement('div');

  const select = document.createElement('select');
  items.forEach((item, i) => {
    const option = document.createElement('option');
    option.innerHTML = item.label;
    option.setAttribute('value', String(i));
    select.appendChild(option);
  });
  select.addEventListener('change', (event) => {
    const item = items[Number((event.target as HTMLSelectElement).value)];
    if (item) {
      setSelected(item, info);
    }
  });
  identifyPanel.appendChild(select);
  identifyPanel.appendChild(info);

  const firstItem = items[0];
  if (firstItem) {
    setSelected(firstItem, info);
  }
};
const setSelected = (item: IdentifyItem, info: HTMLDivElement) => {
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
