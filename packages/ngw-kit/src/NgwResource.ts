import NgwConnector, { ResourceItem } from '@nextgis/ngw-connector';
import { getNgwResourceExtent } from './utils/utils';
import { LngLatBoundsArray } from '@nextgis/webmap';

export class NgwResource {
  item!: ResourceItem;
  connector!: NgwConnector;

  private _extent?: LngLatBoundsArray;

  async getExtent(): Promise<LngLatBoundsArray | undefined> {
    if (this._extent) {
      return this._extent;
    }
    if (this.item) {
      this._extent = await getNgwResourceExtent(
        this.item,
        this.connector
      ).then();
      return this._extent;
    }
  }
}
