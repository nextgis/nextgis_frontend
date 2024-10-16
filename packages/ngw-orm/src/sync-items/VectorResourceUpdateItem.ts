import type { FeatureLayerRead } from '@nextgisweb/feature-layer/type/api';

import type { BaseResourceSyncItem } from './ResourceSyncItem';

export interface VectorResourceUpdateItem extends BaseResourceSyncItem {
  feature_layer: FeatureLayerRead;
}
