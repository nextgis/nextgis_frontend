import { QmsClient } from './QmsClient';
import { parseQmsExtent } from './utils';

import type { QmsExtent, QmsLayer, QmsRequestOptions } from './interfaces';

const serviceExtents = new Map<number, QmsExtent>();

export async function getQmsServiceExtent(
  id: number,
  options: QmsRequestOptions = {},
): Promise<QmsExtent | undefined> {
  const client = new QmsClient();
  const cachedExtent = serviceExtents.get(id);
  if (cachedExtent) {
    return cachedExtent;
  }
  const service = await client.getService(id, options);
  const extent = parseQmsExtent(service.extent);
  if (extent) {
    serviceExtents.set(id, extent);
  }
  return extent;
}

export async function resolveQmsLayer(
  id: number,
  options: QmsRequestOptions = {},
): Promise<QmsLayer> {
  const client = new QmsClient();
  const layer = await client.getLayer(id, options);
  if (layer.extent) {
    serviceExtents.set(id, layer.extent);
  }
  return layer;
}
