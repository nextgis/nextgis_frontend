import type { Geometry, GeoJsonObject } from 'geojson';

export type FeatureLayerFields = { [name: string]: any; }; // GeoJsonProperties;

export interface NgwLayerIdentifyError {
  error: 'Not implemented';
}

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
  [layerId: number]: FeatureLayersIdentifyItems | NgwLayerIdentifyError;
  featureCount: number;
}

export interface FeatureItemAttachment {
  id: number;
  name: string;
  size: number;
  mime_type: string;
  description: null;
  is_image: boolean;
}

export interface FeatureItemExtensions {
  description?: string;
  attachment?: FeatureItemAttachment[];
}

export interface FeatureItem<
  F = FeatureLayerFields,
  G extends Geometry | string = Geometry
> {
  id: number;
  geom: G;
  fields: F;
  extensions: FeatureItemExtensions;
}

export type FeatureItemToNgw<
  F = FeatureLayerFields,
  G extends Geometry | string = Geometry
> = FeatureItem<F, G>;
