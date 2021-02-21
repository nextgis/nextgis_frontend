import { GeoJsonObject, Feature, FeatureCollection } from 'geojson';
import {
  GeoJsonDataSource,
  Color,
  PinBuilder,
  Cartesian3,
  VerticalOrigin,
  Property,
  CallbackProperty,
  Cartographic,
  Entity,
  HeightReference,
  JulianDate,
} from 'cesium';

import {
  VectorLayerAdapter,
  GeoJsonAdapterOptions,
  DataLayerFilter,
  LayerDefinition,
  LngLatBoundsArray,
} from '@nextgis/webmap';
import { PropertiesFilter } from '@nextgis/properties-filter';
import {
  VectorAdapterLayerPaint,
  isPaintCallback,
  Paint,
  isBasePaint,
  isPaint,
  GeometryPaint,
  PinPaint,
} from '@nextgis/paint';

import { BaseAdapter, Map } from './BaseAdapter';
import { whenSampleTerrainMostDetailed } from '../utils/whenSampleTerrainMostDetailed';
import { isFeature3D } from '../utils/isFeature3D';
import { getEntitiesBoundingSphere } from '../utils/getEntitiesBoundingSphere';
import { getExtentFromBoundingSphere } from '../utils/getExtentFromBoundingSphere';

type Layer = GeoJsonDataSource;

interface NativeGeojsonOptions {
  watchTerrainChange?: boolean;
}

type AdapterOptions = GeoJsonAdapterOptions<any, any, NativeGeojsonOptions>;

interface GeoJsonDataSourceLoadOptions {
  sourceUri?: string;
  markerSize?: number;
  markerSymbol?: string;
  markerColor?: Color;
  stroke?: Color;
  strokeWidth?: number;
  fill?: Color;
  clampToGround?: boolean;
}

export class GeoJsonAdapter
  extends BaseAdapter<AdapterOptions>
  implements VectorLayerAdapter<Map> {
  selected = false;

  private readonly _pinBuilder = new PinBuilder();
  private _paint?: Paint;
  private _features: Feature[] = [];
  private _source?: GeoJsonDataSource;

  onTerrainChange = (): void => {
    this.watchHeight();
  };

  addLayer(opt: AdapterOptions): GeoJsonDataSource {
    this.options = { ...this.options, ...opt };
    this._paint = this.options.paint;
    const source = new GeoJsonDataSource(opt.id);
    this._source = source;
    if (opt.data) {
      this.addData(opt.data);
    }
    return source;
  }

  showLayer(): void {
    if (this._source) {
      this.map.dataSources.add(this._source);
    }
    super.showLayer();
  }

  hideLayer(): void {
    if (this._source) {
      this.map.dataSources.remove(this._source);
    }
    super.hideLayer();
  }

  clearLayer(cb?: (feature: Feature) => boolean): void {
    this._clearLayer();
    this.map.scene.requestRender();
  }

  setData(data: GeoJsonObject): Promise<void> {
    this._clearLayer();
    return this.addData(data);
  }

  addData(data: GeoJsonObject): Promise<void> {
    if (this._source) {
      if (data.type === 'Feature') {
        this._features.push(data as Feature);
      } else if (data.type === 'FeatureCollection') {
        const featureCollection = data as FeatureCollection;
        featureCollection.features.forEach((x) => this._features.push(x));
      }
      return this._updateSource().then(() => {
        this.map.scene.requestRender();
      });
    }
    return Promise.resolve();
  }

  getExtent(): LngLatBoundsArray | undefined {
    if (this._source) {
      const boundingSphere = getEntitiesBoundingSphere(
        this.map,
        this._source.entities.values
      );
      if (boundingSphere) {
        return getExtentFromBoundingSphere(boundingSphere);
      }
    }
    return undefined;
  }

  select(findFeatureCb?: DataLayerFilter<Feature> | PropertiesFilter): void {
    if (this._source) {
      const values = this._source.entities.values;
      if (values.length) {
        this.selected = true;
        const entry = values[values.length - 1];
        this.map.selectedEntity = entry;
        this.map.scene.requestRender();
      }
    }
  }

  unselect(findFeatureCb?: DataLayerFilter<Feature> | PropertiesFilter): void {
    if (this._source) {
      if (this.selected) {
        this.map.selectedEntity = undefined;
        this.map.scene.requestRender();
        this.selected = false;
      }
    }
  }

  getLayers(): LayerDefinition[] {
    if (this._source) {
      return this._source?.entities.values.map((x) => {
        return {
          layer: x,
        };
      });
    }
    return [];
  }

  getSelected(): LayerDefinition[] {
    return [];
  }

  filter(fun?: DataLayerFilter<Feature, Layer>): LayerDefinition[] {
    return [];
  }

  cleanFilter(): void {
    //
  }

  private _clearLayer(): void {
    if (this._source) {
      this._source.entities.removeAll();
      this._features = [];
    }
  }

  private _updateSource(): Promise<void> {
    const source = this._source;
    if (source) {
      source.entities.removeAll();
      const promises: Promise<any>[] = [];
      this._features.forEach((x) => {
        const paint = this._getFeaturePaint(x, this.options.paint);
        if (isBasePaint(paint)) {
          if (paint.type === 'pin') {
            promises.push(this._addPin(x, paint));
          } else {
            promises.push(this._addFromGeoJson(x, paint));
          }
        }
      });
      return Promise.all(promises).then((x) => {
        this.watchHeight();
      });
    }
    return Promise.resolve();
  }

  private async _addPin(obj: Feature, paint: PinPaint) {
    const source = this._source;
    if (source) {
      const colorStr = paint.fillColor || paint.color;
      const color = Color.fromCssColorString(
        typeof colorStr === 'string' && colorStr ? colorStr : 'blue'
      );
      const size = typeof paint.size === 'number' ? paint.size : 42;
      const iconFont = paint.iconfont || 'maki';
      let pin: HTMLCanvasElement | Promise<HTMLCanvasElement> | undefined;
      if (typeof paint.icon === 'string' && paint.icon && iconFont === 'maki') {
        try {
          const icon = paint.icon.replace(/-11|-15$/, '');
          pin = await this._pinBuilder.fromMakiIconId(icon, color, size);
        } catch {
          // ignore
        }
      }
      if (!pin) {
        pin =
          typeof paint.symbol === 'string'
            ? this._pinBuilder.fromText(paint.symbol, color, size)
            : this._pinBuilder.fromColor(color, size);
      }
      if (pin && obj.type === 'Feature' && obj.geometry.type === 'Point') {
        const lonLat = obj.geometry.coordinates;
        const canvas = await pin;

        const nameField = this.options.labelField || 'name';
        let name = '';
        if (obj.properties && nameField in obj.properties) {
          name = obj.properties && obj.properties[nameField];
        }
        const description =
          this.options.popupOptions?.createPopupContent &&
          this._getDescription(obj);
        source.entities.add({
          position: Cartesian3.fromDegrees(lonLat[0], lonLat[1]),
          name: name || (obj.id !== undefined ? 'Feature#' + obj.id : ''),
          description: description || undefined,
          billboard: {
            heightReference: HeightReference.CLAMP_TO_GROUND,
            image: canvas.toDataURL(),
            verticalOrigin: VerticalOrigin.BOTTOM,
          },
        });
      }
    }
  }

  private _getDescription(feature: Feature): Property {
    //@ts-ignore
    return {
      getValue: () => {
        if (this.options.popupOptions?.createPopupContent) {
          const content = this.options.popupOptions.createPopupContent({
            feature,
          });
          if (content instanceof HTMLElement) {
            return content.outerHTML;
          }
          return content;
        }
        // return '';
      },
    };
  }

  private _addFromGeoJson(
    feature: Feature,
    paint: GeometryPaint
  ): Promise<void> {
    const source = this._source;
    if (source) {
      const options: GeoJsonDataSourceLoadOptions = {};
      const color = paint.color || 'blue';
      const fillColor = paint.fillColor || color;

      const fill = paint.fill ?? true;
      if (fill && color && typeof fillColor === 'string') {
        options.fill = Color.fromCssColorString(fillColor);
        if (typeof paint.fillOpacity === 'number') {
          options.fill.alpha = paint.fillOpacity;
        }
        options.markerColor = Color.fromCssColorString(fillColor);
      }
      // not work with clampToGround
      if (paint.stroke || paint.strokeColor) {
        const strokeColor = paint.strokeColor || color;
        if (typeof strokeColor === 'string') {
          options.stroke = Color.fromCssColorString(strokeColor);
          if (typeof paint.strokeOpacity === 'number') {
            options.stroke.alpha = paint.strokeOpacity;
          }
        }
        if (typeof paint.weight === 'number') {
          options.strokeWidth = paint.weight;
        }
      }
      if (typeof paint.radius === 'number') {
        // magic 4
        options.markerSize = paint.radius * 4;
      }
      // do not claim to ground features with self Z coordinates
      if (isFeature3D(feature)) {
        options.clampToGround = false;
      }

      const dataSource = new GeoJsonDataSource();
      return dataSource.load(feature, options).then((x) => {
        dataSource.entities.values.forEach((y) => {
          const height = this._getEntityHeight(y, paint);
          if (height && y.polygon) {
            y.polygon.extrudedHeight = height as any;
            // if define through CallbackProperty, then fps drops dramatically
            // y.polygon.extrudedHeight = new CallbackProperty(() => {
            //   return height;
            // }, false);
          }
          const description =
            this.options.popupOptions?.createPopupContent &&
            this._getDescription(feature);
          if (description) {
            y.description = description;
          }
          source.entities.add(y);
        });
      });
    }
    return Promise.resolve();
  }

  private _getFeaturePaint(
    feature: Feature,
    paint?: Paint
  ): VectorAdapterLayerPaint {
    if (paint) {
      if (isPaintCallback(paint)) {
        return this._getFeaturePaint(feature, paint(feature));
      } else if (isPaint(paint)) {
        return paint;
      }
    }
    return {};
  }

  private _getEntityHeight(entity: Entity, paint?: Paint): number | undefined {
    paint = paint || this._paint;
    // @ts-ignore
    const feature: Feature = {
      type: 'Feature',
      properties: entity.properties || {},
    };
    const featurePaint = this._getFeaturePaint(feature, paint);
    if (paint && 'extrude3d' in featurePaint) {
      return featurePaint.extrude3d as number;
    }
  }

  private watchHeight() {
    const watchTerrainChange =
      this.options.nativeOptions &&
      this.options.nativeOptions.watchTerrainChange !== undefined
        ? this.options.nativeOptions.watchTerrainChange
        : true;
    if (this._source && watchTerrainChange) {
      const entities = this._source.entities.values;
      const entriesOnTerrain: Entity[] = [];
      const terrainSamplePositions: Cartographic[] = [];
      entities.forEach((x) => {
        let position: Cartesian3 | undefined;
        if (x.polygon) {
          position = x.polygon.hierarchy?.getValue(JulianDate.now())
            .positions[0];
        } else if (x.point) {
          console.log(x.point);
        }
        if (position) {
          terrainSamplePositions.push(Cartographic.fromCartesian(position));
          entriesOnTerrain.push(x);
        }
      });
      if (entriesOnTerrain.length) {
        whenSampleTerrainMostDetailed(
          this.map.terrainProvider,
          terrainSamplePositions,
          () => {
            for (let i = 0; i < entriesOnTerrain.length; i++) {
              const entity = entriesOnTerrain[i];
              const terrainSamplePosition = terrainSamplePositions[i];
              if (
                entity.polygon &&
                terrainSamplePosition &&
                terrainSamplePosition.height
              ) {
                const terrainHeight = terrainSamplePosition.height;
                entity.polygon.height = new CallbackProperty(() => {
                  return terrainHeight;
                }, false);
                const height = this._getEntityHeight(entity);
                if (height !== undefined) {
                  entity.polygon.extrudedHeight = new CallbackProperty(() => {
                    return height + terrainHeight;
                  }, false);
                }
              }
            }
          }
        );
      }
    }
  }
}
