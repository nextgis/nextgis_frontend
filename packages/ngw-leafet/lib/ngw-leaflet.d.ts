import { WebMap } from '@nextgis/webmap';
import 'leaflet/dist/leaflet.css';
export interface MapOptions {
    target: string;
    qmsId: number;
    baseUrl: string;
    bound: [number, number, number, number];
}
export interface NgwLayerOptions {
    id: number;
}
export default class NgwLeaflet {
    options: MapOptions;
    webMap: WebMap<any>;
    isLoaded: boolean;
    constructor(options: MapOptions);
    fit(): void;
    addNgwLayer(adapter: any, options: NgwLayerOptions): void;
    private _createWebMap;
    private _addControls;
}
