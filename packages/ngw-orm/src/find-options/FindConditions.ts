import { PropertiesFilter } from '@nextgis/properties-filter';

export type FindConditions<Entity> =
  | PropertiesFilter<Entity>
  | ObjectEqualConditions<Entity>;

export type ObjectEqualConditions<Entity> = {
  [P in keyof Entity]?: any;
};
