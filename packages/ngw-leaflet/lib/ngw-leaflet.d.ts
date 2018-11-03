import { WebMap } from '@nextgis/webmap';
import { NgwConnector } from '@nextgis/ngw-connector';
import 'leaflet/dist/leaflet.css';
export interface MapOptions {
    target: string;
    qmsId: number;
    baseUrl: string;
    center?: [number, number];
    zoom?: number;
    bound?: [number, number, number, number];
}
export interface NgwLayerOptions {
    id: number;
    adapter: 'IMAGE' | 'TILE';
}
export default class NgwLeaflet {
    options: MapOptions;
    webMap: WebMap<any>;
    isLoaded: boolean;
    connector: NgwConnector;
    private _ngwLayers;
    constructor(options: MapOptions);
    fit(): void;
    addNgwLayer(options: NgwLayerOptions): any;
    zoomToLayer(id: string | number): Promise<void>;
    private _fitNgwLayerExtend;
    private _createWebMap;
    private _addControls;
}
