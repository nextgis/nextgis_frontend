/// <reference types="node" />
import { MapAdapter } from '@nextgis/webmap';
import { Map } from 'ol';
import { ImageAdapter } from './layer-adapters/ImageAdapter';
import { EventEmitter } from 'events';
import { OsmAdapter } from './layer-adapters/OsmAdapter';
import { MarkerAdapter } from './layer-adapters/markerAdapter';
interface LayerMem {
    order: number;
    layer: any;
    onMap: boolean;
}
export declare class OlMapAdapter implements MapAdapter {
    static layerAdapters: {
        IMAGE: typeof ImageAdapter;
        OSM: typeof OsmAdapter;
        MARKER: typeof MarkerAdapter;
    };
    options: any;
    layerAdapters: {
        IMAGE: typeof ImageAdapter;
        OSM: typeof OsmAdapter;
        MARKER: typeof MarkerAdapter;
    };
    displayProjection: string;
    lonlatProjection: string;
    emitter: EventEmitter;
    map: Map;
    _layers: {
        [x: string]: LayerMem;
    };
    private _olView;
    private _order;
    private _length;
    private DPI;
    private IPM;
    create(options?: {
        target: string;
    }): void;
    getContainer(): HTMLElement;
    onMapLoad(cb?: any): Promise<{}>;
    setCenter(latLng: [number, number]): void;
    setZoom(zoom: number): void;
    fit(e: [number, number, number, number]): void;
    setRotation(angle: number): void;
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
    requestGeomString(pixel: {
        top: number;
        left: number;
    }, pixelRadius?: number): any;
    private _addMapListeners;
}
export {};
