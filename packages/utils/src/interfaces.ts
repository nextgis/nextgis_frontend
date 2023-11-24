import type { Feature } from 'geojson';

export type FeatureProperties = { [name: string]: any }; // GeoJsonProperties;

export type FeatureProperties_<F extends Feature = Feature> = F['properties'];

export type ExtractFeatureProperties<F extends Feature = Feature> =
  FeatureProperties_<F> extends null ? FeatureProperties : FeatureProperties;
