import type { FeatureLayerRead } from '@nextgisweb/feature-layer/type/api';
import type { VectorLayerRead } from '@nextgisweb/vector-layer/type/api';

import type { BaseResourceSyncItem } from './ResourceSyncItem';

export interface VectorResourceSyncItem extends BaseResourceSyncItem {
  vector_layer: VectorLayerRead & FeatureLayerRead;
}
