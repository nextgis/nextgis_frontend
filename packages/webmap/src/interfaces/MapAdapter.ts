/**
 * @module webmap
 */

import { LayerAdapter } from './LayerAdapter';
import { Type } from './BaseTypes';
import { EventEmitter } from 'events';
import {
  MapControls,
  MapControl,
  CreateControlOptions,
  CreateButtonControlOptions,
  CreateToggleControlOptions
} from './MapControl';
import { MapOptions } from './WebMapApp';
import { LatLng, LngLatArray, LngLatBoundsArray, Pixel } from './BaseTypes';

export interface MapClickEvent {
  latLng: LatLng;
  pixel: Pixel;
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
  setLayerOrder(layer: L, order: number, layers?: { [name: string]: LayerAdapter }): void;

  setCenter(latLng: LngLatArray): void;
  setZoom(zoom: number): void;
  fit(extent: LngLatBoundsArray, options?: FitOptions): void;
  setRotation?(angle: number): void;
  setView?(lngLat: LngLatArray, zoom?: number): void;

  getZoom(): number | undefined;

}

export interface MapAdapter<M = any, L = any, C = any> extends BaseMapAdapter<L> {

  lonlatProjection?: string;
  displayProjection?: string;
  map?: M;
  emitter: EventEmitter;
  layerAdapters: { [name: string]: Type<LayerAdapter<M, L, any>> };
  controlAdapters: { [name: string]: Type<C> };

  create(options?: MapOptions): void;

  onMapLoad(cb?: () => void): Promise<any>;

  getContainer(): HTMLElement | undefined;

  setCursor?(cursor: string): void;

  createControl?(control: MapControl, options?: CreateControlOptions): C;
  createButtonControl?(options: CreateButtonControlOptions): C;
  createToggleControl?(options: CreateToggleControlOptions): C;

  addControl<K extends keyof MapControls>(
    controlName: K | any,
    position: ControlPositions,
    options?: MapControls[K]): any;
  removeControl(control: any): void;

  onMapClick(evt: any): void;

  // TODO: now return WKT geometry but need geojson
  requestGeomString?(pixel: Pixel, pixelRadius?: number): string | undefined;
}
