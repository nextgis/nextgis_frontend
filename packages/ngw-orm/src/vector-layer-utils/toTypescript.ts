import {
  GeometryType,
  VectorLayerResourceItem,
  VectorFieldDatatype,
} from '@nextgis/ngw-connector';
import { capitalize, camelize } from '@nextgis/utils';
import { VectorLayer } from '../repository/VectorLayer';
import { CannotExecuteNotConnectedError } from '../error/CannotExecuteNotConnectedError';
import {
  ToTypescriptOptions,
  ToTypescript,
} from '../options/ToTypescriptOptions';

const dataTypeAlias: Record<VectorFieldDatatype, string> = {
  STRING: 'string',
  REAL: 'number',
  DATE: 'Date',
  TIME: 'Date',
  DATETIME: 'Date',
  BIGINT: 'number',
  INTEGER: 'number',
  BOOLEAN: 'boolean',
};

const layerAlias: Partial<Record<GeometryType, string>> = {
  POLYGON: 'PolygonLayer',
  POINT: 'PointLayer',
  LINESTRING: 'LineLayer',
};

export function toTypescript(
  Resource: typeof VectorLayer,
  opt: ToTypescriptOptions = {},
): ToTypescript {
  const item = Resource.item as VectorLayerResourceItem;
  if (!item) {
    throw new CannotExecuteNotConnectedError();
  }
  const type: GeometryType = Resource.geometryType;

  if (!layerAlias[type]) {
    throw new Error(`${type} geometry type is not supported`);
  }
  const name =
    opt.name ||
    (item.resource.keyname && capitalize(camelize(item.resource.keyname))) ||
    `Resource${item.resource.id}`;
  const dts: string[] = [`export interface ${name} {`];

  const ts = [
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
    ts.push(`  keyname: '${item.resource.keyname}',`);
  }
  if (item.resource.description) {
    ts.push(`  description: '${item.resource.description}',`);
  }
  ts.push(`})`);

  ts.push(
    `export default class ${name ? name + ' ' : ''}extends VectorLayer {`,
  );

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
    const prop = `  ${x.keyname}!: ${dataTypeAlias[x.datatype]};`;
    columnStr.push(prop);
    dts.push(prop);
    if (i) {
      ts.push('');
    }
    ts.push(columnStr.join('\n'));
  });
  [dts, ts].forEach((x) => {
    x.push(`}`);
    x.push(``);
  });

  return { model: ts.join('\n'), interface: dts.join('\n') };
}
