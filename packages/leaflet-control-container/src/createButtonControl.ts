import { createButtonControlContent } from '@nextgis/control-container';

import { createControl } from './createControl';

import type { ButtonControlOptions } from '@nextgis/control-container';
import type { Control, Map as LeafletMap } from 'leaflet';

export function createButtonControl<M = LeafletMap>(
  options: ButtonControlOptions,
  map?: M,
): Control {
  return createControl<M>(
    createButtonControlContent(options),
    { bar: true, margin: options.margin },
    map,
  );
}
