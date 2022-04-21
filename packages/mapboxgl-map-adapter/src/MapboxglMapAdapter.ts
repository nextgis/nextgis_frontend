import { EventEmitter } from 'events';

import { Map } from 'maplibre-gl';

import { debounce } from '@nextgis/utils';

import { WmsAdapter } from './layer-adapters/WmsAdapter';
import { MvtAdapter } from './layer-adapters/MvtAdapter';
import { OsmAdapter } from './layer-adapters/OsmAdapter';
import { TileAdapter } from './layer-adapters/TileAdapter';
import { GeoJsonAdapter } from './layer-adapters/GeoJsonAdapter';
import { ZoomControl } from './controls/ZoomControl';
import { createControl } from './controls/createControl';
import { CompassControl } from './controls/CompassControl';
import { AttributionControl } from './controls/AttributionControl';
import { createButtonControl } from './controls/createButtonControl';
import { convertMapClickEvent } from './utils/convertMapClickEvent';

import type { LngLatBoundsArray, LngLatArray } from '@nextgis/utils';
import type {
  CreateControlOptions,
  ButtonControlOptions,
  ControlPosition,
  LayerAdapter,
  ViewOptions,
  MapAdapter,
  FitOptions,
  MapControl,
  MapOptions,
} from '@nextgis/webmap';
import type {
  IControl,
  MapEventType,
  MapMouseEvent,
  ResourceTypeEnum,
  LngLatBoundsLike,
  FitBoundsOptions,
  RequestParameters,
  MapSourceDataEvent,
  StyleSpecification,
  MapOptions as MapboxOptions,
} from 'maplibre-gl';
import { Feature } from './layer-adapters/VectorAdapter';
import { arrayToBoundsLike } from './utils/arrayToBoundsLike';

export type TLayer = string[];
export type UnselectCb = () => void;
type TLayerAdapter = LayerAdapter<Map, TLayer>;
const fitBoundsOptions: FitOptions = {
  // padding: 100
};

export interface MapboxglMapAdapterOptions extends MapOptions {
  style?: Partial<StyleSpecification> | string;
}

export class MapboxglMapAdapter implements MapAdapter<Map, TLayer, IControl> {
  static layerAdapters = {
    TILE: TileAdapter,
    WMS: WmsAdapter,
    // IMAGE: TileAdapter,
    MVT: MvtAdapter,
    OSM: OsmAdapter,
    GEOJSON: GeoJsonAdapter,
  };

  static controlAdapters: { [name: string]: any } = {
    ZOOM: ZoomControl,
    COMPASS: CompassControl,
    ATTRIBUTION: AttributionControl,
  };

  options: MapboxglMapAdapterOptions = {};
  map!: Map;

  emitter = new EventEmitter();

  layerAdapters = MapboxglMapAdapter.layerAdapters;
  controlAdapters = MapboxglMapAdapter.controlAdapters;
  isLoaded = false;

  private _universalEvents: (keyof MapEventType)[] = [
    'zoomstart',
    'zoom',
    'zoomend',
    'movestart',
    'move',
    'moveend',
  ];
  private _positionEvents: (keyof MapEventType)[] = [
    'mousemove',
    'mouseout',
    'mouseover',
  ];
  private _unselectCb: UnselectCb[] = [];
  private _sourceDataLoading: { [name: string]: any[] } = {};
  private __setLayerOrder: (layers: { [x: string]: TLayerAdapter }) => void;

  constructor() {
    this.__setLayerOrder = debounce((layers) => this._setLayerOrder(layers));
  }

  create(options: MapboxglMapAdapterOptions): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (!this.map) {
        this.options = options;
        if (options.target) {
          const style: StyleSpecification | string =
            typeof options.style === 'string'
              ? options.style
              : {
                  ...{
                    version: 8,
                    name: 'Empty style',
                    sources: {},
                    layers: [],
                  },
                  ...options.style,
                };
          const mapOpt: MapboxOptions = {
            style,
            container: options.target,
            attributionControl: false,
            bounds: options.bounds as LngLatBoundsLike,
            fitBoundsOptions: {
              ...options.fitOptions,
              ...fitBoundsOptions,
            },
            transformRequest: (
              url: string,
              resourceType?: ResourceTypeEnum,
            ) => {
              const transformed = this._transformRequest(url, resourceType);
              if (transformed) {
                return transformed;
              } else {
                return {
                  url,
                };
              }
            },
          };

          if (options.center !== undefined) {
            const center = options.center;
            mapOpt.center = [center[0], center[1]];
          }
          if (options.zoom !== undefined) {
            mapOpt.zoom = options.zoom - 1;
          }
          if (options.maxZoom) {
            mapOpt.maxZoom = options.maxZoom - 1;
          }
          if (options.minZoom) {
            mapOpt.minZoom = options.minZoom - 1;
          }
          this.map = new Map(mapOpt);
          this.map.once('load', () => {
            this.map.transformRequests = [];
            this.map._onMapClickLayers = [];
            this.map._addUnselectCb = (args) => this._addUnselectCb(args);
            this.isLoaded = true;
            this.emitter.emit('create', this);
            resolve(this);
          });
          this._addEventsListeners();
        }
      }
    });
  }

  destroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  getContainer(): HTMLElement | undefined {
    return this.map && this.map.getContainer();
  }

  setView(lngLat: LngLatArray, zoom?: number): void;
  setView(options: ViewOptions): void;
  setView(lngLatOrOpt: LngLatArray | ViewOptions, zoom?: number): void {
    const map = this.map;
    if (!map) return;
    if (Array.isArray(lngLatOrOpt)) {
      const c = lngLatOrOpt;
      const options: maplibregl.CameraOptions = {
        center: [c[0], c[1]],
      };
      if (zoom) {
        options.zoom = zoom - 1;
      }
      this.map.jumpTo(options);
    } else {
      const { zoom, center, maxBounds, bounds, minZoom, maxZoom } = lngLatOrOpt;
      if (maxBounds !== undefined) {
        // TODO: remove `as` after maplibre type fix
        map.setMaxBounds(
          arrayToBoundsLike(maxBounds as [number, number, number, number]),
        );
      }
      if (center && zoom !== undefined) {
        this.setView(center, zoom);
      } else {
        if (zoom !== undefined) {
          this.setZoom(zoom);
        }
        if (center) {
          this.setCenter(center);
        }
      }
      if (maxZoom !== undefined) {
        map.setMaxZoom(maxZoom - 1);
      }
      if (minZoom !== undefined) {
        map.setMinZoom(minZoom - 1);
      }
      if (bounds) {
        this.fitBounds(bounds);
      }
    }
  }

  setCenter(latLng: LngLatArray): void {
    if (this.map) {
      this.map.setCenter([latLng[0], latLng[1]]);
    }
  }

  getCenter(): LngLatArray | undefined {
    if (this.map) {
      const center = this.map.getCenter();
      return [center.lng, center.lat];
    }
  }

  setZoom(zoom: number): void {
    if (this.map) {
      this.map.setZoom(zoom - 1);
    }
  }

  getZoom(): number | undefined {
    if (this.map) {
      const zoom = this.map.getZoom();
      if (zoom < 1) {
        return undefined;
      }
      return zoom ? zoom + 1 : undefined;
    }
  }

  getBounds(): LngLatBoundsArray | undefined {
    if (this.map) {
      const bounds = this.map.getBounds();
      const ar = bounds.toArray();
      return [ar[0][0], ar[0][1], ar[1][0], ar[1][1]];
    }
  }

  // [extent_left, extent_bottom, extent_right, extent_top];
  fitBounds(e: LngLatBoundsArray, options: FitOptions = {}): void {
    if (this.map) {
      const opt: FitBoundsOptions = {
        linear: true,
        duration: 0,
        ...options,
        ...fitBoundsOptions,
      };
      if (options.maxZoom) {
        opt.maxZoom = options.maxZoom - 1;
      }
      this.map.fitBounds(arrayToBoundsLike(e), opt);
    }
  }

  setRotation(angle: number): void {
    // ignore
  }

  showLayer(layerIds: string[]): void {
    layerIds &&
      layerIds.forEach((layerId) => {
        this._toggleLayer(layerId, true);
      });
  }

  hideLayer(layerIds: string[]): void {
    layerIds &&
      layerIds.forEach((layerId) => {
        this._toggleLayer(layerId, false);
      });
  }

  removeLayer(layerIds: string[]): void {
    const _map = this.map;
    if (_map && layerIds && Array.isArray(layerIds)) {
      layerIds.forEach((layerId) => {
        _map.removeLayer(layerId);
        const source = _map.getSource(layerId);
        if (source) {
          _map.removeSource(layerId);
        }
      });
    }
  }

  setLayerOrder(
    layerIds: string[],
    order: number,
    layers: { [x: string]: TLayerAdapter },
  ): void {
    this.__setLayerOrder(layers);
  }

  setLayerOpacity(layerIds: string[], opacity: number): void {
    const _map = this.map;
    if (_map) {
      layerIds.forEach((layerId) => {
        this._onMapLoad().then(() => {
          const layer = _map.getLayer(layerId);
          if (layer) {
            if (layer.type === 'symbol') {
              _map.setPaintProperty(layerId, 'text-opacity', opacity);
              _map.setPaintProperty(layerId, 'icon-opacity', opacity);
            } else {
              _map.setPaintProperty(layerId, layer.type + '-opacity', opacity);
            }
          }
        });
      });
    }
  }

  createControl(control: MapControl, options?: CreateControlOptions): IControl {
    return createControl(control, options);
  }

  createButtonControl(options: ButtonControlOptions): IControl {
    return createButtonControl(options);
  }

  addControl(
    control: IControl,
    position: ControlPosition,
  ): IControl | undefined {
    if (this.map) {
      this.map.addControl(control, position);
      return control;
    }
  }

  removeControl(control: IControl): void {
    if (this.map) {
      this.map.removeControl(control);
    }
  }

  onMapClick(evt: MapEventType['click'] & MapMouseEvent): void {
    const map = this.map;
    const emitData = convertMapClickEvent(evt);
    this.emitter.emit('preclick', emitData);
    if (map) {
      const topFirst = map._onMapClickLayers.sort((a, b) => {
        if (a.options && a.options.order && b.options && b.options.order) {
          return b.options.order - a.options.order;
        }
        return 1;
      });
      let firstSelectedLayer: Feature | undefined = undefined;
      for (const l of topFirst) {
        let firstSelectedLayer_: Feature | undefined = undefined;
        if (!firstSelectedLayer) {
          firstSelectedLayer_ = l._onLayerClick(evt);
        }
        if (!firstSelectedLayer_) {
          const unselectOnClick = l.options.unselectOnClick ?? true;
          if (unselectOnClick) {
            l.unselect();
          }
        } else if (l.options.unselectOnSecondClick) {
          // l.unselect();
        }
        if (!firstSelectedLayer && firstSelectedLayer_) {
          firstSelectedLayer = firstSelectedLayer_;
        }
      }

      this.emitter.emit('click', emitData);
    }
  }

  private _onMapLoad(cb?: () => any): Promise<Map> {
    return new Promise<Map>((resolve) => {
      const _resolve = () => {
        if (cb) {
          cb();
        }
        if (this.map) {
          resolve(this.map);
        }
      };
      if (this.isLoaded) {
        // map.loaded()
        _resolve();
      } else if (this.map) {
        this.emitter.once('create', () => {
          _resolve();
        });
      }
    });
  }

  private _setLayerOrder(layers: { [x: string]: TLayerAdapter }): void {
    const _map = this.map;
    if (_map) {
      const baseLayers: TLayerAdapter[] = [];
      let orderedLayers: TLayerAdapter[] = [];
      for (const l in layers) {
        const layer = layers[l];
        if (layer.options.baselayer) {
          baseLayers.push(layer);
        } else {
          orderedLayers.push(layer);
        }
      }

      // normalize layer ordering
      baseLayers.forEach((x) => {
        if (x.layer) {
          x.layer.forEach((y) => {
            _map.moveLayer(y);
          });
        }
      });

      orderedLayers = orderedLayers.sort((a, b) => {
        return a.options.order !== undefined && b.options.order !== undefined
          ? a.options.order - b.options.order
          : 0;
      });

      for (let fry = 0; fry < orderedLayers.length; fry++) {
        const mem = orderedLayers[fry];
        const _layers = this._getLayerIds(mem);
        _layers.forEach((x) => {
          _map.moveLayer(x);
        });
      }
    }
  }

  private _getLayerIds(mem: TLayerAdapter): string[] {
    let _layers: TLayer = [];
    if (mem) {
      if (Array.isArray(mem.layer)) {
        _layers = mem.layer;
      } else if (mem.getDependLayers) {
        const dependLayers = mem.getDependLayers();
        dependLayers.forEach((x) => {
          // @ts-ignore Update x interface
          const layer: TLayer = (x.layer && x.layer.layer) || x;
          if (Array.isArray(layer)) {
            layer.forEach((y) => {
              _layers.push(y);
            });
          }
        });
      }
    }
    return _layers;
  }

  private _toggleLayer(layerId: string, status: boolean): void {
    this._onMapLoad().then((_map) => {
      _map.setLayoutProperty(
        layerId,
        'visibility',
        status ? 'visible' : 'none',
      );
    });
  }

  private _onMapSourceData(data: MapSourceDataEvent) {
    if (data.dataType === 'source') {
      const isLoaded = data.isSourceLoaded;
      const emit = (target: string) => {
        this.emitter.emit('data-loaded', { target });
      };
      this._onDataLoad(data, isLoaded, emit);
    }
  }

  private _onMapError(data: ErrorEvent & MapSourceDataEvent) {
    if (this._sourceDataLoading[data.sourceId]) {
      const isLoaded = data.isSourceLoaded;
      const emit = (target: string) => {
        this.emitter.emit('data-error', { target });
      };
      this._onDataLoad(data, isLoaded, emit);
    }
  }

  private _onDataLoad(
    data: { sourceId: string; tile: any },
    isLoaded = false,
    emit: (sourceId: string) => void,
  ) {
    // if all sources is loaded emmit event for all and clean mem
    if (isLoaded) {
      Object.keys(this._sourceDataLoading).forEach((x) => {
        emit(x);
      });
      this._sourceDataLoading = {};
    } else {
      // check if all tiles in layer is loaded
      const tiles = this._sourceDataLoading[data.sourceId];
      if (tiles && data.tile) {
        const index = tiles.indexOf(data.tile);
        if (index !== -1) {
          this._sourceDataLoading[data.sourceId].splice(index, 1);
        }
        // if no more loaded tiles in layer emit event and clean mem only for this layer
        if (!tiles.length) {
          emit(data.sourceId);
          delete this._sourceDataLoading[data.sourceId];
        }
      }
    }
  }

  private _addUnselectCb(cb: UnselectCb) {
    for (const p of this._unselectCb) {
      p();
    }
    this._unselectCb.length = 0;
    this._unselectCb.push(cb);
  }

  private _transformRequest(
    url: string,
    resourceType?: ResourceTypeEnum,
  ): RequestParameters | undefined {
    const transformRequests = this.map && this.map.transformRequests;
    if (transformRequests) {
      for (const r of transformRequests) {
        const params = r(url, resourceType) as RequestParameters;
        if (params) {
          return params;
        }
      }
      return undefined;
    }
  }

  private _addEventsListeners(): void {
    const _map = this.map;
    if (_map) {
      // write mem for start loaded layers
      _map.on('sourcedataloading', (data) => {
        this._sourceDataLoading[data.sourceId] =
          this._sourceDataLoading[data.sourceId] || [];
        if (data.tile) {
          this._sourceDataLoading[data.sourceId].push(data.tile);
        }
      });
      // emmit data-loaded for each layer or all sources is loaded
      _map.on('sourcedata', this._onMapSourceData.bind(this));
      _map.on('error', this._onMapError.bind(this));
      _map.on('click', (evt) => {
        this.onMapClick(evt);
      });

      for (const e of this._universalEvents) {
        _map.on(e, () => this.emitter.emit(e, this));
      }
      for (const e of this._positionEvents) {
        _map.on(e, (evt) =>
          this.emitter.emit(e, convertMapClickEvent(evt as MapMouseEvent)),
        );
      }
    }
  }
}
