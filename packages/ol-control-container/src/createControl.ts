import {
  createControlElement,
  setControlOptions,
} from '@nextgis/control-container';
import Control from 'ol/control/Control';

import type {
  CreateControlOptions,
  MapControl,
} from '@nextgis/control-container';
import type OlMap from 'ol/Map';

export function createControl<M = OlMap>(
  control: MapControl<M | OlMap>,
  options: CreateControlOptions = {},
  map?: M,
): Control {
  class NewControl extends Control {
    constructor() {
      const addClass = ['ol-unselectable', options.addClass]
        .filter(Boolean)
        .join(' ');
      const element = createControlElement(
        control,
        { ...options, addClass },
        map,
      );
      super({ element });
    }

    setMap(map_: OlMap | null): void {
      const currentMap = this.getMap();
      super.setMap(map_);
      if (currentMap && !map_) {
        control.onRemove(map ?? currentMap);
      }
    }
  }

  const instance = new NewControl();
  setControlOptions(instance, options);
  return instance;
}
