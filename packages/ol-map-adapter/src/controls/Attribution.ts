import Attr from 'ol/control/Attribution';

import type { AttributionControlOptions } from '@nextgis/webmap';
import type { Options as OlControlOptions } from 'ol/control/Attribution';

const OPTIONS: OlControlOptions = {
  collapsible: false,
};

export class Attribution extends Attr {
  constructor({ customAttribution, compact }: AttributionControlOptions = {}) {
    const newOptions: OlControlOptions = {};
    if (customAttribution) {
      newOptions.attributions = customAttribution;
    }
    if (compact) {
      newOptions.collapsible = true;
    }
    super({ ...OPTIONS, ...newOptions });
  }
}
