import { BaseProperty, IEntryBasePropertyOptions } from './BaseProperty';
import { CheckProperty } from './CheckProperty';
import { Entry } from '../Entry';
import { Type } from '../../../utils/Type';

export interface IEntryPropertyTypes {
  'boolean': boolean;
  'string': string;
  'number': number;
  'any': any;
}

interface IEntryPropertyBaseConfig<K extends keyof IEntryPropertyTypes = any> {
  type?: IEntryPropertyTypes[K];
  name?: string;
}
export interface IEntryPropertyConfig<K extends keyof IEntryPropertyTypes> extends IEntryPropertyBaseConfig<K> {
  handler?: Type<BaseProperty<IEntryPropertyTypes[K]>>;
}

export interface IEntryPropertyConfig<K extends keyof IEntryPropertyTypes> extends IEntryPropertyBaseConfig<K> {
  getProperty?(): IEntryPropertyTypes[K];
  onSet?(value: IEntryPropertyTypes[K], options?: IEntryBasePropertyOptions<IEntryPropertyTypes[K]>): void;
}

export class EntryProperties {

  static handlers: { [name: string]: Type<BaseProperty> } = {
    CheckProperty,
  };

  options = {};
  entry: Entry;

  private _properties: { [propName: string]: BaseProperty };
  private _propertiesList: string[];

  constructor(entry, propertiesList?: Array<IEntryPropertyConfig<keyof IEntryPropertyTypes>>) {

    this.entry = entry;
    this._properties = {};
    this._propertiesList = []; // ordered list
    if (propertiesList) {
      propertiesList.forEach(this._setPropertyHandler.bind(this));
    }
  }

  add(propOpt: IEntryPropertyConfig<keyof IEntryPropertyTypes>) {
    this._setPropertyHandler(propOpt);
  }

  _setPropertyHandler(propOpt: IEntryPropertyConfig<keyof IEntryPropertyTypes>) {
    const handlers = EntryProperties.handlers;
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
        this.entry,
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

  value(name) {
    const prop = this.get(name);
    if (prop) {
      return prop.value;
    }
  }

  set<K extends keyof IEntryPropertyTypes>(
    name: string,
    value: IEntryPropertyTypes[K],
    options?: IEntryBasePropertyOptions<IEntryPropertyTypes[K]>) {
    const prop = this.get(name);
    if (prop) {
      return prop.set(value, options);
    }
  }

  get(name) {
    return this._properties[name];
  }

  list() {
    return this._propertiesList.map((x) => this._properties[x]);
  }

  destroy() {
    for (const p in this._properties) {
      if (this._properties.hasOwnProperty(p)) {
        const prop = this.get(p);
        if (prop && prop.destroy) {
          prop.destroy();
        }
      }
    }
    this._properties = null;
    this._propertiesList = [];
  }
}
