import { MapAdapter } from '@nextgis/webmap';
import { MvtAdapter } from './layer-adapters/MvtAdapter';
import { Map } from 'mapbox-gl';
import { OsmAdapter } from './layer-adapters/OsmAdapter';
import { TileAdapter } from './layer-adapters/TileAdapter';
import { EventEmitter } from 'events';
import { ZoomControl } from './controls/ZoomControl';
import { CompassControl } from './controls/CompassControl';

type positions = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export class MapboxglAdapter implements MapAdapter {

  static layerAdapters = {
    TILE: TileAdapter,
    MVT: MvtAdapter,
    OSM: OsmAdapter,
  };

  static controlAdapters = {
    ZOOM: ZoomControl,
    COMPASS: CompassControl,
  };

  options: any;

  displayProjection = 'EPSG:3857';
  lonlatProjection = 'EPSG:4326';

  map: Map;

  emitter = new EventEmitter();

  layerAdapters = MapboxglAdapter.layerAdapters;

  _layers = {};

  private _baseLayers: string[] = [];

  private DPI = 1000 / 39.37 / 0.28;
  private IPM = 39.37;
  private isLoaded = false;
  private orders: string[] = [];
  private _sourcedataloading: { [name: string]: any[] } = {};

  // create(options: MapOptions = {target: 'map'}) {
  create(options) {
    if (!this.map) {
      this.options = options;
      this.map = new Map({
        container: options.target,
        center: [96, 63], // initial map center in [lon, lat]
        zoom: 2,
        style: {
          version: 8,
          name: 'Empty style',
          sources: {},
          layers: [],
        },
      });
      this._addEventsListeners();
    }
  }

  getContainer() {
    return this.map.getContainer();
  }

  setCenter(latLng: [number, number]) {
    // ignore
  }

  setZoom(zoom: number) {
    // ignore
  }

  fit(extent) {
    // ignore
  }

  setRotation(angle: number) {
    // ignore
  }

  showLayer(layerName: string) {
    this.onMapLoad(() => this.toggleLayer(layerName, true));
  }

  hideLayer(layerName: string) {
    this.onMapLoad(() => this.toggleLayer(layerName, false));
  }

  addLayer(adapterDef, options?, baselayer?: boolean) {
    return this.onMapLoad(() => {
      let adapterEngine;
      if (typeof adapterDef === 'string') {
        adapterEngine = this.getLayerAdapter(adapterDef);
      }
      if (adapterEngine) {
        const adapter = new adapterEngine(this.map, options) as any;
        if (baselayer && this.orders.length) {
          options.before = this.orders[0];
        }
        const addlayerFun = adapter.addLayer(options);
        const toResolve = () => {
          const layerId = adapter.name;
          this._layers[layerId] = false;
          this.orders.push(layerId);
          this._baseLayers.push(layerId);
          if (!baselayer) {
            this.map.moveLayer(layerId);
          } else {
            this.map.moveLayer(layerId, this.orders[0]);
          }
          return adapter;
        };
        return addlayerFun.then ? addlayerFun.then((layer) => toResolve()) : Promise.resolve(toResolve());
      }
    });
  }

  removeLayer(layerId: string) {
    if (this._layers[layerId]) {
      this.map.removeLayer(layerId);
      this.map.removeSource(layerId);
      delete this._layers[layerId];
    }
    // this._toggleLayer(false, layerName);
  }

  // TODO: rename hasLayer; move to WebMap
  getLayer(layerName: string) {
    return this._layers[layerName] !== undefined;
  }

  // TODO: move to WebMap
  isLayerOnTheMap(layerName: string): boolean {
    return this._layers[layerName];
  }
  // TODO: move to WebMap
  getLayers(): string[] {
    return Object.keys(this._layers);
  }

  setLayerOpacity(layerName: string, opacity: number) {
    this.onMapLoad().then(() => {
      const layer = this.map.getLayer(layerName);
      if (layer) {
        this.map.setPaintProperty(layerName, layer.type + '-opacity', opacity);
      }
    });
  }

  getScaleForResolution(res, mpu) {
    return parseFloat(res) * (mpu * this.IPM * this.DPI);
  }

  getResolutionForScale(scale, mpu) {
    return parseFloat(scale) / (mpu * this.IPM * this.DPI);
  }

  onMapLoad<K = any>(cb?): Promise<K> {
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

  toggleLayer(layerId, status) {
    this.onMapLoad().then(() => {
      const exist = this._layers[layerId];

      if (exist !== undefined && exist !== status) {
        this.map.setLayoutProperty(layerId, 'visibility', status ? 'visible' : 'none');
        this._layers[layerId] = status;
      }
    });
  }

  addControl(controlDef, position: positions) {
    let control;
    if (typeof controlDef === 'string') {
      const engine = MapboxglAdapter.controlAdapters[controlDef];
      if (engine) {
        control = new engine();
      }
    } else {
      control = controlDef;
    }
    if (control) {
      this.map.addControl(control, position);
    }
  }

  onMapClick(evt) {

    const latLng = evt.lngLat;
    const { x, y } = evt.point;

    this.emitter.emit('click', { latLng, pixel: { top: y, left: x } });
  }

  private getLayerAdapter(name: string) {
    return MapboxglAdapter.layerAdapters[name];
  }

  private _addEventsListeners() {
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
          if (this._layers[target]) {
            this.emitter.emit('data-loaded', { target });
          }
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
