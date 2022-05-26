import { fetchNgwResourceExtent } from './utils/fetchNgwExtent';

import type NgwConnector from '@nextgis/ngw-connector';
import type { ResourceItem } from '@nextgis/ngw-connector';
import type { LngLatBoundsArray } from '@nextgis/utils';
import { FetchNgwLayerExtentOptions } from './interfaces';
export class NgwResource {
  item!: ResourceItem;
  connector!: NgwConnector;

  protected _extent?: LngLatBoundsArray;

  /** @deprecated use {@link NgwResource.getBounds} instead */
  async getExtent(): Promise<LngLatBoundsArray | undefined> {
    return this.getBounds();
  }

  async getBounds(
    options?: FetchNgwLayerExtentOptions,
  ): Promise<LngLatBoundsArray | undefined> {
    if (this._extent) {
      return this._extent;
    }
    if (this.item) {
      this._extent = await fetchNgwResourceExtent(
        this.item,
        this.connector,
        options,
      );
      return this._extent;
    }
  }
}
