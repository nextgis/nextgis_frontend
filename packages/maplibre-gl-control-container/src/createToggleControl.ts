import { createToggleControlContent } from '@nextgis/control-container';

import { createControl } from './createControl';

import type {
  ToggleControl,
  ToggleControlOptions,
} from '@nextgis/control-container';
import type { IControl, Map as MaplibreMap } from 'maplibre-gl';

export function createToggleControl<M = MaplibreMap>(
  options: ToggleControlOptions,
  map?: M,
): IControl & ToggleControl {
  const toggleContent = createToggleControlContent(options);
  const control = createControl<M>(
    toggleContent,
    { bar: true, margin: options.margin },
    map,
  ) as IControl & ToggleControl;
  control.onClick = toggleContent.onClick;
  control.changeStatus = toggleContent.changeStatus;
  control.getStatus = toggleContent.getStatus;
  control.switch = toggleContent.switch;
  Object.defineProperty(control, 'disableOnSecondClick', {
    configurable: true,
    get: () => toggleContent.disableOnSecondClick,
    set: (value) => {
      toggleContent.disableOnSecondClick = value;
    },
  });
  control.onStatusChange = toggleContent.onStatusChange;
  return control;
}
