import {BaseProperty, IEntryBasePropertyOptions} from './BaseProperty';
import {Entry} from '../Entry';

interface ICheckOptions extends IEntryBasePropertyOptions<boolean> {
  label?: string;

  turnOff?: () => void;
  turnOn?: () => void;
}

export class CheckProperty<V = boolean, O = ICheckOptions> extends BaseProperty<boolean, ICheckOptions> {

  static options: ICheckOptions = {
    hierarchy: true,
    bubble: false,
    propagation: false,
    label: 'Toggle',
    // PropertyContainer: IndicatorContainer
  };

  constructor(name, entry, options) {
    super(name, entry, Object.assign({}, CheckProperty.options, options));
    this.set(this.value());
  }

  update(value: boolean, options: ICheckOptions) {
    if (value) {
      const bubble = (options && options.bubble) || this.options.bubble;
      if (bubble) {
        this.unBlock(options);
        const parent = this.getParent();
        const property = parent && parent.properties.get(this.name);
        if (property) {
          property.set(value, Object.assign({}, options, {bubble: true, propagation: false}));
        }
      }
      if (!this.isBlocked()) {
        this._turnOn(options);
      }
    } else {
      this._turnOff(options);
    }
    const propagation = (options && options.propagation) || this.options.propagation;
    if (propagation) {
      this._propagation(value, options);
    }
  }

  getHierarchyValue() {
    return this.value() && this.getParents().every((x) => {
      const property = x.properties[this.name];
      return property && property.get();
    });
  }

  _prepareValue(value: boolean) {
    return !!value;
  }

  _turnOff(options: ICheckOptions) {
    if (this.options.turnOff) {
      this.options.turnOff.call(this, options);
    }
    this._callOnSet(false, options);
    if (this.options.hierarchy && this.isGroup()) {
      this.blockChilds(options);
    }
  }

  _turnOn(options: ICheckOptions) {
    if (this.options.turnOn) {
      this.options.turnOn.call(this, options);
    }
    this._callOnSet(true, options);
    if (this.options.hierarchy && this.isGroup()) {
      this.unblockChilds(options);
    }
  }

  block(options: ICheckOptions) {
    this._blocked = true;
    this._block(options);
  }

  _block(options: ICheckOptions) {
    this._turnOff(options);
  }

  unBlock(options: ICheckOptions) {
    this._blocked = false;
    if (this.getValue()) {
      this._unBlock(options);
    }
  }

  _unBlock(options: ICheckOptions) {
    this._turnOn(options);
  }

  blockChilds(options: ICheckOptions) {
    this.entry.tree.getDescendants().forEach(this._blockChild.bind(this, options));
  }

  unblockChilds(options: ICheckOptions) {
    this.entry.tree.getChildren().forEach(this._unBlockChild.bind(this, options));
  }

  _blockChild(options: ICheckOptions, entry: Entry) {
    const prop = entry.properties.get(this.name) as CheckProperty;
    if (prop.block) {
      prop.block(options);
    }
  }

  _unBlockChild(options: ICheckOptions, entry: Entry) {
    const prop = entry.properties.get(this.name) as CheckProperty;
    if (prop.unBlock) {
      prop.unBlock(options);
    }
  }

  _propagation(value: boolean, options: ICheckOptions) {
    if (this.isGroup()) {
      const childs = this.entry.tree.getChildren();
      for (let fry = 0; fry < childs.length; fry++) {
        const child = childs[fry];
        const property = child.properties.get(this.name) as CheckProperty;
        if (property) {
          property.set(value, {...options, ...{
            propagation: true,
            bubble: false,
          }});
        }
      }
    }
  }
}
