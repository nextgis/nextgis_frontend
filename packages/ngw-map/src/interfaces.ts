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
  /**
   * The HTML element in which NgwMap will render the map,
   * or the element's string  id. The specified element must have no children.
   */
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
