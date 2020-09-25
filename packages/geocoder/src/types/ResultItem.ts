import { GeoJsonObject } from 'geojson';
import { LngLatBoundsArray } from '@nextgis/utils';

export interface ResultItem {
  text: string;
  extent: LngLatBoundsArray;
  geom?: GeoJsonObject;
}
