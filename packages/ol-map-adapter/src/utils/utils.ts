import GeoJSON from 'ol/format/GeoJSON';

import type { Feature } from 'geojson';
import type OlFeature from 'ol/Feature';
import type RenderFeature from 'ol/render/Feature';

export function getFeature(feature: OlFeature<any> | RenderFeature): Feature {
  const geojson = new GeoJSON();
  // @ts-expect-error writeFeatureObject return JSON type, need Feature
  return geojson.writeFeatureObject(feature, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  });
}

export function queryToObject(str: string): Record<string, any> {
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
      if (typeof ret[name] === 'string') {
        // inline'd type check
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

export function objectToQuery(
  obj: { [x: string]: any },
  prefix?: string,
): string {
  const str = [];
  let p;
  for (p in obj) {
    const k = prefix ? prefix + '[' + p + ']' : p;
    const v = obj[p];
    str.push(
      v !== null && typeof v === 'object'
        ? objectToQuery(v, k)
        : encodeURIComponent(k) + '=' + encodeURIComponent(v),
    );
  }
  return str.join('&');
}
