import { GeoJsonProperties, Geometry } from 'geojson';
import { prepareFieldsToNgw } from '@nextgis/ngw-kit';
import {
  ResourceItem,
  FeatureResource,
  FeatureItem,
} from '@nextgis/ngw-connector';
import { VectorLayer } from '../repository/VectorLayer';

export interface VectorResourceToNgwOptions {
  resource: ResourceItem;
  items: VectorLayer[];
}

export function vectorResourceToNgw(
  opt: VectorResourceToNgwOptions,
): Partial<FeatureItem<GeoJsonProperties, Geometry>>[] {
  // const features: Partial<FeatureItem<GeoJsonProperties, string>>[] = [];
  return opt.items.map((item) => {
    const geom = item.geom;
    const featureLayer = opt.resource.feature_layer as FeatureResource;
    const fields = prepareFieldsToNgw(item, featureLayer.fields);
    return {
      id: item.id,
      fields,
      geom,
    };
  });
}
