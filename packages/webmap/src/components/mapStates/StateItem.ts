import type { WebMap } from '../../WebMap';
import type { WebMapEvents } from '../../interfaces/Events';
import type { MapOptions } from '../../interfaces/MapOptions';
import type { MapStateItem } from '../../interfaces/MapState';

export abstract class StateItem<V extends any | undefined = any | undefined>
  implements MapStateItem<V | undefined>
{
  name!: keyof MapOptions;
  event!: keyof WebMapEvents;
  protected value?: V;

  constructor(
    protected webMap: WebMap,
    opt?: { name?: keyof MapOptions; event?: keyof WebMapEvents; value?: V },
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

  getValue(): V | undefined {
    return this.value;
  }

  setValue(val: V): void {
    this.value = val;
  }

  abstract toString(data: unknown): string;
  abstract parse(str: string): V;
}
