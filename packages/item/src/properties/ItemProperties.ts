import { BaseProperty } from './BaseProperty';
import { CheckProperty } from './CheckProperty';
import { Item } from '../Item';

import { ItemBasePropertyOptions, Type, ItemPropertyConfig, ItemPropertyTypes } from '../interfaces';

export class ItemProperties {

  static handlers: { [name: string]: Type<BaseProperty> } = {
    CheckProperty,
  };

  options = {};
  item: Item;

  private _properties: { [propName: string]: BaseProperty };
  private _propertiesList: string[];

  constructor(item: Item, propertiesList?: Array<ItemPropertyConfig<keyof ItemPropertyTypes>>) {

    this.item = item;
    this._properties = {};
    this._propertiesList = []; // ordered list
    if (propertiesList) {
      propertiesList.forEach(this._setPropertyHandler.bind(this));
    }
  }

  add(propOpt: ItemPropertyConfig<keyof ItemPropertyTypes>) {
    this._setPropertyHandler(propOpt);
  }

  _setPropertyHandler(propOpt: ItemPropertyConfig<keyof ItemPropertyTypes>) {
    const handlers = ItemProperties.handlers;
    let handler = propOpt.handler;
    if (!handler && propOpt.type) {
      switch (propOpt.type) {
        case 'boolean':
          handler = handlers.CheckProperty;
          break;
        case 'string':
          handler = handlers.BaseProperty;
          break;
        default:
          handler = handlers.BaseProperty;
      }
    }
    if (handler) {
      const options = { ...propOpt || {} };
      this._properties[propOpt.name] = new handler(
        propOpt.name,
        this.item,
        options,
      );
      this._propertiesList.push(propOpt.name);
    }
  }

  update() {
    this.list().forEach((x) => {
      x.update();
    });
  }

  get(name: string) {
    const prop = this.property(name);
    if (prop) {
      return prop.get();
    }
  }

  set<K extends keyof ItemPropertyTypes>(
    name: string,
    value: ItemPropertyTypes[K],
    options?: ItemBasePropertyOptions<ItemPropertyTypes[K]>) {
    const prop = this.property(name);
    if (prop) {
      return prop.set(value, options);
    }
  }

  property(name) {
    return this._properties[name];
  }

  list() {
    return this._propertiesList.map((x) => this._properties[x]);
  }

  destroy() {
    for (const p in this._properties) {
      if (this._properties.hasOwnProperty(p)) {
        const prop = this.property(p);
        if (prop && prop.destroy) {
          prop.destroy();
        }
      }
    }
    this._properties = null;
    this._propertiesList = [];
  }
}
