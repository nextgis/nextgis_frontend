import Attr from 'ol/control/Attribution';
import { AttributionControlOptions } from '@nextgis/webmap';

const OPTIONS = {
  collapsible: false
};

export class Attribution extends Attr {
  constructor(options: AttributionControlOptions) {
    super({ ...OPTIONS, ...options });
  }
}
