import { LayerAdapter, ImageAdapterOptions } from '@nextgis/webmap';
import ImageWMS from 'ol/source/ImageWMS';
import ImageLayer from 'ol/layer/Image';

let ID = 1;

export class ImageAdapter implements LayerAdapter {

  name: string;
  layer: any;

  addLayer(options?: ImageAdapterOptions) {

    this.name = options.id || 'image-' + ID++;

    const imageOptions: any = {
      url: options.url,
      params: {
        resource: options.resourceId || options.id,
      },
      ratio: 1,
    };

    if (options.updateWmsParams) {
      imageOptions.imageLoadFunction = (image, src) => {
        const url = src.split('?')[0];
        const query = src.split('?')[1];
        const { resource, BBOX, WIDTH, HEIGHT } = queryToObject(query);
        const queryString = objectToQuery(options.updateWmsParams({
          resource,
          bbox: BBOX,
          width: WIDTH,
          height: HEIGHT
        }));
        image.getImage().src = url + '?' + queryString;

        // image.getImage().src = url
        //   + '?resource=' + queryObject.resource
        //   + '&extent=' + queryObject.BBOX
        //   + '&size=' + queryObject.WIDTH + ',' + queryObject.HEIGHT
        //   + '#' + Date.now(); // in-memory cachтe busting
      };
    }

    const source = new ImageWMS(imageOptions);

    const layer = new ImageLayer({ source });
    this.layer = layer;
    return layer;
  }
}

// TODO: move to utils or rewrite with native js methods
function queryToObject(str: string) {

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

function objectToQuery(obj: object, prefix?: string): string {
  const str = [];
  let p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? prefix + '[' + p + ']' : p;
      const v = obj[p];
      str.push((v !== null && typeof v === 'object') ?
        objectToQuery(v, k) :
        encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
  }
  return str.join('&');
}
