import { LayerAdapter } from '@nextgis/webmap';
import ImageWMS from 'ol/source/ImageWMS';
import ImageLayer from 'ol/layer/Image';

let ID = 1;

export class ImageAdapter implements LayerAdapter {

  name: string;

  addLayer(options?) {

    this.name = options.id || 'image-' + ID++;
        // const options = {
    //   maxResolution: item.maxResolution ? item.maxResolution : undefined,
    //   minResolution: item.minResolution ? item.minResolution : undefined,
    //   visible: item.visibility,
    //   opacity: item.transparency ? (1 - item.transparency / 100) : 1.0,
    // };

    const source = new ImageWMS({
      url: options.url,
      params: {
        resource: options.layer_style_id,
      },
      ratio: 1,
      imageLoadFunction: (image, src) => {
        const url = src.split('?')[0];
        const query = src.split('?')[1];
        const queryObject = queryToObject(query);

        image.getImage().src = url
          + '?resource=' + queryObject.resource
          + '&extent=' + queryObject.BBOX
          + '&size=' + queryObject.WIDTH + ',' + queryObject.HEIGHT
          + '#' + Date.now(); // in-memory cache busting
      },
    });

    const layer = new ImageLayer({source});

    return layer;
  }
}

// TODO: move to utils or rewrite with native js methods
export function queryToObject(str: string) {

  const dec = decodeURIComponent;
  const qp = str.split('&');
  const ret: {[name: string]: any} = {};
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
