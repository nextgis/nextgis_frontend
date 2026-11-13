import type { WebMapEvents } from './Events';
import type { MapOptions } from './MapOptions';

export interface StateItemOptions<V> {
  name?: keyof MapOptions;
  event?: keyof WebMapEvents | (keyof WebMapEvents)[];
  value?: V;
}
