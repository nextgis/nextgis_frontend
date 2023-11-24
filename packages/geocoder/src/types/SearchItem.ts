import type { ResultItem } from './ResultItem';
import type { BaseProvider } from '../providers/BaseProvider';
import type CancelablePromise from '@nextgis/cancelable-promise';
import type { LngLatBoundsArray } from '@nextgis/utils';
import type { GeoJsonObject } from 'geojson';

export interface SearchItem {
  /**
   * A dynamic property bucket for the `SearchItem`.
   */
  [prop: string]: any;

  /**
   * An optional unique identifier for the search result.
   */
  _id?: number | string;

  /**
   * Display text of the search result.
   */
  text: string;

  /**
   * The original query string that resulted in this search result.
   */
  query: string;

  /**
   * An optional bounding box of the search result in [west, south, east, north] format.
   */
  extent?: LngLatBoundsArray;

  /**
   * The provider that sourced this search result.
   */
  provider?: BaseProvider;

  /**
   * Optional GeoJSON geometry associated with this search result.
   */
  geom?: GeoJsonObject;

  /**
   * An optional function that can be called to retrieve detailed result for this search item.
   */
  result?: () => CancelablePromise<ResultItem>;
}
