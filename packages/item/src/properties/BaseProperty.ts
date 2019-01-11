import { Item } from '../Item';
import { ItemBasePropertyOptions } from '../interfaces';

let events;
try {
  events = require('events');
} catch (er) {
  // ignore
}
// tslint:disable-next-line:variable-name
const EventEmitter = events && events.EventEmitter;

// import StrictEventEmitter from 'strict-event-emitter-types/types/src';

// export interface BasePropertyEvents<V, O> {
//   'change': {value: V, options: O};
//   'change-tree': {value: V, options: O, item: Item};
// }

export class BaseProperty<V = any, O extends ItemBasePropertyOptions<V> = ItemBasePropertyOptions<V>> {

  options: O;

  // emitter: StrictEventEmitter<EventEmitter, BasePropertyEvents<V, O>> = new EventEmitter();
  emitter = EventEmitter && new EventEmitter();
  name: string;

  item: Item;
  _blocked: boolean;

  private _value: V;
  private _removeEventsListener?: () => void;
  private _container: HTMLElement;

  constructor(name: string, item: Item, options: O) {
    this.item = item;
    this.options = Object.assign({}, options);
    this.name = name;
    this._value = this.getProperty();
  }

  getProperty() {
    if (typeof this.options.getProperty === 'function') {
      return this.options.getProperty.call(this);
    }
    return this.options.value;
  }

  getParents(): Item[] {
    return this.item.tree.getParents() || [];
  }

  getParent() {
    return this.item.tree.getParent();
  }

  isGroup() {
    const children = this.item.tree.getDescendants();
    return children.length;
  }

  isBlocked() {
    if (this._blocked === undefined) {
      const parents = this.item.tree.getParents();
      if (parents) {
        const isBlocked = parents.find((x: Item) => {
          const parentProp = x.properties.property(this.name);
          if (parentProp) {
            return !parentProp.get();
          }
        });
        this._blocked = !!isBlocked;
      } else {
        this._blocked = false;
      }
    }
    return this._blocked;
  }

  set(value: V, options?: O) {
    this._value = this._prepareValue(value);

    this.update(this._value, options);
    this._fireChangeEvent(this._value, options);
  }

  // shortcut for getValue
  get(): V {
    return this.getValue();
  }

  update(value?: V, options?: O) {
    this._callOnSet(value, options);
  }

  getContainer() {
    return this._container;
  }

  destroy() {
    if (this._container) {
      this._container.parentNode.removeChild(this._container);
    }
    if (this._removeEventsListener) {
      this._removeEventsListener();
    }
  }

  getValue(): V {
    return this._value !== undefined ? this._value : this.getProperty();
  }

  _prepareValue(value: V): V {
    return value;
  }

  _callOnSet(value: V, options: O) {
    if (this.options.onSet) {
      this.options.onSet.call(this, value, options);
    }
  }

  _fireChangeEvent(value: V, options: O) {
    if (this.emitter) {
      value = value !== undefined ? value : this.getValue();
      this.emitter.emit('change', { value, options });
      const parents = this.item.tree.getParents();
      parents.forEach((x) => {
        const prop = x.properties.property(this.name);
        if (prop) {
          prop.emitter.emit('change-tree', { value, options, item: this.item });
        }
      });
    }
  }
}
