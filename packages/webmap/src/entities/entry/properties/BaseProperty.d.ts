/// <reference types="node" />
import { EventEmitter } from 'events';
import { Entry } from '../Entry';
import StrictEventEmitter from 'strict-event-emitter-types/types/src';
export interface IEntryBasePropertyOptions<V> {
    hierarchy?: boolean;
    bubble?: boolean;
    propagation?: boolean;
    silent?: boolean;
    value?: V;
    getProperty?: () => V;
    onSet?: (value: V, options?: IEntryBasePropertyOptions<V>) => void;
}
export interface BasePropertyEvents<V, O> {
    'change': {
        value: V;
        options: O;
    };
    'change-tree': {
        value: V;
        options: O;
        entry: Entry;
    };
}
export declare class BaseProperty<V = any, O extends IEntryBasePropertyOptions<V> = IEntryBasePropertyOptions<V>> {
    options: O;
    emitter: StrictEventEmitter<EventEmitter, BasePropertyEvents<V, O>>;
    name: string;
    entry: Entry;
    _blocked: boolean;
    private _value;
    private _removeEventsListener?;
    private _container;
    constructor(name: string, entry: Entry, options: O);
    getProperty(): any;
    getParents(): Entry[];
    getParent(): Entry<import("../Entry").EntryOptions>;
    isGroup(): number;
    isBlocked(): boolean;
    set(value: V, options?: O): void;
    value(): V;
    update(value?: V, options?: O): void;
    getContainer(): HTMLElement;
    destroy(): void;
    getValue(): V;
    _prepareValue(value: V): V;
    _callOnSet(value: V, options: O): void;
    _fireChangeEvent(value: V, options: O): void;
}
