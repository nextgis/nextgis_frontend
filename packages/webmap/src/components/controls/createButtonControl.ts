import { WebMap } from '../../WebMap';
import { ButtonControlOptions } from '../../interfaces/MapControl';

/**
 * @param webMap - WebMap instance
 * @param options
 * @internal
 */
export function createButtonControl(
  webMap: WebMap,
  options: ButtonControlOptions
): any {
  if (webMap.mapAdapter.createButtonControl) {
    return webMap.mapAdapter.createButtonControl(options);
  }
}
