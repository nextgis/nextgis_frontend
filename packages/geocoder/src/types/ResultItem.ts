import { GeoJsonObject } from 'geojson';
import { LngLatBoundsArray } from '@nextgis/webmap';

export interface ResultItem {
  text: string;
  extent: LngLatBoundsArray;
  geom?: GeoJsonObject;
}
