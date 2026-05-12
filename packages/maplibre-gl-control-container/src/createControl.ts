import {
  createControlElement,
  resolveControlOptions,
  setControlOptions,
} from '@nextgis/control-container';

import type {
  CreateControlOptions,
  MapControl,
} from '@nextgis/control-container';
import type {
  ControlPosition,
  IControl,
  Map as MaplibreMap,
} from 'maplibre-gl';

export function createControl<M = MaplibreMap>(
  control: MapControl<M | MaplibreMap>,
  options: CreateControlOptions = {},
  map?: M,
): IControl {
  const resolvedOptions = resolveControlOptions(options);
  class Control implements IControl {
    private _container?: HTMLElement;
    private _map?: MaplibreMap;

    getDefaultPosition(): ControlPosition {
      return 'top-left';
    }

    getContainer(): HTMLElement | undefined {
      return this._container;
    }

    onAdd(maplibreMap: MaplibreMap): HTMLElement {
      this._map = maplibreMap;
      const addClass = [
        'maplibregl-ctrl',
        resolvedOptions.bar ? 'maplibregl-bar maplibregl-ctrl-group' : '',
        resolvedOptions.addClass,
      ]
        .filter(Boolean)
        .join(' ');
      const element = createControlElement(
        control,
        { ...resolvedOptions, addClass },
        map ?? maplibreMap,
      );
      if (!resolvedOptions.margin) {
        element.style.margin = '0px';
      }
      this._container = element;
      return this._container;
    }

    onRemove(maplibreMap: MaplibreMap): void {
      if (this._container) {
        const parent = this._container.parentNode;
        if (parent) {
          parent.removeChild(this._container);
        }
      }
      control.onRemove(map ?? maplibreMap);
    }

    remove(): void {
      if (this._map) {
        this.onRemove(this._map);
      }
    }
  }

  const instance = new Control();
  setControlOptions(instance, resolvedOptions);
  return instance;
}
