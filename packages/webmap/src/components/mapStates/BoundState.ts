import { StateItem } from './StateItem';

import type { LngLatBoundsArray } from '@nextgis/utils';

import type { WebMapEvents } from '../../interfaces/Events';
import type { MapOptions } from '../../interfaces/MapOptions';

export class BoundState extends StateItem<LngLatBoundsArray> {
  name: keyof MapOptions = 'bounds';
  event: (keyof WebMapEvents)[] = ['moveend'];

  getValue(): LngLatBoundsArray | undefined {
    return this.webMap.getBounds();
  }
  setValue(bounds: LngLatBoundsArray): void {
    this.webMap.setView({ bounds });
  }
  toString(): string | undefined {
    const data = this.getValue();
    if (data) {
      return data
        .slice(0, 4)
        .map((x) => x.toFixed(5))
        .join('_');
    }
    return undefined;
  }
  parse(str: string): LngLatBoundsArray {
    const lngLat = str.split('_').map(Number) as LngLatBoundsArray;
    return lngLat;
  }
}
