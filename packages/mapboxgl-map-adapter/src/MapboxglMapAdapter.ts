import {
  MapAdapter,
  LayerMem,
  FitOptions,
  MapControl,
  ControlPositions,
  CreateButtonControlOptions,
  MapControls,
  MapCenter,
  MapOptions
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

type TLayer = string[];

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

  options: MapOptions;

  displayProjection = 'EPSG:3857';
  lonlatProjection = 'EPSG:4326';

  map: Map;

  emitter = new EventEmitter();

  layerAdapters = MapboxglMapAdapter.layerAdapters;

  private isLoaded = false;

  private _sourcedataloading: { [name: string]: any[] } = {};

  // create(options: MapOptions = {target: 'map'}) {
  create(options) {
    if (!this.map) {
      this.options = options;
      this.map = new Map({
        container: options.target,
        center: [96, 63], // initial map center in [lon, lat]
        zoom: 2,
        attributionControl: false,
        style: {
          version: 8,
          name: 'Empty style',
          sources: {},
          layers: [],
        },
      });
      this._addEventsListeners();
      this.onMapLoad();
    }
  }

  getContainer() {
    return this.map.getContainer();
  }

  setView(center: MapCenter, zoom: number) {
    this.map.jumpTo({ center, zoom });
  }

  setCenter(latLng: [number, number]): void {
    this.map.setCenter(latLng);
  }

  setZoom(zoom: number): void {
    this.map.setZoom(zoom);
  }

  getZoom(): number {
    return this.map.getZoom();
  }

  // [extent_left, extent_bottom, extent_right, extent_top];
  fit(e: [number, number, number, number], options: FitOptions = {}): void {
    // top, left, bottom, right
    this.map.fitBounds([[e[0], e[1]], [e[2], e[3]]], { linear: true, ...options });
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
    layerIds.forEach((layerId) => {
      this.map.removeLayer(layerId);
      this.map.removeSource(layerId);
    });
  }

  // TODO: need optimization, something like throttle
  setLayerOrder(layerIds, order, layers: { [x: string]: LayerMem<string[]> }): void {
    const baseLayers: Array<LayerMem<string[]>> = [];
    let orderedLayers: Array<LayerMem<string[]>> = [];
    for (const l in layers) {
      if (layers.hasOwnProperty(l)) {
        const layer = layers[l];
        if (layer.baseLayer) {
          baseLayers.push(layer);
        } else {
          orderedLayers.push(layer);
        }
      }
    }

    orderedLayers = orderedLayers.sort((a, b) => {
      return a.order - b.order;
    });
    const firstLayerId = this._getLayerIds(orderedLayers[0])[0];
    // normilize layer ordering
    baseLayers.forEach((x) => {
      x.layer.forEach((y) => {
        this.map.moveLayer(y, firstLayerId);
      });
    });
    for (let fry = 0; fry < orderedLayers.length; fry++) {
      const nextlayer = orderedLayers[fry + 1];
      const nextlayerId = nextlayer && nextlayer.layer[0];
      const mem = orderedLayers[fry];
      const _layers = this._getLayerIds(mem);
      _layers.forEach((x) => {
        this.map.moveLayer(x, nextlayerId);
      });
    }
  }

  setLayerOpacity(layerIds: string[], opacity: number): void {
    layerIds.forEach((layerId) => {
      this.onMapLoad().then(() => {
        const layer = this.map.getLayer(layerId);
        if (layer) {
          this.map.setPaintProperty(layerId, layer.type + '-opacity', opacity);
        }
      });
    });
  }

  onMapLoad<K = any>(cb?: () => any): Promise<K> {
    return new Promise<K>((resolve) => {
      if (this.isLoaded) { // map.loaded()
        resolve(cb && cb());
      } else {
        this.map.once('load', () => {
          this.isLoaded = true;
          resolve(cb && cb());
        });
      }
    });
  }

  createControl(control: MapControl): IControl {
    return createControl(control);
  }

  createButtonControl(options: CreateButtonControlOptions): IControl {
    return createButtonControl(options);
  }

  async addControl<K extends keyof MapControls>(
    controlDef: K | IControl,
    position: ControlPositions,
    options?: MapControls[K]): Promise<IControl> {

    let control: IControl;
    if (typeof controlDef === 'string') {
      const engine = MapboxglMapAdapter.controlAdapters[controlDef];
      if (engine) {
        control = new engine(options);
      }
    } else {
      control = controlDef as IControl;
    }
    if (control) {
      const _control = await control;
      this.map.addControl(_control, position);
      return _control;
    }
  }

  removeControl(control: IControl): void {
    this.map.removeControl(control);
  }

  onMapClick(evt: MapEventType['click'] & EventData): void {

    const latLng = evt.lngLat;
    const { x, y } = evt.point;

    this.emitter.emit('click', { latLng, pixel: { top: y, left: x } });
  }

  private _getLayerIds(mem: LayerMem<TLayer, Map>): string[] {
    let _layers = [];
    if (Array.isArray(mem.layer)) {
      _layers = mem.layer;
    } else if (mem.adapter.getDependLayers) {
      mem.adapter.getDependLayers().forEach((x) => {
        x.forEach((y) => {
          _layers.push(y);
        });
      });
    }
    return _layers;
  }

  private _toggleLayer(layerId: string, status: boolean): void {
    this.onMapLoad().then(() => {
      this.map.setLayoutProperty(layerId, 'visibility', status ? 'visible' : 'none');
    });
  }

  private _addEventsListeners(): void {
    // write mem for start loaded layers
    this.map.on('sourcedataloading', (data) => {
      this._sourcedataloading[data.sourceId] = this._sourcedataloading[data.sourceId] || [];
      if (data.tile) {
        this._sourcedataloading[data.sourceId].push(data.tile);
      }
    });
    // emmit data-loaded for each layer or all sources is loaded
    this.map.on('sourcedata', (data) => {
      if (data.dataType === 'source') {
        const isLoaded = data.isSourceLoaded;
        const emit = (target) => {
          this.emitter.emit('data-loaded', { target });
        };
        // if all sources is loaded emmit event for all and clean mem
        if (isLoaded) {
          Object.keys(this._sourcedataloading).forEach((x) => {
            emit(x);
          });
          this._sourcedataloading = {};
        } else {
          // check if all tiles in layer is loaded
          const tiles = this._sourcedataloading[data.sourceId];
          if (tiles && data.tile) {
            const index = tiles.indexOf(data.tile);
            if (index !== -1) {
              this._sourcedataloading[data.sourceId].splice(index, 1);
            }
            // if no more loaded tiles in layer emit event and clean mem only for this layer
            if (!tiles.length) {
              emit(data.sourceId);
              delete this._sourcedataloading[data.sourceId];
            }
          }
        }
      }
    });
    this.map.on('click', (evt) => {
      this.onMapClick(evt);
    });
  }
}
