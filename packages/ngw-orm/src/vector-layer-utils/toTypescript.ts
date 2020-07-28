import {
  GeometryType,
  VectorLayerResourceItem,
  ResourceItemDatatype,
} from '@nextgis/ngw-connector';
import { VectorLayer } from '../repository/VectorLayer';
import { CannotExecuteNotConnectedError } from '../error/CannotExecuteNotConnectedError';

const dataTypeAlias: Record<ResourceItemDatatype, string> = {
  STRING: 'string',
  REAL: 'number',
  DATE: 'Date',
  TIME: 'Date',
  DATETIME: 'Date',
  BIGINT: 'number',
  INTEGER: 'number',
};

const layerAlias: Partial<Record<GeometryType, string>> = {
  POLYGON: 'PolygonLayer',
  POINT: 'PointLayer',
  LINESTRING: 'LineLayer',
};

export function toTypescript(Resource: typeof VectorLayer): string {
  const item = Resource.item as VectorLayerResourceItem;
  if (!item) {
    throw new CannotExecuteNotConnectedError();
  }
  const type: GeometryType = Resource.geometryType;

  if (!layerAlias[type]) {
    throw new Error(`${type} geometry type is not supported`);
  }

  const str = [
    `// This code is generated automatically`,
    '',
    `import {`,
    `  ${layerAlias[type]} as VectorLayer,`,
    `  NgwResource,`,
    `  Column,`,
    `} from '@nextgis/ngw-orm';`,
    '',
    `@NgwResource({`,
    `  type: 'vector_layer',`,
    `  display_name: '${item.resource.display_name}',`,
  ];
  if (item.resource.keyname) {
    str.push(`  keyname: '${item.resource.keyname}',`);
  }
  if (item.resource.description) {
    str.push(`  description: '${item.resource.description}',`);
  }
  str.push(`})`);

  str.push(`export default class Plot extends VectorLayer {`);

  item.feature_layer.fields.forEach((x, i) => {
    const columnStr = [`  @Column({`];
    if (x.display_name) {
      columnStr.push(`    display_name: '${x.display_name}',`);
    }
    columnStr.push(`    datatype: '${x.datatype}',`);
    if (x.label_field) {
      columnStr.push(`    label_field: ${x.label_field},`);
    }
    if (!x.grid_visibility) {
      columnStr.push(`    grid_visibility: ${x.grid_visibility},`);
    }
    columnStr.push(`  })`);
    columnStr.push(`  ${x.keyname}!: ${dataTypeAlias[x.datatype]};`);
    if (i) {
      str.push('');
    }
    str.push(columnStr.join('\n'));
  });

  str.push(`}`);
  str.push(``);

  return str.join('\n');
}
