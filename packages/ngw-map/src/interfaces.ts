import {
  MapOptions,
  ControlPositions,
  CirclePaint,
  PathPaint,
  IconOptions,

} from '@nextgis/webmap';

export interface ControlOptions {
  position?: ControlPositions;
}

export interface NgwMapOptions extends MapOptions {
  target: string | HTMLElement;
  qmsId?: number;
  webmapId?: number;
  baseUrl?: string;
  bounds?: [number, number, number, number];
  geoJsonDefaultPaint?: {
    circle: CirclePaint,
    path: PathPaint,
    icon: IconOptions
  };
}

export interface NgwLayerOptions {
  id: number;
  adapter?: 'IMAGE' | 'TILE' | 'GEOJSON';
}
