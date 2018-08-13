import { Entry, EntryOptions } from './entry/Entry';
import { TreeGroup, TreeLayer } from './../interfaces/AppSettings';
import { MapAdapter } from '../interfaces/MapAdapter';
import { NgwConfig } from '../interfaces/NgwConfig';
interface WebLayerEntryOptions extends EntryOptions {
    ngwConfig?: NgwConfig;
}
export declare class WebLayerEntry extends Entry<WebLayerEntryOptions> {
    static options: WebLayerEntryOptions;
    map: MapAdapter;
    item: TreeGroup | TreeLayer;
    constructor(map: MapAdapter, item: TreeGroup | TreeLayer, options: WebLayerEntryOptions, parent?: WebLayerEntry);
    initItem(item: TreeGroup | TreeLayer): void;
    fit(): void;
}
export {};
