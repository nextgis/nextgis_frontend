import { ButtonControlOptions, MapAdapter } from '@nextgis/webmap';
import { createControl } from './createControl';
import { DomEvent, Control } from 'leaflet';

export function createButtonControl(options: ButtonControlOptions, map: MapAdapter): Control {
  const link = document.createElement('a');

  const title = options.title || '';
  link.href = '#';
  link.title = title;

  link.setAttribute('role', 'button');
  link.setAttribute('aria-label', title);

  DomEvent.disableClickPropagation(link);
  DomEvent.on(link, 'click', DomEvent.stop);

  if (options.html instanceof HTMLElement) {
    link.appendChild(options.html);
  } else if (typeof options.html === 'string') {
    link.innerHTML = options.html;
  }

  const onClick = (e: Event) => {
    e.stopPropagation();
    options.onClick();
  };

  return createControl(
    {
      onAdd() {
        if (options.onClick !== undefined) {
          link.addEventListener('click', onClick);
        }
        return link;
      },
      onRemove() {
        const parent = link.parentNode;
        if (parent) {
          parent.removeChild(link);
        }
        if (options.onClick !== undefined) {
          link.removeEventListener('click', onClick);
        }
      },
    },
    { bar: true },
    map
  );
}
