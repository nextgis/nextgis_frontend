import NgwMap from '@nextgis/ngw-leaflet';

const minZoom = 11;
const maxZoom = 15;

NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  minZoom: minZoom - 3,
  maxZoom: maxZoom + 3,
}).then((ngwMap) => {
  ngwMap.addNgwLayer({
    resource: 8814,
    fit: true,
    adapterOptions: { minZoom, maxZoom },
  });

  const zoomLevelControl = ngwMap.createControl(
    {
      onAdd: () => {
        const zoomEl = document.createElement('div');
        zoomEl.className = 'show-zoom';
        const updateZoom = () => {
          const zoom = ngwMap.getZoom();
          zoomEl.style.color = zoom > 15 || zoom < 11 ? 'red' : 'inherit';
          zoomEl.innerHTML = zoom.toFixed(1);
        };
        updateZoom();
        ngwMap.emitter.on('zoom', updateZoom);
        return zoomEl;
      },
      onRemove: () => {},
    },
    { margin: true },
  );
  ngwMap.addControl(zoomLevelControl, 'top-right');
});
