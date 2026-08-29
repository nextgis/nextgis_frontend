import { fetchNgwLayerCount, fetchNgwLayerExtent } from '@nextgis/ngw-kit';
import NgwMap from '@nextgis/ngw-leaflet';

import type { EventEmitter } from 'events';
const id = 'bbox-plus-layer';
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
}).then((ngwMap) => {
  const resourceId = 1733;

  // helper layer to control fetching of vector data
  ngwMap.addNgwLayer({ resource: resourceId, adapter: 'IMAGE' });

  fetchNgwLayerExtent({
    connector: ngwMap.connector,
    resourceId,
  }).then((e) => {
    if (!e) throw new Error('Layer extent is unavailable');
    const [minX, minY, maxX, maxY] = e;
    // Manual buffer for extent
    const maxBounds = [minX - 1, minY - 1, maxX + 1, maxY + 1];
    ngwMap.setView({
      center: [-88, 44],
      zoom: 10,
      minZoom: 9,
      maxBounds,
    });

    ngwMap.addNgwLayer({
      id,
      resource: resourceId,
      adapterOptions: {
        // minZoom: 9,
        strategy: 'BBOX+',
        // better to use Infinity with minZoom option
        limit: Infinity,
      },
    });
  });

  const loadStatusBlock = document.createElement('div');
  loadStatusBlock.className = 'load-status-block';

  const loadControl = ngwMap.createControl(
    {
      onAdd: () => loadStatusBlock,
      onRemove: () => {},
    },
    { bar: true },
  );
  ngwMap.addControl(loadControl, 'top-right');

  let loadedCount = 0;
  const emitter = ngwMap.emitter as EventEmitter;
  emitter.on('layer-' + id + ':preupdate', () => {
    loadStatusBlock.innerHTML = 'Loading new data...';
  });
  emitter.on('layer-' + id + ':updated', (e) => {
    // Feel free to execute this method each time, the request for count is cached.
    fetchNgwLayerCount({
      connector: ngwMap.connector,
      resourceId,
    }).then((total) => {
      let str = '';
      if (e.isFull) {
        str = 'All layer data loaded';
      } else {
        loadedCount += e.newData.features.length;
        str = `+${e.newData.features.length} (${(
          (loadedCount / total) *
          100
        ).toFixed(0)}%)`;
      }
      loadStatusBlock.innerHTML = str;
    });
  });
});
