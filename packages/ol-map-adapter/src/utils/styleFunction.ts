import { isPaint, isPaintCallback } from '@nextgis/paint';
import { asArray } from 'ol/color';
import { Fill, Stroke, Style, Text } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import Icon from 'ol/style/Icon';

import { getFeature } from './utils';

import type {
  GeometryPaint,
  Paint,
  PaintType,
  VectorAdapterLayerPaint,
} from '@nextgis/paint';
import type {
  GeoJsonAdapterOptions,
  VectorAdapterLayerType,
} from '@nextgis/webmap';
import type { Feature } from 'geojson';
import type OlFeature from 'ol/Feature';
import type { Color } from 'ol/color';
import type { Options as IconOptions } from 'ol/style/Icon';
import type { Options as TextOptions } from 'ol/style/Text';

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
      const t =
        ta === 'polygon' || ta === 'line'
          ? 'path'
          : 'html' in paint || 'className' in paint
            ? 'icon'
            : paintTypeAlias[ta];
      if (t) {
        (paint as VectorAdapterLayerPaint).type = t;
      }
    }
    if (paint.type === 'path' || paint.type === 'circle') {
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
          src: 'data:image/svg+xml,' + encodeURIComponent(svg),
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
          anchor: paint.iconAnchor,
          rotation: paint.rotate,
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
