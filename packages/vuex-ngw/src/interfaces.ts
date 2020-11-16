import { Feature, Geometry, GeoJsonProperties } from 'geojson';

export interface ForeignResource {
  relationField?: string;
}

export interface PatchOptions<
  G extends Geometry | null = Geometry,
  P extends GeoJsonProperties = GeoJsonProperties
> {
  item: Feature<G, P>;
  fid?: number;
}
