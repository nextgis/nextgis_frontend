import { VectorLayer, FeatureResource } from '@nextgis/ngw-connector';
import { BaseResourceSyncItem } from './ResourceSyncItem';

export interface VectorResourceSyncItem extends BaseResourceSyncItem {
  vector_layer: VectorLayer & FeatureResource;
}
