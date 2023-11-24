import type { LineString } from 'geojson';
import type { GeometryType } from '@nextgis/ngw-connector';
import { VectorLayer } from './VectorLayer';

export class LineLayer extends VectorLayer<LineString> {
  static geometryType: GeometryType = 'LINESTRING';
}
