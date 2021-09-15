import { convertMapClickEvent } from './convertMapClickEvent';

import type { LeafletMouseEvent } from 'leaflet';
import type { LayerAdapter, OnLayerMouseOptions } from '@nextgis/webmap';
import type { LayerDef } from '../layer-adapters/GeoJsonAdapter';
import { getFeaturesBounds, getFeaturesCenter } from './geometries';

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
  };
  if (feature) {
    opt.getBounds = () => getFeaturesBounds([feature]);
    opt.getCenter = () => getFeaturesCenter([feature]);
  }
  return opt;
}
