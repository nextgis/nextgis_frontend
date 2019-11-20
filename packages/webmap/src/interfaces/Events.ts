/**
 * @module webmap
 */

import { WebMap } from '../WebMap';
import { MapAdapter, MapClickEvent, DataLoadError } from './MapAdapter';
import { LayerAdapter, OnLayerClickOptions } from './LayerAdapter';

export interface WebMapEvents extends BaseMapEvents {
  /** @event */
  create: WebMap;
  /** @event */
  'build-map': MapAdapter;
  /** @event */
  'layer:preadd': LayerAdapter;
  /** @event */
  'layer:add': LayerAdapter;
  /** @event */
  'layer:preremove': LayerAdapter;
  /** @event */
  'layer:remove': LayerAdapter;
  /** @event */
  'layer:preshow': LayerAdapter;
  /** @event */
  'layer:show': LayerAdapter;
  /** @event */
  'layer:prehide': LayerAdapter;
  /** @event */
  'layer:hide': LayerAdapter;
  /** @event */
  'layer:click': OnLayerClickOptions;
}

export interface MapAdapterEvents extends BaseMapEvents {
  /** @event */
  'data-loaded': DataLoadError;
  /** @event */
  'data-error': DataLoadError;
  /** @event */
  create: MapAdapter;
}

export interface BaseMapEvents {
  /** @event */
  click: MapClickEvent;
  /** @event */
  zoomstart: MapAdapter;
  /** @event */
  zoom: MapAdapter;
  /** @event */
  zoomend: MapAdapter;
  /** @event */
  movestart: MapAdapter;
  /** @event */
  move: MapAdapter;
  /** @event */
  moveend: MapAdapter;
}
