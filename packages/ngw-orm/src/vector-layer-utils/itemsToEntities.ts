import { defined } from '@nextgis/utils';

import { getMetadataArgsStorage } from '..';

import type { FeatureItem } from '@nextgis/ngw-connector';
import type { FeatureProperties } from '@nextgis/utils';

import type { VectorLayer } from '../repository/VectorLayer';

export function itemsToEntities(
  Resource: typeof VectorLayer,
  items: FeatureItem[],
): VectorLayer[] {
  const entities: VectorLayer[] = [];
  items.forEach((x) => {
    const entity = itemToEntity(Resource, x);
    entities.push(entity);
  });
  return entities;
}

export function itemToEntity(
  Resource: typeof VectorLayer,
  item: FeatureItem,
): VectorLayer {
  const fields = getMetadataArgsStorage()
    // @ts-expect-error Argument of type 'typeof VectorLayer' is not assignable to parameter of type 'string | FuncType | (string | FuncType)[]'
    .filterColumns(Resource);
  const itemFields = item.fields;
  if ('coordinates' in item.geom && defined(itemFields)) {
    const entity = new Resource();
    fields.forEach((x) => {
      const propertyName = x.propertyName as keyof FeatureProperties;
      if (propertyName in itemFields) {
        let value = itemFields[propertyName];
        if (x.options.datatype === 'BOOLEAN') {
          value = Boolean(value);
        }
        Object.defineProperty(entity, propertyName, {
          value,
          configurable: true,
          enumerable: true,
        });
      }
    });
    // objectAssign(entity, item.fields);
    entity.id = item.id;
    entity.geom = item.geom;
    return entity;
  }
  throw new Error('No coordinates in geometry');
}
