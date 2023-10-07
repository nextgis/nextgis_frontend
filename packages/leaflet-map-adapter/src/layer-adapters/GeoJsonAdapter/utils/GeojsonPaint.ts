import { CircleMarker, DivIcon, Marker } from 'leaflet';
import { defined } from '@nextgis/utils';

import { isPaintCallback, isPaint } from '@nextgis/paint';
import { PAINT } from '../../../utils/geometries';

import type {
  CircleMarkerOptions,
  LatLngExpression,
  GeoJSONOptions,
  PathOptions,
  Path,
} from 'leaflet';
import type {
  IconPaint,
  PathPaint,
  VectorAdapterLayerPaint,
} from '@nextgis/paint';
import type { GeoJsonAdapter, LayerDef } from '../GeoJsonAdapter';

export class GeoJsonPaint {
  private layer: GeoJsonAdapter;

  constructor(layer: GeoJsonAdapter) {
    this.layer = layer;
  }

  setPaintEachLayer(paint: VectorAdapterLayerPaint) {
    this.layer._layers.forEach((layerDef) => {
      this.setPaint(layerDef, paint);
    });
  }

  setPaint(layerDef: LayerDef, paint: VectorAdapterLayerPaint) {
    let style: VectorAdapterLayerPaint | undefined = undefined;
    const { layer, feature } = layerDef;
    if (layer && feature) {
      if (isPaintCallback(paint)) {
        style = paint(feature);
      } else if (isPaint(paint)) {
        style = paint;
      }
      if (style) {
        if (this.layer.type === 'point' && style.type === 'icon') {
          const marker = layer as Marker;
          const divIcon = this._createDivIcon(style);
          setTimeout(() => {
            marker.setIcon(divIcon);
          }, 10);
        } else if ('setStyle' in layer) {
          (layer as Path).setStyle(this.preparePaint(style));
        }
      }
    }
  }

  preparePaint(paint: VectorAdapterLayerPaint): PathOptions {
    if (paint.type !== 'get-paint') {
      const paintAliases: [keyof PathOptions, keyof PathPaint][] = [
        ['color', 'strokeColor'],
        ['opacity', 'strokeOpacity'],
        ['stroke', 'stroke'],
        ['fillColor', 'fillColor'],
        ['fillOpacity', 'fillOpacity'],
        ['fill', 'fill'],
        ['weight', 'weight'],
      ];
      const aliases: [keyof PathOptions, keyof PathPaint][] =
        this.layer.type === 'line'
          ? [
              ['color', 'strokeColor'],
              ['opacity', 'strokeOpacity'],
              ['weight', 'weight'],
            ]
          : paintAliases;

      const readyPaint: PathOptions & CircleMarkerOptions = {};

      if ('radius' in paint && typeof paint.radius === 'number') {
        readyPaint.radius = paint.radius;
      }
      for (const [to, from] of aliases) {
        const opacity = this.layer.options.opacity;
        let paintProp = (paint as PathPaint)[from];
        if (defined(opacity) && from.toLowerCase().indexOf('opacity') !== -1) {
          paintProp = Number(paintProp) * opacity;
        }

        if (paintProp !== undefined) {
          Object.defineProperty(readyPaint, to, {
            enumerable: true,
            value: paintProp,
          });
        }
      }

      return readyPaint;
    }
    return PAINT;
  }

  _createDivIcon(icon: IconPaint) {
    const { html, rotate, className, ...toLIconOpt } = icon;

    const element = document.createElement('div');
    if (className) {
      element.className = className;
    }
    if (rotate) {
      element.style.transform = `rotateZ(${rotate}deg)`;
    }
    if (html) {
      element.innerHTML = html;
    }

    const divIcon = new DivIcon({
      className: '',
      ...toLIconOpt,
      html: element,
    });
    return divIcon;
  }

  createPaintToLayer(icon: IconPaint) {
    if (icon && icon.type) {
      if (icon.type === 'icon') {
        const iconClassName = icon.className;
        const html = icon.html;
        if (iconClassName || html) {
          return (_: any, latlng: LatLngExpression) => {
            const divIcon = this._createDivIcon(icon);
            return new Marker(latlng, { icon: divIcon });
          };
        }
      } else if (icon.type === 'pin') {
        return (_: any, latlng: LatLngExpression) => {
          return new Marker(latlng);
        };
      }
    }
    return (_: any, latlng: LatLngExpression) => {
      const p: any = PAINT;
      return new CircleMarker(latlng, this.preparePaint({ ...p, ...icon }));
    };
  }

  createPaintOptions(paint: VectorAdapterLayerPaint): GeoJSONOptions {
    const geoJsonOptions: GeoJSONOptions = {};
    const newPaint = this.preparePaint(paint);
    if (paint) {
      geoJsonOptions.style = () => {
        return newPaint;
      };
    }
    if (this.layer.type === 'point') {
      (geoJsonOptions as any).pointToLayer = this.createPaintToLayer(
        paint as IconPaint,
      );
    } else if (this.layer.type === 'line') {
      newPaint.stroke = true;
    }
    return geoJsonOptions;
  }
}
