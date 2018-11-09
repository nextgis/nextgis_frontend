import { WebMap, MapAdapter } from '@nextgis/webmap';
import NgwConnector from '@nextgis/ngw-connector';
import 'leaflet/dist/leaflet.css';
import { onMapLoad } from './decorators';
import { fixUrlStr } from './utils';
export interface MapOptions {
    target: string;
    qmsId?: number;
    webmapId?: number;
    baseUrl: string;
    center?: [number, number];
    zoom?: number;
    bounds?: [number, number, number, number];
}
export interface NgwLayerOptions {
    id: number;
    adapter?: 'IMAGE' | 'TILE';
}
export default class NgwMap {
    static utils: {
        fixUrlStr: typeof fixUrlStr;
    };
    static decorators: {
        onMapLoad: typeof onMapLoad;
    };
    options: MapOptions;
    webMap: WebMap;
    isLoaded: boolean;
    connector: NgwConnector;
    _ngwLayers: {};
    constructor(mapAdapter: MapAdapter, options: MapOptions);
    fit(): void;
    fitBounds(bounds: [number, number, number, number]): void;
    addNgwLayer(options: NgwLayerOptions): any;
    zoomToLayer(id: string | number): Promise<void>;
    private _fitNgwLayerExtend;
    private _createWebMap;
    private _addControls;
}
