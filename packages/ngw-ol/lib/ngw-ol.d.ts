import NgwMap, { MapOptions } from '@nextgis-apps/ngw-map';
import 'ol/ol.css';
export default class NgwOl extends NgwMap {
    constructor(options: MapOptions);
    fitBounds(bounds: [number, number, number, number]): void;
}
