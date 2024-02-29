import type { BaseResourceSyncItem } from './ResourceSyncItem';
import type { FeatureResource, VectorLayer } from '@nextgis/ngw-connector';

export interface VectorResourceSyncItem extends BaseResourceSyncItem {
  vector_layer: VectorLayer & FeatureResource;
}
