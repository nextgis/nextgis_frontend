import { LineLayer } from '../repository/LineLayer';
import { PointLayer } from '../repository/PointLayer';
import { PolygonLayer } from '../repository/PolygonLayer';
import { ResourceGroup } from '../repository/ResourceGroup';

import type { BaseResource } from '../repository/BaseResource';
import type { CompositeRead, ResourceCls } from '@nextgisweb/resource/type/api';

type GetClassItemCb = (item: CompositeRead) => typeof BaseResource;

export class NgwResources {
  static classes: { [key in ResourceCls]?: GetClassItemCb } = {
    vector_layer: (item: CompositeRead) => {
      if (item.vector_layer) {
        const geometryType = item.vector_layer.geometry_type;
        if (geometryType === 'POLYGON') {
          return PolygonLayer;
        } else if (geometryType === 'POINT') {
          return PointLayer;
        } else if (geometryType === 'LINESTRING') {
          return LineLayer;
        }
      }
      throw Error('Resource item is not allowed vector layer');
    },
    resource_group: () => ResourceGroup,
  };

  static getResource(item: CompositeRead): typeof BaseResource {
    const cls = item.resource.cls;
    const resource = this.classes[cls];
    if (resource) {
      return resource(item);
    }
    throw Error('This resource item is not support by ngw-orm');
  }
}
