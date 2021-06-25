import { EventEmitter } from 'events';
import mapboxgl, { Map } from 'mapbox-gl';

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

import type {
  MapAdapter,
  FitOptions,
  MapControl,
  ControlPosition,
  ButtonControlOptions,
  LngLatArray,
  MapOptions,
  LayerAdapter,
  LngLatBoundsArray,
  WebMapEvents,
  CreateControlOptions,
  MapClickEvent,
} from '@nextgis/webmap';
import type {
  IControl,
  MapEventType,
  EventData,
  MapboxOptions,
  RequestParameters,
  ResourceType,
  FitBoundsOptions,
} from 'mapbox-gl';

export type TLayer = string[];
type TLayerAdapter = LayerAdapter<Map, TLayer>;

const fitBoundsOptions: FitOptions = {
  // padding: 100
};

export interface MapboxglMapAdapterOptions extends MapOptions {
  style?: Partial<mapboxgl.Style> | string;
  accessToken?: string;
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

  private _universalEvents: (keyof WebMapEvents)[] = [
    'zoomstart',
    'zoom',
    'zoomend',
    'movestart',
    'move',
    'moveend',
  ];

  private _sourceDataLoading: { [name: string]: any[] } = {};
  private __setLayerOrder: (layers: { [x: string]: TLayerAdapter }) => void;

  constructor() {
    this.__setLayerOrder = debounce((layers) => this._setLayerOrder(layers));
  }

  // create(options: MapOptions = {target: 'map'}) {
  create(options: MapboxglMapAdapterOptions): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (!this.map) {
        this.options = options;
        if (options.accessToken) {
          mapboxgl.accessToken = options.accessToken;
        }
        if (options.target) {
          const mapOpt: MapboxOptions = {
            container: options.target,
            attributionControl: false,
            // @ts-ignore
            bounds: options.bounds,
            fitBoundsOptions: {
              ...options.fitOptions,
              ...fitBoundsOptions,
            },
            transformRequest: (url: string, resourceType: ResourceType) => {
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
          if (typeof options.style === 'string') {
            mapOpt.style = options.style;
          } else {
            mapOpt.style = {
              ...{
                version: 8,
                name: 'Empty style',
                sources: {},
                layers: [],
              },
              ...options.style,
            };
          }
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
            // @ts-ignore
            this.map._onMapClickLayers = [];
            // @ts-ignore
            this.map.transformRequests = [];
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

  setView(center: LngLatArray, zoom?: number): void {
    if (this.map) {
      const options: mapboxgl.CameraOptions = {
        center: [center[0], center[1]],
      };
      if (zoom) {
        options.zoom = zoom - 1;
      }
      this.map.jumpTo(options);
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
      this.map.fitBounds(
        [
          [e[0], e[1]],
          [e[2], e[3]],
        ],
        opt,
      );
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

  onMapClick(evt: MapEventType['click'] & EventData): void {
    const latLng = evt.lngLat;
    const { lng, lat } = latLng;
    const { x, y } = evt.point;
    const emitData: MapClickEvent = {
      latLng,
      lngLat: [lng, lat],
      pixel: { top: y, left: x },
    };
    this.emitter.emit('preclick', emitData);
    if (this.map) {
      // @ts-ignore
      this.map._onMapClickLayers
        // @ts-ignore
        .sort((a, b) => {
          if (a.options && a.options.order && b.options && b.options.order) {
            return b.options.order - a.options.order;
          }
          return 1;
        })
        // @ts-ignore
        .find((x) => {
          return x._onLayerClick(evt);
        });
    }

    this.emitter.emit('click', emitData);
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

  private _onMapSourceData(data: mapboxgl.MapSourceDataEvent & EventData) {
    if (data.dataType === 'source') {
      const isLoaded = data.isSourceLoaded;
      const emit = (target: string) => {
        this.emitter.emit('data-loaded', { target });
      };
      this._onDataLoad(data, isLoaded, emit);
    }
  }

  private _onMapError(
    data: mapboxgl.ErrorEvent & mapboxgl.MapSourceDataEvent & EventData,
  ) {
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

  private _transformRequest(
    url: string,
    resourceType: ResourceType,
  ): RequestParameters | undefined {
    // @ts-ignore
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

      this._universalEvents.forEach((e) => {
        _map.on(e, () => this.emitter.emit(e, this));
      });
    }
  }
}
