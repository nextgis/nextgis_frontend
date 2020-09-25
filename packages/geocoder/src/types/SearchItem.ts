import { GeoJsonObject } from 'geojson';
import CancelablePromise from '@nextgis/cancelable-promise';
import { LngLatBoundsArray } from '@nextgis/utils';
import { BaseProvider } from '../providers/BaseProvider';
import { ResultItem } from './ResultItem';

export interface SearchItem {
  [prop: string]: any;
  _id?: number | string;
  text: string;
  query: string;
  extent?: LngLatBoundsArray;
  provider?: BaseProvider;
  geom?: GeoJsonObject;
  result?: () => CancelablePromise<ResultItem>;
}
