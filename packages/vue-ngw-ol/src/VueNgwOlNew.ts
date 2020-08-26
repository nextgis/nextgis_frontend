// import '@nextgis/control-container/lib/control-container.css';
import 'ol/ol.css';

import MapAdapter from '@nextgis/ol-map-adapter';
import { VueNgwMap, VueNgwMapData, VueNgwMapProps } from '@nextgis/vue-ngw-map';
import { NgwMap } from '@nextgis/ngw-map';

import Map from 'ol/Map';

interface VueNgwMapDataOl extends VueNgwMapData {
  ngwMap: NgwMap<Map>;
}

export const VueNgwOl = VueNgwMap.extend<
  Partial<VueNgwMapDataOl>,
  any,
  any,
  Partial<VueNgwMapProps>
>({
  props: {
    mapAdapter: { default: () => new MapAdapter(), type: Object },
  },

  data: {
    ngwMap: {} as NgwMap<Map>,
  },
});
