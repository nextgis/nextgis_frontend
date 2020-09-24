import { GeoJsonObject } from 'geojson';
import CancelablePromise from '@nextgis/cancelable-promise';
import { LngLatBoundsArray } from '@nextgis/webmap';
import { BaseProvider } from '../providers/BaseProvider';
import { ResultItem } from './ResultItem';

export interface SearchItem {
  [prop: string]: any;
  text: string;
  query: string;
  extent?: LngLatBoundsArray;
  provider?: BaseProvider;
  geom?: GeoJsonObject;
  result?: () => CancelablePromise<ResultItem>;
}
