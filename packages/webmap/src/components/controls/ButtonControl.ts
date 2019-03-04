import { WebMap } from '../../WebMap';
import { ButtonControlOptions } from '../../interfaces/MapControl';

export function createButtonControl(webMap: WebMap, options: ButtonControlOptions) {
  if (webMap.mapAdapter.createButtonControl) {
    return webMap.mapAdapter.createButtonControl(options);
  }
}
