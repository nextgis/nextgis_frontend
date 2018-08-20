import { LayerAdapter, LayerAdapters } from './LayerAdapter';
import { Type } from '../Utils/Type';
import { EventEmitter } from 'events';

export interface MapAdapter<M = any> {

  lonlatProjection?: string;
  displayProjection?: string;
  map: M;
  emitter: EventEmitter;

  create(options?): void;
  getLayerAdapter(adapterName: string): Type<LayerAdapter>;
  onMapLoad(cb?: () => void): Promise<any>;

  addLayer<K extends keyof LayerAdapters>(
    layerAdapter: K | Type<LayerAdapter>,
    options: LayerAdapters[K]): Promise<LayerAdapter>;

  removeLayer(layerName: string): any;
  getLayer(layerName: string): any;
  isLayerOnTheMap(layerName: string): boolean;
  setLayerOpacity(layerName: string, opacity: number): void;
  getLayers(): string[];

  showLayer(layerName: string): void;
  hideLayer(layerName: string): void;
  toggleLayer(layerName: string, status: boolean): void;

  setCenter(latLng: [number, number]): void;
  setZoom(zoom: number): void;
  fit(extent: [number, number, number, number]): void;
  setRotation?(angle: number): void;

  addControl(controlDef, position: string): void;

  getContainer(): HTMLElement;
}
