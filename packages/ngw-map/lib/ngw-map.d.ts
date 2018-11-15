/// <reference types="node" />
import WebMap, { MapAdapter, MapOptions as MO, ControlPositions } from '@nextgis/webmap';
import NgwConnector from '@nextgis/ngw-connector';
import 'leaflet/dist/leaflet.css';
import { onMapLoad } from './decorators';
import { fixUrlStr } from './utils';
import { EventEmitter } from 'events';
export interface ControlOptions {
    position?: ControlPositions;
}
export interface MapOptions extends MO {
    target: string | HTMLElement;
    qmsId?: number;
    webmapId?: number;
    baseUrl: string;
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
    emitter: EventEmitter;
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
