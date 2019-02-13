import {
  GeoJsonAdapterOptions,
  GeoJsonAdapterLayerType,
  GeoJsonAdapterLayerPaint,
  GetPaintCallback,
  IconOptions,
  DataLayerFilter,
  LayerDefinition,
  VectorLayerAdapter,
} from '@nextgis/webmap';
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
import {
  Map, MapLayerMouseEvent,
  // BackgroundPaint, FillPaint, FillExtrusionPaint, LinePaint, SymbolPaint,
  // RasterPaint, CirclePaint, HeatmapPaint, HillshadePaint,
} from 'mapbox-gl';

// type MapboxPaint = BackgroundPaint | FillPaint | FillExtrusionPaint | LinePaint | SymbolPaint |
//   RasterPaint | CirclePaint | HeatmapPaint | HillshadePaint;

import { getImage } from '../utils/image_icons';
import { TLayer } from '../MapboxglMapAdapter';
import { BaseAdapter } from './BaseAdapter';

interface Feature<G extends GeometryObject | null = Geometry, P = GeoJsonProperties> extends F<G, P> {
}

const allowedParams: Array<[string, string] | string> = ['color', 'opacity'];
const allowedByType = {
  circle: allowedParams.concat(['radius']),
  line: allowedParams.concat([['weight', 'width']]),
  fill: allowedParams.concat([])
};

const typeAlias: { [key in GeoJsonGeometryTypes]: GeoJsonAdapterLayerType } = {
  'Point': 'circle',
  'LineString': 'line',
  'MultiPoint': 'circle',
  'Polygon': 'fill',
  'MultiLineString': 'line',
  'MultiPolygon': 'fill',
  'GeometryCollection': 'fill'
};

const backAliases: { [key in GeoJsonAdapterLayerType]?: GeoJsonGeometryTypes[] } = {};

for (const a in typeAlias) {
  if (typeAlias.hasOwnProperty(a)) {
    const layerType = typeAlias[a as GeoJsonGeometryTypes];
    const backAlias = backAliases[layerType] || [];
    backAlias.push(a as GeoJsonGeometryTypes);
    backAliases[layerType] = backAlias;
  }
}

const PAINT = {
  color: 'blue',
  opacity: 1,
  radius: 10
};

export class GeoJsonAdapter extends BaseAdapter<GeoJsonAdapterOptions>
  implements VectorLayerAdapter<Map, TLayer, GeoJsonAdapterOptions, Feature> {

  selected: boolean = false;

  private _selectionName?: string;
  private _features: Feature[] = [];
  private _selectedFeatureIds: string[] = [];
  private _filteredFeatureIds: string[] = [];
  private _data?: Feature | FeatureCollection;

  private $onLayerClick?: (e: MapLayerMouseEvent) => void;

  constructor(public map: Map, public options: GeoJsonAdapterOptions) {
    super(map, options);
    this.$onLayerClick = this._onLayerClick.bind(this);
  }

  async addLayer(options: GeoJsonAdapterOptions): Promise<any> {
    options = this.options = { ...this.options, ...(options || {}) };
    const data = options.data;
    let type: GeoJsonAdapterLayerType | undefined;
    if (options.type) {
      type = options.type;
    }
    if (!type && data) {
      const detectedType = detectType(data);
      type = typeAlias[detectedType];
    }

    if (data && type) {
      this._data = this.filterGeometries(data, type) as any;
      this._features.forEach((x, i) => {
        // to avaoid id = 0 is false
        const rendromId = '_' + i;
        // @ts-ignore
        x._rendrom_id = rendromId;
        if (x.properties) {
          x.properties._rendrom_id = rendromId;
        }
      });
      const features = data as Feature | FeatureCollection;
      this.layer = [this._layerId];
      if (options.paint) {
        await this._addLayer(this._layerId, features, options.paint, type);
        if (options.selectedPaint) {
          this._selectionName = this._layerId + '-highlighted';
          await this._addLayer(this._selectionName, features, options.selectedPaint, type);
          this.map.setFilter(this._selectionName, ['in', '_rendrom_id', '']);
          this.layer.push(this._selectionName);
        }
      }

      this._addEventsListeners();

      return this.layer;
    } else {
      throw new Error('No geometry for given type');
    }
  }

  getLayers() {
    const filtered = this._filteredFeatureIds.length;
    return this._features.map((feature) => {
      let visible: boolean = false;
      if (filtered) {
        const id = this._getRendromId(feature);
        if (id !== undefined) {
          visible = this._filteredFeatureIds.indexOf(id) !== -1;
        }
      }
      return {
        feature,
        visible
      };
    });
  }

  filter(fun: DataLayerFilter<Feature, TLayer>) {
    this._filteredFeatureIds = [];
    this._features.forEach((feature) => {
      const ok = fun({ feature });
      const id = this._getRendromId(feature);
      if (ok && id) {
        this._filteredFeatureIds.push(id);
      }
    });
    this._updateFilter();
  }

  getSelected() {
    const features: Array<LayerDefinition<Feature, TLayer>> = [];
    this._features.forEach((x) => {
      const id = this._getRendromId(x);
      if (id && this._selectedFeatureIds.indexOf(id) !== -1) {
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

  private async _addLayer(
    name: string,
    data: Feature | FeatureCollection,
    paint: GeoJsonAdapterLayerPaint | GetPaintCallback,
    type: GeoJsonAdapterLayerType) {

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
        .filter((f) => geometryFilter(f.geometry.type, type)) as Feature[];
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
    name: string): Promise<any> {

    if (typeof paint === 'function') {
      return await this._getPaintFromCallback(paint, type, name);
    } else {
      const mapboxPaint: any = {};
      const _paint = { ...PAINT, ...(paint || {}) };
      if (paint.type === 'icon' && paint.html) {
        await this._registrateImage(paint);
        return {
          'icon-image': paint.html
        };
      } else {
        for (const p in _paint) {
          if (_paint.hasOwnProperty(p)) {
            const allowed = allowedByType[type];
            if (allowed) {
              const allowedType = allowed.find((x) => {
                if (typeof x === 'string') {
                  return x === p;
                } else if (Array.isArray(x)) {
                  return x[0] === p;
                }
                return false;
              });
              if (allowedType) {
                const paramName = Array.isArray(allowedType) ? allowedType[1] : allowedType;
                // @ts-ignore
                mapboxPaint[type + '-' + paramName] = _paint[p];
              }
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
        if (feature.properties) {
          feature.properties['_icon-image-' + name] = _paint.html;
        }
        style['icon-image'] = `{_icon-image-${name}}`;
      } else {
        for (const p in _paint) {
          if (_paint.hasOwnProperty(p)) {
            // @ts-ignore
            const toSave = _paint[p];
            if (feature.properties) {
              feature.properties[`_paint_${p}_${name}`] = toSave;
            }
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
    if (paint.html) {
      const imageExist = this.map.hasImage(paint.html);
      if (!imageExist) {
        let width = 12;
        let height = 12;
        if (paint.iconSize) {
          width = paint.iconSize[0];
          height = paint.iconSize[1];
        }
        const image = await getImage(paint.html, {
          width,
          height
        });

        this.map.addImage(paint.html, image);
      }
    }
  }

  private _onLayerClick(e: mapboxgl.MapLayerMouseEvent) {
    e.preventDefault();
    const features = this.map.queryRenderedFeatures(e.point, { layers: this.layer });
    const feature = features[0] as Feature;
    const id = this._getRendromId(feature);
    if (feature && id !== undefined) {

      let isSelected = this._selectedFeatureIds.indexOf(id) !== -1;
      if (isSelected) {
        if (this.options && this.options.unselectOnSecondClick) {
          this._unselectFeature(feature);
          isSelected = false;
        }
      } else {
        this._selectFeature(feature);
        isSelected = true;
      }
      if (this.options.onLayerClick) {
        this.options.onLayerClick({
          layer: this,
          feature,
          selected: isSelected
        });
      }
    }
  }

  private _selectFeature(feature: Feature | Feature[]) {
    if (this.options && !this.options.multiselect) {
      this._selectedFeatureIds = [];
    }
    let features: Feature[] = [];
    if (Array.isArray(feature)) {
      features = feature;
    } else {
      features = [feature];
    }
    features.forEach((f) => {
      const id = this._getRendromId(f);
      if (id !== undefined) {
        this._selectedFeatureIds.push(id);
      }
    });
    this._updateFilter();
  }

  private _unselectFeature(feature: Feature | Feature[]) {
    let features: Feature[] = [];
    if (Array.isArray(feature)) {
      features = feature;
    } else {
      features = [feature];
    }
    features.forEach((f) => {
      const id = this._getRendromId(f);
      if (id !== undefined) {
        const index = this._selectedFeatureIds.indexOf(id);
        if (index !== -1) {
          this._selectedFeatureIds.splice(index, 1);
        }
      }
    });
    this._updateFilter();
  }

  private _updateFilter() {
    let selectionArray: string[] = [];
    const filteredArray: string[] = [];

    if (this._filteredFeatureIds.length) {
      this._features.forEach((x) => {
        const id = this._getRendromId(x);
        if (id !== undefined && this._filteredFeatureIds.indexOf(id) !== -1) {
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
      this.map.setFilter(this._layerId, ['in', '_rendrom_id', ...filteredArray]);
    } else {
      this.map.setFilter(this._layerId, ['!in', '_rendrom_id', ...selectionArray]);
    }
  }

  private _addEventsListeners() {
    if (this.layer && this.options && this.options.selectable) {
      this.layer.forEach((x) => {
        if (this.$onLayerClick) {
          const onLayerClick = this.$onLayerClick;
          this.map.on('click', x, (e: MapLayerMouseEvent) => {
            onLayerClick(e);
          });
        }

        this.map.on('mousemove', x, () => {
          this.map.getCanvas().style.cursor = 'pointer';
        });
        this.map.on('mouseleave', x, () => {
          this.map.getCanvas().style.cursor = '';
        });
      });
    }
  }

  private _getRendromId(feature: Feature): string | undefined {
    // @ts-ignore
    const id = feature._rendrom_id;
    if (id !== undefined) {
      return id;
    } else if (feature.properties && feature.properties._rendrom_id !== undefined) {
      return feature.properties._rendrom_id;
    }
  }
}

// Static functions
function geometryFilter(geometry: GeoJsonGeometryTypes, type: GeoJsonAdapterLayerType): boolean {
  const backType = backAliases[type];
  if (backType) {
    return backType.indexOf(geometry) !== -1;
  }
  return false;
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
  let maxName: string = '';
  for (const c in counts) {
    if (counts.hasOwnProperty(c)) {
      const maxCount = maxName ? counts[maxName] : 0;
      if (counts[c] > maxCount) {
        maxName = c;
      }
    }
  }
  return maxName as GeoJsonGeometryTypes;
}
