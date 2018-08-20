import {EventEmitter} from 'events';
import {TreeHelper} from './TreeHelper';
import {EntryProperties, IEntryPropertyConfig, IEntryPropertyTypes} from './properties/EntryProperties';

export interface EntryOptions {
  properties?: Array<IEntryPropertyConfig<keyof IEntryPropertyTypes>>;
}

let ID = 0;

export class Entry<O extends EntryOptions = EntryOptions> {

  options: O;
  id: string;

  emitter = new EventEmitter();
  properties: EntryProperties;
  tree: TreeHelper;

  constructor(options: EntryOptions) {
    this.options = Object.assign({}, this.options, options);
    this.id = String(ID++);
    this.tree = new TreeHelper(this);
  }

  initProperties() {
    this.properties = new EntryProperties(this, this.options.properties);
  }
}
