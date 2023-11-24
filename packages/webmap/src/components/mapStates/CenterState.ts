import { StateItem } from './StateItem';

import type { WebMapEvents } from '../../interfaces/Events';
import type { MapOptions } from '../../interfaces/MapOptions';
import type { LngLatArray } from '@nextgis/utils';

export class CenterState extends StateItem<LngLatArray> {
  name: keyof MapOptions = 'center';
  event: keyof WebMapEvents = 'moveend';

  getValue(): LngLatArray | undefined {
    return this.webMap.getCenter();
  }
  setValue(val: LngLatArray): void {
    this.webMap.setCenter(val);
  }
  toString(data: LngLatArray): string {
    const d = data.map((x) => x.toFixed(5));
    return d[0] + '_' + d[1];
  }
  parse(str: string): LngLatArray {
    const lngLat = str.split('_').map(Number) as LngLatArray;
    return lngLat;
  }
}
