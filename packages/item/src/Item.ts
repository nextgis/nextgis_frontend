/**
 * @module item
 */

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
  options: O = {} as O;

  properties!: ItemProperties;
  tree: TreeHelper;
  id = ID;
  emitter = EventEmitter && new EventEmitter();

  constructor(options?: O) {
    ID += 1;
    this.options = { ...options } as O;
    this.tree = new TreeHelper(this);
  }

  initProperties() {
    this.properties = new ItemProperties(this, this.options.properties);
  }
}
