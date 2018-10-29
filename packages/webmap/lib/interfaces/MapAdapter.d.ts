/// <reference types="node" />
import { LayerAdapter, LayerAdapters } from './LayerAdapter';
import { Type } from '../utils/Type';
import { EventEmitter } from 'events';
import { MapOptions } from '../webmap';
import { MapControls, MapControl } from './MapControl';
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
export declare type ControlPositions = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export interface MapAdapter<M = any> {
    lonlatProjection?: string;
    displayProjection?: string;
    map: M;
    emitter: EventEmitter;
    layerAdapters: {
        [name: string]: Type<LayerAdapter>;
    };
    create(options?: MapOptions): void;
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
    addControl<C extends keyof MapControls>(controlName: C | MapControl, position: ControlPositions, options?: MapControls[C]): any;
    getContainer(): HTMLElement;
    onMapClick(evt: MapClickEvent): void;
    requestGeomString?(pixel: {
        top: number;
        left: number;
    }, pixelRadius?: number): string;
}
export {};
