import { MapControl, CreateControlOptions } from '@nextgis/webmap';
import { IControl, Map } from 'mapbox-gl';

export function createControl(control: MapControl, options: CreateControlOptions = {}): IControl {

  class Control implements IControl {
    getDefaultPosition() {
      return 'top-left';
    }

    onAdd(map: Map) {

      const element = document.createElement('div');
      const content: HTMLElement = control.onAdd();
      element.classList.add('mapboxgl-ctrl');
      if (options.bar) {
        // add custom css for boarder style
        element.classList.add('mapboxgl-bar');
      }
      if (options.addClass) {
        element.classList.add(options.addClass);
      }
      element.appendChild(content);

      return element;
    }

    onRemove() {
      return control.onRemove();
    }

    remove() {
      this.onRemove();
    }
  }

  return new Control();
  // return control;
}
