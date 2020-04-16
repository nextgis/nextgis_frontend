import { Resource, VectorLayer, FeatureResource } from '@nextgis/ngw-connector';

export interface VectorResourceSyncItem {
  resource: Resource;
  resmeta: {
    items: {};
  };

  vector_layer: VectorLayer & FeatureResource;
}
