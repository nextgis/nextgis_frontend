import { EventEmitter } from 'events';

import Map from 'ol/Map';
import View from 'ol/View';
import { Extent } from 'ol/extent';
import { fromLonLat, transformExtent, transform } from 'ol/proj';

import { WmsAdapter } from './layer-adapters/WmsAdapter';
import { OsmAdapter } from './layer-adapters/OsmAdapter';
import { TileAdapter } from './layer-adapters/TileAdapter';
import { ImageAdapter } from './layer-adapters/ImageAdapter';
import { GeoJsonAdapter } from './layer-adapters/GeoJsonAdapter';

import { ZoomControl } from './controls/ZoomControl';
import { Attribution } from './controls/Attribution';
import { PanelControl } from './controls/PanelControl';
import { createControl } from './controls/createControl';
import { createButtonControl } from './controls/createButtonControl';
import { convertMapClickEvent } from './utils/convertMapClickEvent';

import type { FitOptions as OlFitOptions } from 'ol/View';
import type Base from 'ol/layer/Base';
import type { Pixel } from 'ol/pixel';
import type { ViewOptions } from 'ol/View';
import type BaseEvent from 'ol/events/Event';
import type Control from 'ol/control/Control';
import type MapBrowserEvent from 'ol/MapBrowserEvent';
import type { MapOptions as OlMapOptions } from 'ol/PluggableMap';
import type {
  FitOptions,
  MapControl,
  MapAdapter,
  MapOptions,
  LngLatArray,
  ControlPosition,
  LngLatBoundsArray,
  CreateControlOptions,
  ButtonControlOptions,
} from '@nextgis/webmap';

export type MouseEventType = 'click' | 'hover';

type MapBrowserPointerEvent = MapBrowserEvent<any>;

type Layer = Base;
interface PositionMem {
  center: LngLatArray | undefined;
  zoom: number | undefined;
}
export type ForEachFeatureAtPixelOrderedCallback = [
  order: number,
  cb: ForEachFeatureAtPixelCallback,
];
export type MapClickEvent = (evt: MapBrowserPointerEvent) => void;
export type ForEachFeatureAtPixelCallback = (
  pixel: Pixel,
  evt: MapBrowserPointerEvent,
  type: MouseEventType,
) => boolean;
export type UnselectCb = () => void;
export class OlMapAdapter implements MapAdapter<Map, Layer> {
  static layerAdapters = {
    IMAGE: ImageAdapter,
    TILE: TileAdapter,
    WMS: WmsAdapter,
    // MVT: MvtAdapter,
    OSM: OsmAdapter,
    GEOJSON: GeoJsonAdapter,
  };

  static controlAdapters = {
    ZOOM: ZoomControl,
    ATTRIBUTION: Attribution,
  };

  options: any = { target: 'map' };

  layerAdapters = OlMapAdapter.layerAdapters;
  controlAdapters = OlMapAdapter.controlAdapters;

  emitter = new EventEmitter();

  map?: Map;

  private displayProjection = 'EPSG:3857';
  private lonlatProjection = 'EPSG:4326';

  private _mapClickEvents: MapClickEvent[] = [];
  private _forEachFeatureAtPixel: ForEachFeatureAtPixelOrderedCallback[] = [];
  private _unselectCb: UnselectCb[] = [];
  private _olView?: View;
  private _panelControl?: PanelControl;
  private _isLoaded = false;
  private _positionMem: { [key in 'movestart' | 'moveend']?: PositionMem } = {};

  create(options: MapOptions): void {
    this.options = { ...options };
    const viewOptions: ViewOptions = {
      center: this.options.center,
      zoom: this.options.zoom,
      minZoom: this.options.minZoom,
      maxZoom: this.options.maxZoom,
      projection: this.displayProjection,
    };
    const view = new View(viewOptions);

    const defOpt: OlMapOptions = {
      // logo: false,
      controls: [],
      view,
      layers: [],
    };
    const mapInitOptions: OlMapOptions = {
      ...defOpt,
      target: this.options.target || 'map',
      // logo: options.logo,
    };

    this.map = new Map(mapInitOptions);

    this._panelControl = new PanelControl();
    this.map.addControl(this._panelControl);

    this.map.set('_mapClickEvents', this._mapClickEvents);
    this.map.set('_forEachFeatureAtPixel', this._forEachFeatureAtPixel);
    this.map.set('_addUnselectCb', (cb: UnselectCb) => this._addUnselectCb(cb));

    this.emitter.emit('create', this);
    this._olView = this.map.getView();
    this._isLoaded = true;
    this._addMapListeners();
  }

  destroy(): void {
    if (this.map) {
      this.map.dispose();
    }
  }

  getContainer(): HTMLElement | undefined {
    if (this.options.target) {
      let element;
      if (typeof this.options.target === 'string') {
        element = document.getElementById(this.options.target);
      } else if (this.options.target instanceof HTMLElement) {
        element = this.options.target;
      }
      return element;
    }
  }

  getControlContainer(): HTMLElement {
    if (this._panelControl) {
      return this._panelControl.getContainer();
    }
    throw new Error(
      'The ol-map-adapter ControlPanel has not been initialized yet',
    );
  }

  setCenter(lonLat: LngLatArray): void {
    if (this._olView) {
      this._olView.setCenter(fromLonLat(lonLat));
    }
  }

  getCenter(): LngLatArray | undefined {
    if (this._olView) {
      const center = this._olView.getCenter();
      if (center) {
        const transformedCenter = transform(
          center,
          this.displayProjection,
          this.lonlatProjection,
        );
        return transformedCenter as [number, number];
      }
    }
  }

  setZoom(zoom: number): void {
    if (this._olView) {
      this._olView.setZoom(zoom);
    }
  }

  getZoom(): number | undefined {
    if (this._olView) {
      return this._olView.getZoom();
    }
  }

  fitBounds(e: LngLatBoundsArray, options: FitOptions = {}): void {
    if (this._olView) {
      const { padding, maxZoom, offset } = options;
      const zoom = this.getZoom();
      const extent = e as Extent;
      const toExtent = transformExtent(
        extent,
        this.lonlatProjection,
        this.displayProjection,
      );
      const opt: OlFitOptions = {};
      if (maxZoom) {
        opt.maxZoom = maxZoom;
      }
      if (padding) {
        opt.padding = [padding, padding];
      }
      if (offset) {
        opt.padding = offset;
      }

      this._olView.fit(toExtent, opt);
      this._emitMoveEndEvents({ zoom });
    }
  }

  getBounds(): LngLatBoundsArray | undefined {
    if (!this._olView) return undefined;
    const mapExtent = this._olView.calculateExtent();
    const extent = transformExtent(
      mapExtent,
      this.displayProjection,
      this.lonlatProjection,
    );
    return extent as LngLatBoundsArray;
  }

  setRotation(angle: number): void {
    if (this._olView) {
      this._olView.setRotation(angle);
    }
  }

  removeLayer(layer: Layer): void {
    if (this.map) {
      this.map.removeLayer(layer);
    }
  }

  showLayer(layer: Layer): void {
    if (this.map) {
      this.map.addLayer(layer);
    }
  }

  hideLayer(layer: Layer): void {
    if (this.map) {
      this.map.removeLayer(layer);
    }
  }

  setLayerOpacity(): void {
    // ignore
  }

  setLayerOrder(layer: Layer, order: number): void {
    if (layer && layer.setZIndex) {
      layer.setZIndex(order);
    }
  }

  createControl(control: MapControl, options: CreateControlOptions): Control {
    return createControl(control, options, this);
  }

  createButtonControl(options: ButtonControlOptions): Control {
    return createButtonControl(options);
  }

  addControl(control: Control, position: ControlPosition): Control | undefined {
    if (this._panelControl) {
      this._panelControl.addControl(control, position);
      return control;
    }
  }

  removeControl(control: Control): void {
    if (this._panelControl) {
      this._panelControl.removeControl(control);
    }
  }

  onMapClick(evt: MapBrowserPointerEvent): void {
    const emitData = convertMapClickEvent(evt);
    this.emitter.emit('preclick', emitData);
    this._mapClickEvents.forEach((x) => {
      x(evt);
    });

    this._callEachFeatureAtPixel(evt, 'click');

    this.emitter.emit('click', emitData);
  }

  private _callEachFeatureAtPixel(
    evt: MapBrowserPointerEvent,
    type: MouseEventType,
  ) {
    if (this._forEachFeatureAtPixel.length) {
      if (this.map) {
        // select only top feature
        for (const e of this._forEachFeatureAtPixel.sort(
          (a, b) => b[0] - a[0],
        )) {
          const stop = e[1](evt.pixel, evt, type);
          if (stop) {
            break;
          }
        }
      }
    }
  }

  // requestGeomString(pixel: { top: number, left: number }, pixelRadius = 5) {
  //   const { top, left } = pixel;
  //   const olMap = this.map;
  //   if (olMap) {
  //     const bounds = boundingExtent([
  //       olMap.getCoordinateFromPixel([
  //         left - pixelRadius,
  //         top - pixelRadius,
  //       ]),
  //       olMap.getCoordinateFromPixel([
  //         left + pixelRadius,
  //         top + pixelRadius,
  //       ]),
  //     ]);

  //     return new WKT().writeGeometry(
  //       Polygon.fromExtent(bounds)
  //     );
  //   }
  // }

  private _emitMoveEndEvents(from: { zoom: number | undefined }) {
    if (this._isLoaded) {
      const zoom = this.getZoom();
      if (from.zoom !== zoom) {
        this.emitter.emit('zoomend');
      }
    }
  }

  private _addMapListeners() {
    const map = this.map;
    if (map) {
      map.on('click', (evt: BaseEvent | Event) =>
        this.onMapClick(evt as MapBrowserPointerEvent),
      );
      map.on('pointermove', (evt: BaseEvent | Event) =>
        this._callEachFeatureAtPixel(evt as MapBrowserPointerEvent, 'hover'),
      );

      const center = this.getCenter();
      const zoom = this.getZoom();

      const events: ['movestart', 'moveend'] = ['movestart', 'moveend'];
      events.forEach((x) => {
        this._positionMem[x] = { center, zoom };
        map.on(x, () => {
          this._emitPositionChangeEvent(x);
        });
      });

      if (this._olView) {
        this._olView.on('change:resolution', () => {
          this.emitter.emit('zoom', this);
        });

        this._olView.on('change:center', () => {
          this.emitter.emit('move', this);
        });
      }
    }
  }

  private _addUnselectCb(cb: UnselectCb) {
    for (const p of this._unselectCb) {
      p();
    }
    this._unselectCb.length = 0;
    this._unselectCb.push(cb);
  }

  private _emitPositionChangeEvent(eventName: 'movestart' | 'moveend') {
    const mem = this._positionMem[eventName];
    let memCenter: LngLatArray | undefined;
    let memZoom: number | undefined;
    if (mem) {
      memCenter = mem.center;
      memZoom = mem.zoom;
    }
    const center = this.getCenter();
    const zoom = this.getZoom();
    if (memZoom !== zoom) {
      const zoomEventName = eventName === 'movestart' ? 'zoomstart' : 'zoomend';
      this.emitter.emit(zoomEventName, this);
    }
    if (memCenter && center) {
      const [cLng, cLat] = center;
      const [lng, lat] = memCenter;
      if (cLng !== lng || cLat !== lat) {
        this.emitter.emit(eventName, this);
      }
      // type self query for undefined case
    } else if (memCenter !== center) {
      this.emitter.emit(eventName, this);
    }
    this._positionMem[eventName] = { center, zoom };
  }
}
