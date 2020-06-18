import { Polygon } from 'geojson';
import { GeometryType } from '@nextgis/ngw-connector';
import { VectorLayer } from './VectorLayer';

export class PolygonLayer extends VectorLayer<Polygon> {
  static geometryType: GeometryType = 'POLYGON';
}
