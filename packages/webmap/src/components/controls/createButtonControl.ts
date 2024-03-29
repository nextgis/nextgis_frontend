import type { WebMap } from '../../WebMap';
import type { ButtonControlOptions } from '../../interfaces/MapControl';

/**
 * @param webMap - WebMap instance
 * @internal
 */
export function createButtonControl(
  webMap: WebMap,
  options: ButtonControlOptions,
): any {
  if (webMap.mapAdapter.createButtonControl) {
    return webMap.mapAdapter.createButtonControl(options);
  }
}
