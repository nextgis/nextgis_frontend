import { MapControl } from '@nextgis/webmap';
import { IControl, Map } from 'mapbox-gl';

export function createControl(control: MapControl, options?): IControl {

  class Control implements IControl {
    getDefaultPosition() {
      return 'top-left';
    }

    onAdd(map: Map) {
      const element: HTMLElement = control.onAdd(map);
      element.classList.add('mapboxgl-ctrl');
      return element;
    }

    onRemove() {
      return control.onRemove();
    }
  }

  return new Control();
  // return control;
}
