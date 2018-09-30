import { Entry, EntryOptions } from './entry/Entry';
import { TreeGroup, TreeLayer } from '../interfaces/AppSettings';
import { MapAdapter } from '../interfaces/MapAdapter';
export declare class WebLayerEntry extends Entry<EntryOptions> {
    static options: EntryOptions;
    map: MapAdapter<any>;
    item: TreeGroup | TreeLayer;
    constructor(map: MapAdapter<any>, item: TreeGroup | TreeLayer, options?: EntryOptions, parent?: WebLayerEntry);
    initItem(item: TreeGroup | TreeLayer): void;
    fit(): void;
}
