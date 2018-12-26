import {
  MapAdapter,
  ControlPositions,
  MapOptions,
  MapControl,
  CreateControlOptions,
  CreateButtonControlOptions
} from '@nextgis/webmap';
import Map from 'ol/Map';
import View from 'ol/View';
import Zoom from 'ol/control/Zoom';
import Polygon from 'ol/geom/Polygon';

import WKT from 'ol/format/WKT';
import { ImageAdapter } from './layer-adapters/ImageAdapter';
import { EventEmitter } from 'events';
import { OsmAdapter } from './layer-adapters/OsmAdapter';
import { MarkerAdapter } from './layer-adapters/MarkerAdapter';
import { TileAdapter } from './layer-adapters/TileAdapter';
import { GeoJsonAdapter } from './layer-adapters/GeoJsonAdapter';

// @ts-ignore
import { fromLonLat, transformExtent, transform } from 'ol/proj';
// @ts-ignore
import { boundingExtent } from 'ol/extent';
import { Attribution } from './controls/Attribution';
import { olx } from 'openlayers';
import { PanelControl } from './controls/PanelControl';
import { createControl } from './controls/createControl';
import { createButtonControl } from './controls/createButtonControl';

export type ForEachFeatureAtPixelCallback = (
  feature: ol.Feature,
  layer: ol.layer.Layer,
  evt: ol.MapBrowserPointerEvent) => void;
export class OlMapAdapter implements MapAdapter {

  static layerAdapters = {
    IMAGE: ImageAdapter,
    TILE: TileAdapter,
    // MVT: MvtAdapter,
    OSM: OsmAdapter,
    MARKER: MarkerAdapter,
    GEOJSON: GeoJsonAdapter,
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
  private _panelControl: PanelControl;
  private _mapClickEvents: Array<(evt: ol.MapBrowserPointerEvent) => void> = [];
  private _forEachFeatureAtPixel: ForEachFeatureAtPixelCallback[] = [];

  create(options: MapOptions) {
    this.options = { ...options };
    const view = new View({
      center: options.center,
      zoom: options.zoom,
      projection: this.displayProjection,
    });

    const defOpt: olx.MapOptions = {
      logo: false,
      controls: [],
      view,
      layers: [],
    };
    const mapInitOptions: olx.MapOptions = {
      ...defOpt,
      target: options.target,
      logo: options.logo,
    };

    this.map = new Map(mapInitOptions);

    this._panelControl = new PanelControl();
    this.map.addControl(this._panelControl);

    this.map.set('_mapClickEvents', this._mapClickEvents);
    this.map.set('_forEachFeatureAtPixel', this._forEachFeatureAtPixel);

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

  getZoom() {
    return this._olView.getZoom();
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

  createControl(control: MapControl, options: CreateControlOptions) {
    return createControl(control, options);
  }

  createButtonControl(options: CreateButtonControlOptions) {
    return createButtonControl(options);
  }

  addControl(controlDef, position?: ControlPositions, options?) {
    let control;
    if (typeof controlDef === 'string') {
      const engine = OlMapAdapter.controlAdapters[controlDef];
      if (engine) {
        control = new engine();
      }
    } else {
      control = controlDef;
    }
    if (control) {
      this._panelControl.addControl(control, position);
      return control;
    }
  }

  onMapClick(evt: ol.MapBrowserPointerEvent) {
    const [lng, lat] = transform(
      evt.coordinate,
      this.displayProjection,
      this.lonlatProjection,
    );
    const latLng = {
      lat, lng,
    };

    this._mapClickEvents.forEach((x) => {
      x(evt);
    });

    if (this._forEachFeatureAtPixel.length) {
      this.map.forEachFeatureAtPixel(evt.pixel, (feature: ol.Feature, layer) => {
        this._forEachFeatureAtPixel.forEach((x) => {
          x(feature, layer, evt);
        });
      });
    }

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
      Polygon.fromExtent(bounds));
  }

  private _addMapListeners() {
    this.map.on('click', (evt: ol.MapBrowserPointerEvent) => this.onMapClick(evt), this);
  }
}
