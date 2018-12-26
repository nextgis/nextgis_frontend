import { CreateButtonControlOptions } from '@nextgis/webmap';
import Control from 'ol/control/Control';

export function createButtonControl(options: CreateButtonControlOptions): Control {

  const newControl = (function (C) {

    function NewControl() {

      const button = document.createElement('button');
      if (typeof options.html === 'string') {
      button.innerHTML = options.html;
      } else {
        button.appendChild(options.html);
      }

      const element = document.createElement('div');
      element.className = (options.addClass ? options.addClass + ' ' : '') + 'ol-unselectable ol-control';
      element.appendChild(button);

      C.call(this, {
        element,
      });

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
  }(Control));

  return new newControl();

}
