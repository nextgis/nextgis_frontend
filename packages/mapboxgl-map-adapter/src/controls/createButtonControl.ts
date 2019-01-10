import { CreateButtonControlOptions } from '@nextgis/webmap';
import { createControl } from './createControl';

export function createButtonControl(options: CreateButtonControlOptions) {
  const link = document.createElement('button');
  link.className = 'mapboxgl-ctrl-icon';

  link.setAttribute('role', 'button');
  if (options.title) {
    link.title = options.title;
    link.setAttribute('aria-label', options.title);
  }

  if (options.html) {
    if (options.html instanceof HTMLElement) {
      link.appendChild(options.html);
    } else {
      link.innerHTML = options.html;
    }
  }
  if (options.addClass) {
    options.addClass.split(' ').forEach((x) => link.classList.add(x));
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
