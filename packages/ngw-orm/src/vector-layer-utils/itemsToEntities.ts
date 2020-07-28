import { FeatureItem } from '@nextgis/ngw-connector';
import { objectAssign } from '@nextgis/utils';
import { VectorLayer } from '../repository/VectorLayer';

export function itemsToEntities(
  Resource: typeof VectorLayer,
  items: FeatureItem[]
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
  item: FeatureItem
): VectorLayer {
  if ('coordinates' in item.geom) {
    const entity = new Resource();
    objectAssign(entity, item.fields);
    entity.id = item.id;
    entity.geom = item.geom;
    return entity;
  }
  throw new Error('No coordinates in geometry');
}
