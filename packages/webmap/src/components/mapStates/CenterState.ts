import { StateItem } from './StateItem';
import { WebMapEvents } from '../../interfaces/Events';
import { LngLatArray } from '../../interfaces/BaseTypes';
import { MapOptions } from '../../interfaces/WebMapApp';

export class CenterState extends StateItem<LngLatArray> {
  name: keyof MapOptions = 'center';
  event: keyof WebMapEvents = 'moveend';

  getValue() {
    return this.webMap.getCenter();
  }
  setValue(val: LngLatArray) {
    this.webMap.setCenter(val);
  }
  toString(data: LngLatArray) {
    const d = data.map(x => x.toFixed(5));
    return d[0] + '_' + d[1];
  }
  parse(str: string) {
    const lngLat = str.split('_').map(Number) as LngLatArray;
    return lngLat;
  }
}
