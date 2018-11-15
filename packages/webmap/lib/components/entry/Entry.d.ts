/// <reference types="node" />
import { EventEmitter } from 'events';
import { TreeHelper } from './TreeHelper';
import { EntryProperties, IEntryPropertyConfig, IEntryPropertyTypes } from './properties/EntryProperties';
export interface EntryOptions {
    properties?: Array<IEntryPropertyConfig<keyof IEntryPropertyTypes>>;
}
export declare class Entry<O extends EntryOptions = EntryOptions> {
    options: O;
    id: string;
    emitter: EventEmitter;
    properties: EntryProperties;
    tree: TreeHelper;
    constructor(options: EntryOptions);
    initProperties(): void;
}
