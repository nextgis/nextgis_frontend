import { isBasePaint, isPaint, isPaintCallback } from '@nextgis/paint';
import {
  Cartesian3,
  Cartographic,
  Color,
  GeoJsonDataSource,
  HeightReference,
  JulianDate,
  PinBuilder,
  VerticalOrigin,
} from 'cesium';

import { getBoundsFromBoundingSphere } from '../utils/getBoundsFromBoundingSphere';
import { getEntitiesBoundingSphere } from '../utils/getEntitiesBoundingSphere';
import { isFeature3D } from '../utils/isFeature3D';
import { whenSampleTerrainMostDetailed } from '../utils/whenSampleTerrainMostDetailed';

import { BaseAdapter } from './BaseAdapter';

import type {
  Ellipsoid3DPaint,
  GeometryPaint,
  Paint,
  PinPaint,
  Sphere3DPaint,
  VectorAdapterLayerPaint,
} from '@nextgis/paint';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type { LngLatBoundsArray } from '@nextgis/utils';
import type {
  CreatePopupContentProps,
  DataLayerFilter,
  GeoJsonAdapterOptions,
  LayerDefinition,
  VectorLayerAdapter,
} from '@nextgis/webmap';
import type { EllipsoidGraphics, Entity, Property } from 'cesium';
import type {
  Feature,
  FeatureCollection,
  GeoJsonObject,
  GeoJsonProperties,
  Geometry,
} from 'geojson';

import type { Map } from './BaseAdapter';

type Layer = GeoJsonDataSource;

interface NativeGeojsonOptions {
  watchTerrainChange?: boolean;
}

type AdapterOptions = GeoJsonAdapterOptions<Feature, any, NativeGeojsonOptions>;

interface GeoJsonDataSourceLoadOptions {
  fill?: Color;
  stroke?: Color;
  strokeWidth?: number;
  markerColor?: Color;
  markerSize?: number;
  markerSymbol?: string;
  clampToGround?: boolean;
  sourceUri?: string;
}

export class GeoJsonAdapter
  extends BaseAdapter<AdapterOptions>
  implements VectorLayerAdapter<Map>
{
  selected = false;

  private readonly _pinBuilder = new PinBuilder();
  private _paint?: Paint;
  private _features: Feature[] = [];
  private _source?: GeoJsonDataSource;
  private _heightOffset = 0;
  private _popupContainers: {
    [featureId: string]:
      | string
      | HTMLElement
      | Promise<string | HTMLElement | undefined>
      | undefined;
  } = {};
  private _currentPopupId: number | string | null = null;

  onTerrainChange = (): void => {
    this.watchHeight();
  };

  addLayer(opt: AdapterOptions): GeoJsonDataSource {
    this.options = { ...this.options, ...opt };
    if (this.options.heightOffset) {
      this._heightOffset = this.options.heightOffset;
    }
    this._paint = this.options.paint;
    const source = new GeoJsonDataSource(opt.id);
    this._source = source;
    if (opt.data) {
      this.addData(opt.data);
    }

    return source;
  }

  removeLayer(): void {
    const viewer = this.map;
    if (viewer && this._source) {
      viewer.dataSources.remove(this._source);
      this.map.scene.requestRender();
    }
  }

  beforeRemove() {
    this._destroyPopupContainer();
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
        this._features.push(...featureCollection.features);
      }
      return this._updateSource().then(() => {
        this.map.scene.requestRender();
      });
    }
    return Promise.resolve();
  }

  /** @deprecated use {@link GeoJsonAdapter.getBounds} instead */
  getExtent(): LngLatBoundsArray | undefined {
    return this.getBounds();
  }

  getBounds(): LngLatBoundsArray | undefined {
    if (this._source) {
      const boundingSphere = getEntitiesBoundingSphere(
        this.map,
        this._source.entities.values,
      );
      if (boundingSphere) {
        return getBoundsFromBoundingSphere(boundingSphere);
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
    this._destroyPopupContainer();
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
      }) as LayerDefinition[];
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
      for (const x of this._features) {
        const paint = this._getFeaturePaint(x, this.options.paint);
        if (isBasePaint(paint)) {
          if (paint.type === 'pin') {
            promises.push(this._addPin(x, paint));
          } else if (paint.type === 'ellipsoid') {
            const ellipsoidPaint3d = paint as Partial<Ellipsoid3DPaint>;
            promises.push(this._addEllipsoid(x, ellipsoidPaint3d));
          } else if (paint.type === 'sphere') {
            const spherePaint3d = paint as Partial<Sphere3DPaint>;
            const spherePaint3dMerge = paint as Partial<Sphere3DPaint>;
            const radius = spherePaint3d.radius;
            const ellipsoidPaint3d = {
              ...spherePaint3dMerge,
              type: 'ellipsoid',
              width: radius,
              length: radius,
              height: radius,
            } as Ellipsoid3DPaint;
            promises.push(this._addEllipsoid(x, ellipsoidPaint3d));
          } else {
            promises.push(this._addFromGeoJson(x, paint));
          }
        }
      }
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
        typeof colorStr === 'string' && colorStr ? colorStr : 'blue',
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

        const nameField = String(this.options.labelField || 'name');
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

  private _addEllipsoid(
    obj: Feature,
    paint: Partial<Ellipsoid3DPaint>,
  ): Promise<void> {
    const source = this._source;
    if (!source) {
      return Promise.reject();
    }
    const nameField = String(this.options.labelField || 'name');
    let name = '';
    if (obj.properties && nameField in obj.properties) {
      name = obj.properties && obj.properties[nameField];
    }
    if (obj.type === 'Feature' && obj.geometry.type === 'Point') {
      const lonLat = obj.geometry.coordinates;

      const options: EllipsoidGraphics | EllipsoidGraphics.ConstructorOptions =
        {
          radii: new Cartesian3(paint.length, paint.width, paint.height),
        };
      const color = paint.color || 'blue';
      const fillColor = paint.fillColor || color;

      const fill = paint.fill ?? true;
      if (fill && color && typeof fillColor === 'string') {
        options.material = Color.fromCssColorString(fillColor);
      }
      // not work with clampToGround
      if (paint.stroke || paint.strokeColor) {
        const strokeColor = paint.strokeColor || color;
        options.outline = true;
        if (typeof strokeColor === 'string') {
          options.outlineColor = Color.fromCssColorString(strokeColor);
        }
        if (typeof paint.strokeWidth === 'number') {
          options.outlineWidth = paint.strokeWidth;
        }
      }
      const position = Cartesian3.fromDegrees(
        lonLat[0],
        lonLat[1],
        lonLat[2] + this._heightOffset,
      );

      // const orientation = Transforms.headingPitchRollQuaternion(
      //   position,
      //   new HeadingPitchRoll(Math.toRadians(30.0), Math.toRadians(30.0), 0.0),
      // );

      const description =
        this.options.popupOptions?.createPopupContent &&
        this._getDescription(obj);

      source.entities.add({
        name: name || (obj.id !== undefined ? 'Feature#' + obj.id : ''),
        position,
        description,
        // orientation,
        ellipsoid: options,
      });
    }
    return Promise.resolve();
  }

  private _destroyPopupContainer() {
    this._popupContainers = {};
  }

  private _getDescription(feature: Feature): Property {
    const close = () => {
      // ignore
    };
    const onClose = () => {
      // ignore
    };

    const showContent = (
      elem:
        | string
        | HTMLElement
        | Promise<string | HTMLElement | undefined>
        | undefined,
    ) => {
      if (elem instanceof HTMLElement) {
        return elem.outerHTML;
      }
      return elem;
    };

    // @ts-expect-error is missing the following properties from type 'Property': isConstant, definitionChanged, equals
    return {
      getValue: () => {
        const id = feature.id;
        if (id !== undefined) {
          if (id === this._currentPopupId) {
            const exist = this._popupContainers[id];
            if (exist) {
              return showContent(exist);
            }
          } else {
            this._popupContainers = {};
          }
          this._currentPopupId = id;
        }
        if (this.options.popupOptions?.createPopupContent) {
          const props: CreatePopupContentProps<
            Feature<Geometry, GeoJsonProperties>,
            any
          > = {
            feature,
            type: 'api',
            target: this,
            close,
            onClose,
            getBounds: () => [],
            getCenter: () => [],
          };
          const content = this.options.popupOptions.createPopupContent(props);
          if (id !== undefined) {
            this._popupContainers[id] = content;
          }
          return showContent(content);
        }
        return '';
      },
    };
  }

  private _addFromGeoJson(
    feature: Feature,
    paint: GeometryPaint,
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
        for (const y of dataSource.entities.values) {
          const height = this._getEntityHeight(y, paint);
          if (height && y.polygon) {
            // if define through CallbackProperty, then fps drops dramatically
            y.polygon.extrudedHeight = height as any;
          }
          const description =
            this.options.popupOptions?.createPopupContent &&
            this._getDescription(feature);
          if (description) {
            y.description = description;
          }
          source.entities.add(y);
        }
      });
    }
    return Promise.resolve();
  }

  private _getFeaturePaint(
    feature: Feature,
    paint?: Paint,
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

    const feature = {
      type: 'Feature',
      properties: entity.properties || {},
    } as Feature;
    const featurePaint = this._getFeaturePaint(feature, paint);
    if (paint && 'extrude3d' in featurePaint) {
      return featurePaint.extrude3d as number;
    }
  }

  private _getEntityPosition(entity: Entity): Cartesian3 | undefined {
    let position: Cartesian3 | undefined;
    if (entity.polygon) {
      position = entity.polygon.hierarchy?.getValue(JulianDate.now())
        .positions[0];
    } else if (entity.point) {
      // console.log(entity.point);
    }
    return position;
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
      for (const x of entities) {
        const position = this._getEntityPosition(x);
        if (position) {
          terrainSamplePositions.push(Cartographic.fromCartesian(position));
          entriesOnTerrain.push(x);
        }
      }
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
                // if define through CallbackProperty, then fps drops dramatically
                entity.polygon.height = terrainHeight as any;
                const height = this._getEntityHeight(entity);
                if (height !== undefined) {
                  // if define through CallbackProperty, then fps drops dramatically
                  entity.polygon.extrudedHeight = (height +
                    terrainHeight) as any;
                }
              }
            }
          },
        );
      }
    }
  }
}
