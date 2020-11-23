import { FeatureItem } from '@nextgis/ngw-connector';
import { FeatureRequestParams } from '../../interfaces';

export function extensionsAllowedDevHelper(
  resp: FeatureItem,
  params: FeatureRequestParams
): void {
  const extensions = params.extensions;
  if (__DEV__ && !extensions) {
    Object.defineProperty(resp, 'extensions', {
      get: () => {
        console.warn(
          `you are trying to get extensions, but haven't set the appropriate request option`
        );
        return extensions;
      },
    });
  }
}
