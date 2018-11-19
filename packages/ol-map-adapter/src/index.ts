import { MapAdapter } from '@nextgis/webmap';
import { Map, View } from 'ol';
import { fromLonLat, transformExtent, transform } from 'ol/proj';
import { Zoom, Attribution, defaults as defaultControls } from 'ol/control';
import { boundingExtent } from 'ol/extent';
import { WKT } from 'ol/format';
import { fromExtent } from 'ol/geom/Polygon';
import { ImageAdapter } from './layer-adapters/ImageAdapter';
import { EventEmitter } from 'events';
import { OsmAdapter } from './layer-adapters/OsmAdapter';
import { MarkerAdapter } from './layer-adapters/MarkerAdapter';
import { TileAdapter } from './layer-adapters/TileAdapter';

interface LayerMem {
  layer: any;
  onMap: boolean;
  order?: number;
  baseLayer?: boolean;
}

export default class OlMapAdapter implements MapAdapter {

  static layerAdapters = {
    IMAGE: ImageAdapter,
    TILE: TileAdapter,
    // MVT: MvtAdapter,
    OSM: OsmAdapter,
    MARKER: MarkerAdapter,
  };

  static controlAdapters = {
    ZOOM: Zoom,
    ATTRIBUTION: Attribution,
  };

  options: any;

  layerAdapters = OlMapAdapter.layerAdapters;

  displayProjection = 'EPSG:3857';
  lonlatProjection = 'EPSG:4326';
  emitter = new EventEmitter();

  map: Map;

  _layers: { [x: string]: LayerMem } = {};
  _baseLayers: string[] = [];
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
    this.emitter.emit('create', { map: this.map });
    this._olView = this.map.getView();

    // olView.on('change:resolution', (evt) => {
    //   this.set('resolution', olView.getResolution());
    // });

    // olView.on('change:center', (evt) => {
    //   this.set('center', olView.getCenter());
    // });

    this._addMapListeners();
  }

  getContainer(): HTMLElement {
    return document.getElementById(this.options.target);
  }

  onMapLoad(cb?: any) {
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

  fit(e: [number, number, number, number]) {
    const toExtent = transformExtent(
      e,
      this.lonlatProjection,
      this.displayProjection,
    );
    this._olView.fit(toExtent);
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

  addLayer(adapterDef, options?, baselayer?: boolean) {

    let adapterEngine;
    if (typeof adapterDef === 'string') {
      adapterEngine = this.getLayerAdapter(adapterDef);
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
        // this._length++;

        return adapter;
      };
      return addlayerFun.then ? addlayerFun.then((l) => toResolve(l)) : Promise.resolve(toResolve(layer));
    }
    return Promise.reject('No adapter');
  }

  removeLayer(layerName: string) {
    const layer = this._layers[layerName];
    if (layer) {
      this.map.removeLayer(layer.layer);
      if (layer.baseLayer) {
        const index = this._baseLayers.indexOf(layerName);
        if (index) {
          this._baseLayers.splice(index, 1);
        }
      }
      delete this._layers[layerName];
    }
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
          l.layer.setZIndex(this._length - l.order);
          source.addLayer(l.layer);
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

  addControl(controlDef, position?: string, options?) {
    let control;
    if (typeof controlDef === 'string') {
      const engine = OlMapAdapter.controlAdapters[controlDef];
      if (engine) {
        control = new engine(options);
      }
    } else {
      control = controlDef;
    }
    if (control) {
      this.map.addControl(control);
      return control;
    }
  }

  onMapClick(evt) {
    const [lng, lat] = transform(
      evt.coordinate,
      this.displayProjection,
      this.lonlatProjection,
    );
    const latLng = {
      lat, lng,
    };
    this.emitter.emit('click', {
      latLng,
      pixel: { left: evt.pixel[0], top: evt.pixel[1] },
      source: evt,
    });
  }

  requestGeomString(pixel: { top: number, left: number }, pixelRadius = 5) {
    const { top, left } = pixel;
    const olMap = this.map;
    const bounds = boundingExtent([
      olMap.getCoordinateFromPixel([
        left - pixelRadius,
        top - pixelRadius,
      ]),
      olMap.getCoordinateFromPixel([
        left + pixelRadius,
        top + pixelRadius,
      ]),
    ]);

    return new WKT().writeGeometry(
      fromExtent(bounds));
  }

  private _addMapListeners() {
    this.map.on('click', (evt) => {
      this.onMapClick(evt);
    });
  }
}
