import { PropertiesFilter, Properties } from '@nextgis/properties-filter';

export type FindConditions<P extends Properties = Properties> =
  | PropertiesFilter<P>
  | ObjectEqualConditions<P>;

export type ObjectEqualConditions<P extends Properties = Properties> = {
  [K in keyof P]?: any;
};
