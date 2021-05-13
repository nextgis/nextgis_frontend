import { Map, GeoJSONSource, GeoJSONSourceRaw, LngLatBounds } from 'mapbox-gl';
import {
  GeoJsonAdapterOptions,
  VectorAdapterLayerType,
  DataLayerFilter,
  LayerDefinition,
  LngLatBoundsArray,
} from '@nextgis/webmap';
import { VectorAdapterLayerPaint, GetPaintCallback } from '@nextgis/paint';
import { featureFilter, PropertiesFilter } from '@nextgis/properties-filter';
import {
  GeoJsonObject,
  FeatureCollection,
  GeometryCollection,
  GeometryObject,
  Geometry,
  GeoJsonProperties,
} from 'geojson';
import { TLayer } from '../MapboxglMapAdapter';
import { VectorAdapter, Feature } from './VectorAdapter';
import {
  detectType,
  typeAlias,
  typeAliasForFilter,
  geometryFilter,
} from '../util/geomType';

let ID = 0;

type Layers = LayerDefinition<Feature<Geometry, GeoJsonProperties>, TLayer>[];

export class GeoJsonAdapter extends VectorAdapter<GeoJsonAdapterOptions> {
  selected = false;
  source?: string;
  private _features: Feature[] = [];
  private _filteredFeatureIds?: (string | number)[] | undefined;
  private _filterFun?: DataLayerFilter<Feature>;
  private _sources: Record<string, GeoJSONSource> = {};

  constructor(public map: Map, public options: GeoJsonAdapterOptions) {
    super(map, options);
    this.source = this._sourceId;
  }

  async addLayer(options: GeoJsonAdapterOptions): Promise<TLayer> {
    const layer = await super.addLayer(options);
    return layer;
  }

  beforeRemove(): void {
    if (this.map) {
      const source = this.map.getSource(this._sourceId);
      if (source) {
        this.map.removeSource(this._sourceId);
      }
    }
    super.beforeRemove();
  }

  clearLayer(cb?: (feature: Feature) => boolean): void {
    let features: Feature[] = [];
    const source = this.map.getSource(this._sourceId) as GeoJSONSource;
    if (cb) {
      features = this._features = this._features.filter((x) => !cb(x));
    }
    this._features = features;
    source.setData({ type: 'FeatureCollection', features });
  }

  async addData(data: GeoJsonObject): Promise<void> {
    let type: VectorAdapterLayerType | undefined;
    if (this.options.type) {
      type = this.options.type;
    }
    if (!type && data) {
      const detectedType = detectType(data);
      type = typeAlias[detectedType];
    }
    if (data && type) {
      const features = this.filterGeometries(data, type);
      features.forEach((x) => {
        // to avoid id = 0 is false
        const fid = '_' + ID++;
        x._featureFilterId = fid;
        if (x.properties) {
          x.properties[this.featureIdName] = fid;
        }
      });
      if (this._filterFun) {
        this._filter(this._filterFun);
      }
      await this._updateLayerPaint(type);
      const source = this.map.getSource(this._sourceId) as GeoJSONSource;
      source.setData({
        type: 'FeatureCollection',
        features: this._features,
      });
    }
  }

  getLayers(): Layers {
    const filtered = this._filteredFeatureIds;
    const filterProperties = this._filterProperties;
    if (filterProperties) {
      this._updateWithNativeFilter(filterProperties);
    }
    return this._getFeatures().map((feature) => {
      let visible = false;
      if (filterProperties && feature.properties) {
        visible = featureFilter(feature, filterProperties);
      } else if (filtered) {
        const id = this._getFeatureFilterId(feature);
        if (id !== undefined) {
          visible = filtered.indexOf(id) !== -1;
        }
      }
      return {
        feature,
        visible,
      };
    });
  }

  filter(fun: DataLayerFilter<Feature, TLayer>): void {
    this._filterFun = fun;
    this._filter(fun);
  }

  removeFilter(): void {
    this._filterFun = undefined;
    this._filteredFeatureIds = undefined;
    this._updateFilter();
  }

  getSelected(): Layers {
    const features: LayerDefinition<Feature, TLayer>[] = [];
    const selectedFeatureIds = this._selectedFeatureIds;
    const selectProperties = this._selectProperties;
    const allFeatures = this._getFeatures();
    if (selectedFeatureIds && selectedFeatureIds.length) {
      allFeatures.forEach((x) => {
        const id = this._getFeatureFilterId(x);
        if (id && selectedFeatureIds.indexOf(id) !== -1) {
          features.push({ feature: x });
        }
      });
    } else if (this.source && selectProperties) {
      allFeatures
        .filter((x) => featureFilter(x, selectProperties))
        .forEach((x) => {
          features.push({ feature: x });
        });
    }
    return features;
  }

  select(find?: DataLayerFilter<Feature, TLayer> | PropertiesFilter): void {
    if (find) {
      if (typeof find === 'function') {
        const features = this._getFeatures().filter((x) =>
          find({ feature: x }),
        );
        this._selectFeature(features);
      } else {
        this.selected = true;
        this._selectProperties = find;
        super._updateFilter();
        this._fireOnLayerSelectEvent();
      }
    } else if (!this.selected) {
      this._selectFeature(this._getFeatures());
    }
  }

  unselect(find?: DataLayerFilter<Feature, TLayer> | PropertiesFilter): void {
    this._selectProperties = undefined;
    if (find) {
      if (typeof find === 'function') {
        const features = this._getFeatures().filter((x) =>
          find({ feature: x }),
        );
        this._unselectFeature(features);
        this.selected = Array.isArray(this._selectedFeatureIds) ? true : false;
      }
    } else if (this.selected) {
      this.selected = false;
      this._unselectFeature();
    }
  }

  getExtent(): LngLatBoundsArray {
    const features = this._features;
    const bounds = new LngLatBounds();
    const coordinates: (number[] | [number, number])[] = [];
    features.forEach((feature) => {
      const geom = feature.geometry;
      if (geom.type === 'Polygon' || geom.type === 'MultiLineString') {
        geom.coordinates.forEach((x) => {
          x.forEach((y) => coordinates.push(y));
        });
      } else if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach((x) => {
          x.forEach((y) => y.forEach((z) => coordinates.push(z)));
        });
      } else if (geom.type === 'Point') {
        coordinates.push(geom.coordinates);
      } else if (geom.type === 'MultiPoint' || geom.type === 'LineString') {
        geom.coordinates.forEach((x) => {
          coordinates.push(x);
        });
      }
    });
    coordinates.forEach((c) => bounds.extend(c as [number, number]));
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    return [sw.lng, sw.lat, ne.lng, ne.lat];
  }

  protected _onAddLayer(sourceId: string): void {
    if (this.options.data) {
      this.addData(this.options.data);
    }
    let source = this.map.getSource(sourceId) as GeoJSONSource;
    if (!source) {
      const sourceOpt: GeoJSONSourceRaw = {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      };
      const _opts: (keyof GeoJsonAdapterOptions)[] = [
        'cluster',
        'clusterMaxZoom',
        'clusterRadius',
      ];
      _opts.forEach((x) => {
        const opt = this.options[x] as GeoJsonAdapterOptions;
        if (opt !== undefined) {
          //@ts-ignore
          sourceOpt[x] = opt;
        }
      });
      this.map.addSource(sourceId, sourceOpt);
      source = this.map.getSource(sourceId) as GeoJSONSource;
    }
    this._sources[sourceId] = source;
    if (this.options.type) {
      this._updateLayerPaint(this.options.type);
    }
  }

  protected async _createPaintForType(
    paint: VectorAdapterLayerPaint | GetPaintCallback,
    type: VectorAdapterLayerType,
    name: string,
  ): Promise<any> {
    if (typeof paint === 'function') {
      return await this._getPaintFromCallback(paint, type, name);
    } else {
      return super._createPaintForType(paint, type, name);
    }
  }

  protected _selectFeature(
    feature: Feature | Feature[],
    opt: { silent: boolean } = { silent: false },
  ): Feature[] {
    let selectedFeatureIds = this._selectedFeatureIds || [];
    if (this.options && !this.options.multiselect) {
      selectedFeatureIds = [];
    }
    let features: Feature[] = [];
    if (Array.isArray(feature)) {
      features = feature;
    } else {
      features = [feature];
    }
    features.forEach((f) => {
      const id = this._getFeatureFilterId(f);
      if (id !== undefined) {
        selectedFeatureIds.push(id);
      }
    });
    this._selectProperties = undefined;
    this._selectedFeatureIds = selectedFeatureIds;
    this._updateFilter();
    if (!opt.silent && this.options.onLayerSelect) {
      this.options.onLayerSelect({ layer: this, features });
    }
    return features;
  }

  protected _unselectFeature(
    feature?: Feature | Feature[],
    opt: { silent: boolean } = { silent: false },
  ): void {
    if (feature) {
      let features: Feature[] = [];
      if (Array.isArray(feature)) {
        features = feature;
      } else {
        features = [feature];
      }
      if (features.length) {
        features.forEach((f) => {
          const id = this._getFeatureFilterId(f);
          const selected = this._selectedFeatureIds;
          if (selected && id !== undefined) {
            const index = selected.indexOf(id);
            if (index !== -1) {
              selected.splice(index, 1);
            }
          }
        });
      }
    } else {
      this._selectedFeatureIds = false;
    }
    this._updateFilter();
    if (!opt.silent && this.options.onLayerSelect) {
      this.options.onLayerSelect({ layer: this, features: undefined });
    }
  }

  protected _updateFilter(): void {
    // it is not yet possible to use callbacks and properties filters together
    if (this._filterProperties || this._selectProperties) {
      super._updateFilter();
      this._fireOnLayerSelectEvent();
      return;
    }
    const selected = this._selectedFeatureIds;
    let selectionArray: (string | number)[] = [];
    const filteredArray: (string | number)[] = [];
    const filtered = this._filteredFeatureIds;
    if (filtered) {
      this._getFeatures().forEach((x) => {
        const id = this._getFeatureFilterId(x);
        if (id !== undefined && filtered.indexOf(id) !== -1) {
          if (selected && selected.indexOf(id) !== -1) {
            selectionArray.push(id);
          } else {
            filteredArray.push(id);
          }
        }
      });
    } else if (selected) {
      selectionArray = selected;
    }
    this.selected = !!selected;
    const layers = this.layer;
    if (layers) {
      this._types.forEach((t) => {
        const geomType = typeAliasForFilter[t];
        if (geomType) {
          const geomFilter = ['==', '$type', geomType];
          const layerName = this._getLayerNameFromType(t);
          const selLayerName = this._getSelectionLayerNameFromType(t);
          if (layers.indexOf(selLayerName) !== -1) {
            if (this._selectionName) {
              this.map.setFilter(selLayerName, [
                'all',
                geomFilter,
                ['in', this.featureIdName, ...selectionArray],
              ]);
            }
          }
          if (layers.indexOf(layerName) !== -1) {
            const filter_: any[] = ['all', geomFilter];
            if (filtered) {
              filter_.push(['in', this.featureIdName, ...filteredArray]);
            } else {
              filter_.push(['!in', this.featureIdName, ...selectionArray]);
              this._updateWithNativeFilter(filter_);
            }
            this.map.setFilter(layerName, filter_);
          }
        }
      });
    }
  }

  private _getFeatures(): Feature[] {
    if (this.source) {
      // const features = this.map.querySourceFeatures(this.source);
      // return features;

      const source = this.map.getSource(this.source);
      if (source) {
        // @ts-ignore
        return source._data ? source._data.features : [];
      }
    }
    return this._features;
  }

  private _filter(fun: DataLayerFilter<Feature, TLayer>) {
    const filtered: (string | number)[] = [];
    this._getFeatures().forEach((feature) => {
      const ok = fun({ feature });
      const id = this._getFeatureFilterId(feature);
      if (ok && id) {
        filtered.push(id);
      }
    });
    this._filteredFeatureIds = filtered;
    this._updateFilter();
  }

  private filterGeometries(
    data: GeoJsonObject,
    type: VectorAdapterLayerType,
  ): Feature[] {
    let newFeatures: Feature[] = [];
    if (data.type === 'FeatureCollection') {
      const features = (data as FeatureCollection).features.filter((f) =>
        geometryFilter(f.geometry.type, type),
      ) as Feature[];
      (data as FeatureCollection).features = features;
      newFeatures = features;
    } else if (data.type === 'Feature') {
      const allow = geometryFilter((data as Feature).geometry.type, type);
      if (!allow) {
        return [];
      }
      newFeatures.push(data as Feature);
    } else if (data.type === 'GeometryCollection') {
      const geomCollection = data as GeometryCollection;
      geomCollection.geometries = geomCollection.geometries.filter((g) =>
        geometryFilter(g.type, type),
      );
      newFeatures = geomCollection.geometries.map((x) => {
        const f: Feature = {
          type: 'Feature',
          geometry: x as GeometryObject,
          properties: {},
        };
        return f;
      });
    } else if (typeAlias[data.type]) {
      const obj: Feature = {
        type: 'Feature',
        geometry: data as GeometryObject,
        properties: {},
      };
      newFeatures = [obj];
    }
    this._features = this._features.concat(newFeatures);
    return newFeatures;
  }

  private async _getPaintFromCallback(
    paint: GetPaintCallback,
    type: VectorAdapterLayerType,
    name: string,
  ) {
    const style: any = {};
    style.type = paint.type;
    for (const feature of this._features) {
      const _paint = paint(feature);
      if (_paint.type === 'icon') {
        await this._registerImage(_paint);
        if (feature.properties) {
          feature.properties['_icon-image-' + name] = _paint.html;
        }
        style['icon-image'] = `{_icon-image-${name}}`;
      } else {
        for (const p in _paint) {
          // @ts-ignore
          const toSave = _paint[p];
          if (feature.properties) {
            feature.properties[`_paint_${p}_${name}`] = toSave;
          }
          style[p] = ['get', `_paint_${p}_${name}`];
        }
      }
    }
    if ('icon-image' in style) {
      return style;
    }
    const styleFromCb = this._createPaintForType(style, type, name);
    return styleFromCb;
  }

  private _fireOnLayerSelectEvent() {
    if (this.options.onLayerSelect) {
      const features_: Feature[] = [];
      this.getSelected().forEach((x) => {
        if (x.feature) {
          features_.push(x.feature);
        }
      });
      const features = features_.length ? features_ : undefined;
      this.options.onLayerSelect({
        layer: this,
        features,
      });
    }
  }
}
