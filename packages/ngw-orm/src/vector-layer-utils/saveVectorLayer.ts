import { FEATURE_REQUEST_PARAMS } from '@nextgis/ngw-kit';

import { vectorResourceToNgw } from './vectorResourceToNgw';

import type { Connection } from '../connection/Connection';

import type { VectorResourceToNgwOptions } from './vectorResourceToNgw';

export async function saveVectorLayer(
  opt: VectorResourceToNgwOptions,
  connection: Connection,
): Promise<{ id: number }[]> {
  const features = vectorResourceToNgw(opt);
  const resp = await connection.driver
    .route('feature_layer.feature.collection', {
      id: opt.resource.resource.id,
    })
    .patch({
      // @ts-expect-error TODO: update api
      json: features,
      query: FEATURE_REQUEST_PARAMS,
    });

  opt.items.forEach((x, i) => {
    x.id = resp[i].id;
  });
  return resp;
}
