import { Control } from 'leaflet';
// import { AttributionControlOptions } from '@nextgis/webmap';

export class AttributionControl extends Control.Attribution {

  // options: AttributionControlOptions
  constructor(options) {
    super(options);
    if (options.customAttribution) {
      const attributions = [].concat(options.customAttribution);
      attributions.forEach((x) => this.addAttribution(x));
    }
  }

}
