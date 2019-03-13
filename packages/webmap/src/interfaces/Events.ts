/**
 * @module webmap
 */

import { WebMap } from '../WebMap';
import { MapAdapter, MapClickEvent } from './MapAdapter';
import { LayerAdapter, OnLayerClickOptions } from './LayerAdapter';

export interface WebMapEvents {
  'build-map': MapAdapter;
  'create': WebMap;

  'click': MapClickEvent;
  'zoomstart': MapAdapter;
  'zoom': MapAdapter;
  'zoomend': MapAdapter;
  'movestart': MapAdapter;
  'move': MapAdapter;
  'moveend': MapAdapter;

  'layer:preadd': LayerAdapter;
  'layer:add': LayerAdapter;

  'layer:preremove': LayerAdapter;
  'layer:remove': LayerAdapter;

  'layer:preshow': LayerAdapter;
  'layer:show': LayerAdapter;

  'layer:prehide': LayerAdapter;
  'layer:hide': LayerAdapter;

  'layer:click': OnLayerClickOptions;
}
