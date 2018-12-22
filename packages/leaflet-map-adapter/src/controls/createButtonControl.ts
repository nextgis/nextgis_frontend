import { CreateButtonControlOptions } from '@nextgis/webmap';
import { createControl } from './createControl';
import { DomEvent } from 'leaflet';

export function createButtonControl(options: CreateButtonControlOptions) {
  const link = document.createElement('a');

  link.href = '#';
  link.title = options.title;

  link.setAttribute('role', 'button');
  link.setAttribute('aria-label', options.title);

  DomEvent.disableClickPropagation(link);
  DomEvent.on(link, 'click', DomEvent.stop);

  if (options.html instanceof HTMLElement) {
    link.appendChild(options.html);
  } else {
    link.innerHTML = options.html;
  }

  const onClick = (e: Event) => {
    e.stopPropagation();
    options.onClick();
  };
  if (options.onClick) {
    link.addEventListener('click', onClick);
  }

  return createControl({
    onAdd() {
      return link;
    },
    onRemove() {
      const parent = link.parentNode;
      if (parent) {
        parent.removeChild(link);
      }
      if (options.onClick) {
        link.removeEventListener('click', onClick);
      }
    }
  }, { bar: true });
}
