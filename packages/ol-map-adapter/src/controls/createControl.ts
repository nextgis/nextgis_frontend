import Control from 'ol/control/Control';
import type { MapControl, CreateControlOptions, MapAdapter } from '@nextgis/webmap';

export function createControl(
  control: MapControl,
  options: CreateControlOptions = {},
  map: MapAdapter
): Control {
  const newControl = (function (C) {
    function NewControl(this: Control) {
      const element = document.createElement('div');
      element.className =
        (options.addClass ? options.addClass + ' ' : '') +
        'ol-unselectable' +
        (options.bar ? ' webmap-ctrl-group' : '') +
        (options.margin ? ' ol-control-margin' : '');
      const content = control.onAdd(map);
      if (content) {
        element.appendChild(content);
      }

      C.call(this, {
        element,
      });
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
  // return control;
}
