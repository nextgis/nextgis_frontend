import { convertMapClickEvent } from './convertMapClickEvent';
import { createFeaturePositionOptions } from './geometries';

import type { LayerAdapter, OnLayerClickOptions } from '@nextgis/webmap';
import type { LeafletMouseEvent } from 'leaflet';

import type { LayerDef } from '../layer-adapters/GeoJsonAdapter/GeoJsonAdapter';

export interface CreateMouseEventOptions {
  layer: LayerAdapter;
  source: LeafletMouseEvent;
}

export function createMouseEvent({
  layer,
  source,
}: CreateMouseEventOptions): OnLayerClickOptions {
  const layer_ = source.target as LayerDef;
  const feature = layer_.feature;
  const opt: OnLayerClickOptions = {
    layer,
    feature,
    event: convertMapClickEvent(source),
    source,
    ...createFeaturePositionOptions(feature),
  };
  return opt;
}
