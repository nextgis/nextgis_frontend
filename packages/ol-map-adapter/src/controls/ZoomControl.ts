import Zoom from 'ol/control/Zoom';

import './ZoomControl.css';

export class ZoomControl extends Zoom {
  constructor(...args: any[]) {
    super(...args);
    this.element.classList.remove('ol-control');
    this.element.classList.add('webmap-ctrl-group');
  }
}
