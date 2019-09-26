/**
 * @module ngw-connector
 */

import { GeometryObject, GeoJsonProperties } from 'geojson';

export type FeatureLayerFields = GeoJsonProperties;

export interface LayerFeature {
  id: number;
  label: string;
  layerId: number;
  parent: string;
  fields: FeatureLayerFields;
}

export interface FeatureLayersIdentify {
  featureCount: number;
  features: LayerFeature[];
}

export interface FeatureLayersIdentify {
  featureCount: number;
  [layerName: number]: FeatureLayersIdentify;
}

export interface FeatureItemAttachment {
  id: number;
  name: string;
  size: number;
  mime_type: string;
  description: null;
  is_image: boolean;
}

export interface FeatureItem<F = FeatureLayerFields> {
  id: number;
  geom: string | GeometryObject;
  fields: F;
  extensions: {
    description?: string;
    attachment?: FeatureItemAttachment[];
  };
}
