import GeoJSON from 'ol/format/GeoJSON';
import CircleStyle from 'ol/style/Circle';
import { asArray, Color } from 'ol/color';
import { Fill, Stroke, Style, Text } from 'ol/style';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import Icon from 'ol/style/Icon';
import { isPaintCallback, isPaint } from '@nextgis/paint';

import type { Feature } from 'geojson';
import type OlFeature from 'ol/Feature';
import type { Options as TextOptions } from 'ol/style/Text';
import type { Options as IconOptions } from 'ol/style/Icon';
import type {
  GeoJsonAdapterOptions,
  VectorAdapterLayerType,
} from '@nextgis/webmap';
import type { GeometryPaint, Paint, PaintType } from '@nextgis/paint';

const typeAlias: { [x: string]: VectorAdapterLayerType } = {
  Point: 'point',
  MultiPoint: 'point',
  LineString: 'line',
  MultiLineString: 'line',
  Polygon: 'polygon',
  MultiPolygon: 'polygon',
  Circle: 'point',
};

const paintTypeAlias: Record<VectorAdapterLayerType, PaintType> = {
  polygon: 'path',
  line: 'path',
  point: 'circle',
};

export function getFeature(feature: OlFeature<any>): Feature {
  const geojson = new GeoJSON();
  // @ts-ignore writeFeatureObject return JSON type, need Feature
  return geojson.writeFeatureObject(feature, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  });
}

export function getColor(colorStr: string, opacity?: number): Color {
  const color = asArray(colorStr);
  const colorArray = color.slice() as [number, number, number, number];
  colorArray[3] = opacity !== undefined ? opacity : 1;
  return colorArray;
}

export function styleFunction(
  feature: OlFeature<any>,
  paint: Paint = {},
): Style | undefined {
  if (isPaintCallback(paint)) {
    const f: Feature = getFeature(feature);
    return styleFunction(feature, paint(f));
  }
  if (isPaint(paint)) {
    const geometry = feature.getGeometry();
    const geomType = geometry && geometry.getType();
    const type = geomType || 'Point';
    const style: { stroke?: Stroke; fill?: Fill; image?: any } = {};
    const _type = paint.type;
    if (!_type) {
      const ta = typeAlias[type];
      paint.type =
        ta === 'polygon' || ta === 'line'
          ? 'path'
          : 'html' in paint || 'className' in paint
          ? 'icon'
          : paintTypeAlias[ta];
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
        strokeOpacity,
      } = {
        ...paint,
      } as GeometryPaint;

      if (
        fill &&
        fillColor &&
        typeof fillColor === 'string' &&
        typeof fillOpacity === 'number'
      ) {
        style.fill = new Fill({
          color: getColor(fillColor, fillOpacity),
        });
      }
      if (
        strokeColor &&
        typeof strokeColor === 'string' &&
        typeof strokeOpacity === 'number' &&
        (stroke || ['MultiLineString', 'LineString'].indexOf(type) !== -1)
      ) {
        style.stroke = new Stroke({
          // @ts-ignore
          width: paint.weight,
          color: getColor(strokeColor, strokeOpacity),
        });
      }

      if (paint.type === 'circle' && typeof radius === 'number') {
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
          imgSize: paint.iconSize,
        };
        style.image = new Icon(iconOptions);
      }
    }
    return new Style(style);
  }
}

export function labelStyleFunction(
  type: VectorAdapterLayerType,
  opt: GeoJsonAdapterOptions,
): Style {
  const fontSize = 12; //* (opt.ratio || 1);
  let options: TextOptions = {
    font: fontSize + 'px Calibri,sans-serif',
    overflow: true,
    fill: new Fill({
      color: '#000',
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 3,
    }),
  };
  if (type === 'point') {
    options = {
      ...options,
      placement: 'point',
      textBaseline: 'bottom',
      offsetY: 20,
    };
  }
  return new Style({
    text: new Text(options),
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
