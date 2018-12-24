import { MapAdapter, LayerMem, FitOptions, MapControl, ControlPositions } from '@nextgis/webmap';
import { MvtAdapter } from './layer-adapters/MvtAdapter';
import { Map, IControl, Control } from 'mapbox-gl';
import { OsmAdapter } from './layer-adapters/OsmAdapter';
import { TileAdapter } from './layer-adapters/TileAdapter';
import { EventEmitter } from 'events';
import { ZoomControl } from './controls/ZoomControl';
import { CompassControl } from './controls/CompassControl';
import { AttributionControl } from './controls/AttributionControl';
import { GeoJsonAdapter } from './layer-adapters/GeoJsonAdapter';
import { createControl } from './controls/createControl';

type TControl = new (options?) => IControl;

export class MapboxglMapAdapter implements MapAdapter<Map, string[], IControl> {

  static layerAdapters = {
    TILE: TileAdapter,
    // IMAGE: ImageAdapter,
    MVT: MvtAdapter,
    OSM: OsmAdapter,
    GEOJSON: GeoJsonAdapter,
  };

  static controlAdapters: {[name: string]: any} = {
    ZOOM: ZoomControl,
    COMPASS: CompassControl,
    ATTRIBUTION: AttributionControl,
  };

  options: any;

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

  setCenter(latLng: [number, number]) {
    this.map.setCenter(latLng);
  }

  setZoom(zoom: number) {
    this.map.setZoom(zoom);
  }

  getZoom() {
    return this.map.getZoom();
  }

  // [extent_left, extent_bottom, extent_right, extent_top];
  fit(e: [number, number, number, number], options: FitOptions = {}) {
    // top, left, bottom, right
    this.map.fitBounds([[e[0], e[1]], [e[2], e[3]]], { linear: true, ...options });
  }

  setRotation(angle: number) {
    // ignore
  }

  showLayer(layerIds: string[]) {
    layerIds.forEach((layerId) => {
      this._toggleLayer(layerId, true);
    });
  }

  hideLayer(layerIds: string[]) {
    layerIds.forEach((layerId) => {
      this._toggleLayer(layerId, false);
    });
  }

  removeLayer(layerIds: string[]) {
    layerIds.forEach((layerId) => {
      this.map.removeLayer(layerId);
      this.map.removeSource(layerId);
    });
  }

  setLayerOrder(layerIds, order, layers: { [x: string]: LayerMem<string[]> }) {
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

    // normilize layer ordering
    baseLayers.forEach((x) => {
      x.layer.forEach((y) => this.map.moveLayer(y, orderedLayers[0].layer[0]));
    });
    for (let fry = 0; fry < orderedLayers.length; fry++) {
      const nextlayer = orderedLayers[fry + 1];
      const nextlayerId = nextlayer && nextlayer.layer[0] ;
      orderedLayers[fry].layer.forEach((x) => this.map.moveLayer(x, nextlayerId));
    }
  }

  setLayerOpacity(layerIds: string[], opacity: number) {
    layerIds.forEach((layerId) => {
      this.onMapLoad().then(() => {
        const layer = this.map.getLayer(layerId);
        if (layer) {
          this.map.setPaintProperty(layerId, layer.type + '-opacity', opacity);
        }
      });
    });
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

  createControl(control: MapControl) {
    return createControl(control);
  }

  addControl(controlDef: string | IControl, position: ControlPositions, options) {
    let control: IControl;
    if (typeof controlDef === 'string') {
      const engine = MapboxglMapAdapter.controlAdapters[controlDef];
      if (engine) {
        control = new engine(options);
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

  private _toggleLayer(layerId: string, status: boolean) {
    this.onMapLoad().then(() => {
      this.map.setLayoutProperty(layerId, 'visibility', status ? 'visible' : 'none');
    });
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
