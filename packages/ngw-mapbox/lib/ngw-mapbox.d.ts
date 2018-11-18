import NgwMap, { MapOptions, NgwLayerOptions } from '@nextgis/ngw-map';
import 'mapbox-gl/dist/mapbox-gl.css';
export default class NgwLeaflet extends NgwMap {
    constructor(options: MapOptions);
    addNgwLayer(options: NgwLayerOptions): Promise<string>;
}
