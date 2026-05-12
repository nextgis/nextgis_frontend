import { createButtonControlContent } from '@nextgis/control-container';

import { createControl } from './createControl';

import type { ButtonControlOptions } from '@nextgis/control-container';
import type { IControl, Map as MaplibreMap } from 'maplibre-gl';

export function createButtonControl<M = MaplibreMap>(
  options: ButtonControlOptions,
  map?: M,
): IControl {
  return createControl<M>(
    createButtonControlContent(options),
    { bar: true, margin: options.margin },
    map,
  );
}
