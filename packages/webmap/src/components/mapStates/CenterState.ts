import { StateItem } from './StateItem';

import type { WebMap } from '@nextgis/ngw-map';
import type { LngLatArray } from '@nextgis/utils';

import type { StateItemOptions } from '../../interfaces/StateItemOptions';

export class CenterState extends StateItem<LngLatArray> {
  constructor(webMap: WebMap, opt?: StateItemOptions<LngLatArray>) {
    super(webMap, {
      name: 'center',
      event: 'moveend',
      ...opt,
    });
  }

  getValue(): LngLatArray | undefined {
    return this.webMap.getCenter();
  }
  setValue(val: LngLatArray): void {
    this.webMap.setCenter(val);
  }
  toString(): string {
    const data = this.getValue();
    if (data) {
      const d = data.map((x) => x.toFixed(5));
      return d[0] + '_' + d[1];
    }
    return '';
  }
  parse(str: string): LngLatArray {
    const lngLat = str.split('_').map(Number) as LngLatArray;
    return lngLat;
  }
}
