import { GeometryType } from '@nextgis/ngw-connector';
import { BaseResourceOptions } from './BaseResourceOptions';

/**
 * Describes all resource's options.
 */
export interface VectorLayerOptions extends BaseResourceOptions {
  type?: 'vector_layer';
  geometry_type?: GeometryType;
}
