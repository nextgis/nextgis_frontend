import NgwMap from '@nextgis/ngw-leaflet';
const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
});

ngwMap.setCursor('pointer');

const vectorLayerStyle = 1734;
ngwMap.addNgwLayer({
  resource: vectorLayerStyle,
  fit: true,
  adapterOptions: {
    selectable: true,
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
  abortController = new AbortController();
  ngwMap
    .fetchIdentifyGeoJson(identify, { signal: abortController.signal })
    .then((geojson) => {
      abortController = null;
      ngwMap.addLayer('GEOJSON', {
        id: 'highlight',
        data: geojson,
        paint: { color: 'green', stroke: true, fillOpacity: 0.8 },
        popup: true,
        popupOptions: {
          // disable close button to use custom one
          closeButton: false,
          createPopupContent: (e) => {
            // get vector item from style resource
            return ngwMap.connector
              .getResourceParent(vectorLayerStyle)
              .then((item) => {
                const element = document.createElement('table');
                element.innerHTML = '<tbody>';
                // set up event on popup close
                e.onClose(() => {
                  clean();
                });
                // link properties field names with layer attributes names
                item.feature_layer.fields.forEach((x) => {
                  if (x.grid_visibility) {
                    const value = e.feature.properties[x.keyname];
                    element.innerHTML +=
                      '<tr><th>' +
                      x.display_name +
                      '</th><td>' +
                      value +
                      '</td></tr>';
                  }
                });
                element.innerHTML += '</tbody>';
                // create custom close button
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = 'Close';
                closeBtn.onclick = e.close;
                element.appendChild(closeBtn);
                return element;
              });
          },
        },
      });
    })
    .catch((e) => {
      if (e.name !== 'AbortError') {
        throw e;
      }
    });
};
ngwMap.emitter.on('ngw:select', drawLayer);

// If this example helped you, you can ★star★ our repository on github
// https://github.com/nextgis/nextgis_frontend
