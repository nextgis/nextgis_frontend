import { fetchNgwLayerItem, fetchNgwLayerItemExtent } from '.';

import type {
  FeatureItemExtensions,
  GetRequestOptions,
  LayerFeature,
} from '@nextgis/ngw-connector';
import type NgwConnector from '@nextgis/ngw-connector';
import type { FeatureProperties, LngLatBoundsArray } from '@nextgis/utils';
import type { FeatureLayerRead } from '@nextgisweb/feature-layer/type/api';
import type { CompositeRead } from '@nextgisweb/resource/type/api';
import type { Feature, GeoJsonObject, Geometry } from 'geojson';

import type { IdentifyItemOptions, NgwFeatureItemResponse } from '.';
import type { FetchNgwItemOptions } from './interfaces';

export class IdentifyItem<
  F extends FeatureProperties = FeatureProperties,
  G extends Geometry = Geometry,
> implements LayerFeature
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
  private _resource?: CompositeRead;
  private _extent?: LngLatBoundsArray;

  constructor(options: IdentifyItemOptions) {
    const f = options.feature;
    this.id = f.id;
    this.geom = f.geom;
    this.label = f.label;
    this.parent = f.parent;
    this.fields = f.fields;
    this.layerId = f.layerId;
    this.connector = options.connector;
  }

  identify(
    options: Partial<FetchNgwItemOptions<F>> = {},
  ): Promise<NgwFeatureItemResponse<F, G>> {
    if (this._item) {
      return Promise.resolve(this._item);
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

  async resource(opt?: GetRequestOptions): Promise<FeatureLayerRead> {
    const composite = await this.composite(opt);

    return composite.feature_layer;
  }
  async composite(
    opt?: GetRequestOptions,
  ): Promise<CompositeRead & { feature_layer: FeatureLayerRead }> {
    if (this._resource && this._resource.feature_layer) {
      return this._resource as CompositeRead & {
        feature_layer: FeatureLayerRead;
      };
    }
    const resp = await this.connector.getResource(this.layerId, opt);

    if (!resp) {
      throw new Error('Resource does not exist');
    }
    if (!resp.feature_layer) {
      throw new Error('Resource is not a vector layer');
    }

    this._resource = resp;
    return resp as CompositeRead & { feature_layer: FeatureLayerRead };
  }

  getBounds(
    opt?: Pick<GetRequestOptions, 'cache' | 'signal'>,
  ): Promise<LngLatBoundsArray | undefined> {
    if (this._extent) {
      return Promise.resolve(this._extent);
    }
    return fetchNgwLayerItemExtent({
      connector: this.connector,
      featureId: this.id,
      resourceId: this.layerId,
      ...opt,
    });
  }

  geojson(
    options: Partial<FetchNgwItemOptions<F>> = {},
  ): Promise<Feature<G, F>> {
    if (this._geojson) {
      return Promise.resolve(this._geojson);
    }
    return this.identify(options).then((resp) => {
      return resp.toGeojson().then((geojson) => {
        this._geojson = geojson;
        return geojson;
      });
    });
  }
}
