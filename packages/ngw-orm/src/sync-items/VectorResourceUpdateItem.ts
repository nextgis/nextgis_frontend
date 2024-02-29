import type { BaseResourceSyncItem } from './ResourceSyncItem';
import type { FeatureResource } from '@nextgis/ngw-connector';

export interface VectorResourceUpdateItem extends BaseResourceSyncItem {
  feature_layer: FeatureResource;
}
