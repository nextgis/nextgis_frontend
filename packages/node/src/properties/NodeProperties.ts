import { BaseProperty, NodeBasePropertyOptions } from './BaseProperty';
import { CheckProperty } from './CheckProperty';
import { Node } from '../Node';

type Type<T> = new (...args: any[]) => T;

export interface NodePropertyTypes {
  'boolean': boolean;
  'string': string;
  'number': number;
  'any': any;
}

interface NodePropertyBaseConfig<K extends keyof NodePropertyTypes = any> {
  type?: NodePropertyTypes[K];
  name?: string;
}
export interface NodePropertyConfig<K extends keyof NodePropertyTypes> extends NodePropertyBaseConfig<K> {
  handler?: Type<BaseProperty<NodePropertyTypes[K]>>;
}

export interface NodePropertyConfig<K extends keyof NodePropertyTypes> extends NodePropertyBaseConfig<K> {
  getProperty?(): NodePropertyTypes[K];
  onSet?(value: NodePropertyTypes[K], options?: NodeBasePropertyOptions<NodePropertyTypes[K]>): void;
}

export class NodeProperties {

  static handlers: { [name: string]: Type<BaseProperty> } = {
    CheckProperty,
  };

  options = {};
  node: Node;

  private _properties: { [propName: string]: BaseProperty };
  private _propertiesList: string[];

  constructor(node: Node, propertiesList?: Array<NodePropertyConfig<keyof NodePropertyTypes>>) {

    this.node = node;
    this._properties = {};
    this._propertiesList = []; // ordered list
    if (propertiesList) {
      propertiesList.forEach(this._setPropertyHandler.bind(this));
    }
  }

  add(propOpt: NodePropertyConfig<keyof NodePropertyTypes>) {
    this._setPropertyHandler(propOpt);
  }

  _setPropertyHandler(propOpt: NodePropertyConfig<keyof NodePropertyTypes>) {
    const handlers = NodeProperties.handlers;
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
        this.node,
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

  set<K extends keyof NodePropertyTypes>(
    name: string,
    value: NodePropertyTypes[K],
    options?: NodeBasePropertyOptions<NodePropertyTypes[K]>) {
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
