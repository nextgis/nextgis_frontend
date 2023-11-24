import type { MapAdapter } from '@nextgis/webmap';

export interface ControlContainerOptions {
  target?: string;
  classPrefix?: string;
  addClass?: string;
  map?: MapAdapter;
}
