import { create, NominatimProvider } from '@nextgis/geocoder';
import { fetchNgwExtent } from '@nextgis/ngw-kit';
import NgwMap from '@nextgis/ngw-leaflet';
import { debounce } from '@nextgis/utils';

// 1. Initialize the NGW Map
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
}).then(async (ngwMap) => {
  // 2. Get the resource extent
  const viewbox = (await fetchNgwExtent({
    connector: ngwMap.connector,
    resourceId: 4226,
  })) as [number, number, number, number];

  ngwMap.fitBounds(viewbox);

  // 3. Initialize the geocoder provider
  const ngwProvider = new NominatimProvider({
    viewbox,
    bounded: true,
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
