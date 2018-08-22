import Map from 'ol/Map';
import { fromLonLat, transformExtent, transform } from 'ol/proj';

import View from 'ol/View';
import { ImageAdapter } from './layer-adapters/ImageAdapter';
import { EventEmitter } from 'events';
import { OsmAdapter } from './layer-adapters/OsmAdapter';
import { MarkerAdapter } from './layer-adapters/markerAdapter';

interface LayerMem {
  order: number;
  layer: any;
  onMap: boolean;
}

export class OlMapAdapter { // implements MapAdapter {

  static layerAdapters = {
    IMAGE: ImageAdapter,
    // TILE: TileAdapter,
    // MVT: MvtAdapter,
    OSM: OsmAdapter,
    MARKER: MarkerAdapter
  };

  options;

  displayProjection = 'EPSG:3857';
  lonlatProjection = 'EPSG:4326';
  emitter = new EventEmitter();

  map: Map;

  _layers: { [x: string]: LayerMem } = {};
  private _olView: View;
  private _order = 0;
  private _length = 9999; // TODO: get real layers length count, after all registered

  private DPI = 1000 / 39.37 / 0.28;
  private IPM = 39.37;

  // private _layers: {[name: string]: LayerMem} = {};

  // create(options: MapOptions = {target: 'map'}) {
  create(options = { target: 'map' }) {
    this.options = Object.assign({}, options);
    const view = new View({
      center: [-9101767, 2822912],
      zoom: 14,
      projection: this.displayProjection,
    });

    const defOpt = {
      logo: false,
      controls: [],
      view,
      layers: [],
    };
    const mapInitOptions = { ...defOpt, ...options };

    this.map = new Map(mapInitOptions);

    this._olView = this.map.getView();

    // olView.on('change:resolution', (evt) => {
    //   this.set('resolution', olView.getResolution());
    // });

    // olView.on('change:center', (evt) => {
    //   this.set('center', olView.getCenter());
    // });

    this._addMapListeners();
  }

  getContainer() {
    return document.getElementById(this.options.target);
  }

  onMapLoad(cb?) {
    return new Promise((resolve) => {
      resolve(cb && cb());
    });
  }

  setCenter(latLng: [number, number]) {
    this._olView.setCenter(fromLonLat(latLng));
  }

  setZoom(zoom: number) {
    this._olView.setZoom(zoom);
  }

  fit(extent) {
    extent = transformExtent(
      extent,
      this.lonlatProjection,
      this.displayProjection,
    );
    this._olView.fit(extent);
  }

  setRotation(angle: number) {
    this._olView.setRotation(angle);
  }

  getLayerAdapter(name: string) {
    return OlMapAdapter.layerAdapters[name];
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

  addLayer(adapterDef, options?) {

    let adapterEngine;
    if (typeof adapterDef === 'string') {
      adapterEngine = this.getLayerAdapter(adapterDef);
    }
    if (adapterEngine) {
      const adapter = new adapterEngine(this.map, options);
      const layer = adapter.addLayer(options);
      const layerId = adapter.name;
      this._layers[layerId] = { layer, order: options.order || this._order++, onMap: false };
      this._length++;
      return Promise.resolve(adapter);
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
          source.addLayer(l.layer);
          l.layer.setZIndex(this._length - l.order);
        }
      } else {
        source.removeLayer(l.layer);
      }
      l.onMap = status;
    };
    const layer = this._layers[layerName];
    if (layer && layer.onMap !== status) {
      action(this.map, layer);
    }
  }

  addControl(controlDef, position: string) {
    // ignore
  }

  onMapClick(evt) {
    const [lng, lat] = transform(
      evt.coordinate,
      this.displayProjection,
      this.lonlatProjection,
    );
    const latLng = {
      lat, lng
    };
    this.emitter.emit('click', {
      latLng,
      pixel: {left: evt.pixel[0], top: evt.pixel[1]},
      source: evt
    });
  }

  private _addMapListeners() {
    this.map.on('click', (evt) => {
      this.onMapClick(evt);
    });
  }

}
