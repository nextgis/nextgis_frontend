import {EventEmitter} from 'events';
import {Entry} from '../Entry';
// import StrictEventEmitter from 'strict-event-emitter-types/types/src';

export interface IEntryBasePropertyOptions<V> {
  hierarchy?: boolean;
  bubble?: boolean;
  propagation?: boolean;
  silent?: boolean;
  value?: V;
  getProperty?: () => V;
  onSet?: (value: V, options?: IEntryBasePropertyOptions<V>) => void;
}

// export interface BasePropertyEvents<V, O> {
//   'change': {value: V, options: O};
//   'change-tree': {value: V, options: O, entry: Entry};
// }

export class BaseProperty<V = any, O extends IEntryBasePropertyOptions<V> = IEntryBasePropertyOptions<V> > {

  options: O;

  // emitter: StrictEventEmitter<EventEmitter, BasePropertyEvents<V, O>> = new EventEmitter();
  emitter = new EventEmitter();
  name: string;

  entry: Entry;
  _blocked: boolean;

  private _value: V;
  private _removeEventsListener?: () => void;
  private _container: HTMLElement;

  constructor(name: string, entry: Entry, options: O) {
    this.entry = entry;
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

  getParents(): Entry[] {
    return this.entry.tree.getParents() || [];
  }

  getParent() {
    return this.entry.tree.getParent();
  }

  isGroup() {
    const children = this.entry.tree.getDescendants();
    return children.length;
  }

  isBlocked() {
    if (this._blocked === undefined) {
      const parents = this.entry.tree.getParents();
      if (parents) {
        const isBlocked = parents.find((x: Entry) => {
          const parentProp = x.properties.get(this.name);
          if (parentProp) {
            return !parentProp.value();
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
  value(): V {
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
    value = value !== undefined ? value : this.getValue();
    this.emitter.emit('change', {value, options});
    const parents = this.entry.tree.getParents();
    parents.forEach((x) => {
      const prop = x.properties.get(this.name);
      if (prop) {
        prop.emitter.emit('change-tree', {value, options, entry: this.entry});
      }
    });
  }
}
