import { LayerAdapter } from '@nextgis/webmap';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import {Vector as VectorLayer} from 'ol/layer';
import {Icon, Style} from 'ol/style.js';
import VectorSource from 'ol/source/Vector';

let ID = 1;

export class MarkerAdapter implements LayerAdapter {

  name: string;

  addLayer(options?) {

    this.name = options.id || 'marker-' + ID++;

    const {lat, lng} = options.latLng;

    const point = new Feature({
      geometry: new Point(fromLonLat([lng, lat])),
     });

    // const icon = new Icon({
    //   color: '#4271AE',
    //   crossOrigin: 'anonymous',
    //   // src: 'data/dot.png'
    // });

    // point.setStyle(new Style({
    //   image: icon
    // }));

    const source = new VectorSource({
      features: [point],
    });

    const layer = new VectorLayer({
      source,
    });

    return layer;
  }
}
