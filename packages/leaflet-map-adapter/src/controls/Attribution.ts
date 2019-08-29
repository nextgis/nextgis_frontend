/**
 * @module leaflet-map-adapter
 */
import { Control, ControlOptions } from 'leaflet';
import { AttributionControlOptions } from '@nextgis/webmap';

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
      attributions.forEach(x => this.addAttribution(x));
    }
  }
}
