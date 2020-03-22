/**
 * @module qms-kit
 */
import { LayerAdaptersOptions, AdapterOptions } from '@nextgis/webmap';

import { QmsBasemap, QmsLayerType } from '../interfaces';

export const alias: { [key in QmsLayerType]: keyof LayerAdaptersOptions } = {
  tms: 'TILE',
};

export function updateQmsOptions(
  qms: QmsBasemap
): AdapterOptions & { url: string } {
  const protocol = (location.protocol === 'https:' ? 'https' : 'http') + '://';
  const serviceUrl = qms.url.replace(/^(https?|ftp):\/\//, protocol);
  return {
    url: serviceUrl,
    name: qms.name,
    attribution: qms.copyright_text,
    maxZoom: qms.z_max,
    minZoom: qms.z_min,
  };
}
