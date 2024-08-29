import { StateItem } from './StateItem';

import type { WebMapEvents } from '../../interfaces/Events';
import type { MapOptions } from '../../interfaces/MapOptions';

export class ZoomState extends StateItem<number> {
  name: keyof MapOptions = 'zoom';
  event: (keyof WebMapEvents)[] = ['zoomend'];
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
