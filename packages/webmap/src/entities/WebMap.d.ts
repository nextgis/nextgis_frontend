/// <reference types="node" />
import { AppOptions, WebMapAppEvents } from '../interfaces/WebMapApp';
import { Settings } from '../interfaces/AppSettings';
import StrictEventEmitter from 'strict-event-emitter-types/types/src';
import { EventEmitter } from 'events';
import { WebLayerEntry } from './WebLayerEntry';
import { Keys } from './keys/Keys';
import { MapAdapter } from '../Interfaces/MapAdapter';
export declare class WebMap {
    options: AppOptions;
    displayProjection: string;
    lonlatProjection: string;
    settings: Settings;
    layers: WebLayerEntry;
    emitter: StrictEventEmitter<EventEmitter, WebMapAppEvents>;
    keys: Keys;
    map: MapAdapter;
    private _settings;
    private runtimeParams;
    private settingsIsLoading;
    create(options: AppOptions): Promise<this>;
    getSettings(): Promise<Settings>;
    private _setupMap;
    private _addTreeLayers;
    private _zoomToInitialExtent;
}
