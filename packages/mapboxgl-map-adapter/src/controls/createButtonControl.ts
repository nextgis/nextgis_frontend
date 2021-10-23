import { IControl } from 'maplibre-gl';
import { ButtonControlOptions } from '@nextgis/webmap';
import { createControl } from './createControl';

export function createButtonControl(options: ButtonControlOptions): IControl {
  const link = document.createElement('button');
  link.className = 'maplibregl-ctrl-icon';

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
    const child = link.firstElementChild as HTMLElement;
    if (child) {
      child.style.width = '100%';
      child.style.height = '100%';
      child.style.lineHeight = (link.offsetHeight || 30) + 'px';
    }
  }
  if (options.addClass) {
    options.addClass.split(' ').forEach((x) => link.classList.add(x));
  }

  const onClick = (e: Event) => {
    e.stopPropagation();
    options.onClick();
  };
  if (options.onClick !== undefined) {
    link.addEventListener('click', onClick);
  }

  return createControl(
    {
      onAdd() {
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
    { bar: true, addClass: 'maplibregl-ctrl-group' },
  );
}
