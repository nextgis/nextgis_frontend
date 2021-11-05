import NgwConnector, { ResourceStoreItem } from '@nextgis/ngw-connector';
import CancelablePromise from '@nextgis/cancelable-promise';
import { BaseProvider } from './BaseProvider';
import { BaseProviderOptions } from './BaseProviderOptions';
import { SearchItem } from '../types/SearchItem';
import { ResultItem } from '../types/ResultItem';

interface NgwSearchItem extends SearchItem {
  resourceId: number;
  featureId: number;
}

interface SearchResource {
  id: number;
  limit?: number;
}

interface NgwProviderOptions extends BaseProviderOptions {
  connector?: NgwConnector;
  searchResources: SearchResource[];
}

export class NgwProvider extends BaseProvider<NgwProviderOptions> {
  caseInsensitive = true;
  searchUrl = 'https://maxim.nextgis.com';
  searchResources: SearchResource[] = [];
  private connector: NgwConnector;
  private requests: CancelablePromise[] = [];

  constructor(options: NgwProviderOptions) {
    super(options);

    this.connector =
      options.connector ||
      new NgwConnector({
        baseUrl: this.searchUrl,
      });
    this.searchResources = options.searchResources;
  }

  abort(): void {
    this.requests.forEach((x) => {
      x.cancel();
    });
    this.requests = [];
  }

  async *search(like: string): AsyncGenerator<NgwSearchItem, void, unknown> {
    for (const resource of this.searchResources) {
      const limit = resource.limit || 300;
      const request = this.connector.get(
        'feature_layer.store',
        {
          headers: { RANGE: `items=0-${limit}` },
        },
        {
          id: resource.id,
          like,
        },
      );
      this.requests.push(request);
      request.catch((er) => {
        console.warn(er);
      });
      const resp = await request;
      const entries: ResourceStoreItem[] = [];
      if (resp) {
        resp.forEach((x) => {
          entries.push({
            query: like,
            resourceId: resource.id,
            ...x,
          });
        });
      }
      for (const item of this._items(entries)) {
        item.result = () => this.result(item);
        yield item;
      }
    }
  }

  result(item: NgwSearchItem): CancelablePromise<ResultItem> {
    const req = this.connector
      .get('feature_layer.feature.item_extent', null, {
        id: item.resourceId,
        fid: item.featureId,
      })
      .then((x) => {
        const e = x.extent;
        return {
          text: item.text,
          extent: [e.minLon, e.minLat, e.maxLon, e.maxLat],
        };
      });
    this.requests.push(req);
    return req;
  }

  _items(entries: ResourceStoreItem[]): NgwSearchItem[] {
    const items: NgwSearchItem[] = [];
    entries.forEach((entry) => {
      const meta = this.searchResources.find((x) => x.id === entry.resourceId);
      if (meta) {
        items.push({
          query: entry.query,
          text: entry.label,
          featureId: entry.id,
          resourceId: entry.resourceId,
        });
      }
    });
    return items;
  }
}
