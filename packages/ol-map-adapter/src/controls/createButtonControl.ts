import './createButtonControl.css';

import Control from 'ol/control/Control';
import type { ButtonControlOptions } from '@nextgis/webmap';

export function createButtonControl(options: ButtonControlOptions): Control {
  const newControl = (function (C) {
    function NewControl(this: Control) {
      const button = document.createElement('button');
      button.className = 'custom-button-control';
      if (typeof options.html === 'string') {
        button.innerHTML = options.html;
      } else if (options.html) {
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

      C.call(this, { element });

      button.addEventListener('click', () => options.onClick(), false);
    }

    if (C) {
      NewControl.__proto__ = C;
    }
    NewControl.prototype = Object.create(Control && Control.prototype);
    NewControl.prototype.constructor = NewControl;

    NewControl.prototype.handleRotateNorth = function handleRotateNorth() {
      this.getMap().getView().setRotation(0);
    };

    return NewControl;
  })(Control);

  // @ts-ignore
  return new newControl();
}
