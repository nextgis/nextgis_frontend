import type { VectorLayer, FeatureResource } from '@nextgis/ngw-connector';
import type { BaseResourceSyncItem } from './ResourceSyncItem';

export interface VectorResourceSyncItem extends BaseResourceSyncItem {
  vector_layer: VectorLayer & FeatureResource;
}
