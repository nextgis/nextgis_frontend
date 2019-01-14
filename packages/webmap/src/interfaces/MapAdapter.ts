import { LayerAdapter } from './LayerAdapter';
import { Type } from '../utils/Type';
import { EventEmitter } from 'events';
import { MapControls, MapControl, CreateControlOptions, CreateButtonControlOptions } from './MapControl';
import { MapOptions } from './WebMapApp';
import { LayerMem } from '../WebMap';
import { LatLng, MapCenter, LayerExtent } from './BaseTypes';

export interface MapClickEvent {
  latLng: LatLng;
  pixel: { top: number, left: number, right?: number, bottom?: number };
  source?: any;
}

export interface FitOptions {
  maxZoom?: number;
}

export type ControlPositions = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface BaseMapAdapter<L = any> {

  removeLayer(layer: L): any;
  isLayerOnTheMap?(layer: L): boolean;
  setLayerOpacity(layer: L, opacity: number): void;
  showLayer(layer: L): void;
  hideLayer(layer: L): void;
  setLayerOrder(layer: L, order: number, layers?: {[name: string]: LayerMem}): void;

  setCenter(latLng: MapCenter): void;
  setZoom(zoom: number): void;
  fit(extent: LayerExtent, options?: FitOptions): void;
  setRotation?(angle: number): void;
  setView?(lngLat: MapCenter, zoom?: number): void;

  getZoom(): number;

}

export interface MapAdapter<M = any, L = any, C = any> extends BaseMapAdapter<L> {

  lonlatProjection?: string;
  displayProjection?: string;
  map: M;
  emitter: EventEmitter;
  layerAdapters: { [name: string]: Type<LayerAdapter<any, L, M>> };
  controlAdapters: { [name: string]: Type<C> };

  create(options?: MapOptions): void;

  onMapLoad(cb?: () => void): Promise<any>;

  getContainer(): HTMLElement;

  createControl?(control: MapControl, options?: CreateControlOptions): C;
  createButtonControl?(options: CreateButtonControlOptions): C;

  addControl<K extends keyof MapControls>(
    controlName: K | any,
    position: ControlPositions,
    options?: MapControls[K]): any;
  removeControl(control: any): void;

  onMapClick(evt: any): void;

  // TODO: now return WKT geometry but need geojson
  requestGeomString?(pixel: { top: number, left: number }, pixelRadius?: number): string;
}
