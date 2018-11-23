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

export class OlMapAdapter implements MapAdapter {

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

  private _olView: View;

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

  setCenter(lonLat: [number, number]) {
    this._olView.setCenter(fromLonLat(lonLat));
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

  removeLayer(layer) {
    this.map.removeLayer(layer);
  }

  showLayer(layer) {
    this.map.addLayer(layer);
  }

  hideLayer(layer) {
    this.map.removeLayer(layer);
  }

  setLayerOpacity(layerName: string, value: number) {
    // ignore
  }

  setLayerOrder(layer, order, layers) {
    layer.setZIndex(order);
  }

  getScaleForResolution(res, mpu) {
    return parseFloat(res) * (mpu * this.IPM * this.DPI);
  }

  getResolutionForScale(scale, mpu) {
    return parseFloat(scale) / (mpu * this.IPM * this.DPI);
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
