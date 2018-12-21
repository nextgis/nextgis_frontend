import { CreateButtonControlOptions } from 'packages/webmap/src';
import { createControl } from './createControl';

export function createButtonControl(options: CreateButtonControlOptions) {
  const element = document.createElement('a');
  element.setAttribute('role', 'button');
  if (options.html instanceof HTMLElement) {
    element.appendChild(options.html);
  } else {
    element.innerHTML = options.html;
  }

  const onClick = (e: Event) => {
    e.stopPropagation();
    options.onClick();
  };
  if (options.onClick) {
    element.setAttribute('href', '#');
    element.addEventListener('click', onClick);
  }

  return createControl({
    onAdd() {
      return element;
    },
    onRemove() {
      const parent = element.parentNode;
      if (parent) {
        parent.removeChild(element);
      }
      if (options.onClick) {
        element.removeEventListener('click', onClick);
      }
    }
  }, {bar: true});
}
