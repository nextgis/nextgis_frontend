import { MapControl, CreateControlOptions } from '@nextgis/webmap';
import { Control, DomEvent } from 'leaflet';

export function createControl(
  control: MapControl,
  options: CreateControlOptions = {},
): Control {
  const C = Control.extend({
    onAdd() {
      const element = document.createElement('div');
      const content = control.onAdd();
      element.classList.add('leaflet-control');
      if (options.bar) {
        element.classList.add('leaflet-bar');
      }
      if (!options.margin && !options.bar) {
        element.style.marginBottom = '0px';
        element.style.marginTop = '0px';
        element.style.marginLeft = '0px';
        element.style.marginRight = '0px';
      }
      if (content) {
        element.appendChild(content);
      }

      DomEvent.disableClickPropagation(element);

      return element;
    },
    onRemove() {
      control.onRemove();
    },
  });
  return new C();
}
