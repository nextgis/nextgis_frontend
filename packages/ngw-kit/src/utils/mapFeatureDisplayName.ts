import type NgwConnector from '@nextgis/ngw-connector';
import type { ResourceDefinition } from '@nextgis/ngw-connector';

export interface MapFeatureDisplayNameOptions {
  connector: NgwConnector;
  resource: ResourceDefinition;
  fields: string[];
}

export async function mapFeatureDisplayName({
  connector,
  resource,
  fields,
}: MapFeatureDisplayNameOptions): Promise<string[]> {
  return connector.getResource(resource).then((res) => {
    const featureLayer = res && res.feature_layer;
    if (featureLayer) {
      return fields.map((x) => {
        const alias = featureLayer.fields.find((y) => y.keyname === x);
        return alias ? alias.display_name : x;
      });
    }
    return fields;
  });
}
