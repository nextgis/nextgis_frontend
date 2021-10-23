import { IControl } from 'maplibre-gl';
import { MapControl, CreateControlOptions } from '@nextgis/webmap';

export function createControl(
  control: MapControl,
  options: CreateControlOptions = {},
): IControl {
  class Control implements IControl {
    private _container?: HTMLElement;

    getDefaultPosition() {
      return 'top-left';
    }

    onAdd() {
      const element = document.createElement('div');
      const content = control.onAdd();
      element.classList.add('maplibregl-ctrl');
      if (options.bar) {
        // add custom css for boarder style
        element.classList.add('maplibregl-bar');
        element.classList.add('maplibregl-ctrl-group');
      }
      if (options.addClass) {
        element.classList.add(options.addClass);
      }
      if (content) {
        element.appendChild(content);
      }
      this._container = element;
      return this._container;
    }

    onRemove() {
      if (this._container) {
        const parent = this._container.parentNode;
        if (parent) {
          parent.removeChild(this._container);
        }
      }
      return control.onRemove();
    }

    remove() {
      this.onRemove();
    }
  }

  return new Control();
  // return control;
}
