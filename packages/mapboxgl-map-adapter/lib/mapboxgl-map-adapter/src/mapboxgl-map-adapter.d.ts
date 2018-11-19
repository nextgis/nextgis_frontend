/// <reference types="node" />
import { MapAdapter } from '@nextgis/webmap';
import { MvtAdapter } from './layer-adapters/MvtAdapter';
import { Map } from 'mapbox-gl';
import { OsmAdapter } from './layer-adapters/OsmAdapter';
import { TileAdapter } from './layer-adapters/TileAdapter';
import { EventEmitter } from 'events';
import { ZoomControl } from './controls/ZoomControl';
import { CompassControl } from './controls/CompassControl';
import { AttributionControl } from './controls/AttributionControl';
declare type positions = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export default class MapboxglMapAdapter implements MapAdapter {
    static layerAdapters: {
        TILE: typeof TileAdapter;
        MVT: typeof MvtAdapter;
        OSM: typeof OsmAdapter;
    };
    static controlAdapters: {
        ZOOM: typeof ZoomControl;
        COMPASS: typeof CompassControl;
        ATTRIBUTION: typeof AttributionControl;
    };
    options: any;
    displayProjection: string;
    lonlatProjection: string;
    map: Map;
    emitter: EventEmitter;
    layerAdapters: {
        TILE: typeof TileAdapter;
        MVT: typeof MvtAdapter;
        OSM: typeof OsmAdapter;
    };
    _layers: {};
    private _baseLayers;
    private DPI;
    private IPM;
    private isLoaded;
    private orders;
    private _sourcedataloading;
    create(options: any): void;
    getContainer(): any;
    setCenter(latLng: [number, number]): void;
    setZoom(zoom: number): void;
    fit(e: [number, number, number, number]): void;
    setRotation(angle: number): void;
    showLayer(layerName: string): void;
    hideLayer(layerName: string): void;
    addLayer(adapterDef: any, options?: any, baselayer?: boolean): Promise<any>;
    removeLayer(layerId: string): void;
    getLayer(layerName: string): boolean;
    isLayerOnTheMap(layerName: string): boolean;
    getLayers(): string[];
    setLayerOpacity(layerName: string, opacity: number): void;
    getScaleForResolution(res: any, mpu: any): number;
    getResolutionForScale(scale: any, mpu: any): number;
    onMapLoad<K = any>(cb?: any): Promise<K>;
    toggleLayer(layerId: any, status: any): void;
    addControl(controlDef: any, position: positions, options: any): void;
    onMapClick(evt: any): void;
    private getLayerAdapter;
    private _addEventsListeners;
}
export {};
