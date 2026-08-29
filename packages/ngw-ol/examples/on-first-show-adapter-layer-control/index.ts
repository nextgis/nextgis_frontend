import NgwMap from '@nextgis/ngw-ol';

import type { LayerAdapter } from '@nextgis/webmap';
import type TileLayer from 'ol/layer/Tile';

const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  bounds: [0, -90, 180, 90],
  resources: [
    {
      resource: 5364,
      fit: true,
    },
  ],
  controls: ['ZOOM', 'ATTRIBUTION', 'switch_basemap'],
  controlsOptions: {
    switch_basemap: {
      control: 'BUTTON',
      html: '>>',
      title: 'Switch basemap layer',
      onClick: () => {
        const activeBaseLayer = ngwMap.getActiveBaseLayer();
        const baseLayers = ngwMap.getBaseLayersIds();
        if (!activeBaseLayer?.id) {
          return;
        }
        const index = baseLayers.indexOf(activeBaseLayer.id);
        const nextBaseLayer = baseLayers[(index + 1) % baseLayers.length];
        if (nextBaseLayer) {
          ngwMap.showLayer(nextBaseLayer);
        }
      },
    },
  },
});
ngwMap.onLoad().then(() => {
  const setLayerPreload = (l: LayerAdapter<unknown, TileLayer>) => {
    if (l.layer) {
      l.layer.setPreload(0);
    }
  };

  for (const l of ngwMap.getBaseLayers()) {
    if (l.layer.length) {
      l.layer.forEach(setLayerPreload);
    } else {
      ngwMap.emitter.once(`layer-${l.id}:show`, (e) => {
        e.layer.forEach(setLayerPreload);
      });
    }
  }
});
