/**
 * @module item
 */
import { BaseProperty } from './BaseProperty';
import { Item } from '../Item';

import { CheckOptions } from '../interfaces';

type VAL = boolean;

export class CheckProperty<
  V extends VAL = VAL,
  O extends CheckOptions<VAL> = CheckOptions<VAL>
> extends BaseProperty<VAL, CheckOptions<VAL>> {
  static options: CheckOptions = {
    hierarchy: true,
    bubble: false,
    propagation: false,
    label: 'Toggle'
    // PropertyContainer: IndicatorContainer
  };

  constructor(name: string, item: Item, options: O) {
    super(name, item, { ...CheckProperty.options, ...options });
    this.set(this.get());
  }

  update(value?: V, options?: O) {
    if (value) {
      const bubble = (options && options.bubble) || this.options.bubble;
      if (bubble) {
        this.unBlock(options);
        const parent = this.getParent();
        const property =
          parent && parent.properties && parent.properties.property(this.name);
        if (property) {
          property.set(
            value,
            Object.assign({}, options, { bubble: true, propagation: false })
          );
        }
      }
      if (!this.isBlocked()) {
        this._turnOn(options);
      }
    } else {
      this._turnOff(options);
    }
    const propagation =
      (options && options.propagation) || this.options.propagation;
    if (propagation) {
      this._propagation(value, options);
    }
  }

  getHierarchyValue() {
    return (
      this.get() &&
      this.getParents().every(x => {
        const property = x.properties && x.properties.get(this.name);
        return property && property.get();
      })
    );
  }

  _prepareValue(value?: any): V | undefined {
    return value;
  }

  _turnOff(options?: O) {
    if (this.options.turnOff) {
      this.options.turnOff.call(this, options);
    }
    this._callOnSet(false, options);
    if (this.options.hierarchy && this.isGroup()) {
      this.blockChilds(options);
    }
  }

  _turnOn(options?: O) {
    if (this.options.turnOn) {
      this.options.turnOn.call(this, options);
    }
    this._callOnSet(true, options);
    if (this.options.hierarchy && this.isGroup()) {
      this.unblockChilds(options);
    }
  }

  block(options?: O) {
    this._blocked = true;
    this._block(options);
  }

  _block(options?: O) {
    this._turnOff(options);
  }

  unBlock(options?: O) {
    this._blocked = false;
    if (this.getValue()) {
      this._unBlock(options);
    }
  }

  _unBlock(options?: O) {
    this._turnOn(options);
  }

  blockChilds(options?: O) {
    this.item.tree.getDescendants().forEach(x => this._blockChild(x, options));
  }

  unblockChilds(options?: O) {
    this.item.tree.getChildren().forEach(x => this._unBlockChild(x, options));
  }

  _blockChild(item: Item, options?: O) {
    const prop =
      item.properties &&
      (item.properties.property(this.name) as CheckProperty<V, O>);
    if (prop && prop.block) {
      prop.block(options);
    }
  }

  _unBlockChild(item: Item, options?: O) {
    const prop =
      item.properties &&
      (item.properties.property(this.name) as CheckProperty<V, O>);
    if (prop && prop.unBlock) {
      prop.unBlock(options);
    }
  }

  _propagation(value?: V, options?: O) {
    if (this.isGroup()) {
      const children = this.item.tree.getChildren();
      for (let fry = 0; fry < children.length; fry++) {
        const child = children[fry];
        const property =
          child.properties &&
          (child.properties.property(this.name) as CheckProperty<V, O>);
        if (property) {
          property.set(value, {
            ...options,
            ...{
              propagation: true,
              bubble: false
            }
          });
        }
      }
    }
  }
}
