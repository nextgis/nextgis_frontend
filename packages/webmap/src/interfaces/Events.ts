import type { WebMap } from '../WebMap';
import type { MapAdapter, MapClickEvent, DataLoadError } from './MapAdapter';
import type {
  LayerAdapter,
  OnLayerClickOptions,
  OnLayerSelectOptions,
} from './LayerAdapter';

/**
 * @public
 */
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
  /**
   * @eventProperty
   */
  'layer:add': LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:preremove': LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:remove': LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:updated': LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:preshow': LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:show': LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:prehide': LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:hide': LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:pretoggle': LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:toggle': LayerAdapter;
  /**
   * @eventProperty
   */
  'layer:click': OnLayerClickOptions;
  /**
   * @eventProperty
   */
  'layer:mouseover': OnLayerClickOptions;
  /**
   * @eventProperty
   */
  'layer:mouseout': OnLayerClickOptions;
  /**
   * @eventProperty
   */
  'layer:select': OnLayerSelectOptions;
  /**
   * @eventProperty
   */
  'controls:create': any;
}

/**
 * @public
 */
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

/**
 * @public
 */
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
}
