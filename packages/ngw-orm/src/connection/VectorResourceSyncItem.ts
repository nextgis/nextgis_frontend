import { Resource, VectorLayer, FeatureResource } from '@nextgis/ngw-connector';

export interface VectorResourceSyncItem {
  resource: Resource;
  resmeta: {
    items: Record<string, unknown>;
  };

  vector_layer: VectorLayer & FeatureResource;
}
