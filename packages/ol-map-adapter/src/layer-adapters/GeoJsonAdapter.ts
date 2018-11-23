import { LayerAdapter, GeoJsonAdapterOptions } from '@nextgis/webmap';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';

let ID = 1;

export class GeoJsonAdapter implements LayerAdapter {

  name: string;

  addLayer(options?: GeoJsonAdapterOptions) {

    this.name = options.id || 'geojson-' + ID++;

    const features = (new GeoJSON()).readFeatures(options.data, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });

    const vectorSource = new VectorSource({
      features
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (f) => styleFunction(f, options.paint)
    });
    // this.layer = vectorLayer;
    return vectorLayer;
  }

}

const getImage = (paint) => {
  return new CircleStyle({ ...paint, stroke: new Stroke(paint), fill: new Fill(paint), });
};

// const styles = {
//   'Point': (paint) => {
//     return new Style({
//       image: getImage(paint)
//     });
//   },
//   'LineString': (paint) => new Style({
//     stroke: new Stroke(paint)
//   }),
//   'MultiLineString': (paint) => new Style({
//     stroke: new Stroke(paint)
//   }),
//   'MultiPoint': (paint) => {
//     return new Style({
//       image: getImage(paint)
//     });
//   },
//   'MultiPolygon': (paint) => new Style({
//     stroke: new Stroke(paint),
//     fill: new Fill(paint)
//   }),
//   'Polygon': (paint) => new Style({
//     stroke: new Stroke(paint),
//     fill: new Fill(paint)
//   }),
//   'GeometryCollection': (paint) => new Style({
//     stroke: new Stroke(paint),
//     fill: new Fill(paint),
//     image: getImage(paint)
//   }),
//   'Circle': (paint) => new Style({
//     stroke: new Stroke(paint),
//     fill: new Fill(paint)
//   }),
// };

function styleFunction(feature, paint) {
  const type = feature.getGeometry().getType();
  const style: {stroke?, fill, image} = {
    fill: new Fill(paint),
    image: getImage(paint)
  };
  if (paint.stroke || ['MultiLineString', 'LineString'].indexOf(type) !== -1) {
    style.stroke = new Stroke(paint);
  }
  return new Style(style);
}
