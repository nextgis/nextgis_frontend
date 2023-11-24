import type { QmsBasemap, QmsLayerType } from '../interfaces';
import type { AdapterOptions, LayerAdaptersOptions } from '@nextgis/webmap';

export const alias: { [key in QmsLayerType]: keyof LayerAdaptersOptions } = {
  tms: 'TILE',
};

export function updateQmsOptions(
  qms: QmsBasemap,
): AdapterOptions & { url: string } {
  const protocol = (location.protocol === 'https:' ? 'https' : 'http') + '://';
  let serviceUrl = qms.url.replace(/^(https?|ftp):\/\//, protocol);
  if (!qms.y_origin_top) {
    serviceUrl = serviceUrl.replace('{y}', '{-y}');
  }
  return {
    url: serviceUrl,
    name: qms.name,
    attribution: qms.copyright_text,
    maxZoom: qms.z_max,
    minZoom: qms.z_min,
  };
}
