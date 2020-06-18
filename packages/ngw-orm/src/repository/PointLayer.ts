import { Point } from 'geojson';
import { GeometryType } from '@nextgis/ngw-connector';
import { VectorLayer } from './VectorLayer';

export class PointLayer extends VectorLayer<Point> {
  static geometryType: GeometryType = 'POINT';
}
