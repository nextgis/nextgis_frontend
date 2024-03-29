import type { WebMapEvents } from './Events';

export interface MapStateItem<V = any> {
  event: keyof WebMapEvents;
  name: string;
  getValue: () => V;
  toString: (data: V) => string;
  parse: (str: string) => V;
}

export type MapState = MapStateItem[];
