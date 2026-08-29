import { create, NgwProvider } from '@nextgis/geocoder';
import NgwMap from '@nextgis/ngw-leaflet';
import { debounce } from '@nextgis/utils';

import type { RenderSearchItem } from '@nextgis/geocoder';

// 1. Initialize the NGW Map
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
  resources: [{ resource: 4226, fit: true, adapter: 'IMAGE' }],
}).then((ngwMap) => {
  // 2. Create a function to render the search results
  const renderSearch = ({ item, resourceItem }: RenderSearchItem) =>
    `${item.fields.NAME} ${resourceItem.resource.display_name}`;

  // 3. Initialize the geocoder provider
  const ngwProvider = new NgwProvider({
    connectorOptions: { baseUrl: 'https://demo.nextgis.com' },
    searchResources: [
      { resourceId: 4224, limit: 3 },
      { resourceId: 4222, limit: 3, renderSearch },
      { resourceId: 4220, limit: 3, renderSearch },
    ],
  });

  // 4. Create the geocoder
  const geocoder = create({ providers: [ngwProvider] });

  // 5. Define the geocoder control
  const geocoderControl = ngwMap.createControl(
    {
      onAdd: () => {
        const container = document.createElement('div');
        container.className = 'geocoder-container';

        const inputWrapper = document.createElement('div');
        inputWrapper.id = 'query-input-wrapper';
        container.appendChild(inputWrapper);

        const queryInput = document.createElement('input');
        queryInput.id = 'query-input';
        queryInput.placeholder = 'search';
        inputWrapper.appendChild(queryInput);

        const geocoderResults = document.createElement('div');
        geocoderResults.id = 'geocoder-results';
        container.appendChild(geocoderResults);

        const search = debounce(async (val: string) => {
          if (val) {
            let isSomethingFound = false;
            const geocoderGenerator = geocoder.search(val);
            for await (const item of geocoderGenerator) {
              const resultItem = document.createElement('div');
              resultItem.className = 'search-result-item';
              resultItem.innerHTML = item.text;
              resultItem.onclick = () => {
                if (!item.result) return;
                item.result().then(({ extent }) => {
                  ngwMap.fitBounds(extent, { maxZoom: 16 });
                });
              };
              if (!isSomethingFound) {
                geocoderResults.innerHTML = '';
              }
              isSomethingFound = true;

              geocoderResults.appendChild(resultItem);
            }
            if (!isSomethingFound) {
              geocoderResults.innerHTML = '';
            }
          }
        }, 300);

        queryInput.oninput = () => {
          geocoder.abort();
          if (queryInput.value) {
            geocoderResults.innerHTML = '...loading';
          } else {
            geocoderResults.innerHTML = '';
          }
          search(queryInput.value);
        };

        return container;
      },
      onRemove: () => {},
    },
    {
      bar: true,
    },
  );

  // 6. Add the geocoder control to the map
  ngwMap.addControl(geocoderControl, 'top-right');
});
