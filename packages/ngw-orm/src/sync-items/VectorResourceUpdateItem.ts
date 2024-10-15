import type { BaseResourceSyncItem } from './ResourceSyncItem';
import type { FeatureLayerRead } from '@nextgisweb/feature-layer/type/api';

export interface VectorResourceUpdateItem extends BaseResourceSyncItem {
  feature_layer: FeatureLayerRead;
}
