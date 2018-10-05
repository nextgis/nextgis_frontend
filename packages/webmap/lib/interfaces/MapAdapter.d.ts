/// <reference types="node" />
import { LayerAdapter, LayerAdapters } from './LayerAdapter';
import { Type } from '../Utils/Type';
import { EventEmitter } from 'events';
interface LatLng {
    lat: number;
    lng: number;
}
export interface MapClickEvent {
    latLng: LatLng;
    pixel: {
        top: number;
        left: number;
        right?: number;
        bottom?: number;
    };
    source?: any;
}
export interface MapAdapter<M = any> {
    lonlatProjection?: string;
    displayProjection?: string;
    map: M;
    emitter: EventEmitter;
    layerAdapters: {
        [name: string]: Type<LayerAdapter>;
    };
    create(options?: any): void;
    onMapLoad(cb?: () => void): Promise<any>;
    addLayer<K extends keyof LayerAdapters>(layerAdapter: K | Type<LayerAdapter>, options?: LayerAdapters[K], baselayer?: boolean): Promise<LayerAdapter>;
    removeLayer(layerName: string): any;
    getLayer(layerName: string): any;
    isLayerOnTheMap(layerName: string): boolean;
    setLayerOpacity(layerName: string, opacity: number): void;
    getLayers(): string[];
    showLayer(layerName: string): void;
    hideLayer(layerName: string): void;
    toggleLayer(layerName: string, status: boolean): void;
    setCenter(latLng: [number, number]): void;
    setZoom(zoom: number): void;
    fit(extent: [number, number, number, number]): void;
    setRotation?(angle: number): void;
    addControl(controlDef: any, position: string): void;
    getContainer(): HTMLElement;
    onMapClick(evt: MapClickEvent): void;
    requestGeomString?(pixel: {
        top: number;
        left: number;
    }, pixelRadius?: number): string;
}
export {};
