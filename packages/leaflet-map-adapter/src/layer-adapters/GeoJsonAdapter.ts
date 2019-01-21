import {
  LayerAdapter,
  GeoJsonAdapterOptions,
  GeoJsonAdapterLayerPaint,
  GeoJsonAdapterLayerType,
  IconOptions,
  GetPaintCallback
} from '@nextgis/webmap';
import {
  GeoJSON,
  CircleMarker, GeoJSONOptions,
  PathOptions,
  CircleMarkerOptions,
  DivIcon,
  Marker,
  FeatureGroup,
  DomEvent
} from 'leaflet';
import { BaseAdapter } from './BaseAdapter';
import { GeoJsonObject, GeoJsonGeometryTypes, FeatureCollection, Feature, GeometryCollection } from 'geojson';

let ID = 1;

const typeAlias: { [x: string]: GeoJsonAdapterLayerType } = {
  'Point': 'circle',
  'LineString': 'line',
  'MultiPoint': 'circle',
  'Polygon': 'fill',
  'MultiLineString': 'line',
  'MultiPolygon': 'fill'
};

const PAINT = {
  stroke: false,
  fillOpacity: 1
};

const backAliases = {};
for (const a in typeAlias) {
  if (typeAlias.hasOwnProperty(a)) {
    backAliases[typeAlias[a]] = backAliases[typeAlias[a]] || [];
    backAliases[typeAlias[a]].push(a);
  }
}

export class GeoJsonAdapter extends BaseAdapter implements LayerAdapter {
  options: GeoJsonAdapterOptions;

  layer = new FeatureGroup();

  name: string;
  paint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  selectedPaint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  type: GeoJsonAdapterLayerType;
  selected = false;

  private _layers: Array<{ feature, layer }> = [];
  private _selectedLayers: Array<{ feature, layer }> = [];

  addLayer(options?: GeoJsonAdapterOptions) {
    this.options = options;
    this.paint = options.paint;

    this.selectedPaint = options.selectedPaint;
    options.paint = this.paint;

    this.name = options.id || 'geojson-' + ID++;

    this.addLayerData(options.data);

    return this.layer;
  }

  select(findFeatureFun?) {
    if (findFeatureFun) {
      const feature = this._layers.filter(findFeatureFun);
      feature.forEach((x) => {
        this._selectLayer(x.layer);
      });
    } else if (!this.selected) {
      this.selected = true;
      if (this.selectedPaint) {
        this.setPaintEachLayer(this.selectedPaint);
      }
    }
  }

  unselect(findFeatureFun?) {
    if (findFeatureFun) {
      const feature = this._layers.filter(findFeatureFun);
      feature.forEach((x) => {
        this._unselectLayer(x.layer);
      });
    } else if (this.selected) {
      this.selected = false;
      this.setPaintEachLayer(this.paint);
    }
  }

  getSelected() {
    return this._selectedLayers.map((x) => {
      return { feature: x.feature, layer: x };
    });
  }

  filter(fun) {
    // Some optimization
    // @ts-ignore
    const _map = this.layer._map;
    if (_map) {
      this.layer.remove();
    }

    this._layers.forEach(({ feature, layer }) => {
      const ok = fun({ feature, layer });
      if (ok) {
        this.layer.addLayer(layer);
      } else {
        this.layer.removeLayer(layer);
      }
    });
    if (_map) {
      this.layer.addTo(_map);
    }
  }

  getLayers() {
    return this._layers.map(({ layer, feature }) => Object.create({
      feature,
      layer,
      visible: layer._map
    }));
  }

  clearLayer() {
    this.layer.clearLayers();
    this._layers = [];
  }

  setData(data: GeoJsonObject) {
    this.clearLayer();
    this.addLayerData(data);
  }

  private addLayerData(data: GeoJsonObject | false) {
    const options = this.options;
    let geoJsonOptions: GeoJSONOptions;
    if (data) {
      let type: GeoJsonAdapterLayerType = options.type;

      if (!type) {
        const detectedType = detectType(data);
        type = typeAlias[detectedType];
      }
      this.type = type;

      data = filterGeometries(data, type);
      if (data) {
        geoJsonOptions = this.getGeoJsonOptions(options, type);
      }
    }
    const layer = new GeoJSON(data || null, geoJsonOptions);
  }

  private setPaintEachLayer(paint: GetPaintCallback | GeoJsonAdapterLayerPaint) {
    this.layer.eachLayer((l) => {
      this.setPaint(l, paint);
    });
  }

  private setPaint(l, paint: GetPaintCallback | GeoJsonAdapterLayerPaint) {
    let style: GeoJsonAdapterLayerPaint;
    if (typeof paint === 'function') {
      style = paint(l.feature);
    } else {
      style = paint;
    }
    if (this.type === 'circle' && style.type === 'icon') {
      const marker = l as Marker;
      const divIcon = this.createDivIcon(style);
      marker.setIcon(divIcon);
    } else if ('setStyle' in l) {
      l.setStyle(this.preparePaint(style));
    }
  }

  private preparePaint(paint): PathOptions {
    const path: CircleMarkerOptions | PathOptions = paint;
    if (path.opacity) {
      path.fillOpacity = path.opacity;
    }
    return path;
  }

  private getGeoJsonOptions(options: GeoJsonAdapterOptions, type: GeoJsonAdapterLayerType): GeoJSONOptions {
    const paint = options.paint;
    let lopt: GeoJSONOptions = {};

    if (typeof paint === 'function') {
      if (type === 'circle') {
        lopt = {
          pointToLayer: (feature, latLng) => {
            const iconOpt = paint(feature);
            const pointToLayer = this.createPaintToLayer(iconOpt as IconOptions);
            return pointToLayer(feature, latLng);
          }
        };
      } else {
        lopt = {
          style: (feature) => {
            return { ...PAINT, ...paint(feature) };
          }
        };
      }
    } else {
      lopt = this.createPaintOptions((paint as GeoJsonAdapterLayerPaint), type);
    }

    lopt.onEachFeature = (feature, layer) => {
      this._layers.push({ feature, layer });
      this.layer.addLayer(layer);
      if (options.selectable) {
        layer.on('click', this._onLayerClick, this);
      }
    };

    return lopt;
  }

  private _onLayerClick(e) {
    DomEvent.stopPropagation(e);
    const layer = e.target;
    let isSelected = this._selectedLayers.indexOf(layer) !== -1;
    if (isSelected) {
      if (this.options.unselectOnSecondClick) {
        this._unselectLayer(layer);
        isSelected = false;
      }
    } else {
      this._selectLayer(layer);
      isSelected = true;
    }
    if (this.onLayerClick) {
      this.onLayerClick({
        adapter: this,
        layer,
        feature: layer.feature,
        selected: isSelected
      });
    }
  }

  private _selectLayer(layer) {
    if (!this.options.multiselect) {
      this._selectedLayers.forEach((x) => this._unselectLayer(x));
    }
    this._selectedLayers.push(layer);
    this.selected = true;
    if (this.options.selectedPaint) {
      this.setPaint(layer, this.options.selectedPaint);
    }
  }

  private _unselectLayer(layer) {
    const index = this._selectedLayers.indexOf(layer);
    if (index !== -1) {
      this._selectedLayers.splice(index, 1);
    }
    this.selected = this._selectedLayers.length > 0;
    this.setPaint(layer, this.options.paint);
  }

  private createDivIcon(icon: IconOptions) {
    const { type, ...toLIconOpt } = icon;
    return new DivIcon({ className: '', ...toLIconOpt });
  }

  private createPaintToLayer(icon: IconOptions) {
    if (icon.type === 'icon') {
      const iconClassName = icon.className;
      const html = icon.html;
      if (iconClassName || html) {
        return (geoJsonPoint, latlng) => {
          const divIcon = this.createDivIcon(icon);
          return new Marker(latlng, { icon: divIcon });
        };
      }
    } else {
      return (geoJsonPoint, latlng) => {
        return new CircleMarker(latlng, this.preparePaint({ ...PAINT, ...icon }));
      };
    }
  }

  private createPaintOptions(paintOptions: GeoJsonAdapterLayerPaint, type: GeoJsonAdapterLayerType): GeoJSONOptions {
    const geoJsonOptions: GeoJSONOptions = {};
    const paint = (paintOptions && this.preparePaint(paintOptions)) || {};
    if (paintOptions) {
      geoJsonOptions.style = (feature) => {
        return paint;
      };
    }
    if (type === 'circle') {
      geoJsonOptions.pointToLayer = this.createPaintToLayer(paintOptions as IconOptions);
    } else if (type === 'line') {
      paint.stroke = true;
    }
    return geoJsonOptions;
  }
}

function detectType(geojson: GeoJsonObject): GeoJsonGeometryTypes {
  let geometry: GeoJsonGeometryTypes;
  if (geojson.type === 'FeatureCollection') {
    const featuresTypes = (geojson as FeatureCollection).features.map((f) => f.geometry.type);
    geometry = findMostFrequentGeomType(featuresTypes);
  } else if (geojson.type === 'GeometryCollection') {
    const geometryTypes = (geojson as GeometryCollection).geometries.map((g) => g.type);
    geometry = findMostFrequentGeomType(geometryTypes);
  } else if (geojson.type === 'Feature') {
    geometry = (geojson as Feature).geometry.type;
  } else {
    geometry = geojson.type;
  }
  return geometry;
}

function findMostFrequentGeomType(arr: GeoJsonGeometryTypes[]): GeoJsonGeometryTypes {
  const counts: { [x: string]: number } = {};
  for (let fry = 0; fry < arr.length; fry++) {
    counts[arr[fry]] = 1 + (counts[arr[fry]] || 0);
  }
  let maxName: string;
  for (const c in counts) {
    if (counts[c] > (counts[maxName] || 0)) {
      maxName = c;
    }
  }
  return maxName as GeoJsonGeometryTypes;
}

function geometryFilter(geometry: GeoJsonGeometryTypes, type: GeoJsonAdapterLayerType): boolean {
  return backAliases[type].indexOf(geometry) !== -1;
}

function filterGeometries(data: GeoJsonObject, type: GeoJsonAdapterLayerType): GeoJsonObject | false {
  if (data.type === 'FeatureCollection') {
    (data as FeatureCollection).features = (data as FeatureCollection).features
      .filter((f) => geometryFilter(f.geometry.type, type));
  } else if (data.type === 'Feature') {
    const allow = geometryFilter((data as Feature).geometry.type, type);
    if (!allow) {
      return false;
    }
  } else if (data.type === 'GeometryCollection') {
    (data as GeometryCollection).geometries = (data as GeometryCollection).geometries
      .filter((g) => geometryFilter(g.type, type));
  }
  return data;
}
