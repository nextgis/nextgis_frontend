import type { Point } from 'geojson';
import type { GeometryType } from '@nextgis/ngw-connector';
import { VectorLayer } from './VectorLayer';

export class PointLayer extends VectorLayer<Point> {
  static geometryType: GeometryType = 'POINT';
}
