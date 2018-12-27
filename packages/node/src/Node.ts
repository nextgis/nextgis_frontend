import { EventEmitter } from 'events';
import {TreeHelper} from './TreeHelper';
import {NodeProperties, NodePropertyConfig, NodePropertyTypes} from './properties/NodeProperties';

export interface NodeOptions {
  properties?: Array<NodePropertyConfig<keyof NodePropertyTypes>>;
}

let ID = 0;

export class Node<O extends NodeOptions = NodeOptions> {

  options: O;
  id: string;

  emitter = new EventEmitter();
  properties: NodeProperties;
  tree: TreeHelper;

  constructor(options: NodeOptions) {
    this.options = Object.assign({}, this.options, options);
    this.id = String(ID++);
    this.tree = new TreeHelper(this);
  }

  initProperties() {
    this.properties = new NodeProperties(this, this.options.properties);
  }
}
