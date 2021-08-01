import { EventEmitter } from 'events';
import { Map, Control, FitBoundsOptions } from 'leaflet';
import { convertMapClickEvent } from './utils/utils';
import { createButtonControl } from './controls/createButtonControl';
import { AttributionControl } from './controls/Attribution';
import { createControl } from './controls/createControl';
import { GeoJsonAdapter } from './layer-adapters/GeoJsonAdapter';
import { ImageAdapter } from './layer-adapters/ImageAdapter/ImageAdapter';
import { TileAdapter } from './layer-adapters/TileAdapter/TileAdapter';
import { WmsAdapter } from './layer-adapters/WmsAdapter/WmsAdapter';
import { OsmAdapter } from './layer-adapters/OsmAdapter';

import type {
  CreateControlOptions,
  ButtonControlOptions,
  LngLatBoundsArray,
  LocationEvents,
  LocateOptions,
  MainMapEvents,
  LayerAdapter,
  LngLatArray,
  MapAdapter,
  MapOptions,
  FitOptions,
  MapControl,
  Locate,
} from '@nextgis/webmap';
import type {
  Layer,
  GridLayer,
  ControlPosition,
  LeafletMouseEvent,
} from 'leaflet';

export type Type<T> = new (...args: any[]) => T;

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
        maxBounds: mb && [
          [mb[1], mb[0]],
          [mb[3], mb[2]],
        ],
        maxZoom,
        minZoom,
        center: center && [center[1], center[0]],
        zoom,
        ...mapAdapterOptions,
      });
      // create default pane
      const defPane = this.map.createPane('order-0');
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

  setCursor(cursor: string): void {
    if (this.map) {
      this.map.getContainer().style.cursor = cursor;
    }
  }

  setView(lngLat: LngLatArray, zoom?: number): void {
    const [lng, lat] = lngLat;
    if (this.map) {
      if (typeof zoom === 'number') {
        this.map.setView([lat, lng], zoom, { animate: false });
      } else {
        this.setCenter([lng, lat]);
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
  fitBounds(e: LngLatBoundsArray, options: FitOptions = {}): void {
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
      // top, left, bottom, right
      this.map.fitBounds(
        [
          [e[3], e[0]],
          [e[1], e[2]],
        ],
        opt,
      );
    }
  }

  getLayerAdapter(name: string): Type<LayerAdapter<L.Map, any, any>> {
    return LeafletMapAdapter.layerAdapters[name];
  }

  createControl(control: MapControl, options: CreateControlOptions): L.Control {
    return createControl(control, options);
  }

  createButtonControl(options: ButtonControlOptions): L.Control {
    return createButtonControl(options);
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
    // const baseLayers: string[] = [];
    // const orderedLayers = Object.keys(layers).filter((x) => {
    //   if (layers[x].options.baselayer) {
    //     baseLayers.push(x);
    //     return false;
    //   }
    //   return true;
    // }).sort((a, b) => {
    //   const layerAOrder = layers[a] && layers[a].options.order;
    //   const layerBOrder = layers[b] && layers[b].options.order;
    //   if (layerAOrder !== undefined && layerBOrder !== undefined) {
    //     return layerAOrder - layerBOrder;
    //   }
    //   return 0;
    // });
    // baseLayers.forEach((x) => {
    //   layers[x].layer.bringToBack();
    // });
    // if (layer.setZIndex) {
    //   layer.setZIndex(order);
    // } else {
    //   for (let fry = 0; fry < orderedLayers.length; fry++) {
    //     if (layers[orderedLayers[fry]].options.visibility) {
    //       layers[orderedLayers[fry]].layer.bringToFront();
    //     }
    //   }
    // }
    // orderedLayers.forEach((x) => {
    //   const l = layers[x];
    //   const map = l.layer._map;
    //   if (l.options.visibility && map) {
    //     l.layer.remove();
    //     l.layer.addTo(map);
    //   }
    // });
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
