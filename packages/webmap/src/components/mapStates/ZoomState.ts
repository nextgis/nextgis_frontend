/**
 * @module webmap
 */
import { StateItem } from './StateItem';
import { WebMapEvents } from '../../interfaces/Events';
import { MapOptions } from '../../interfaces/WebMapApp';

export class ZoomState extends StateItem<number> {
  name: keyof MapOptions = 'zoom';
  event: keyof WebMapEvents = 'zoomend';
  getValue(): number | undefined {
    const zoom = this.webMap.getZoom();
    return zoom !== undefined ? Math.round(zoom) : undefined;
  }
  setValue(val: number): void {
    this.webMap.setZoom(val);
  }
  toString(val: number): string {
    return String(val);
  }
  parse(str: string): number {
    return Number(str);
  }
}
