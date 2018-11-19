import { BaseProperty, IEntryBasePropertyOptions } from './BaseProperty';
import { Entry } from '../Entry';
import { Type } from '../../../utils/Type';
export interface IEntryPropertyTypes {
    'boolean': boolean;
    'string': string;
    'number': number;
    'any': any;
}
interface IEntryPropertyBaseConfig<K extends keyof IEntryPropertyTypes = any> {
    type?: IEntryPropertyTypes[K];
    name?: string;
}
export interface IEntryPropertyConfig<K extends keyof IEntryPropertyTypes> extends IEntryPropertyBaseConfig<K> {
    handler?: Type<BaseProperty<IEntryPropertyTypes[K]>>;
}
export interface IEntryPropertyConfig<K extends keyof IEntryPropertyTypes> extends IEntryPropertyBaseConfig<K> {
    getProperty?(): IEntryPropertyTypes[K];
    onSet?(value: IEntryPropertyTypes[K], options?: IEntryBasePropertyOptions<IEntryPropertyTypes[K]>): void;
}
export declare class EntryProperties {
    static handlers: {
        [name: string]: Type<BaseProperty>;
    };
    options: {};
    entry: Entry;
    private _properties;
    private _propertiesList;
    constructor(entry: any, propertiesList?: Array<IEntryPropertyConfig<keyof IEntryPropertyTypes>>);
    add(propOpt: IEntryPropertyConfig<keyof IEntryPropertyTypes>): void;
    _setPropertyHandler(propOpt: IEntryPropertyConfig<keyof IEntryPropertyTypes>): void;
    update(): void;
    value(name: any): () => any;
    set<K extends keyof IEntryPropertyTypes>(name: string, value: IEntryPropertyTypes[K], options?: IEntryBasePropertyOptions<IEntryPropertyTypes[K]>): void;
    get(name: any): BaseProperty<any, IEntryBasePropertyOptions<any>>;
    list(): BaseProperty<any, IEntryBasePropertyOptions<any>>[];
    destroy(): void;
}
export {};
