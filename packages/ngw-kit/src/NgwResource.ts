import NgwConnector, { ResourceItem } from '@nextgis/ngw-connector';
import { getNgwResourceExtent } from './utils';

export class NgwResource {
  item!: ResourceItem;
  connector!: NgwConnector;

  async getExtent() {
    if (this.item) {
      return getNgwResourceExtent(this.item, this.connector);
    }
  }
}
