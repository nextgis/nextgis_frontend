import { CreateButtonControlOptions } from '@nextgis/webmap';
import { createControl } from './createControl';

export function createButtonControl(options: CreateButtonControlOptions) {
  const link = document.createElement('button');
  link.className = 'mapboxgl-ctrl-icon';
  link.title = options.title;

  link.setAttribute('role', 'button');
  link.setAttribute('aria-label', options.title);

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
  }, { bar: true, addClass: 'mapboxgl-ctrl-group' });
}
