import type { GeoJsonObject } from 'geojson';
import type { LngLatBoundsArray } from '@nextgis/utils';

export interface ResultItem {
  /**
   * Display text of the result item.
   */
  text: string;

  /**
   * Bounding box of the result item in [west, south, east, north] format.
   */
  extent: LngLatBoundsArray;

  /**
   * Optional GeoJSON geometry associated with this result item.
   */
  geom?: GeoJsonObject;
}
