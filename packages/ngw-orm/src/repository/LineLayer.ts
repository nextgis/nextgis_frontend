import { VectorLayer } from './VectorLayer';

import type { GeometryType } from '@nextgis/ngw-connector';
import type { LineString } from 'geojson';

export class LineLayer extends VectorLayer<LineString> {
  static geometryType: GeometryType = 'LINESTRING';
}
