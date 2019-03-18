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
  Map, MapLayerMouseEvent, GeoJSONSource,
  // BackgroundPaint, FillPaint, FillExtrusionPaint, LinePaint, SymbolPaint,
  // RasterPaint, CirclePaint, HeatmapPaint, HillshadePaint,
} from 'mapbox-gl';

// type MapboxPaint = BackgroundPaint | FillPaint | FillExtrusionPaint | LinePaint | SymbolPaint |
//   RasterPaint | CirclePaint | HeatmapPaint | HillshadePaint;

import { getImage } from '../util/image_icons';
import { TLayer } from '../MapboxglMapAdapter';
import { BaseAdapter } from './BaseAdapter';

interface Feature<G extends GeometryObject | null = Geometry, P = GeoJsonProperties> extends F<G, P> {
  _rendrom_id?: string;
}

const allowedParams: Array<[string, string] | string> = ['color', 'opacity'];
const allowedByType = {
  circle: allowedParams.concat(['radius']),
  line: allowedParams.concat([['weight', 'width']]),
  fill: allowedParams.concat([]),
  icon: allowedParams.concat([])
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

const backAliases: { [key in GeoJsonAdapterLayerType]?: GeoJsonGeometryTypes[] } = {
  'icon': ['Point']
};

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

type MapboxLayerType = 'fill' | 'line' | 'symbol' | 'circle';

export class GeoJsonAdapter extends BaseAdapter<GeoJsonAdapterOptions>
  implements VectorLayerAdapter<Map, TLayer, GeoJsonAdapterOptions, Feature> {

  selected: boolean = false;

  private _features: Feature[] = [];
  private readonly _sourceId: string;
  private readonly _selectionName: string;
  private _selectedFeatureIds: string[] = [];
  private _filteredFeatureIds: string[] = [];
  private _types: GeoJsonAdapterLayerType[] = ['fill', 'circle', 'line'];
  // private _layersByType: { [key in GeoJsonAdapterLayerType]?: string } = {};

  private $onLayerClick?: (e: MapLayerMouseEvent) => void;

  constructor(public map: Map, public options: GeoJsonAdapterOptions) {
    super(map, options);
    this._sourceId = `source-${this._layerId}`;
    this._selectionName = this._layerId + '-highlighted';
    this.$onLayerClick = this._onLayerClick.bind(this);
  }

  async addLayer(options: GeoJsonAdapterOptions): Promise<any> {
    options = this.options = { ...this.options, ...(options || {}) };

    this.map.addSource(this._sourceId, {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': []
      }
    });
    this.layer = [];
    const types = options.type ? [options.type] : this._types;
    for (const t of types) {
      if (options.paint) {

        const layer = this._getLayerNameFromType(t);
        const geomTypes = backAliases[t];
        if (geomTypes && geomTypes.length) {
          let type = t;
          if (t === 'circle') {
            const paintType = this._detectPaintType(options.paint);
            if (paintType === 'icon') {
              type = 'icon';
            }
          }
          const geomFilter = ['==', '$type', geomTypes[0]];
          await this._addLayer(layer, type, geomFilter);
          this.layer.push(layer);
          if (options.selectedPaint) {
            const selectionLayer = this._getSelectionLayerNameFromType(type);
            await this._addLayer(selectionLayer, type, [geomFilter, ['in', '_rendrom_id', '']]);
            this.layer.push(selectionLayer);
          }
        }
      }
    }

    if (this.options.data) {
      this.addData(this.options.data);
    }

    this._addEventsListeners();

    return this.layer;
  }

  removeLayer() {
    const map = this.map;
    if (this.layer) {
      this.layer.forEach((layerId) => {
        map.removeLayer(layerId);
      });
      map.removeSource(this._sourceId);
    }
  }

  clearLayer(cb?: (feature: Feature) => boolean) {
    let features: Feature[] = [];
    const source = this.map.getSource(this._sourceId) as GeoJSONSource;
    if (cb) {
      features = this._features = this._features.filter((x) => !cb(x));
    }
    source.setData({ type: 'FeatureCollection', features });
  }

  addData(data: GeoJsonObject) {
    let type: GeoJsonAdapterLayerType | undefined;
    if (this.options.type) {
      type = this.options.type;
    }
    if (!type && data) {
      const detectedType = detectType(data);
      type = typeAlias[detectedType];
    }
    if (data && type) {
      const features = this.filterGeometries(data, type);
      features.forEach((x, i) => {
        // to avoid id = 0 is false
        const rendromId = '_' + i;
        x._rendrom_id = rendromId;
        if (x.properties) {
          x.properties._rendrom_id = rendromId;
        }
      });
      this._updateLayerPaint(type);
      const source = this.map.getSource(this._sourceId) as GeoJSONSource;
      source.setData({ type: 'FeatureCollection', features: this._features });
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

  private _getLayerNameFromType(type: GeoJsonAdapterLayerType) {
    return type + '-' + this._layerId;
  }

  private _getSelectionLayerNameFromType(type: GeoJsonAdapterLayerType) {
    return type + '-' + this._selectionName;
  }

  private async _addLayer(name: string, type: GeoJsonAdapterLayerType, filter?: any) {
    let mType: MapboxLayerType;
    if (type === 'icon') {
      mType = 'symbol';
    } else {
      mType = type;
    }

    const layerOpt: mapboxgl.Layer = {
      id: name,
      type: mType,
      source: this._sourceId,
      layout: {
        visibility: 'none',
      },
      filter
    };

    this.map.addLayer(layerOpt);
  }

  private async _updateLayerPaint(type: GeoJsonAdapterLayerType) {

    const layerName = this._getLayerNameFromType(type);

    if (this.options.paint) {
      const layers: Array<[string, GeoJsonAdapterLayerPaint | GetPaintCallback]> = [[layerName, this.options.paint]];
      if (this.options.selectedPaint) {
        const selName = this._getSelectionLayerNameFromType(type);
        layers.push([selName, this.options.selectedPaint]);

      }

      for (const [name, paint] of layers) {
        const _paint: any = await this._createPaintForType(paint, type, name);
        if ('icon-image' in _paint) {
          // If true, the icon will be visible even if it collides with other previously drawn symbols.
          _paint['icon-allow-overlap'] = true;
          for (const p in _paint) {
            if (_paint.hasOwnProperty(p)) {
              this.map.setLayoutProperty(name, p, _paint[p]);
            }
          }

        } else {
          for (const p in _paint) {
            if (_paint.hasOwnProperty(p)) {
              this.map.setPaintProperty(name, p, _paint[p]);
            }
          }
        }
      }
    }
  }

  private filterGeometries(data: GeoJsonObject, type: GeoJsonAdapterLayerType): Feature[] {
    let newFeatures: Feature[] = [];
    if (data.type === 'FeatureCollection') {
      const features = (data as FeatureCollection).features = (data as FeatureCollection).features
        .filter((f) => geometryFilter(f.geometry.type, type)) as Feature[];
      newFeatures = features;
    } else if (data.type === 'Feature') {
      const allow = geometryFilter((data as Feature).geometry.type, type);
      if (!allow) {
        return [];
      }
      newFeatures.push((data as Feature));
    } else if (data.type === 'GeometryCollection') {
      const geomCollection = data as GeometryCollection;
      geomCollection.geometries = geomCollection.geometries.filter((g) => geometryFilter(g.type, type));
      newFeatures = geomCollection.geometries.map((x) => {
        const f: Feature = { type: 'Feature', geometry: x as GeometryObject, properties: {} };
        return f;
      });
    } else if (typeAlias[data.type]) {
      const obj: Feature = { type: 'Feature', geometry: data as GeometryObject, properties: {} };
      newFeatures = [obj];
    }
    this._features = this._features.concat(newFeatures);
    return newFeatures;
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

  private _detectPaintType(paint: GeoJsonAdapterLayerPaint | GetPaintCallback): string | undefined {
    if ('type' in paint) {
      return paint.type;
    } else if (typeof paint === 'function') {
      const falsePaint = paint({type: 'Feature', properties: {}, geometry: {}});
      return this._detectPaintType(falsePaint);
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
