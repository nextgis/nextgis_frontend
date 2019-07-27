import { FeatureLayersIdentify, NgwConnector } from '@nextgis/ngw-connector';
import { getNgwLayerFeature } from './featureLayerUtils';

export function getIdentifyGeoJson(options: {
  identify: FeatureLayersIdentify;
  connector: NgwConnector;
  multiple?: boolean;
}) {

  const { identify, connector } = options;
  let params: { resourceId: number; featureId: number } | undefined;
  for (const l in identify) {
    if (l !== 'featureCount') {
      const layerFeatures = identify[l].features;
      const resourceId = Number(l);
      const f = layerFeatures[0];
      if (f) {
        // select only one feature from first layer
        params = {
          featureId: f.id,
          resourceId
        };
        break;
      }

    }
  }
  if (params) {
    return getNgwLayerFeature({ connector, ...params });
  }
}
