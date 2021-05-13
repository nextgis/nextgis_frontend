import NgwConnector, { ResourceItem } from '@nextgis/ngw-connector';
import { LngLatBoundsArray } from '@nextgis/webmap';
import { fetchNgwResourceExtent } from './utils/fetchNgwExtent';
export class NgwResource {
  item!: ResourceItem;
  connector!: NgwConnector;

  protected _extent?: LngLatBoundsArray;

  async getExtent(): Promise<LngLatBoundsArray | undefined> {
    if (this._extent) {
      return this._extent;
    }
    if (this.item) {
      this._extent = await fetchNgwResourceExtent(
        this.item,
        this.connector,
      ).then();
      return this._extent;
    }
  }
}
