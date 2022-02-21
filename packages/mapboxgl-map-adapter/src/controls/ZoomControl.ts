import { NavigationControl } from 'maplibre-gl';
import type { ZoomControlOptions } from '@nextgis/webmap';

export class ZoomControl extends NavigationControl {
  options = {} as ZoomControlOptions & any;

  constructor(options: ZoomControlOptions & any = {}) {
    super({ ...options, showCompass: false });
  }
}
