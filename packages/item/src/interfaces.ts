import type { AdapterOptions, VectorAdapterOptions } from '@nextgis/webmap';

import type { BaseProperty } from './properties/BaseProperty';
import type { Item } from './Item';

export type Type<T> = new (...args: any[]) => T;

export interface ItemBasePropertyOptions<V> {
  hierarchy?: boolean;
  bubble?: boolean;
  propagation?: boolean;
  silent?: boolean;
  value?: V;
  getProperty?: (item?: Item) => V;
  onSet?: (
    value?: V,
    options?: ItemBasePropertyOptions<V>,
    item?: Item,
  ) => void;
}

export interface ItemPropertyTypes {
  boolean: boolean;
  string: string;
  number: number;
  any: any;
}

export interface ItemPropertyBaseConfig<
  K extends keyof ItemPropertyTypes = any,
> {
  type?: ItemPropertyTypes[K];
  name?: string;
}
export interface ItemPropertyConfig<K extends keyof ItemPropertyTypes>
  extends ItemPropertyBaseConfig<K> {
  handler?: Type<BaseProperty<ItemPropertyTypes[K]>>;
}

export interface ItemPropertyConfig<K extends keyof ItemPropertyTypes>
  extends ItemPropertyBaseConfig<K> {
  getProperty?(): ItemPropertyTypes[K];
  onSet?(
    value: ItemPropertyTypes[K],
    options?: ItemBasePropertyOptions<ItemPropertyTypes[K]>,
  ): void;
}

export interface CheckOptions<V = boolean> extends ItemBasePropertyOptions<V> {
  label?: string;

  turnOff?: <O = CheckOptions>(options?: O) => void;
  turnOn?: <O = CheckOptions>(options?: O) => void;
}

type ItemOptionsToExtend = Pick<
  AdapterOptions,
  | 'minZoom'
  | 'maxZoom'
  | 'crossOrigin'
  | 'ratio'
  | 'order'
  | 'headers'
  | 'withCredentials'
  | 'setViewDelay'
> &
  Pick<VectorAdapterOptions, 'popupOptions'>;

export interface ItemOptions extends ItemOptionsToExtend {
  // TODO: check usage and sage remove
  properties?: Array<ItemPropertyConfig<keyof ItemPropertyTypes>>;
  drawOrderEnabled?: boolean;
}

export interface ChangeEvent<
  V = any,
  O extends ItemBasePropertyOptions<V> = ItemBasePropertyOptions<V>,
> {
  value: V;
  options: O;
}
