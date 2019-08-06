import { GeometryObject } from 'geojson';

/**
 * @module ngw-connector
 */

export interface FeatureLayerFields {
  [field: string]: string | number | Date | boolean;
}

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

export interface FeatureItem {
  id: number;
  geom: string | GeometryObject;
  fields: FeatureLayerFields;
  extensions: {
    description?: string;
    attachment?: FeatureItemAttachment[];
  };
}
