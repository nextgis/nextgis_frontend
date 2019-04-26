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
