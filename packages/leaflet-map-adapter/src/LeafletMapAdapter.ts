import { EventEmitter } from 'events';
import { Control, latLng, latLngBounds, Map } from 'leaflet';

import { AttributionControl } from './controls/Attribution';
import { createButtonControl } from './controls/createButtonControl';
import { createControl } from './controls/createControl';
import { GeoJsonAdapter } from './layer-adapters/GeoJsonAdapter/GeoJsonAdapter';
import { ImageAdapter } from './layer-adapters/ImageAdapter/ImageAdapter';
import { OsmAdapter } from './layer-adapters/OsmAdapter';
import { TileAdapter } from './layer-adapters/TileAdapter/TileAdapter';
import { WmsAdapter } from './layer-adapters/WmsAdapter/WmsAdapter';
import { arrayToBoundsExpression } from './utils/arrayToBoundsExpression';
import { convertMapClickEvent } from './utils/convertMapClickEvent';

import type { LngLatArray, LngLatBoundsArray } from '@nextgis/utils';
import type {
  ButtonControlOptions,
  CreateControlOptions,
  FitOptions,
  LayerAdapter,
  Locate,
  LocateOptions,
  LocationEvents,
  MainMapEvents,
  MapAdapter,
  MapControl,
  MapOptions,
  ViewOptions,
} from '@nextgis/webmap';
import type {
  ControlPosition,
  FitBoundsOptions,
  GridLayer,
  Layer,
  LeafletEvent,
  LeafletMouseEvent,
  LocationEvent,
} from 'leaflet';

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

  options: MapOptions<Map> = { target: 'map' };

  layerAdapters = LeafletMapAdapter.layerAdapters;
  controlAdapters = LeafletMapAdapter.controlAdapters;
  emitter = new EventEmitter();
  map?: Map;

  private _resizeObserver?: ResizeObserver;
  private _unselectCb: UnselectDef[] = [];
  private _universalEvents: (keyof MainMapEvents)[] = [
    'move',
    'zoom',
    'zoomend',
    'zoomstart',
    'moveend',
    'movestart',
  ];
  private _positionEvents: (keyof MainMapEvents)[] = [
    'mousemove',
    'mouseout',
    'mouseover',
  ];

  create(options: MapOptions<Map>): void {
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

      this.map =
        this.options.map ||
        new Map(this.options.target, {
          attributionControl: false,
          zoomControl: false,
          maxBounds: mb ? arrayToBoundsExpression(mb) : undefined,
          maxZoom,
          minZoom,
          center: center && [center[1], center[0]],
          zoom,
          ...mapAdapterOptions,
        });

      this._updateMinZoomForBounds(minZoom);
      this._watchSizeChangeToUpdateMinZoom();
      // create default pane
      const defPane = this.map.createPane('order-0');
      (this.map as any)._addUnselectCb = (def: UnselectDef) => {
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
    this._stopWatchSizeChangeToUpdateMinZoom();
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
          const b = arrayToBoundsExpression(maxBounds);
          map.setMaxBounds(b);
          this._updateMinZoomForBounds();
        } else {
          // @ts-expect-error `null` works for unset maxBounds, but not in typing
          map.setMaxBounds(null);
          this._updateMinZoomForBounds();
        }
      }
      if (maxZoom !== undefined) {
        map.setMaxZoom(maxZoom);
      }
      if (minZoom !== undefined) {
        this._updateMinZoomForBounds(minZoom);
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
    return (this.map && this.map.getZoom()) ?? undefined;
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

  getLayerAdapter(name: string): Type<LayerAdapter<Map, any, any>> {
    return LeafletMapAdapter.layerAdapters[name];
  }

  createControl(control: MapControl, options: CreateControlOptions): Control {
    return createControl(control, options, this);
  }

  createButtonControl(options: ButtonControlOptions): Control {
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
    if (layer && layer.remove) layer.remove();
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
        const locationFound = (e: LeafletEvent) => {
          const event = e as LocationEvent;
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

  private _watchSizeChangeToUpdateMinZoom() {
    this._stopWatchSizeChangeToUpdateMinZoom();
    const container = this.getContainer();
    const map = this.map;
    if (container && map && window.ResizeObserver) {
      this._resizeObserver = new ResizeObserver(() => {
        this._updateMinZoomForBounds();
      });
      this._resizeObserver.observe(container);
    }
  }

  private _stopWatchSizeChangeToUpdateMinZoom() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = undefined;
    }
  }

  private _addMapListeners() {
    const map = this.map;
    if (map) {
      map.on('click', (evt) => {
        this.onMapClick(evt as LeafletMouseEvent);
      });
      for (const e of this._universalEvents) {
        map.on(e, () => this.emitter.emit(e, this), map);
      }

      map.on('movestart', () => {
        ImageAdapter.queue.abort();
      });
      map.on('zoomstart', () => {
        ImageAdapter.queue.abort();
      });

      for (const e of this._positionEvents) {
        map.on(
          e,
          (evt) =>
            this.emitter.emit(
              e,
              convertMapClickEvent(evt as LeafletMouseEvent),
            ),
          map,
        );
      }
    }
  }

  private _updateMinZoomForBounds(zoom?: number) {
    const map = this.map;
    if (map) {
      zoom = zoom ?? map.getMinZoom();
      const defaultBounds = latLngBounds(
        latLng(-90, -18000),
        latLng(90, 18000),
      );
      const maxBounds = map.options.maxBounds ?? defaultBounds;
      if (maxBounds !== undefined) {
        map.setMinZoom(0);
        const boundsZoom = map.getBoundsZoom(maxBounds, true);
        const minZoom = zoom < boundsZoom ? boundsZoom : zoom;

        map.options.minZoom = minZoom;
        map.setMinZoom(minZoom);

        if (map.getZoom() < minZoom) {
          map.setZoom(minZoom);
        }
      }
    }
  }
}
