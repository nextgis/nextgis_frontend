import {
  createControlElement,
  resolveControlOptions,
  setControlOptions,
} from '@nextgis/control-container';
import { Control } from 'leaflet';

import type {
  CreateControlOptions,
  MapControl,
} from '@nextgis/control-container';
import type { Map as LeafletMap } from 'leaflet';

export function createControl<M = LeafletMap>(
  control: MapControl<M | LeafletMap>,
  options: CreateControlOptions = {},
  map?: M,
): Control {
  const resolvedOptions = resolveControlOptions(options);
  const C = Control.extend({
    onAdd(leafletMap: LeafletMap) {
      const addClass = [
        'leaflet-control',
        resolvedOptions.bar ? 'leaflet-bar' : '',
        resolvedOptions.addClass,
      ]
        .filter(Boolean)
        .join(' ');
      const element = createControlElement(
        control,
        { ...resolvedOptions, addClass },
        map ?? leafletMap,
      );
      if (!resolvedOptions.margin) {
        element.style.margin = '0px';
      }

      return element;
    },
    onRemove(leafletMap: LeafletMap) {
      control.onRemove(map ?? leafletMap);
    },
  });
  const instance = new C();
  setControlOptions(instance, resolvedOptions);
  return instance;
}
