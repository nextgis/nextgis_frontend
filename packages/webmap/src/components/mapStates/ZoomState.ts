import { StateItem } from './StateItem';
import { WebMapEvents } from '../../interfaces/Events';
import { MapOptions } from '../../interfaces/WebMapApp';

export class ZoomState extends StateItem<number> {
  name: keyof MapOptions = 'zoom';
  event: keyof WebMapEvents = 'zoomend';
  getValue() {
    const zoom = this.webMap.getZoom();
    return zoom !== undefined ? Math.round(zoom) : undefined;
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
