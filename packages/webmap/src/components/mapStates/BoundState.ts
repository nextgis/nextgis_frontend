import { StateItem } from './StateItem';

import type { WebMap } from '@nextgis/ngw-map';
import type { LngLatBoundsArray } from '@nextgis/utils';

import type { StateItemOptions } from '../../interfaces/StateItemOptions';

export class BoundState extends StateItem<LngLatBoundsArray> {
  constructor(webMap: WebMap, opt?: StateItemOptions<LngLatBoundsArray>) {
    super(webMap, {
      name: 'bounds',
      event: 'moveend',
      ...opt,
    });
  }

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
