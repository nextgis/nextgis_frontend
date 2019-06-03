import { BaseLayerAdapter, ImageAdapterOptions } from '@nextgis/webmap';
import ImageWMS, { Options as ImageWMSOptions} from 'ol/source/ImageWMS';
import ImageLayer from 'ol/layer/Image';
import Map from 'ol/Map';

export class ImageAdapter implements BaseLayerAdapter {

  layer: any;

  constructor(public map: Map, public options: ImageAdapterOptions) { }

  addLayer(options: ImageAdapterOptions) {

    const imageOptions: ImageWMSOptions = {
      url: options.url,
      params: {
        resource: options.resourceId || options.id,
      },
      ratio: 1,
      projection: undefined
    };

    const updateWmsParams = options.updateWmsParams;
    if (updateWmsParams) {
      imageOptions.imageLoadFunction = (image, src) => {
        const url = src.split('?')[0];
        const query = src.split('?')[1];
        const { resource, BBOX, WIDTH, HEIGHT } = queryToObject(query);
        const queryString = objectToQuery(updateWmsParams({
          resource,
          bbox: BBOX,
          width: WIDTH,
          height: HEIGHT
        }));
        // @ts-ignore
        image.getImage().src = url + '?' + queryString;
      };
    }

    const source = new ImageWMS(imageOptions);

    const layer = new ImageLayer({ source });
    this.layer = layer;
    return layer;
  }
}

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

function objectToQuery(obj: { [x: string]: any }, prefix?: string): string {
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
