import { EventEmitter } from 'events';
import { TreeHelper } from './TreeHelper';
import { ItemProperties, ItemPropertyConfig, ItemPropertyTypes } from './properties/ItemProperties';

export interface ItemOptions {
  properties?: Array<ItemPropertyConfig<keyof ItemPropertyTypes>>;
}

let ID = 0;

export class Item<O extends ItemOptions = ItemOptions> {

  options: O;
  id: string;

  emitter = new EventEmitter();
  properties: ItemProperties;
  tree: TreeHelper;

  constructor(options: ItemOptions) {
    this.options = Object.assign({}, this.options, options);
    this.id = String(ID++);
    this.tree = new TreeHelper(this);
  }

  initProperties() {
    this.properties = new ItemProperties(this, this.options.properties);
  }
}
