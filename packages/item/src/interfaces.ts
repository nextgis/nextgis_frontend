import { BaseProperty } from './properties/BaseProperty';

export type Type<T> = new (...args: any[]) => T;

export interface ItemBasePropertyOptions<V> {
  hierarchy?: boolean;
  bubble?: boolean;
  propagation?: boolean;
  silent?: boolean;
  value?: V;
  getProperty?: () => V;
  onSet?: (value: V, options?: ItemBasePropertyOptions<V>) => void;
}

export interface ItemPropertyTypes {
  'boolean': boolean;
  'string': string;
  'number': number;
  'any': any;
}

export interface ItemPropertyBaseConfig<K extends keyof ItemPropertyTypes = any> {
  type?: ItemPropertyTypes[K];
  name?: string;
}
export interface ItemPropertyConfig<K extends keyof ItemPropertyTypes> extends ItemPropertyBaseConfig<K> {
  handler?: Type<BaseProperty<ItemPropertyTypes[K]>>;
}

export interface ItemPropertyConfig<K extends keyof ItemPropertyTypes> extends ItemPropertyBaseConfig<K> {
  getProperty?(): ItemPropertyTypes[K];
  onSet?(value: ItemPropertyTypes[K], options?: ItemBasePropertyOptions<ItemPropertyTypes[K]>): void;
}

export interface ICheckOptions extends ItemBasePropertyOptions<boolean> {
  label?: string;

  turnOff?: () => void;
  turnOn?: () => void;
}

export interface ItemOptions {
  properties?: Array<ItemPropertyConfig<keyof ItemPropertyTypes>>;
}
