import { GeometryObject } from 'geojson';

/**
 * @module ngw-connector
 */

export interface LayerFeature {
  id: number;
  label: string;
  layerId: number;
  parent: string;
  fields: { [field: string]: string | number | Date | boolean };
}

export interface FeatureLayersIdentify {
  featureCount: number;
  features: LayerFeature[];
}

export interface FeatureLayersIdentify {
  [layerName: number]: FeatureLayersIdentify;
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

export interface FeatureItem {
  id: number;
  geom: string | GeometryObject;
  fields: { [field: string]: number | string | boolean };
  extensions: {
    description?: string;
    attachment?: FeatureItemAttachment[];
  };
}
