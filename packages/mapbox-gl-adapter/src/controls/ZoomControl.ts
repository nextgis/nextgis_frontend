import { NavigationControl } from 'mapbox-gl';

export class ZoomControl extends NavigationControl {
  constructor(options = {}) {
    options = Object.assign({}, options, { showCompass: false });
    super(options);
  }
}
