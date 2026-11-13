import { StateItem } from './StateItem';

import type { WebMap } from '@nextgis/ngw-map';

import type { StateItemOptions } from '../../interfaces/StateItemOptions';

export class ZoomState extends StateItem<number> {
  constructor(webMap: WebMap, opt?: StateItemOptions<number>) {
    super(webMap, {
      name: 'zoom',
      event: 'zoomend',
      ...opt,
    });
  }
  getValue(): number | undefined {
    const zoom = this.webMap.getZoom();
    return zoom !== undefined ? Math.round(zoom) : undefined;
  }
  setValue(val: number): void {
    this.webMap.setZoom(val);
  }
  toString(): string | undefined {
    return String(this.getValue());
  }
  parse(str: string): number {
    return Number(str);
  }
}
