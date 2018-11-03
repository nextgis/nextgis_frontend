import { MapAdapter, MapOptions } from '@nextgis/webmap';
import { Map, Control } from 'leaflet';
import { EventEmitter } from 'events';
import { TileAdapter } from './layer-adapters/TileAdapter';
import { GeoJsonAdapter } from './layer-adapters/GeoJsonAdapter';
import { AttributionControl } from './controls/Attribution';
// import { ImageAdapter } from './layer-adapters/ImageAdapter';
// import { OsmAdapter } from './layer-adapters/OsmAdapter';
// import { MarkerAdapter } from './layer-adapters/MarkerAdapter';

interface LayerMem {
  layer: any;
  onMap: boolean;
  order?: number;
  baseLayer?: boolean;
}

export interface LeafletMapAdapterOptions extends MapOptions {
  id?: string;
}

export class LeafletMapAdapter implements MapAdapter {

  static layerAdapters = {
    // IMAGE: ImageAdapter,
    TILE: TileAdapter,
    GEOJSON: GeoJsonAdapter,
    // // MVT: MvtAdapter,
    // OSM: OsmAdapter,
    // MARKER: MarkerAdapter,
  };

  static controlAdapters = {
    ZOOM: Control.Zoom,
    ATTRIBUTION: AttributionControl,
  };

  options: LeafletMapAdapterOptions = { target: 'map' };

  layerAdapters = LeafletMapAdapter.layerAdapters;

  displayProjection = 'EPSG:3857';
  lonlatProjection = 'EPSG:4326';
  emitter = new EventEmitter();

  map: Map;

  _layers: { [x: string]: LayerMem } = {};

  private DPI = 1000 / 39.37 / 0.28;
  private IPM = 39.37;
  private _order = 0;
  private _length = 9999; // TODO: get real layers length count, after all registered
  private _baseLayers: string[] = [];

  // create(options: MapOptions = {target: 'map'}) {
  create(options: LeafletMapAdapterOptions = { target: 'map' }) {
    this.options = Object.assign({}, options);

    this.map = new Map(this.options.target, { zoomControl: false, attributionControl: false });
    this.emitter.emit('create', { map: this.map });

    this._addMapListeners();
  }

  getContainer(): HTMLElement {
    return this.map.getContainer();
  }

  onMapLoad(cb?: any) {
    return new Promise((resolve) => {
      resolve(cb && cb());
    });
  }

  setCenter(latLng: [number, number]) {
    this.map.setView(latLng, this.map.getZoom());
  }

  setZoom(zoom: number) {
    this.map.setZoom(zoom);
  }

  fit(e: [number, number, number, number]) {
    this.map.fitBounds([[e[0], e[1]], [e[2], e[3]]]);
  }

  getLayerAdapter(name: string) {
    return LeafletMapAdapter.layerAdapters[name];
  }

  getLayer(layerName: string) {
    return this._layers[layerName] !== undefined;
  }

  getLayers(): string[] {
    return Object.keys(this._layers);
  }

  isLayerOnTheMap(layerName: string): boolean {
    const layerMem = this._layers[layerName];
    return layerMem.onMap;
  }

  addControl(controlDef, position, options) {
    let control;
    if (typeof controlDef === 'string') {
      const engine = LeafletMapAdapter.controlAdapters[controlDef];
      if (engine) {
        control = new engine(options);
      }
    } else {
      control = controlDef;
    }
    if (control) {
      control.options.position = position.replace('-', '');
      this.map.addControl(control);
      return control;
    }
  }

  addLayer(adapterDef, options?, baselayer?: boolean) {

    let adapterEngine;
    if (typeof adapterDef === 'string') {
      adapterEngine = this.getLayerAdapter(adapterDef);
    } else {
      adapterEngine = adapterDef;
    }
    if (adapterEngine) {
      const adapter = new adapterEngine(this.map, options);
      const layer = adapter.addLayer(options);

      const addlayerFun = adapter.addLayer(options);
      const toResolve = (l) => {
        const layerId = adapter.name;
        const layerOpts: LayerMem = { layer: l, onMap: false };
        if (baselayer) {
          layerOpts.baseLayer = true;
          this._baseLayers.push(layerId);
        } else {
          layerOpts.order = options.order || this._order++;
        }
        this._layers[layerId] = layerOpts;
        this._length++;

        return adapter;
      };
      return addlayerFun.then ? addlayerFun.then((l) => toResolve(l)) : Promise.resolve(toResolve(layer));
    }
    return Promise.reject('No adapter');
  }

  removeLayer(layerName: string) {
    // ignore
  }

  showLayer(layerName: string) {
    this.toggleLayer(layerName, true);
  }

  hideLayer(layerName: string) {
    this.toggleLayer(layerName, false);
  }

  setLayerOpacity(layerName: string, value: number) {
    // ignore
  }

  getScaleForResolution(res, mpu) {
    return parseFloat(res) * (mpu * this.IPM * this.DPI);
  }

  getResolutionForScale(scale, mpu) {
    return parseFloat(scale) / (mpu * this.IPM * this.DPI);
  }

  toggleLayer(layerName: string, status: boolean) {
    const action = (source: Map, l: LayerMem) => {
      if (status) {
        if (source instanceof Map) {
          l.layer.addTo(source);
          // TODO: set order for any layer
          if (l.layer.setZIndex) {
            const order = l.baseLayer ? 0 : this._length - l.order;
            l.layer.setZIndex(order);
          }
        }
      } else {
        source.removeLayer(l.layer);
      }
      l.onMap = status;
    };
    const layer = this._layers[layerName];
    if (layer && layer.onMap !== status) {
      if (this.map) {
        action(this.map, layer);
      } else {
        this.emitter.once('create', (data) => {
          action(data.map, layer);
        });
      }
    }
  }

  onMapClick(evt) {
    const coord = evt.containerPoint;
    const latLng = evt.latlng;
    this.emitter.emit('click', {
      latLng,
      pixel: { left: coord.x, top: coord.y },
      source: evt,
    });
  }

  private _addMapListeners() {
    this.map.on('click', (evt) => {
      this.onMapClick(evt);
    });
  }

}
