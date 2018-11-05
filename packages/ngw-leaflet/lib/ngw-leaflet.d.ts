import NgwMap, { MapOptions, NgwLayerOptions } from '@nextgis-apps/ngw-map';
import 'leaflet/dist/leaflet.css';
export default class NgwLeaflet extends NgwMap {
    constructor(options: MapOptions);
    addNgwLayer(options: NgwLayerOptions): any;
}
