import { GeometryType } from '@nextgis/ngw-connector';
import { ResourceMetadataArgs } from './ResourceMetadataArgs';

/**
 * Arguments for TableMetadata class, helps to construct an TableMetadata object.
 */
export interface VectorLayerMetadataArgs extends ResourceMetadataArgs {
  geometry_type?: GeometryType;
}
