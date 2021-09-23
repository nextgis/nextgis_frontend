import { BaseProperty } from './BaseProperty';
import { CheckProperty } from './CheckProperty';
import { Item } from '../Item';

import {
  ItemBasePropertyOptions,
  Type,
  ItemPropertyConfig,
  ItemPropertyTypes,
} from '../interfaces';

export class ItemProperties {
  static handlers: { [name: string]: Type<BaseProperty> } = {
    CheckProperty,
  };

  options = {};

  private _properties: { [propName: string]: BaseProperty } = {};
  private _propertiesList: string[];

  constructor(
    public item: Item,
    propertiesList?: ItemPropertyConfig<keyof ItemPropertyTypes>[],
  ) {
    this._propertiesList = []; // ordered list
    if (propertiesList) {
      propertiesList.forEach(this._setPropertyHandler.bind(this));
    }
  }

  add(propOpt: ItemPropertyConfig<keyof ItemPropertyTypes>): void {
    this._setPropertyHandler(propOpt);
  }

  _setPropertyHandler(
    propOpt: ItemPropertyConfig<keyof ItemPropertyTypes>,
  ): void {
    const handlers = ItemProperties.handlers;
    let Handler = propOpt.handler;
    if (!Handler && propOpt.type) {
      switch (propOpt.type) {
        case 'boolean':
          Handler = handlers.CheckProperty;
          break;
        case 'string':
          Handler = handlers.BaseProperty;
          break;
        default:
          Handler = handlers.BaseProperty;
      }
    }
    if (Handler && propOpt.name) {
      const options = { ...(propOpt || {}) };
      this._properties[propOpt.name] = new Handler(
        propOpt.name,
        this.item,
        options,
      );
      this._propertiesList.push(propOpt.name);
    }
  }

  update(): void {
    this.list().forEach((x) => {
      x.update();
    });
  }

  get(name: string): any {
    const prop = this.property(name);
    if (prop) {
      return prop.get();
    }
  }

  set<K extends keyof ItemPropertyTypes>(
    name: string,
    value: ItemPropertyTypes[K],
    options?: ItemBasePropertyOptions<ItemPropertyTypes[K]>,
  ): void {
    const prop = this.property(name);
    if (prop) {
      return prop.set(value, options);
    }
  }

  property(name: string): BaseProperty<any, ItemBasePropertyOptions<any>> {
    return this._properties[name];
  }

  list(): BaseProperty<any, ItemBasePropertyOptions<any>>[] {
    return this._propertiesList.map((x) => this._properties[x]);
  }

  destroy(): void {
    for (const p in this._properties) {
      const prop = this.property(p);
      if (prop && prop.destroy) {
        prop.destroy();
      }
    }
    this._properties = {};
    this._propertiesList = [];
  }
}
