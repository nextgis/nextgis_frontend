import { LayerAdapter } from './LayerAdapter';
import { Type } from '../utils/Type';
import { EventEmitter } from 'events';
import { MapControls, MapControl, CreateControlOptions, CreateButtonControlOptions } from './MapControl';
import { MapOptions } from './WebMapApp';
import { LayerMem } from '../WebMap';

interface LatLng {
  lat: number; lng: number;
}

export interface MapClickEvent {
  latLng: LatLng;
  pixel: { top: number, left: number, right?: number, bottom?: number };
  source?: any;
}

export interface FitOptions {
  maxZoom?: number;
}

export type ControlPositions = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface BaseMapAdapter {

  removeLayer(layer: any): any;
  isLayerOnTheMap?(layer): boolean;
  setLayerOpacity(layer, opacity: number): void;
  showLayer(layer: any): void;
  hideLayer(layer: any): void;
  setLayerOrder(layer: any, order: number, layers?: {[name: string]: LayerMem}): void;

  setCenter(latLng: [number, number]): void;
  setZoom(zoom: number): void;
  fit(extent: [number, number, number, number], options?: FitOptions): void;
  setRotation?(angle: number): void;
  setView?(lngLat: [number, number], zoom?: number): void;

  getZoom(): number;

}

export interface MapAdapter<M = any, L = any, C = any> extends BaseMapAdapter {

  lonlatProjection?: string;
  displayProjection?: string;
  map: M;
  emitter: EventEmitter;
  layerAdapters: { [name: string]: Type<LayerAdapter<any, L, M>> };

  create(options?: MapOptions): void;

  onMapLoad(cb?: () => void): Promise<any>;

  getContainer(): HTMLElement;

  createControl?(control: MapControl, options?: CreateControlOptions): C;
  createButtonControl?(options: CreateButtonControlOptions): C;

  addControl<K extends keyof MapControls>(
    controlName: K | any,
    position: ControlPositions,
    options?: MapControls[K]): any;

  onMapClick(evt: any): void;

  // TODO: now return WKT geometry but need geojson
  requestGeomString?(pixel: { top: number, left: number }, pixelRadius?: number): string;
}
