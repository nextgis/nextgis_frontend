import { LayerAdaptersOptions, AdapterOptions } from '@nextgis/webmap';
import { fixUrlStr } from '@nextgis/utils';
import { QmsBasemap, QmsLayerType } from '../interfaces';

export const alias: { [key in QmsLayerType]: keyof LayerAdaptersOptions } = {
  tms: 'TILE'
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
    minZoom: qms.z_min
  };
}

export function loadJSON<T = any>(url: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        if (xmlHttp.responseText) {
          try {
            resolve(JSON.parse(xmlHttp.responseText));
          } catch (er) {
            reject(er);
          }
        }
      }
    };
    xmlHttp.open('GET', fixUrlStr(url), true); // true for asynchronous
    xmlHttp.send();
  });
}
