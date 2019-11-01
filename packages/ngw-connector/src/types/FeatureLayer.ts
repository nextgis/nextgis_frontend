/**
 * @module ngw-connector
 */

import { GeometryObject, GeoJsonProperties, GeoJsonObject } from 'geojson';

export type FeatureLayerFields = GeoJsonProperties;

export interface LayerFeature {
  id: number;
  label: string;
  layerId: number;
  parent: string;
  fields: FeatureLayerFields;
  geom?: GeoJsonObject;
}

export interface FeatureLayersIdentifyItems {
  featureCount: number;
  features: LayerFeature[];
}

export interface FeatureLayersIdentify {
  featureCount: number;
  [layerId: number]: FeatureLayersIdentifyItems;
}

export interface FeatureItemAttachment {
  id: number;
  name: string;
  size: number;
  mime_type: string;
  description: null;
  is_image: boolean;
}

export interface FeatureItem<
  F = FeatureLayerFields,
  G extends GeometryObject | string = GeometryObject
> {
  id: number;
  geom: G;
  fields: F;
  extensions: {
    description?: string;
    attachment?: FeatureItemAttachment[];
  };
}

export type FeatureItemToNgw<F = FeatureLayerFields> = FeatureItem<F, string>;
