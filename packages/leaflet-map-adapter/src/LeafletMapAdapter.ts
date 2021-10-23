import { EventEmitter } from 'events';
import { Map, Control, FitBoundsOptions } from 'leaflet';
import { convertMapClickEvent } from './utils/convertMapClickEvent';
import { createButtonControl } from './controls/createButtonControl';
import { AttributionControl } from './controls/Attribution';
import { createControl } from './controls/createControl';
import { GeoJsonAdapter } from './layer-adapters/GeoJsonAdapter';
import { ImageAdapter } from './layer-adapters/ImageAdapter/ImageAdapter';
import { TileAdapter } from './layer-adapters/TileAdapter/TileAdapter';
import { WmsAdapter } from './layer-adapters/WmsAdapter/WmsAdapter';
import { OsmAdapter } from './layer-adapters/OsmAdapter';

import type {
  Layer,
  GridLayer,
  ControlPosition,
  LeafletMouseEvent,
} from 'leaflet';
import type { LngLatBoundsArray, LngLatArray } from '@nextgis/utils';
import type {
  CreateControlOptions,
  ButtonControlOptions,
  LocationEvents,
  LocateOptions,
  MainMapEvents,
  LayerAdapter,
  ViewOptions,
  MapAdapter,
  MapOptions,
  FitOptions,
  MapControl,
  Locate,
} from '@nextgis/webmap';
import { arrayToBoundsExpression } from './utils/arrayToBoundsExpression';

export type Type<T> = new (...args: any[]) => T;
export type UnselectCb = () => void;
export type UnselectDef = UnselectCb;
export class LeafletMapAdapter implements MapAdapter<Map, any, Control> {
  static layerAdapters: {
    [name: string]: Type<LayerAdapter<Map, any, any>>;
  } = {
    GEOJSON: GeoJsonAdapter,
    IMAGE: ImageAdapter,
    TILE: TileAdapter,
    WMS: WmsAdapter,
    // // MVT: MvtAdapter,
    OSM: OsmAdapter,
  };

  static controlAdapters = {
    ZOOM: Control.Zoom,
    ATTRIBUTION: AttributionControl,
  };

  static Map = Map;

  options: MapOptions = { target: 'map' };

  layerAdapters = LeafletMapAdapter.layerAdapters;
  controlAdapters = LeafletMapAdapter.controlAdapters;
  emitter = new EventEmitter();
  map?: Map;

  private _unselectCb: UnselectDef[] = [];
  private _universalEvents: (keyof MainMapEvents)[] = [
    'move',
    'zoom',
    'moveend',
    'zoomend',
    'zoomstart',
    'movestart',
  ];

  create(options: MapOptions): void {
    this.options = { ...options };
    if (this.options.target) {
      const {
        zoom,
        center,
        maxZoom,
        minZoom,
        maxBounds: mb,
        mapAdapterOptions,
      } = this.options;
      this.map = new Map(this.options.target, {
        attributionControl: false,
        zoomControl: false,
        maxBounds: mb ? arrayToBoundsExpression(mb) : undefined,
        maxZoom,
        minZoom,
        center: center && [center[1], center[0]],
        zoom,
        ...mapAdapterOptions,
      });
      // create default pane
      const defPane = this.map.createPane('order-0');
      this.map._addUnselectCb = (def) => {
        this._addUnselectCb(def);
      };
      defPane.style.zIndex = String(0);
      this.emitter.emit('create', this);
      this._addMapListeners();
    }
  }

  destroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  getContainer(): HTMLElement | undefined {
    return this.map && this.map.getContainer();
  }

  getControlContainer(): HTMLElement {
    const controlContainer = this.map && (this.map as any)._controlContainer;
    if (controlContainer) {
      return controlContainer;
    }
    throw new Error('Leaflet Map is not initialized yet');
  }

  setCursor(cursor: string): void {
    if (this.map) {
      this.map.getContainer().style.cursor = cursor;
    }
  }

  setView(lngLat: LngLatArray, zoom?: number): void;
  setView(options: ViewOptions): void;
  setView(lngLatOrOpt: LngLatArray | ViewOptions, zoom?: number): void {
    const map = this.map;
    if (!map) return;
    if (Array.isArray(lngLatOrOpt)) {
      const lngLat = lngLatOrOpt;
      const [lng, lat] = lngLat;
      if (this.map) {
        if (typeof zoom === 'number') {
          this.map.setView([lat, lng], zoom, { animate: false });
        } else {
          this.setCenter([lng, lat]);
        }
      }
    } else {
      const { zoom, center, maxBounds, bounds, minZoom, maxZoom } = lngLatOrOpt;
      if (center && zoom !== undefined) {
        this.setView(center, zoom);
      } else {
        if (zoom !== undefined) {
          this.setZoom(zoom);
        }
        if (center) {
          this.setCenter(center);
        }
      }
      if (bounds) {
        this.fitBounds(bounds);
      }
      if (maxBounds !== undefined) {
        if (maxBounds) {
          map.setMaxBounds(arrayToBoundsExpression(maxBounds));
        } else {
          // @ts-ignore `null` works for unset maxBounds, but not in typing
          map.setMaxBounds(null);
        }
      }
      if (maxZoom !== undefined) {
        map.setMaxZoom(maxZoom);
      }
      if (minZoom !== undefined) {
        map.setMinZoom(minZoom);
      }
    }
  }

  setCenter(lngLat: LngLatArray): void {
    const [lng, lat] = lngLat;
    if (this.map) {
      this.map.panTo([lat, lng]);
    }
  }

  getCenter(): LngLatArray | undefined {
    const map = this.map;
    if (map) {
      const bounds = map.getBounds();
      const center = bounds.getCenter();
      return [center.lng, center.lat];
    }
  }

  setZoom(zoom: number): void {
    if (this.map) {
      this.map.setZoom(zoom);
    }
  }

  getZoom(): number | undefined {
    return (this.map && this.map.getZoom()) || undefined;
  }

  getBounds(): LngLatBoundsArray | undefined {
    if (!this.map) return undefined;
    const b = this.map.getBounds();
    const sw = b.getSouthWest();
    const ne = b.getNorthEast();
    return [sw.lng, sw.lat, ne.lng, ne.lat];
  }

  // [west, south, east, north]
  fitBounds(bounds: LngLatBoundsArray, options: FitOptions = {}): void {
    if (this.map) {
      const { maxZoom, offset, padding } = options;
      const opt: FitBoundsOptions = {};
      if (maxZoom) {
        opt.maxZoom = maxZoom;
      }
      if (padding) {
        opt.padding = [padding, padding];
      }
      if (offset) {
        opt.padding = offset;
      }

      this.map.fitBounds(arrayToBoundsExpression(bounds), opt);
    }
  }

  getLayerAdapter(name: string): Type<LayerAdapter<L.Map, any, any>> {
    return LeafletMapAdapter.layerAdapters[name];
  }

  createControl(control: MapControl, options: CreateControlOptions): L.Control {
    return createControl(control, options, this);
  }

  createButtonControl(options: ButtonControlOptions): L.Control {
    return createButtonControl(options, this);
  }

  addControl(control: Control, position: string): Control | undefined {
    control.options.position = position.replace('-', '') as ControlPosition;
    if (this.map) {
      this.map.addControl(control);
      return control;
    }
  }

  removeControl(control: Control): void {
    if (this.map) {
      this.map.removeControl(control);
    }
  }

  removeLayer(layer: Layer): void {
    layer && layer.remove && layer.remove();
  }

  showLayer(layer: Layer): void {
    if (this.map) {
      layer.addTo(this.map);
    }
  }

  hideLayer(layer: Layer): void {
    layer.remove();
  }

  setLayerOpacity(layer: GridLayer | Layer, value: number): void {
    if ('setOpacity' in layer) {
      layer.setOpacity(value);
    }
  }

  setLayerOrder(
    layer: Layer,
    order: number,
    layers: { [x: string]: LayerAdapter },
  ): void {
    //
  }

  onMapClick(evt: LeafletMouseEvent): void {
    const converted = convertMapClickEvent(evt);
    this.emitter.emit('preclick', converted);
    this.emitter.emit('click', converted);
  }

  locate(opt: LocateOptions, events?: LocationEvents): Locate {
    const map = this.map;
    if (map) {
      map.locate(opt);
      if (events) {
        const { locationfound, locationerror } = events;
        const locationFound = (e: L.LeafletEvent) => {
          const event = e as L.LocationEvent;
          const lngLat: [number, number] = [event.latlng.lng, event.latlng.lat];
          locationfound({ lngLat });
        };
        if (locationfound !== undefined) {
          map.on('locationfound', locationFound, this);
        }
        if (locationerror) {
          map.on('locationerror', locationerror, this);
        }
        const stop = () => {
          if (locationfound !== undefined) {
            map.off('locationfound', locationFound);
          }
          if (locationerror) {
            map.off('locationerror', locationerror);
          }
        };
        return { stop };
      }
    }
    const stop = () => void 'fake function';
    return { stop };
  }

  private _addUnselectCb(cb: UnselectDef) {
    for (const p of this._unselectCb) {
      p();
    }
    this._unselectCb.length = 0;
    this._unselectCb.push(cb);
  }

  private _addMapListeners() {
    const map = this.map;
    if (map) {
      map.on('click', (evt) => {
        this.onMapClick(evt as LeafletMouseEvent);
      });
      this._universalEvents.forEach((e) => {
        map.on(e, () => this.emitter.emit(e, this), map);
      });
    }
  }
}
