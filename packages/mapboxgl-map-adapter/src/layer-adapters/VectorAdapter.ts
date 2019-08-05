import {
  VectorAdapterLayerType,
  VectorAdapterLayerPaint,
  GetPaintCallback,
  IconOptions,
  VectorLayerAdapter,
  VectorAdapterOptions
} from '@nextgis/webmap';
import { Feature as F, GeometryObject, Geometry, GeoJsonProperties } from 'geojson';
import {
  Map,
  MapLayerMouseEvent,
  AnySourceData
  // BackgroundPaint, FillPaint, FillExtrusionPaint, LinePaint, SymbolPaint,
  // RasterPaint, CirclePaint, HeatmapPaint, HillshadePaint,
} from 'mapbox-gl';

// type MapboxPaint = BackgroundPaint | FillPaint | FillExtrusionPaint | LinePaint | SymbolPaint |
//   RasterPaint | CirclePaint | HeatmapPaint | HillshadePaint;

import { getImage } from '../util/image_icons';
import { TLayer } from '../MapboxglMapAdapter';
import { BaseAdapter } from './BaseAdapter';
import { typeAliasForFilter, allowedByType } from '../util/geom_type';

export interface Feature<G extends GeometryObject | null = Geometry, P = GeoJsonProperties> extends F<G, P> {
  _rendromId?: string;
}

const PAINT = {
  color: 'blue',
  opacity: 1,
  radius: 10
};

type MapboxLayerType = 'fill' | 'line' | 'symbol' | 'circle';

export abstract class VectorAdapter<O extends VectorAdapterOptions = VectorAdapterOptions> extends BaseAdapter<O>
  implements VectorLayerAdapter<Map, TLayer, O, Feature> {
  selected: boolean = false;

  protected featureIdName = 'id';
  protected _types: VectorAdapterLayerType[] = ['fill', 'circle', 'line'];
  protected readonly _sourceId: string;
  protected readonly _selectionName: string;
  protected _selectedFeatureIds: string[] = [];

  private $onLayerClick?: (e: MapLayerMouseEvent) => void;

  constructor(public map: Map, public options: O) {
    super(map, options);
    this._sourceId = `source-${this._layerId}`;
    this._selectionName = this._layerId + '-highlighted';
    this.$onLayerClick = this._onLayerClick.bind(this);
  }

  async addLayer(options: O): Promise<TLayer> {
    options = this.options = { ...this.options, ...(options || {}) };

    this.layer = [];
    const types = (this._types = options.type ? [options.type] : this._types);
    if (options.paint) {
      this._onAddLayer(this._sourceId);
      // const types = this._types;
      for (const t of types) {
        const geomType = typeAliasForFilter[t];
        if (geomType) {
          let type = t;
          if (t === 'circle') {
            const paintType = this._detectPaintType(options.paint);
            if (paintType === 'icon') {
              type = 'icon';
            }
          }
          const layer = this._getLayerNameFromType(t);
          const geomFilter = ['==', '$type', geomType];
          await this._addLayer(layer, type, geomFilter);
          this.layer.push(layer);
          if (options.selectedPaint) {
            const selectionLayer = this._getSelectionLayerNameFromType(t);
            await this._addLayer(selectionLayer, type, ['all', geomFilter, ['in', this.featureIdName, '']]);
            this.layer.push(selectionLayer);
          }
        }
      }
    }

    this._addEventsListeners();

    return this.layer;
  }

  removeLayer() {
    const map = this.map;
    if (this.layer) {
      this.layer.forEach(layerId => {
        map.removeLayer(layerId);
      });
    }
  }

  protected _onAddLayer(sourceId: string, options?: AnySourceData) {
    // ignore
  }

  protected async _updateLayerPaint(type: VectorAdapterLayerType) {
    const layerName = this._getLayerNameFromType(type);

    if (this.options.paint) {
      const layers: Array<[string, VectorAdapterLayerPaint | GetPaintCallback]> = [[layerName, this.options.paint]];
      if (this.options.selectedPaint) {
        const selName = this._getSelectionLayerNameFromType(type);
        layers.push([selName, this.options.selectedPaint]);
      }

      for (const [name, paint] of layers) {
        let _paint: any;
        if (this.options.nativePaint) {
          _paint = paint;
        } else {
          _paint = await this._createPaintForType(paint, type);
        }

        if ('icon-image' in _paint) {
          // If true, the icon will be visible even if it collides with other previously drawn symbols.
          _paint['icon-allow-overlap'] = true;
          for (const p in _paint) {
            this.map.setLayoutProperty(name, p, _paint[p]);
          }
        } else {
          for (const p in _paint) {
            this.map.setPaintProperty(name, p, _paint[p]);
          }
        }
      }
    }
  }

  protected _getLayerNameFromType(type: VectorAdapterLayerType) {
    return type + '-' + this._layerId;
  }

  protected _getSelectionLayerNameFromType(type: VectorAdapterLayerType) {
    return type + '-' + this._selectionName;
  }

  protected async _createPaintForType(
    paint: VectorAdapterLayerPaint | GetPaintCallback,
    type: VectorAdapterLayerType,
    name?: string
  ): Promise<any> {
    if (typeof paint !== 'function') {
      const mapboxPaint: any = {};
      const _paint = { ...PAINT, ...(paint || {}) };
      if (paint.type === 'icon' && paint.html) {
        await this._registerImage(paint);
        return {
          'icon-image': paint.html
        };
      } else {
        for (const p in _paint) {
          const allowed = allowedByType[type];
          if (allowed) {
            const allowedType = allowed.find(x => {
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
        mapboxPaint[type + '-opacity-transition'] = { duration: 0 };
        return mapboxPaint;
      }
    }
  }

  protected _getRendromId(feature: Feature): string | undefined {
    // @ts-ignore
    return feature.id;
  }

  protected async _registerImage(paint: IconOptions) {
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

  protected _selectFeature(feature: Feature | Feature[]) {
    // ignore
  }

  protected _unselectFeature(feature: Feature | Feature[]) {
    // ignore
  }

  protected _getAdditionalLayerOptions() {
    return {};
  }

  protected async _addLayer(name: string, type: VectorAdapterLayerType, filter?: any) {
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
        visibility: 'none'
      },
      filter,
      ...this._getAdditionalLayerOptions()
    };

    this.map.addLayer(layerOpt);
  }

  private _onLayerClick(e: mapboxgl.MapLayerMouseEvent) {
    e.preventDefault();
    const features = this.map.queryRenderedFeatures(e.point, { layers: this.layer });
    const feature = features[0] as Feature;
    if (feature) {
      const id = this._getRendromId(feature);
      if (id !== undefined) {
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
  }

  private _detectPaintType(paint: VectorAdapterLayerPaint | GetPaintCallback): string | undefined {
    if ('type' in paint) {
      return paint.type;
    } else if (typeof paint === 'function') {
      try {
        const falsePaint = paint({ type: 'Feature', properties: {}, geometry: {} as Geometry });
        return this._detectPaintType(falsePaint);
      } catch (er) {
        //
      }
    }
  }

  private _addEventsListeners() {
    if (this.layer && this.options && this.options.selectable) {
      this.layer.forEach(x => {
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
}
