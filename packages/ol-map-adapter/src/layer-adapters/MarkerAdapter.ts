import { BaseLayerAdapter, MarkerAdapterOptions } from '@nextgis/webmap';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
// @ts-ignore
import { fromLonLat } from 'ol/proj';

export class MarkerAdapter implements BaseLayerAdapter {

  layer?: VectorLayer;

  addLayer(options: MarkerAdapterOptions) {

    const { lat, lng } = options.latLng;

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
