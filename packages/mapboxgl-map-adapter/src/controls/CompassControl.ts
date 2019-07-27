import { NavigationControl } from 'mapbox-gl';

export class CompassControl extends NavigationControl {
  constructor(options = {}) {
    options = Object.assign({}, options, { showZoom: false });
    super(options);
  }
}
