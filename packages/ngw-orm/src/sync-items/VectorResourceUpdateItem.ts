import type { FeatureResource } from '@nextgis/ngw-connector';
import type { BaseResourceSyncItem } from './ResourceSyncItem';

export interface VectorResourceUpdateItem extends BaseResourceSyncItem {
  feature_layer: FeatureResource;
}
