import { FeatureResource } from '@nextgis/ngw-connector';
import { BaseResourceSyncItem } from './ResourceSyncItem';

export interface VectorResourceUpdateItem extends BaseResourceSyncItem {
  feature_layer: FeatureResource;
}
