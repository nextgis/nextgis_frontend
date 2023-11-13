import NgwConnector from '@nextgis/ngw-connector';
import { fetchNgwLayerItems } from '@nextgis/ngw-kit';

import { BaseProvider } from './BaseProvider';

import type CancelablePromise from '@nextgis/cancelable-promise';
import type {
  FeatureItem,
  NgwConnectorOptions,
  ResourceItem,
} from '@nextgis/ngw-connector';
import type { FetchNgwItemsOptions } from '@nextgis/ngw-kit';
import type { LngLatArray } from '@nextgis/utils';

import type { ResultItem } from '../types/ResultItem';
import type { SearchItem } from '../types/SearchItem';
import type { BaseProviderOptions } from './BaseProviderOptions';

/**
 * Extends the basic search item with NGW-specific properties.
 */
interface NgwSearchItem extends SearchItem {
  /** ID of the NGW resource */
  resourceId: number;
  /** ID of the feature in the NGW resource */
  featureId: number;
  /** The specific feature item from NGW */
  item: FeatureItem;
  /** The NGW resource item */
  resourceItem: ResourceItem;
}

/**
 * Defines the structure for a rendered search item.
 */
interface RenderSearchItem {
  /** The specific feature item */
  item: FeatureItem;
  /** The NGW resource item */
  resourceItem: ResourceItem;
}

/**
 * Options for searching within a NGW resource.
 */
interface SearchResource extends FetchNgwItemsOptions {
  /** The search method used ('ilike' is case-insensitive) */
  searchMethod?: 'ilike' | 'like';
  /** Custom rendering function for search results */
  renderSearch?: (item: RenderSearchItem) => string | HTMLElement;
}

/**
 * Options required to initialize an NGW provider.
 */
interface NgwProviderOptions extends BaseProviderOptions {
  /** Connector instance for NGW. If not provided, will be created internally */
  connector?: NgwConnector;
  /** List of NGW resources to search within */
  searchResources: SearchResource[];
  /** Options for the internal NgwConnector (if one needs to be created) */
  connectorOptions?: NgwConnectorOptions;
}

export class NgwProvider extends BaseProvider<NgwProviderOptions> {
  static limit = 300;

  searchResources: SearchResource[] = [];

  private connector: NgwConnector;
  private _abortControllers: AbortController[] = [];

  constructor(options: NgwProviderOptions) {
    super(options);
    if (!options.searchUrl && !options.connectorOptions?.baseUrl) {
      throw new Error(
        'The `searchUrl` of `connectorOptions.baseUrl` are required',
      );
    }

    this.connector =
      options.connector ||
      new NgwConnector({
        baseUrl: this.searchUrl,
        ...options.connectorOptions,
      });
    this.searchResources = options.searchResources;
  }

  abort(): void {
    this._abortControllers.forEach((a) => {
      a.abort();
    });
    this._abortControllers.length = 0;
  }

  async *search(query: string): AsyncGenerator<NgwSearchItem, void, unknown> {
    const signal = this._makeSignal();
    for (const config of this.searchResources) {
      if (signal.aborted) {
        break;
      }
      const { searchMethod } = config;

      const limit = config.limit ?? NgwProvider.limit;
      //
      const resourceId = (config as any).id ?? config.resourceId;

      try {
        const resource = await this.connector.getResourceOrFail(resourceId, {
          cache: true,
        });

        const options: FetchNgwItemsOptions = {
          connector: this.connector,
          resourceId,
          signal,
          limit,
        };

        if (searchMethod === 'like') {
          options.like = query;
        } else {
          options.ilike = query;
        }

        const request = fetchNgwLayerItems(options);

        const entries = await request;

        for (const item of this._items({
          entries,
          query,
          config,
          resourceItem: resource,
        })) {
          item.result = () => this.result(item);
          yield item;
        }
      } catch (er) {
        if (
          er &&
          'name' in (er as Error) &&
          (er as Error).name !== 'CancelError'
        ) {
          console.warn(er);
        }
      }
    }
  }

  result(item: NgwSearchItem): CancelablePromise<ResultItem> {
    const signal = this._makeSignal();
    const req = this.connector
      .get(
        'feature_layer.feature.item_extent',
        { signal },
        {
          id: item.resourceId,
          fid: item.featureId,
        },
      )
      .then((x) => {
        const e = x.extent;
        return {
          text: item.text,
          extent: [e.minLon, e.minLat, e.maxLon, e.maxLat],
        };
      });
    return req;
  }

  async *reverse(
    coordinates: LngLatArray,
  ): AsyncGenerator<SearchItem, void, unknown> {
    throw new Error('Not implemented');
  }

  private _makeSignal() {
    const abortController = new AbortController();
    this._abortControllers.push(abortController);
    return abortController.signal;
  }

  private _items({
    entries,
    query,
    config,
    resourceItem,
  }: {
    config: SearchResource;
    entries: FeatureItem[];
    query: string;
    resourceItem: ResourceItem;
  }): NgwSearchItem[] {
    const items: NgwSearchItem[] = [];

    let labelField: string | undefined = undefined;

    if (resourceItem.feature_layer) {
      labelField = resourceItem.feature_layer.fields.find((f) => f.label_field)
        ?.keyname;
    }

    const meta = this.searchResources.find(
      (x) => (x as any).id ?? x.resourceId === resourceItem.resource.id,
    );
    if (meta) {
      entries.forEach((entry) => {
        let text = labelField ? entry.fields[labelField] : entry.id;
        if (config.renderSearch) {
          text = config.renderSearch({
            item: entry,
            resourceItem,
          });
        } else if (labelField) {
          text = entry.fields[labelField];
        }

        items.push({
          query: query,
          text,
          featureId: entry.id,
          resourceId: resourceItem.resource.id,
          item: entry,
          resourceItem,
        });
      });
    }
    return items;
  }
}
