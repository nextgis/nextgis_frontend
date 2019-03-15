/**
 * @module mapboxgl-map-adapter
 */

import {
  MapAdapter,
  FitOptions,
  MapControl,
  ControlPositions,
  ButtonControlOptions,
  LngLatArray,
  MapOptions,
  LayerAdapter,
  LngLatBoundsArray,
  WebMapEvents
} from '@nextgis/webmap';
import { MvtAdapter } from './layer-adapters/MvtAdapter';
import { Map, IControl, MapEventType, EventData } from 'mapbox-gl';
import { OsmAdapter } from './layer-adapters/OsmAdapter';
import { TileAdapter } from './layer-adapters/TileAdapter';
import { EventEmitter } from 'events';
import { ZoomControl } from './controls/ZoomControl';
import { CompassControl } from './controls/CompassControl';
import { AttributionControl } from './controls/AttributionControl';
import { GeoJsonAdapter } from './layer-adapters/GeoJsonAdapter';
import { createControl } from './controls/createControl';
import { createButtonControl } from './controls/createButtonControl';

export type TLayer = string[];
type TLayerAdapter = LayerAdapter<Map, TLayer>;

export class MapboxglMapAdapter implements MapAdapter<Map, TLayer, IControl> {

  static layerAdapters = {
    TILE: TileAdapter,
    // IMAGE: ImageAdapter,
    MVT: MvtAdapter,
    OSM: OsmAdapter,
    GEOJSON: GeoJsonAdapter,
  };

  static controlAdapters: { [name: string]: any } = {
    ZOOM: ZoomControl,
    COMPASS: CompassControl,
    ATTRIBUTION: AttributionControl,
  };

  options: MapOptions = {};
  map?: Map;

  emitter = new EventEmitter();

  layerAdapters = MapboxglMapAdapter.layerAdapters;
  controlAdapters = MapboxglMapAdapter.controlAdapters;
  isLoaded = false;

  private _universalEvents: Array<keyof WebMapEvents> = [
    'zoomstart',
    'zoom',
    'zoomend',
    'movestart',
    'move',
    'moveend',
  ];

  private _sourceDataLoading: { [name: string]: any[] } = {};
  private _sortTimerId?: number;

  // create(options: MapOptions = {target: 'map'}) {
  create(options: MapOptions) {
    if (!this.map) {
      this.options = options;
      if (options.target) {
        this.map = new Map({
          container: options.target,
          attributionControl: false,
          style: {
            version: 8,
            name: 'Empty style',
            sources: {},
            layers: [],
          },
        });
        this._addEventsListeners();
        this.map.once('load', () => {
          this.isLoaded = true;
          this.emitter.emit('create', { map: this.map });
        });
      }
    }
  }

  getContainer() {
    return this.map && this.map.getContainer();
  }

  setView(center: LngLatArray, zoom: number) {
    if (this.map) {
      this.map.jumpTo({ center, zoom: zoom - 1 });
    }
  }

  setCenter(latLng: LngLatArray): void {
    if (this.map) {
      this.map.setCenter(latLng);
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
      return zoom + 1;
    }
  }

  // [extent_left, extent_bottom, extent_right, extent_top];
  fit(e: LngLatBoundsArray, options: FitOptions = {}): void {
    if (this.map) {
      // top, left, bottom, right
      this.map.fitBounds([[e[0], e[1]], [e[2], e[3]]], { linear: true, ...options });
    }
  }

  setRotation(angle: number): void {
    // ignore
  }

  showLayer(layerIds: string[]): void {
    layerIds.forEach((layerId) => {
      this._toggleLayer(layerId, true);
    });
  }

  hideLayer(layerIds: string[]): void {
    layerIds.forEach((layerId) => {
      this._toggleLayer(layerId, false);
    });
  }

  removeLayer(layerIds: string[]): void {
    if (this.map) {
      const map = this.map;
      layerIds.forEach((layerId) => {
        map.removeLayer(layerId);
        map.removeSource(layerId);
      });
    }
  }

  // TODO: need optimization, something like throttle
  setLayerOrder(layerIds: string[], order: number, layers: { [x: string]: TLayerAdapter }): void {
    if (this._sortTimerId) {
      window.clearTimeout(this._sortTimerId);
    }
    this._sortTimerId = window.setTimeout(() => this._setLayerOrder(layers), 10);
  }

  setLayerOpacity(layerIds: string[], opacity: number): void {
    const map = this.map;
    if (map) {
      layerIds.forEach((layerId) => {
        this._onMapLoad().then(() => {
          const layer = map.getLayer(layerId);
          if (layer) {
            map.setPaintProperty(layerId, layer.type + '-opacity', opacity);
          }
        });
      });
    }
  }

  createControl(control: MapControl): IControl {
    return createControl(control);
  }

  createButtonControl(options: ButtonControlOptions): IControl {
    return createButtonControl(options);
  }

  addControl(control: IControl, position: ControlPositions): IControl | undefined {
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
    const { x, y } = evt.point;

    this.emitter.emit('click', { latLng, pixel: { top: y, left: x } });
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
      if (this.isLoaded) { // map.loaded()
        _resolve();
      } else if (this.map) {
        this.emitter.once('create', () => {
          _resolve();
        });
      }
    });
  }

  private _setLayerOrder(layers: { [x: string]: TLayerAdapter }): void {
    const map = this.map;
    if (map) {
      const baseLayers: TLayerAdapter[] = [];
      let orderedLayers: TLayerAdapter[] = [];
      for (const l in layers) {
        if (layers.hasOwnProperty(l)) {
          const layer = layers[l];
          if (layer.options.baseLayer) {
            baseLayers.push(layer);
          } else {
            orderedLayers.push(layer);
          }
        }
      }

      orderedLayers = orderedLayers.sort((a, b) => {
        return a.options.order !== undefined && b.options.order !== undefined ? a.options.order - b.options.order : 0;
      });
      const firstRealLayer = orderedLayers.find((x) => Array.isArray(x.layer));
      if (firstRealLayer) {
        const firstLayerId = this._getLayerIds(firstRealLayer)[0];
        // normalize layer ordering
        baseLayers.forEach((x) => {
          if (x.layer) {
            x.layer.forEach((y) => {
              map.moveLayer(y, firstLayerId);
            });
          }
        });
      }
      for (let fry = 0; fry < orderedLayers.length; fry++) {
        const nextLayer = orderedLayers[fry + 1];
        const nextLayerId = nextLayer && nextLayer.layer && nextLayer.layer[0];
        const mem = orderedLayers[fry];
        const _layers = this._getLayerIds(mem);
        _layers.forEach((x) => {
          map.moveLayer(x, nextLayerId);
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
        mem.getDependLayers().forEach((x) => {
          x.forEach((y) => {
            _layers.push(y);
          });
        });
      }
    }
    return _layers;
  }

  private _toggleLayer(layerId: string, status: boolean): void {
    this._onMapLoad().then((map) => {
      map.setLayoutProperty(layerId, 'visibility', status ? 'visible' : 'none');
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

  private _onMapError(data: mapboxgl.ErrorEvent & mapboxgl.MapSourceDataEvent & EventData) {
    if (this._sourceDataLoading[data.sourceId]) {
      const isLoaded = data.isSourceLoaded;
      const emit = (target: string) => {
        this.emitter.emit('data-error', { target });
      };
      this._onDataLoad(data, isLoaded, emit);
    }
  }

  private _onDataLoad(data: { sourceId: string, tile: any }, isLoaded = false, emit: (sourceId: string) => void) {
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

  private _addEventsListeners(): void {
    const map = this.map;
    if (map) {
      // write mem for start loaded layers
      map.on('sourcedataloading', (data) => {
        this._sourceDataLoading[data.sourceId] = this._sourceDataLoading[data.sourceId] || [];
        if (data.tile) {
          this._sourceDataLoading[data.sourceId].push(data.tile);
        }
      });
      // emmit data-loaded for each layer or all sources is loaded
      map.on('sourcedata', this._onMapSourceData.bind(this));
      map.on('error', this._onMapError.bind(this));
      map.on('click', (evt) => {
        this.onMapClick(evt);
      });

      this._universalEvents.forEach((e) => {
        map.on(e, () => this.emitter.emit(e, this));
      });
    }
  }
}
