import { createButtonControlContent } from '@nextgis/control-container';

import { createControl } from './createControl';

import type { ButtonControlOptions } from '@nextgis/control-container';
import type Control from 'ol/control/Control';
import type OlMap from 'ol/Map';

export function createButtonControl<M = OlMap>(
  options: ButtonControlOptions,
  map?: M,
): Control {
  const buttonOptions = { ...options };
  delete buttonOptions.addClass;
  return createControl(
    createButtonControlContent(buttonOptions),
    { bar: true, margin: options.margin, addClass: options.addClass },
    map,
  );
}
