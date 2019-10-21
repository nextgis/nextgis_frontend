import { StateItem } from './StateItem';
import { WebMapEvents } from '../../interfaces/Events';

export class ZoomState extends StateItem<number> {
  name = 'zoom';
  event: keyof WebMapEvents = 'zoomend';
  getValue() {
    return this.webMap.getZoom();
  }
  setValue(val: number) {
    this.webMap.setZoom(val);
  }
  toString(val: number) {
    return String(val);
  }
  parse(str: string) {
    return Number(str);
  }
}
