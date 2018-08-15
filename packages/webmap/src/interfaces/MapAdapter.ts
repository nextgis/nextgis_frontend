import { LayerAdapter } from "./LayerAdapter";
import { Type } from "../Utils/Type";
import { EventEmitter } from "events";

export interface MapOptions {
  target: string | HTMLElement;
  logo?: string;
  controls?: any[];
  minZoom?: number;
}

export interface MapAdapter<M = any> {

  lonlatProjection: string;
  displayProjection: string;
  map: M;
  emitter: EventEmitter;

  create(options?): void;
  getLayerAdapter(adapterName: string): Type<LayerAdapter>;

  addLayer(layerName: string, layerProvider, options: any): Promise<LayerAdapter>;
  removeLayer(layerName: string): any;

  showLayer(layerName: string): void;
  hideLayer(layerName: string): void;

  setCenter(latLng: [number, number]): void;
  setZoom(zoom: number): void;
  fit(extent: [number, number, number, number]): void;
  setRotation?(angle: number): void;

  addControl(controlDef, position: string): void;

  getContainer(): HTMLElement;
}
