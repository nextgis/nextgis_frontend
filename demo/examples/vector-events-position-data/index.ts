import NgwMap from '@nextgis/ngw-leaflet';

const ID = 'layer';

NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
}).then((ngwMap) => {
  ngwMap.addNgwLayer({
    id: ID,
    resource: 4224,
    fit: true,
    adapterOptions: {
      selectable: true,
      selectedPaint: { opacity: 0.8 },
      limit: 100,
      onClick: (e) => {
        const bounds = e.getBounds();
        const center = e.getCenter();
        console.log('click', bounds, center);
      },
      onSelect: (e) => {
        const bounds = e.getBounds();
        const center = e.getCenter();
        console.log('select', bounds, center);
      },
      popupOnSelect: true,
      popupOptions: {
        createPopupContent: (e) => {
          const content = document.createElement('div');
          content.className = 'popup-content';

          const title = document.createElement('div');
          title.className = 'popup-title';
          title.textContent = 'Selected Feature';
          content.appendChild(title);

          const coordinates = e.getCenter();
          const coordText = document.createElement('div');
          coordText.innerHTML = `Center: ${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}`;
          content.appendChild(coordText);

          const zoomBtn = document.createElement('button');
          zoomBtn.className = 'popup-btn';
          zoomBtn.innerHTML = 'Zoom to Feature';
          zoomBtn.onclick = () => {
            ngwMap.fitBounds(e.getBounds());
          };
          content.appendChild(zoomBtn);

          return content;
        },
      },
    },
  });

  ngwMap.emitter.on('ngw:select', (e) => {
    const identifyItem = e && e.getIdentifyItems()[0];
    if (identifyItem) {
      identifyItem.getBounds().then((bounds) => {
        console.log('ngw:select', bounds);
      });
    }
  });
});
