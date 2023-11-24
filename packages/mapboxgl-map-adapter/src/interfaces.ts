import type {
  CircleLayerSpecification,
  FillLayerSpecification,
  LineLayerSpecification,
  SymbolLayerSpecification,
} from 'maplibre-gl';

export type VectorLayerSpecification =
  | LineLayerSpecification
  | FillLayerSpecification
  | CircleLayerSpecification
  | SymbolLayerSpecification;

export type SelectedFeaturesIds = (number | string)[];
