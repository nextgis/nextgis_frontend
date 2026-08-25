import NgwMap from '@nextgis/ngw-maplibre-gl';

const bounds = [-5.94703, 54.58755, -5.92991, 54.594552];

const adapterOptions = (resourceId, opt) => {
  return Object.assign(
    {
      intersects: bounds,
      selectable: true,
      popupOnSelect: true,
      popupOptions: {
        createPopupContent: (e) => {
          const element = document.createElement('div');
          const table = document.createElement('table');
          table.className = 'popup-table';
          element.innerHTML = '<div class="popup-header">Feature Information</div>';
          element.appendChild(table);

          return ngwMap.connector.getResource(resourceId).then((item) => {
            table.innerHTML = '<tbody>';
            // Add properties to the table
            item.feature_layer.fields.forEach((x) => {
              if (x.grid_visibility) {
                const value = e.feature.properties[x.keyname];
                table.innerHTML += `<tr><th>${x.display_name}</th><td>${value}</td></tr>`;
              }
            });
            table.innerHTML += '</tbody>';

            // Add popup behavior description
            const description = document.createElement('div');
            description.className = 'popup-description';
            description.innerHTML = `
              <strong>Popup Behavior:</strong><br/>
              ${opt.unselectOnSecondClick ? 'Closes on second click.' : 'Does not close on second click.'}
              ${opt.unselectOnClick ? ' Closes on outside click.' : ' Does not close on outside click.'}
            `;
            element.appendChild(description);

            return element;
          });
        },
        unselectOnClick: opt.unselectOnClick || false,
      },
    },
    opt,
  );
};

const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  bounds: bounds,
  osm: true,
});

ngwMap.addNgwLayer({
  id: 'building',
  resource: 6940,
  adapterOptions: adapterOptions(6940, {
    unselectOnSecondClick: true,
    paint: { color: 'brown' },
    selectedPaint: { color: 'red' },
    unselectOnClick: true,
  }),
});

ngwMap.addNgwLayer({
  id: 'railway',
  resource: 6965,
  adapterOptions: adapterOptions(6965, {
    paint: { color: 'green', weight: 3 },
    selectedPaint: { color: 'limegreen', weight: 4 },
    unselectOnClick: false,
  }),
});

const stationPaint = {
  opacity: 1,
  color: 'orange',
  strokeColor: 'white',
};
ngwMap.addNgwLayer({
  id: 'station',
  resource: 6954,
  adapterOptions: adapterOptions(6954, {
    paint: Object.assign({ radius: 6 }, stationPaint),
    selectedPaint: Object.assign({ radius: 8 }, stationPaint),
    unselectOnClick: true,
  }),
});

window.ngwMap = ngwMap;

// If this example helped you, you can ★star★ our repository on github
// https://github.com/nextgis/nextgis_frontend
