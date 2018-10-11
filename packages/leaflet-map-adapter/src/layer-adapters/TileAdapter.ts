import { LayerAdapter } from '@nextgis/webmap';
import { TileLayer } from 'leaflet';
import { BaseAdapter } from './BaseAdapter';

let ID = 1;

export class TileAdapter extends BaseAdapter implements LayerAdapter {

  name: string;

  addLayer(options?) {

    this.name = options.id || 'tile-' + ID++;
    const {url, ...opt} = options;
    const layer = new TileLayer(url, opt);

    // layer.addTo(this.map);

    return layer;
  }
}

// TODO: move to utils or rewrite with native js methods
export function queryToObject(str: string) {

  const dec = decodeURIComponent;
  const qp = str.split('&');
  const ret: { [name: string]: any } = {};
  let name;
  let val;
  for (let i = 0, l = qp.length, item; i < l; ++i) {
    item = qp[i];
    if (item.length) {
      const s = item.indexOf('=');
      if (s < 0) {
        name = dec(item);
        val = '';
      } else {
        name = dec(item.slice(0, s));
        val = dec(item.slice(s + 1));
      }
      if (typeof ret[name] === 'string') { // inline'd type check
        ret[name] = [ret[name]];
      }

      if (Array.isArray(ret[name])) {
        ret[name].push(val);
      } else {
        ret[name] = val;
      }
    }
  }
  return ret; // Object
}
