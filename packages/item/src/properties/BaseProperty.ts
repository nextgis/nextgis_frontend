import { EventEmitter } from 'events';
import type { Item } from '../Item';
import type { ItemBasePropertyOptions, ItemOptions } from '../interfaces';

// import StrictEventEmitter from 'strict-event-emitter-types/types/src';

// export interface BasePropertyEvents<V, O> {
//   'change': {value: V, options: O};
//   'change-tree': {value: V, options: O, item: Item};
// }

export abstract class BaseProperty<
  V = any,
  O extends ItemBasePropertyOptions<V> = ItemBasePropertyOptions<V>,
  I extends Item = Item,
> {
  options: O;

  // emitter: StrictEventEmitter<EventEmitter, BasePropertyEvents<V, O>> = new EventEmitter();
  emitter = new EventEmitter();
  name: string;

  item: I;
  protected _blocked = false;
  protected _container?: HTMLElement;
  protected _value?: V;

  private _removeEventsListener?: () => void;

  constructor(name: string, item: I, options: O) {
    this.item = item;
    this.options = Object.assign({}, options);
    this.name = name;
    this._value = this.getProperty();
  }

  getProperty(): V | undefined {
    if (typeof this.options.getProperty === 'function') {
      return this.options.getProperty.call(this, this.item);
    }
    return this.options.value;
  }

  getParents(): Item[] {
    return this.item.tree.getParents() || [];
  }

  getParent(): Item<ItemOptions> | undefined {
    return this.item.tree.getParent();
  }

  getChildren(): Item<ItemOptions>[] {
    return this.item.tree.getChildren();
  }

  isGroup(): number {
    const children = this.item.tree.getDescendants();
    return children.length;
  }

  isBlocked(): boolean {
    if (this._blocked === undefined) {
      const parents = this.item.tree.getParents();
      if (parents) {
        const isBlocked = parents.find((x: Item) => {
          const parentProp = x.properties && x.properties.property(this.name);
          if (parentProp) {
            return !parentProp.get();
          }
          return false;
        });
        this._blocked = !!isBlocked;
      } else {
        this._blocked = false;
      }
    }
    return this._blocked;
  }

  set(value?: V, options?: O): void {
    this._value = this._prepareValue(value);

    this.update(this._value, options);
    this._fireChangeEvent(this._value, options);
  }

  // shortcut for getValue
  get(): V | undefined {
    return this.getValue();
  }

  update(value?: V, options?: O): void {
    this._callOnSet(value, options);
  }

  getContainer(): HTMLElement | undefined {
    return this._container;
  }

  destroy(): void {
    if (this._container) {
      const parentNode = this._container.parentNode;
      if (parentNode) {
        parentNode.removeChild(this._container);
      }
    }
    if (this._removeEventsListener) {
      this._removeEventsListener();
    }
  }

  getValue(): V | undefined {
    return this._value !== undefined ? this._value : this.getProperty();
  }

  protected _prepareValue(value?: V): V | undefined {
    return value;
  }

  protected _callOnSet<W extends V = V>(value?: W, options?: O): void {
    if (this.options.onSet) {
      this.options.onSet.call(this, value, options, this.item);
    }
  }

  protected _fireChangeEvent(value?: V, options?: O): void {
    if (this.emitter) {
      value = value !== undefined ? value : this.getValue();
      this.emitter.emit('change', { value, options });
      const parents = this.item.tree.getParents();
      parents.forEach((x) => {
        const prop = x.properties && x.properties.property(this.name);
        if (prop) {
          prop.emitter.emit('change-tree', {
            value,
            options,
            item: this.item,
          });
        }
      });
    }
  }
}
