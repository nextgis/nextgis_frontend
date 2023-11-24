import { convertMapClickEvent } from './convertMapClickEvent';
import { createFeaturePositionOptions } from './geometries';

import type { LayerDef } from '../layer-adapters/GeoJsonAdapter/GeoJsonAdapter';
import type { LayerAdapter, OnLayerMouseOptions } from '@nextgis/webmap';
import type { LeafletMouseEvent } from 'leaflet';

export interface CreateMouseEventOptions {
  layer: LayerAdapter;
  source: LeafletMouseEvent;
}

export function createMouseEvent({
  layer,
  source,
}: CreateMouseEventOptions): OnLayerMouseOptions {
  const layer_ = source.target as LayerDef;
  const feature = layer_.feature;
  const opt: OnLayerMouseOptions = {
    layer,
    feature,
    event: convertMapClickEvent(source),
    source,
    ...createFeaturePositionOptions(feature),
  };
  return opt;
}
