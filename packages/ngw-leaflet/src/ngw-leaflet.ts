import NgwMap, { MapOptions, NgwLayerOptions } from '@nextgis-apps/ngw-map';
import 'leaflet/dist/leaflet.css';
import { LeafletMapAdapter } from '@nextgis/leaflet-map-adapter';
// import { LeafletMapAdapter } from '../../../nextgisweb_frontend/packages/leaflet-map-adapter/src/LeafletMapAdapter';
import { NgwImageAdapter } from './ngw-image-adapter';

const onMapLoad = NgwMap.decorators.onMapLoad;

export default class NgwLeaflet extends NgwMap {

  constructor(options: MapOptions) {
    super(new LeafletMapAdapter(), options);
  }

  @onMapLoad()
  addNgwLayer(options: NgwLayerOptions) {
    const adapter = options.adapter || 'IMAGE';
    if (adapter === 'IMAGE' || adapter === 'TILE') {
      let url = this.options.baseUrl;
      let addLayerPromise;
      if (adapter === 'IMAGE') {
        url += '/api/component/render/image';
        addLayerPromise = this.webMap.map.addLayer(NgwImageAdapter, { url, id: String(options.id) });
      } else if (adapter === 'TILE') {
        url += '/api/component/render/tile?z={z}&x={x}&y={y}&resource=' + options.id;
        addLayerPromise = this.webMap.map.addLayer(adapter, { url });
      }
      return addLayerPromise.then((layer) => {
        this._ngwLayers[layer.name] = layer;
        this.webMap.map.showLayer(layer.name);
        return layer.name;
      });
    } else {
      throw new Error(adapter + ' not supported yet. Only TILE');
    }
  }

}
