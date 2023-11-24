import { Control } from 'leaflet';

import type { AttributionControlOptions } from '@nextgis/webmap';
import type { ControlOptions } from 'leaflet';

export class AttributionControl extends Control.Attribution {
  // options: AttributionControlOptions
  constructor(options: AttributionControlOptions & ControlOptions) {
    super(options);
    const customAttribution = options && options.customAttribution;
    if (customAttribution) {
      let attributions: string[] = [];
      if (Array.isArray(customAttribution)) {
        attributions = customAttribution;
      } else if (customAttribution) {
        attributions = [customAttribution];
      }
      attributions.forEach((x) => this.addAttribution(x));
    }
  }
}
