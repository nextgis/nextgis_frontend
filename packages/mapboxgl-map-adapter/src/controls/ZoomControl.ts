import { NavigationControl } from 'maplibre-gl';
import type { ZoomControlOptions } from '@nextgis/webmap';

const N = NavigationControl;

export function zoomControl(options = {} as ZoomControlOptions & any) {
  console.log(N);
  return class ZoomControl extends N {};
}
