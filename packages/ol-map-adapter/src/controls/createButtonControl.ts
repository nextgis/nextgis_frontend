import './createButtonControl.css';
import Control from 'ol/control/Control';

import type { ButtonControlOptions } from '@nextgis/webmap';

export function createButtonControl(options: ButtonControlOptions): Control {
  class NewControl extends Control {
    constructor() {
      super({ element: createControlElement(options) });
      if (options.onClick) {
        this.element
          .querySelector('button')!
          .addEventListener('click', options.onClick, false);
      }
    }

    handleRotateNorth() {
      this.getMap()?.getView().setRotation(0);
    }
  }

  return new NewControl();
}

function createControlElement(options: ButtonControlOptions) {
  const button = document.createElement('button');
  button.className = 'custom-button-control';
  if (typeof options.html === 'string') {
    button.innerHTML = options.html;
  } else if (options.html instanceof HTMLElement) {
    button.appendChild(options.html);
  }
  if (typeof options.title === 'string') {
    button.title = options.title;
  }

  const element = document.createElement('div');
  element.className =
    (options.addClass ? options.addClass + ' ' : '') +
    'ol-unselectable webmap-ctrl-group';
  element.appendChild(button);

  return element;
}
