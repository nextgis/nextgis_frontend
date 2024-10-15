import { prepareFieldsToNgw } from '@nextgis/ngw-kit';

import type { VectorLayer } from '../repository/VectorLayer';
import type { FeatureItem } from '@nextgis/ngw-connector';
import type { CompositeRead } from '@nextgisweb/resource/type/api';
import type { GeoJsonProperties, Geometry } from 'geojson';

export interface VectorResourceToNgwOptions {
  resource: CompositeRead;
  items: VectorLayer[];
}

export function vectorResourceToNgw(
  opt: VectorResourceToNgwOptions,
): Partial<FeatureItem<GeoJsonProperties, Geometry>>[] {
  // const features: Partial<FeatureItem<GeoJsonProperties, string>>[] = [];
  return opt.items.map((item) => {
    const geom = item.geom;
    const featureLayer = opt.resource.feature_layer;
    if (!featureLayer) {
      throw new Error('Resource is not a vector layer');
    }
    const fields = prepareFieldsToNgw(item, featureLayer.fields);
    return {
      id: item.id,
      fields,
      geom,
    };
  });
}
