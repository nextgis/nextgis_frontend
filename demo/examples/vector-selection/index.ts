import NgwMap from '@nextgis/ngw-leaflet';

import type { NgwGeoJsonLayerAdapter } from '@nextgis/ngw-kit';

const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  center: [50.0113, 19.9845],
  zoom: 10,
});

interface SelectionProperties {
  color: string;
  selcolor: string;
}

// tree
ngwMap.addNgwLayer<SelectionProperties>({
  id: 'tree',
  resource: 4069,
  adapter: 'GEOJSON',
  adapterOptions: {
    paint: (feature) => {
      return { color: feature.properties.color, opacity: 0.8 };
    },
    selectedPaint: (feature) => {
      return { color: feature.properties.selcolor, opacity: 1 };
    },
    selectable: true,
    unselectOnSecondClick: false,
  },
});

// toys
ngwMap.addNgwLayer<SelectionProperties>({
  id: 'toys',
  resource: 4061,
  adapter: 'GEOJSON',
  adapterOptions: {
    paint: (feature) => {
      return { color: feature.properties.color, opacity: 0.5 };
    },
    selectedPaint: (feature) => {
      return { color: feature.properties.selcolor, opacity: 1 };
    },
    selectable: true,
    multiselect: true,
  },
});

// star
ngwMap.addNgwLayer({
  id: 'star',
  resource: 4059,
  adapter: 'GEOJSON',
  adapterOptions: {
    paint: NgwMap.getIcon({
      shape: 'star',
      color: 'darkred',
      strokeColor: 'darkred',
      size: 30,
    }),
    selectedPaint: NgwMap.getIcon({
      shape: 'star',
      color: 'red',
      strokeColor: 'orange',
      size: 60,
    }),
    selectable: false,
  },
});

ngwMap.emitter.on('layer:click', (e) => {
  if (e.layer.id === 'toys') {
    const selected = (
      e.layer as NgwGeoJsonLayerAdapter<SelectionProperties>
    ).getSelected();
    const tree = ngwMap.getLayer(
      'tree',
    ) as NgwGeoJsonLayerAdapter<SelectionProperties>;

    if (selected.length >= 9) {
      const treeSelected = tree.getSelected() || [];
      // hint: make tree normal first
      const treeIsNormal =
        treeSelected[0] &&
        treeSelected[0].feature.properties.color === '#25741f';
      if (treeIsNormal) {
        ngwMap.selectLayer('star');
      }
    } else {
      ngwMap.unSelectLayer('star');
    }
  }
});
