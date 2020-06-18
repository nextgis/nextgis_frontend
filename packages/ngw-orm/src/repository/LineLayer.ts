import { LineString } from 'geojson';
import { GeometryType } from '@nextgis/ngw-connector';
import { VectorLayer } from './VectorLayer';

export class LineLayer extends VectorLayer<LineString> {
  static geometryType: GeometryType = 'LINESTRING';
}
