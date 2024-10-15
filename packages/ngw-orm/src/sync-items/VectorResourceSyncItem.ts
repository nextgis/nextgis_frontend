import type { BaseResourceSyncItem } from './ResourceSyncItem';
import type { FeatureLayerRead } from '@nextgisweb/feature-layer/type/api';
import type { VectorLayerRead } from '@nextgisweb/vector-layer/type/api';

export interface VectorResourceSyncItem extends BaseResourceSyncItem {
  vector_layer: VectorLayerRead & FeatureLayerRead;
}
