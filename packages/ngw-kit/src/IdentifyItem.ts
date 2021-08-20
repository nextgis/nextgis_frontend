import { fetchNgwLayerItem, IdentifyItemOptions } from '.';
import CancelablePromise from '@nextgis/cancelable-promise';

import type { NgwFeatureItemResponse } from '.';
import type { GeoJsonObject, Geometry, Feature } from 'geojson';
import type {
  FeatureItemExtensions,
  FeatureResource,
  LayerFeature,
  VectorLayerResourceItem,
} from '@nextgis/ngw-connector';
import type NgwConnector from '@nextgis/ngw-connector';
import type { FeatureProperties } from '@nextgis/utils';
import { FetchNgwItemOptions } from './interfaces';

export class IdentifyItem<F = FeatureProperties, G extends Geometry = Geometry>
  implements LayerFeature
{
  readonly id: number;
  readonly label: string;
  readonly layerId: number;
  readonly parent: string;
  readonly fields: FeatureProperties;
  geom?: GeoJsonObject;
  extensions?: FeatureItemExtensions;

  private connector: NgwConnector;
  private _item?: NgwFeatureItemResponse<F, G>;
  private _geojson?: Feature<G, F>;
  private _resource?: VectorLayerResourceItem;

  constructor(options: IdentifyItemOptions) {
    const f = options.feature;
    this.id = f.id;
    this.label = f.label;
    this.layerId = f.layerId;
    this.parent = f.parent;
    this.fields = f.fields;
    this.geom = f.geom;
    this.connector = options.connector;
  }

  identify(
    options: Partial<FetchNgwItemOptions<F>> = {},
  ): CancelablePromise<NgwFeatureItemResponse<F, G>> {
    if (this._item) {
      return CancelablePromise.resolve(this._item);
    }
    return fetchNgwLayerItem<G, F>({
      connector: this.connector,
      featureId: this.id,
      resourceId: this.layerId,
      fields: null,
      extensions: ['attachment', 'description'],
      ...options,
    }).then((resp) => {
      this._item = resp;
      this.geom = resp.geom;
      this.extensions = resp.extensions;
      return resp;
    });
  }

  resource(): CancelablePromise<FeatureResource> {
    if (this._resource) {
      return CancelablePromise.resolve(this._resource.feature_layer);
    }
    return this.connector.getResource(this.layerId).then((resp) => {
      this._resource = resp as VectorLayerResourceItem;
      return this._resource.feature_layer;
    });
  }

  geojson(): CancelablePromise<Feature<G, F>> {
    if (this._geojson) {
      return CancelablePromise.resolve(this._geojson);
    }
    return this.identify().then((resp) => {
      return resp.toGeojson().then((geojson) => {
        this._geojson = geojson;
        return geojson;
      });
    });
  }
}
