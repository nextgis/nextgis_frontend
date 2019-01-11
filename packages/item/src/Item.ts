import { TreeHelper } from './TreeHelper';
import { ItemProperties } from './properties/ItemProperties';
import { ItemOptions } from './interfaces';

let events;
try {
  events = require('events');
} catch (er) {
  // ignore
}
// tslint:disable-next-line:variable-name
const EventEmitter = events && events.EventEmitter;

let ID = 0;

export class Item<O extends ItemOptions = ItemOptions> {

  options: O;
  id: string;

  properties: ItemProperties;
  tree: TreeHelper;

  emitter = EventEmitter && new EventEmitter();

  constructor(options?: ItemOptions) {
    this.options = { ...this.options, ...options };
    this.id = String(ID++);
    this.tree = new TreeHelper(this);
  }

  initProperties() {
    this.properties = new ItemProperties(this, this.options.properties);
  }
}
