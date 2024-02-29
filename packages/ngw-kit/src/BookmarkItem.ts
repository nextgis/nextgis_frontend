import CancelablePromise from '@nextgis/cancelable-promise';

import { createGeoJsonFeature } from './utils/featureLayerUtils';
import { fetchNgwLayerItem } from './utils/fetchNgwLayerItem';

import type NgwConnector from '@nextgis/ngw-connector';
import type { FeatureItem } from '@nextgis/ngw-connector';
import type { LngLatBoundsArray } from '@nextgis/utils';
import type { Feature, Point } from 'geojson';

interface BookmarkItemOptions {
  connector: NgwConnector;
  resourceId: number;
  item: FeatureItem;
  labelField?: string;
}

export class BookmarkItem {
  readonly name: string;
  readonly resourceId: number;
  readonly item: FeatureItem;

  private _extent?: LngLatBoundsArray;

  constructor(private options: BookmarkItemOptions) {
    this.resourceId = options.resourceId;
    const item = options.item;
    this.item = item;
    if (options.labelField && item.fields) {
      this.name = item.fields[options.labelField];
    } else {
      this.name = String(item.id);
    }
  }

  extent(): CancelablePromise<LngLatBoundsArray> {
    if (this._extent) {
      return CancelablePromise.resolve(this._extent);
    }
    return this.options.connector
      .get('feature_layer.feature.item_extent', null, {
        id: this.resourceId,
        fid: this.item.id,
      })
      .then((resp) => {
        const { minLat, minLon, maxLat, maxLon } = resp.extent;
        const lonLat = [minLon, minLat, maxLon, maxLat];
        this._extent = lonLat;
        return lonLat;
      });
  }

  geoJson(): CancelablePromise<Feature<Point, any>> {
    if (this.item.geom) {
      return CancelablePromise.resolve(createGeoJsonFeature(this.item));
    } else {
      return fetchNgwLayerItem({
        resourceId: this.resourceId,
        featureId: this.item.id,
        connector: this.options.connector,
        geom: true,
        fields: null,
        extensions: null,
      }).then((onlyGeomItem) => {
        const geom = onlyGeomItem.geom;
        this.item.geom = geom;
        return createGeoJsonFeature(this.item);
      });
    }
  }
}
