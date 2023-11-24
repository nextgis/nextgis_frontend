import { NavigationControl } from 'maplibre-gl';

import type { ZoomControlOptions } from '@nextgis/webmap';

export function ZoomControl(options: ZoomControlOptions) {
  return new NavigationControl({ ...options, showCompass: false });
}
