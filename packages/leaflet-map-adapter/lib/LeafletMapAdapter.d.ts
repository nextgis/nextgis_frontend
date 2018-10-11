/// <reference types="node" />
import { MapAdapter, MapOptions } from '@nextgis/webmap';
import { Map } from 'leaflet';
import { EventEmitter } from 'events';
interface LayerMem {
    order: number;
    layer: any;
    onMap: boolean;
}
export interface LeafletMapAdapterOptions extends MapOptions {
    id?: string;
}
export declare class LeafletMapAdapter implements MapAdapter {
    static layerAdapters: {};
    options: LeafletMapAdapterOptions;
    layerAdapters: {};
    displayProjection: string;
    lonlatProjection: string;
    emitter: EventEmitter;
    map: Map;
    _layers: {
        [x: string]: LayerMem;
    };
    private DPI;
    private IPM;
    private _order;
    private _length;
    create(options?: LeafletMapAdapterOptions): void;
    getContainer(): HTMLElement;
    onMapLoad(cb?: any): Promise<{}>;
    setCenter(latLng: [number, number]): void;
    setZoom(zoom: number): void;
    fit(e: [number, number, number, number]): void;
    getLayerAdapter(name: string): any;
    getLayer(layerName: string): boolean;
    getLayers(): string[];
    isLayerOnTheMap(layerName: string): boolean;
    addLayer(adapterDef: any, options?: any, baselayer?: boolean): any;
    removeLayer(layerName: string): void;
    showLayer(layerName: string): void;
    hideLayer(layerName: string): void;
    setLayerOpacity(layerName: string, value: number): void;
    getScaleForResolution(res: any, mpu: any): number;
    getResolutionForScale(scale: any, mpu: any): number;
    toggleLayer(layerName: string, status: boolean): void;
    addControl(controlDef: any, position: string): void;
    onMapClick(evt: any): void;
    private _addMapListeners;
}
export {};
