import { BaseProperty } from './BaseProperty';
import { CheckProperty } from './CheckProperty';
import { Item } from '../Item';

import {
  ItemBasePropertyOptions,
  Type,
  ItemPropertyConfig,
  ItemPropertyTypes,
} from '../interfaces';

// Constants for property types
const BOOLEAN_TYPE = 'boolean';
const STRING_TYPE = 'string';

export class ItemProperties {
  static handlers: Record<string, Type<BaseProperty>> = {
    CheckProperty,
  };

  options: Record<string, any> = {};

  private _properties: Record<string, BaseProperty> = {};
  private _propertiesList: string[] = [];

  constructor(
    public item: Item,
    propertiesList?: ItemPropertyConfig<keyof ItemPropertyTypes>[],
  ) {
    if (propertiesList) {
      propertiesList.forEach(this._setPropertyHandler.bind(this));
    }
  }

  add(propOpt: ItemPropertyConfig<keyof ItemPropertyTypes>): void {
    this._setPropertyHandler(propOpt);
  }

  update(): void {
    this.list().forEach((x) => x.update());
  }

  get(name: string): any {
    const prop = this.property(name);
    return prop ? prop.get() : undefined;
  }

  set<K extends keyof ItemPropertyTypes>(
    name: string,
    value: ItemPropertyTypes[K],
    options?: ItemBasePropertyOptions<ItemPropertyTypes[K]>,
  ): void {
    const prop = this.property(name);
    if (prop && prop.getValue() !== value) {
      prop.set(value, options);
    }
  }

  property(name: string): BaseProperty<any, ItemBasePropertyOptions<any>> {
    return this._properties[name];
  }

  list(): BaseProperty<any, ItemBasePropertyOptions<any>>[] {
    return this._propertiesList.map((name) => this._properties[name]);
  }

  destroy(): void {
    for (const name in this._properties) {
      const prop = this.property(name);
      if (prop && prop.destroy) {
        prop.destroy();
      }
    }
    this._properties = {};
    this._propertiesList = [];
  }

  private _setPropertyHandler(
    propOpt: ItemPropertyConfig<keyof ItemPropertyTypes>,
  ): void {
    const Handler = this._getHandler(propOpt);
    if (Handler && propOpt.name) {
      const options = { ...propOpt };
      this._properties[propOpt.name] = new Handler(
        propOpt.name,
        this.item,
        options,
      );
      this._propertiesList.push(propOpt.name);
    }
  }

  private _getHandler(
    propOpt: ItemPropertyConfig<keyof ItemPropertyTypes>,
  ): Type<BaseProperty> | undefined {
    const Handler = propOpt.handler;
    if (!Handler && propOpt.type) {
      switch (propOpt.type) {
        case BOOLEAN_TYPE:
          return ItemProperties.handlers.CheckProperty;
        case STRING_TYPE:
        default:
          return ItemProperties.handlers.BaseProperty;
      }
    }
    return Handler;
  }
}
