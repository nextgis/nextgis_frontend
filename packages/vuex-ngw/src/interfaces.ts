import { Polygon as LPolygon } from 'leaflet';
import { VectorResourceAdapter } from '@nextgis/ngw-kit';
import { LayerDefinition } from '@nextgis/webmap';
import { Feature, Polygon, Point, Geometry, GeoJsonProperties } from 'geojson';

export type PlotFeature = Feature<Polygon, PlotProperties>;
export type PlotLayerDefinition = LayerDefinition<PlotFeature>;
export type PlotResourceAdapter = VectorResourceAdapter<any, LPolygon, any, PlotFeature>;

export interface PlotProperties {
  subj: string;
  rayon: string;
}

export type TurnPointType = 0 | 1 | 2;

export interface ReferencePointProperty extends TurnPointProperties {
  type: 0;
  idpnt: 0;
}

export type ReferencePointFeature = Feature<Point, ReferencePointProperty>;

export interface TurnPointProperties {
  idpnt: number;
  type: TurnPointType;
  plotid: number;
}

export type LookupTables = { [field: string]: Record<string, string> };

export interface ForeignResource {
  relationField?: string;
}

export interface PatchOptions<
  G extends Geometry | null = Geometry,
  P extends GeoJsonProperties = GeoJsonProperties
> {
  item: Feature<G, P>;
  fid?: number;
  [options: string]: any;
}
