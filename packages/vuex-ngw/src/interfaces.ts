import { Feature, Geometry, GeoJsonProperties } from 'geojson';

export type LookupTables = { [field: string]: Record<string, string> };

export interface ForeignResource {
  relationField?: string;
}

export interface PatchOptions<
  G extends Geometry | null = Geometry,
  P extends GeoJsonProperties = GeoJsonProperties
> {
  [options: string]: any;
  item: Feature<G, P>;
  fid?: number;
}
