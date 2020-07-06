import { Connection } from '../connection/Connection';
import {
  vectorResourceToNgw,
  VectorResourceToNgwOptions,
} from './vectorResourceToNgw';

export function saveVectorLayer(
  opt: VectorResourceToNgwOptions,
  connection: Connection
): Promise<{ id: number }[]> {
  const features = vectorResourceToNgw(opt);

  return connection.driver
    .patch(
      'feature_layer.feature.collection',
      { data: features },
      { id: opt.resource.resource.id }
    )
    .then((resp) => {
      opt.items.forEach((x, i) => {
        x.id = resp[i].id;
      });
      return resp;
    });
}
