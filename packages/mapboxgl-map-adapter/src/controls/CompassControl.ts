import { NavigationControl } from 'maplibre-gl';

export class CompassControl extends NavigationControl {
  constructor(options = {}) {
    options = Object.assign({}, options, { showZoom: false });
    super(options);
  }
}
