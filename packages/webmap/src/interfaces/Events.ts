import type { WebMap } from '../WebMap';

import type {
  LayerAdapter,
  OnLayerMouseOptions,
  OnLayerSelectOptions,
} from './LayerAdapter';
import type { DataLoadError, MapAdapter, MapClickEvent } from './MapAdapter';

export interface WebMapEvents extends MainMapEvents {
  /**
   * @eventProperty
   */
  create: WebMap;
  /**
   * @eventProperty
   */
  'build-map': MapAdapter;
  /**
   * @eventProperty
   */
  'layer:preadd': LayerAdapter;
  [key: `layer-${string | number}:preadd`]: LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:add': LayerAdapter;
  [key: `layer-${string | number}:add`]: LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:preremove': LayerAdapter;
  [key: `layer-${string | number}:preremove`]: LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:remove': LayerAdapter;
  [key: `layer-${string | number}:remove`]: LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:preupdate': LayerAdapter;
  [key: `layer-${string | number}:preupdate`]: LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:updated': LayerAdapter;
  [key: `layer-${string | number}:updated`]: LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:preshow': LayerAdapter;
  [key: `layer-${string | number}:preshow`]: LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:show': LayerAdapter;
  [key: `layer-${string | number}:show`]: LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:prehide': LayerAdapter;
  [key: `layer-${string | number}:prehide`]: LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:hide': LayerAdapter;
  [key: `layer-${string | number}:hide`]: LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:pretoggle': LayerAdapter;
  [key: `layer-${string | number}:pretoggle`]: LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:toggle': LayerAdapter;
  [key: `layer-${string | number}:toggle`]: LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:click': OnLayerMouseOptions;
  [key: `layer-${string | number}:click`]: OnLayerMouseOptions;
  /**
   * @eventProperty
   */
  'layer:dblclick': OnLayerMouseOptions;
  [key: `layer-${string | number}:dblclick`]: OnLayerMouseOptions;
  /**
   * @eventProperty
   */
  'layer:mouseover': OnLayerMouseOptions;
  [key: `layer-${string | number}:mouseover`]: OnLayerMouseOptions;
  /**
   * @eventProperty
   */
  'layer:mouseout': OnLayerMouseOptions;
  [key: `layer-${string | number}:mouseout`]: OnLayerMouseOptions;
  /**
   * @eventProperty
   */
  'layer:select': OnLayerSelectOptions;
  [key: `layer-${string | number}:select`]: OnLayerMouseOptions;
  /**
   * @eventProperty
   */
  'layer:label:toggle': LayerAdapter;
  /**
   * @eventProperty
   */
  'controls:create': any;

  /**
   * @eventProperty
   */
  [key: `event-${string}`]: any;
}

export interface MapAdapterEvents extends MainMapEvents {
  /**
   * @eventProperty
   */
  'data-loaded': DataLoadError;
  /**
   * @eventProperty
   */
  'data-error': DataLoadError;
  /**
   * @eventProperty
   */
  create: MapAdapter;
}

export interface MainMapEvents {
  /**
   * Fired before the map is clicked.
   * @eventProperty
   */
  preclick: MapClickEvent;
  /**
   * Fired every time a map is clicked.
   * @eventProperty
   */
  click: MapClickEvent;
  /**
   * Fired when the map zoom is about to change.
   * @eventProperty
   */
  zoomstart: MapAdapter;
  /**
   * Fired repeatedly during any change in zoom level
   * @eventProperty
   */
  zoom: MapAdapter;
  /**
   * Fired when the map has changed.
   * @eventProperty
   */
  zoomend: MapAdapter;
  /**
   * Fired when the view of the map starts changing (e.g. user starts dragging the map).
   * @eventProperty
   */
  movestart: MapAdapter;
  /**
   * Fired repeatedly during any movement of the map.
   * @eventProperty
   */
  move: MapAdapter;
  /**
   * Fired when the center of the map stops changing.
   * @eventProperty
   */
  moveend: MapAdapter;
  /**
   * 	Fired while the mouse moves over the map.
   * @eventProperty
   */
  mousemove: MapAdapter;
  /**
   * 	Fired when the mouse leaves the map.
   * @eventProperty
   */
  mouseout: MapAdapter;
  /**
   * Fired when the mouse enters the map.
   * @eventProperty
   */
  mouseover: MapAdapter;
}
