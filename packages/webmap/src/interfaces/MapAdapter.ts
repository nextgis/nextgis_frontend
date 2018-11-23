import { LayerAdapter, LayerAdapters } from './LayerAdapter';
import { Type } from '../utils/Type';
import { EventEmitter } from 'events';
import { MapControls, MapControl } from './MapControl';
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
  fit(extent: [number, number, number, number]): void;
  setRotation?(angle: number): void;

}

export interface MapAdapter<M = any> extends BaseMapAdapter {

  lonlatProjection?: string;
  displayProjection?: string;
  map: M;
  emitter: EventEmitter;
  layerAdapters: { [name: string]: Type<LayerAdapter> };

  create(options?: MapOptions): void;

  onMapLoad(cb?: () => void): Promise<any>;

  getContainer(): HTMLElement;

  addControl<C extends keyof MapControls>(
    controlName: C | MapControl,
    position: ControlPositions,
    options?: MapControls[C]): any;

  onMapClick(evt: MapClickEvent): void;

  // TODO: now return WKT geometry but need geojson
  requestGeomString?(pixel: { top: number, left: number }, pixelRadius?: number): string;
}
