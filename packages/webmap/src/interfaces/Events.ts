/**
 * @module webmap
 */

import { WebMap } from '../WebMap';
import { MapAdapter, MapClickEvent } from './MapAdapter';
import { LayerAdapter, OnLayerClickOptions } from './LayerAdapter';

export interface WebMapEvents {
  'create': WebMap;
  'build-map': MapAdapter;
  'click': MapClickEvent;

  'layer:add': LayerAdapter;
  'layer:click': OnLayerClickOptions;
}
