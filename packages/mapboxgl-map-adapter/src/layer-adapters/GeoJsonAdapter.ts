import {
  LayerAdapter,
  GeoJsonAdapterOptions,
  GeoJsonAdapterLayerType,
  GeoJsonAdapterLayerPaint,
  GetPaintCallback,
  IconOptions
} from '@nextgis/webmap';
import { BaseAdapter } from './BaseAdapter';
import {
  GeoJsonObject,
  GeoJsonGeometryTypes,
  Feature as F,
  FeatureCollection,
  GeometryCollection,
  GeometryObject,
  Geometry,
  GeoJsonProperties
} from 'geojson';

import { getImage } from '../utils/image.icons';

let ID = 1;

interface Feature<G extends GeometryObject | null = Geometry, P = GeoJsonProperties> extends F<G, P> {
  _rendrom_id?: number;
}

const allowedParams: Array<[string, string] | string> = ['color', 'opacity'];
const allowedByType = {
  circle: allowedParams.concat(['radius']),
  line: allowedParams.concat([['weight', 'width']]),
  fill: allowedParams.concat([])
};

const typeAlias: { [x: string]: GeoJsonAdapterLayerType } = {
  'Point': 'circle',
  'LineString': 'line',
  'MultiPoint': 'circle',
  'Polygon': 'fill',
  'MultiLineString': 'line',
  'MultiPolygon': 'fill'
};

const backAliases = {};
for (const a in typeAlias) {
  if (typeAlias.hasOwnProperty(a)) {
    backAliases[typeAlias[a]] = backAliases[typeAlias[a]] || [];
    backAliases[typeAlias[a]].push(a);
  }
}

const PAINT = {
  color: 'blue',
  opacity: 1,
  radius: 10
};

export class GeoJsonAdapter extends BaseAdapter implements LayerAdapter<GeoJsonAdapterOptions, string[]> {

  selected: boolean;

  private _selectionName?: string;
  private _features: Feature[] = [];
  private _selectedFeatureIds: string[] = [];
  private _filteredFeatureIds: string[] = [];
  private _data: Feature | FeatureCollection;

  private $onLayerClick?: () => void;

  constructor(map, options?) {
    super(map, options);
    // bind methods for event listeners
    this.$onLayerClick = this._onLayerClick.bind(this);
  }

  async addLayer(options?: GeoJsonAdapterOptions): Promise<string[]> {
    this.name = options.id || 'geojson-' + ID++;
    this.options = { ...this.options, ...(options || {}) };

    let type: GeoJsonAdapterLayerType = options.type;

    if (!type) {
      const detectedType = detectType(options.data);
      type = typeAlias[detectedType];
    }

    this._data = this.filterGeometries(options.data, type) as any;
    this._features.forEach((x, i) => {
      x._rendrom_id = i;
      x.properties._rendrom_id = i;
    });
    if (this._data) {
      await this._getAddLayerOptions(this.name, this._data, options.paint, type);
      this.layer = [this.name];
      if (options.selectable || options.selectedPaint) {
        this._selectionName = this.name + '-highlighted';
        await this._getAddLayerOptions(this._selectionName, this._data, options.selectedPaint, type);
        this.map.setFilter(this._selectionName, ['in', '_rendrom_id', '']);
        this.layer.push(this._selectionName);
      }

      this._addEventsListeners();

      return this.layer;
    } else {
      throw new Error('No geometry for given type');
    }
  }

  getLayers() {
    const filtered = this._filteredFeatureIds.length;
    return this._features.map((feature) => Object.create({
      feature,
      visible: filtered && this._filteredFeatureIds.indexOf(feature.properties._rendrom_id) !== -1
    }));
  }

  filter(fun) {
    this._filteredFeatureIds = [];
    this._features.forEach((feature) => {
      const ok = fun({ feature });
      if (ok) {
        this._filteredFeatureIds.push(feature.properties._rendrom_id);
      }
    });
    this._updateFilter();
  }

  getSelected() {
    const features = [];
    this._features.forEach((x) => {
      if (this._selectedFeatureIds.indexOf(x.properties._rendrom_id) !== -1) {
        features.push({ feature: x });
      }
    });
    return features;
  }

  select(findFeatureFun?: (opt: { feature: Feature }) => boolean) {
    if (findFeatureFun) {
      const features = this._features.filter((x) => findFeatureFun({ feature: x }));
      this._selectFeature(features);
    } else if (!this.selected) {
      this._selectFeature(this._features);
    }
    this.selected = true;
  }

  unselect(findFeatureFun?: (opt: { feature: Feature }) => boolean) {
    if (findFeatureFun) {
      const features = this._features.filter((x) => findFeatureFun({ feature: x }));
      this._unselectFeature(features);
    } else if (this.selected) {
      this._unselectFeature(this._features);
    }
    this.selected = !!this._selectedFeatureIds.length;
  }

  private async _getAddLayerOptions(name: string, data: Feature | FeatureCollection, paint, type) {
    const layerOpt: mapboxgl.Layer = {
      id: String(name),
      source: {
        type: 'geojson',
        data
      },
      layout: {
        visibility: 'none',
      },
    };
    const _paint: any = await this._createPaintForType(paint, type, name);
    if ('icon-image' in _paint) {
      // If true, the icon will be visible even if it collides with other previously drawn symbols.
      _paint['icon-allow-overlap'] = true;
      layerOpt.layout = { ...layerOpt.layout, ..._paint };
      layerOpt.type = 'symbol';
    } else {
      layerOpt.paint = _paint;
      layerOpt.type = type;
    }
    this.map.addLayer(layerOpt);
  }

  private filterGeometries(data: GeoJsonObject, type: GeoJsonAdapterLayerType): GeoJsonObject | boolean {
    if (data.type === 'FeatureCollection') {
      const features = (data as FeatureCollection).features = (data as FeatureCollection).features
        .filter((f) => geometryFilter(f.geometry.type, type));
      this._features = features;
    } else if (data.type === 'Feature') {
      const allow = geometryFilter((data as Feature).geometry.type, type);
      if (!allow) {
        return false;
      }
      this._features.push((data as Feature));
    } else if (data.type === 'GeometryCollection') {
      (data as GeometryCollection).geometries = (data as GeometryCollection).geometries
        .filter((g) => geometryFilter(g.type, type));
    }
    return data;
  }

  private async _createPaintForType(
    paint: GeoJsonAdapterLayerPaint | GetPaintCallback,
    type: GeoJsonAdapterLayerType,
    name: string) {

    if (typeof paint === 'function') {
      return await this._getPaintFromCallback(paint, type, name);
    } else {
      const mapboxPaint = {};
      const _paint = { ...PAINT, ...(paint || {}) };
      if (paint.type === 'icon') {
        await this._registrateImage(paint);
        return {
          'icon-image': paint.html
        };
      } else {
        for (const p in _paint) {
          if (_paint.hasOwnProperty(p)) {
            const allowedType = allowedByType[type].find((x) => {
              if (typeof x === 'string') {
                return x === p;
              } else if (Array.isArray(x)) {
                return x[0] === p;
              }
            });
            if (allowedType) {
              const paramName = Array.isArray(allowedType) ? allowedType[1] : allowedType;
              mapboxPaint[type + '-' + paramName] = _paint[p];
            }
          }
        }
        return mapboxPaint;
      }
    }
  }

  private async _getPaintFromCallback(paint: GetPaintCallback, type: GeoJsonAdapterLayerType, name: string) {
    const style: any = {};
    for (const feature of this._features) {
      const _paint = paint(feature);
      if (_paint.type === 'icon') {
        await this._registrateImage(_paint);
        feature.properties['_icon-image-' + name] = _paint.html;
        style['icon-image'] = `{_icon-image-${name}}`;
      } else {
        for (const p in _paint) {
          if (_paint.hasOwnProperty(p)) {
            feature.properties[`_paint_${p}_${name}`] = _paint[p];
            style[p] = ['get', `_paint_${p}_${name}`];
          }
        }
      }
    }
    if ('icon-image' in style) {
      return style;
    }
    const styleFromCb = this._createPaintForType(style, type, name);
    return styleFromCb;
  }

  private async _registrateImage(paint: IconOptions) {
    const imageExist = this.map.hasImage(paint.html);
    if (!imageExist) {
      const image = await getImage(paint.html, {
        width: paint.iconSize[0],
        height: paint.iconSize[1]
      });

      this.map.addImage(paint.html, image);
    }
  }

  private _onLayerClick(e: mapboxgl.MapLayerMouseEvent) {
    e.preventDefault();
    const features = this.map.queryRenderedFeatures(e.point, { layers: this.layer }) as Feature[];
    const feature = features[0];
    if (feature) {
      let isSelected = this._selectedFeatureIds.indexOf(feature.properties._rendrom_id) !== -1;
      if (isSelected) {
        if (this.options.unselectOnSecondClick) {
          this._unselectFeature(feature);
          isSelected = false;
        }
      } else {
        this._selectFeature(feature);
        isSelected = true;
      }
      if (this.onLayerClick) {
        this.onLayerClick({
          adapter: this,
          feature,
          selected: isSelected
        });
      }
    }
  }

  private _selectFeature(feature: Feature | Feature[]) {
    if (!this.options.multiselect) {
      this._selectedFeatureIds = [];
    }
    [].concat(feature).forEach((f) => this._selectedFeatureIds.push(f.properties._rendrom_id));
    this._updateFilter();
  }

  private _unselectFeature(feature: Feature | Feature[]) {
    [].concat(feature).forEach((f) => {
      const index = this._selectedFeatureIds.indexOf(f.properties._rendrom_id);
      if (index !== -1) {
        this._selectedFeatureIds.splice(index, 1);
      }
    });
    this._updateFilter();
  }

  private _updateFilter() {
    let selectionArray = [];
    const filteredArray = [];

    if (this._filteredFeatureIds.length) {
      this._features.forEach((x) => {
        const id = x.properties._rendrom_id;
        if (this._filteredFeatureIds.indexOf(id) !== -1) {
          if (this._selectedFeatureIds.indexOf(id) !== -1) {
            selectionArray.push(id);
          } else {
            filteredArray.push(id);
          }
        }
      });
    } else {
      selectionArray = this._selectedFeatureIds;
    }
    if (this._selectionName) {
      this.map.setFilter(this._selectionName, ['in', '_rendrom_id', ...selectionArray]);
    }
    if (this._filteredFeatureIds.length) {
      this.map.setFilter(this.name, ['in', '_rendrom_id', ...filteredArray]);
    } else {
      this.map.setFilter(this.name, ['!in', '_rendrom_id', ...selectionArray]);
    }
  }

  private _addEventsListeners() {
    if (this.options.selectable) {
      this.layer.forEach((x) => {
        this.map.on('click', x, this.$onLayerClick);

        this.map.on('mousemove', x, () => {
          this.map.getCanvas().style.cursor = 'pointer';
        });
        this.map.on('mouseleave', x, () => {
          this.map.getCanvas().style.cursor = '';
        });
      });
    }
  }
}

// Static functions
function geometryFilter(geometry: GeoJsonGeometryTypes, type: GeoJsonAdapterLayerType): boolean {
  return backAliases[type].indexOf(geometry) !== -1;
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
