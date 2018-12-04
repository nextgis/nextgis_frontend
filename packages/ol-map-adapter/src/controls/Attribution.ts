import Attr from 'ol/control/Attribution';

const OPTIONS = {
  collapsible: false
};

export class Attribution extends Attr {
  constructor(options) {
    super({ ...OPTIONS, ...options });
  }
}
