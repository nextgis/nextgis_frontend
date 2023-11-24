import { FEATURE_REQUEST_PARAMS } from '@nextgis/ngw-kit';
import type { Connection } from '../connection/Connection';
import type { VectorResourceToNgwOptions } from './vectorResourceToNgw';
import { vectorResourceToNgw } from './vectorResourceToNgw';

export function saveVectorLayer(
  opt: VectorResourceToNgwOptions,
  connection: Connection,
): Promise<{ id: number }[]> {
  const features = vectorResourceToNgw(opt);

  return connection.driver
    .patch(
      'feature_layer.feature.collection',
      { data: features },
      { id: opt.resource.resource.id, ...FEATURE_REQUEST_PARAMS },
    )
    .then((resp) => {
      opt.items.forEach((x, i) => {
        x.id = resp[i].id;
      });
      return resp;
    });
}
