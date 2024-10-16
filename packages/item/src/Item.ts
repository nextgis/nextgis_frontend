import { ItemProperties } from './properties/ItemProperties';
import { TreeHelper } from './TreeHelper';

import type { ItemOptions } from './interfaces';

let ID = 0;
export class Item<O extends ItemOptions = ItemOptions> {
  options: O = {} as O;

  properties!: ItemProperties;
  tree: TreeHelper;
  id = ID;

  constructor(options?: O) {
    ID += 1;
    this.options = { ...options } as O;
    this.tree = new TreeHelper(this);
  }

  initProperties(): void {
    this.properties = new ItemProperties(this, this.options.properties);
  }
}
