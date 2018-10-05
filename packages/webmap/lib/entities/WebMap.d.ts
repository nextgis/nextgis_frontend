/// <reference types="node" />
import { AppOptions, MapOptions } from '../interfaces/WebMapApp';
import { RuntimeParams } from '../interfaces/RuntimeParams';
import { EventEmitter } from 'events';
import { WebLayerEntry } from './WebLayerEntry';
import { Keys } from './keys/Keys';
import { MapAdapter } from '../interfaces/MapAdapter';
import { Type } from '../utils/Type';
import { LayerAdapter, LayerAdapters } from '../interfaces/LayerAdapter';
import { AppSettings } from '../interfaces/AppSettings';
export declare class WebMap<M = any> {
    options: MapOptions;
    displayProjection: string;
    lonlatProjection: string;
    settings: AppSettings;
    layers: WebLayerEntry;
    emitter: EventEmitter;
    keys: Keys;
    map: MapAdapter<M>;
    runtimeParams: RuntimeParams[];
    private _starterKits;
    private settingsIsLoading;
    private _baseLayers;
    private _extent;
    constructor(appOptions: AppOptions);
    create(options: MapOptions): Promise<this>;
    getSettings(): Promise<AppSettings>;
    addBaseLayer(layerName: string, provider: keyof LayerAdapters | Type<LayerAdapter>, options?: any): Promise<LayerAdapter>;
    isBaseLayer(layerName: string): boolean;
    private _setupMap;
    private _addTreeLayers;
    private _zoomToInitialExtent;
    private _addLayerProviders;
    private _addEventsListeners;
    private _onMapClick;
}
