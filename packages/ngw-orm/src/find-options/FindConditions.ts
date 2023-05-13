import { PropertiesFilter, Properties } from '@nextgis/properties-filter';

export type FindConditions<T extends Properties = Properties> =
  | PropertiesFilter<T>
  | ObjectEqualConditions<T>;

export type ObjectEqualConditions<T extends Properties = Properties> = {
  [P in keyof T]?: any;
};
