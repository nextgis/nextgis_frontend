import { GeoJsonProperties } from 'geojson';
import {
  ResourceItem,
  FeatureResource,
  FeatureItem,
} from '@nextgis/ngw-connector';
import { prepareGeomToNgw } from './prepareGeomToNgw';
import { VectorLayer } from '../repository/VectorLayer';

export interface VectorResourceToNgwOptions {
  resource: ResourceItem;
  items: VectorLayer[];
}

export function vectorResourceToNgw(
  opt: VectorResourceToNgwOptions
): Partial<FeatureItem<GeoJsonProperties, string>>[] {
  // const features: Partial<FeatureItem<GeoJsonProperties, string>>[] = [];
  return opt.items.map((item) => {
    const geom = prepareGeomToNgw(item.geom);

    const fields: GeoJsonProperties = {};
    const featureLayer = opt.resource.feature_layer as FeatureResource;
    featureLayer.fields.forEach((x) => {
      if (x.keyname in item) {
        // @ts-ignore
        const property = opt.item[x.keyname];

        let value: any;
        if (property) {
          if (x.datatype === 'STRING') {
            value = String(property);
          } else if (x.datatype === 'BIGINT' || x.datatype === 'INTEGER') {
            value = parseInt(property, 10);
          } else if (x.datatype === 'REAL') {
            value = parseFloat(property);
          } else if (x.datatype === 'DATE') {
            let dt: Date | undefined;
            if (typeof property === 'object') {
              value = property;
            } else {
              if (property instanceof Date) {
                dt = property;
              } else {
                const parse = Date.parse(property);
                if (parse) {
                  dt = new Date(parse);
                }
              }
              if (dt) {
                value = {
                  year: dt.getFullYear(),
                  month: dt.getMonth(),
                  day: dt.getDay(),
                };
              }
            }
          }
        }
        // @ts-ignore
        fields[x.keyname] = value || null;
      }
    });

    return {
      id: item.id,
      fields,
      geom,
    };
  });
}
