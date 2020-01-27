import {
  VectorAdapterLayerPaint,
  GetPaintCallback,
  GeometryPaint,
  VectorAdapterLayerType
} from '@nextgis/webmap';
import GeoJSON from 'ol/format/GeoJSON';
import CircleStyle from 'ol/style/Circle';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { Options as TextOptions } from 'ol/style/Text';
import Icon, { Options as IconOptions } from 'ol/style/Icon';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';

import { asArray, Color } from 'ol/color';
import { Feature } from 'geojson';

import * as ol from 'ol';

type OlStyle = Style | Style[];

const typeAlias: { [x: string]: VectorAdapterLayerType } = {
  Point: 'circle',
  MultiPoint: 'circle',
  LineString: 'line',
  MultiLineString: 'line',
  Polygon: 'fill',
  MultiPolygon: 'fill',
  Circle: 'circle'
};

export function getFeature(feature: ol.Feature): Feature {
  const geojson = new GeoJSON();
  // @ts-ignore writeFeatureObject return JSON type, need Feature
  return geojson.writeFeatureObject(feature, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });
}

export function getColor(colorStr: string, opacity?: number): Color {
  const color = asArray(colorStr);
  const colorArray = color.slice() as [number, number, number, number];
  colorArray[3] = opacity !== undefined ? opacity : 1;
  return colorArray;
}

export function styleFunction(
  feature: ol.Feature,
  paint: VectorAdapterLayerPaint | GetPaintCallback = {}
): Style {
  if (typeof paint === 'function') {
    const f: Feature = getFeature(feature);
    return styleFunction(feature, paint(f));
  } else {
    const geometry = feature.getGeometry();
    const geomType = geometry && geometry.getType();
    const type = geomType || 'Point';
    const style: { stroke?: Stroke; fill?: Fill; image?: any } = {};
    const _type = paint.type;
    if (!_type) {
      const ta = typeAlias[type];
      paint.type =
        ta === 'fill' || ta === 'line'
          ? 'path'
          : 'html' in paint || 'className' in paint
          ? 'icon'
          : ta;
    }
    if (paint.type === 'path' || paint.type === 'circle') {
      // const geomPaint = ;
      const {
        radius,
        fill,
        fillColor,
        fillOpacity,
        strokeColor,
        stroke,
        strokeOpacity
      } = {
        ...paint
      } as GeometryPaint;

      if (fill && fillColor) {
        style.fill = new Fill({
          color: getColor(fillColor, fillOpacity)
        });
      }
      if (
        strokeColor &&
        (stroke || ['MultiLineString', 'LineString'].indexOf(type) !== -1)
      ) {
        style.stroke = new Stroke({
          // @ts-ignore
          width: paint.weight,
          color: getColor(strokeColor, strokeOpacity)
        });
      }

      if (paint.type === 'circle' && radius) {
        style.image = new CircleStyle({ radius, ...style });
      }
    } else if (paint.type === 'icon') {
      const svg = paint.html;
      if (svg) {
        const iconOptions: IconOptions = {
          src: 'data:image/svg+xml,' + escape(svg),
          anchorXUnits: IconAnchorUnits.PIXELS,
          anchorYUnits: IconAnchorUnits.PIXELS,
          anchor: paint.iconAnchor,
          imgSize: paint.iconSize
        };
        style.image = new Icon(iconOptions);
      }
    }
    return new Style(style);
  }
}

export function labelStyleFunction(type: VectorAdapterLayerType) {
  let options: TextOptions = {
    font: '12px Calibri,sans-serif',
    overflow: true,
    fill: new Fill({
      color: '#000'
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 3
    })
  };
  if (type === 'circle') {
    options = {
      ...options,
      placement: 'point',
      textBaseline: 'bottom',
      offsetY: 20
    };
  }
  return new Style({
    text: new Text(options)
  });
}

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
  prefix?: string
): string {
  const str = [];
  let p;
  for (p in obj) {
    const k = prefix ? prefix + '[' + p + ']' : p;
    const v = obj[p];
    str.push(
      v !== null && typeof v === 'object'
        ? objectToQuery(v, k)
        : encodeURIComponent(k) + '=' + encodeURIComponent(v)
    );
  }
  return str.join('&');
}
