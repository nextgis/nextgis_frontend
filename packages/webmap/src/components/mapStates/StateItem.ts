import { MapStateItem } from '../../interfaces/MapState';
import { WebMapEvents } from '../../interfaces/Events';
import { WebMap } from '../../WebMap';
import { MapOptions } from '../../interfaces/WebMapApp';

export abstract class StateItem<V extends any | undefined = any | undefined>
  implements MapStateItem<V | undefined> {
  name!: keyof MapOptions;
  event!: keyof WebMapEvents;
  protected value?: V;

  constructor(
    protected webMap: WebMap,
    opt?: { name?: keyof MapOptions; event?: keyof WebMapEvents; value?: V }
  ) {
    if (opt) {
      if (opt.value) {
        this.setValue(opt.value);
      }
      if (opt.name) {
        this.name = opt.name;
      }
      if (opt.event) {
        this.event = opt.event;
      }
    }
  }

  getValue() {
    return this.value;
  }

  setValue(val: V) {
    this.value = val;
  }

  abstract toString(data: any): string;
  abstract parse(str: string): V;
}
