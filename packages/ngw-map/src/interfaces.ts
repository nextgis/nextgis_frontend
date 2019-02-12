import {
  MapOptions,
  ControlPositions,
  CirclePaint,
  PathPaint,
  IconOptions,
  LayerExtent,

} from '@nextgis/webmap';
import { NgwLayerOptions } from '@nextgis/ngw-kit';

export interface ControlOptions {
  position?: ControlPositions;
}

export interface NgwMapOptions extends MapOptions {
  target: string | HTMLElement;
  qmsId?: number | [number, string];
  webmapId?: number | [number, string];
  baseUrl?: string;
  bounds?: LayerExtent;
  geoJsonDefaultPaint?: {
    circle: CirclePaint,
    path: PathPaint,
    icon: IconOptions
  };
}

export { NgwLayerOptions };
