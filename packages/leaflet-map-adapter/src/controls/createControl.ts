import { Control, DomEvent } from 'leaflet';
import type {
  MapControl,
  CreateControlOptions,
  MapAdapter,
} from '@nextgis/webmap';

export function createControl(
  control: MapControl,
  options: CreateControlOptions = {},
  map: MapAdapter,
): Control {
  const C = Control.extend({
    onAdd() {
      const element = document.createElement('div');
      const content = control.onAdd(map);
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
