import { MapControl, CreateControlOptions } from '@nextgis/webmap';
import { Control } from 'leaflet';

export function createControl(control: MapControl, options: CreateControlOptions = {}): Control  {
  const C = Control.extend({
    onAdd () {
      const element = document.createElement('div');
      const content: HTMLElement = control.onAdd();
      element.classList.add('leaflet-control');
      if (options.bar) {
        element.classList.add('leaflet-bar');
      }
      element.appendChild(content);
      return element;
    },
    onRemove () {
      control.onRemove();
    }
  });
  return new C();
}
