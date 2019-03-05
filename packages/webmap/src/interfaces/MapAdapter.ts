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
  ButtonControlOptions,
  ToggleControlOptions
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

/**
 * @typeparam M WEB-GIS framework map interface
 * @typeparam M WEB-GIS framework layer interface
 * @typeparam M WEB-GIS framework control interface
 */
export interface MapAdapter<M = any, L = any, C = any> {

  lonlatProjection?: string;
  displayProjection?: string;
  map?: M;
  emitter: EventEmitter;
  layerAdapters: { [name: string]: Type<LayerAdapter<M, L, any>> };
  controlAdapters: { [name: string]: Type<C> };

  removeLayer(layer: L): any;
  isLayerOnTheMap?(layer: L): boolean;
  setLayerOpacity(layer: L, opacity: number): void;
  showLayer(layer: L): void;
  hideLayer(layer: L): void;
  setLayerOrder(layer: L, order: number, layers?: { [name: string]: LayerAdapter }): void;

  fit(extent: LngLatBoundsArray, options?: FitOptions): void;
  setRotation?(angle: number): void;
  setView?(lngLat: LngLatArray, zoom?: number): void;

  getZoom(): number | undefined;
  setZoom(zoom: number): void;

  getCenter(): LngLatArray | undefined;
  setCenter(latLng: LngLatArray): void;

  create(options?: MapOptions): void;

  onMapLoad(cb?: () => void): Promise<any>;

  getContainer(): HTMLElement | undefined;

  setCursor?(cursor: string): void;

  createControl?(control: MapControl, options?: CreateControlOptions): C;
  createButtonControl?(options: ButtonControlOptions): C;
  createToggleControl?(options: ToggleControlOptions): C;

  addControl<K extends keyof MapControls>(
    controlName: K | any,
    position: ControlPositions,
    options?: MapControls[K]): any;
  removeControl(control: any): void;

  onMapClick(evt: any): void;

  // TODO: now return WKT geometry but need geojson
  requestGeomString?(pixel: Pixel, pixelRadius?: number): string | undefined;
}
