/**
 * @module leaflet-map-adapter
 */

import {
  MapAdapter,
  MapOptions,
  MapControl,
  CreateControlOptions,
  ButtonControlOptions,
  LayerAdapter,
  LngLatArray,
  LngLatBoundsArray,
  LocateOptions,
  LocationEvents,
  Locate,
  BaseMapEvents
} from '@nextgis/webmap';
import L, {
  Map,
  Control,
  Layer,
  ControlPosition,
  LeafletMouseEvent,
  GridLayer
} from 'leaflet';
import { EventEmitter } from 'events';
import { TileAdapter } from './layer-adapters/TileAdapter/TileAdapter';
import { GeoJsonAdapter } from './layer-adapters/GeoJsonAdapter';
import { AttributionControl } from './controls/Attribution';
import { ImageAdapter } from './layer-adapters/ImageAdapter/ImageAdapter';
import { createControl } from './controls/createControl';
import { createButtonControl } from './controls/createButtonControl';
import { convertMapClickEvent } from './utils/utils';

export type Type<T> = new (...args: any[]) => T;

export class LeafletMapAdapter implements MapAdapter<Map, any, Control> {
  static layerAdapters: {
    [name: string]: Type<LayerAdapter<Map, any, any>>;
  } = {
    IMAGE: ImageAdapter,
    TILE: TileAdapter,
    GEOJSON: GeoJsonAdapter
    // // MVT: MvtAdapter,
    // OSM: OsmAdapter,
    // MARKER: MarkerAdapter,
  };

  static controlAdapters = {
    ZOOM: Control.Zoom,
    ATTRIBUTION: AttributionControl
  };

  static Map = L;

  options: MapOptions = { target: 'map' };

  layerAdapters = LeafletMapAdapter.layerAdapters;
  controlAdapters = LeafletMapAdapter.controlAdapters;
  emitter = new EventEmitter();
  map?: Map;

  private _universalEvents: (keyof BaseMapEvents)[] = [
    'zoomstart',
    'zoom',
    'zoomend',
    'movestart',
    'move',
    'moveend'
  ];

  create(options: MapOptions) {
    this.options = { ...options };
    if (this.options.target) {
      const { maxZoom, minZoom, zoom, center } = this.options;
      this.map = new Map(this.options.target, {
        zoomControl: false,
        attributionControl: false,
        maxZoom,
        minZoom,
        zoom,
        center
      });
      // create default pane
      const defPane = this.map.createPane('order-0');
      defPane.style.zIndex = String(0);
      this.emitter.emit('create', this);
      this._addMapListeners();
    }
  }

  destroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  getContainer(): HTMLElement | undefined {
    return this.map && this.map.getContainer();
  }

  setCursor(cursor: string) {
    if (this.map) {
      this.map.getContainer().style.cursor = cursor;
    }
  }

  setView(lngLat: LngLatArray, zoom?: number) {
    const [lng, lat] = lngLat;
    if (this.map) {
      if (zoom) {
        this.map.setView([lat, lng], zoom, { animate: false });
      } else {
        this.setCenter([lng, lat]);
      }
    }
  }

  setCenter(lngLat: LngLatArray) {
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

  setZoom(zoom: number) {
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
  fitBounds(e: LngLatBoundsArray) {
    if (this.map) {
      // top, left, bottom, right
      this.map.fitBounds([
        [e[3], e[0]],
        [e[1], e[2]]
      ]);
    }
  }

  getLayerAdapter(name: string) {
    return LeafletMapAdapter.layerAdapters[name];
  }

  createControl(control: MapControl, options: CreateControlOptions) {
    return createControl(control, options);
  }

  createButtonControl(options: ButtonControlOptions) {
    return createButtonControl(options);
  }

  addControl(control: Control, position: string): Control | undefined {
    control.options.position = position.replace('-', '') as ControlPosition;
    if (this.map) {
      this.map.addControl(control);
      return control;
    }
  }

  removeControl(control: Control) {
    if (this.map) {
      this.map.removeControl(control);
    }
  }

  removeLayer(layer: Layer) {
    layer && layer.remove && layer.remove();
  }

  showLayer(layer: Layer) {
    if (this.map) {
      layer.addTo(this.map);
    }
  }

  hideLayer(layer: Layer) {
    layer.remove();
  }

  setLayerOpacity(layer: any, value: number) {
    if (layer.setOpacity) {
      (layer as GridLayer).setOpacity(value);
    }
  }

  setLayerOrder(
    layer: any,
    order: number,
    layers: { [x: string]: LayerAdapter }
  ) {
    // const baseLayers: string[] = [];
    // const orderedLayers = Object.keys(layers).filter((x) => {
    //   if (layers[x].options.baseLayer) {
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

  onMapClick(evt: LeafletMouseEvent) {
    this.emitter.emit('click', convertMapClickEvent(evt));
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
      map.on('click', evt => {
        this.onMapClick(evt as LeafletMouseEvent);
      });
      this._universalEvents.forEach(e => {
        map.on(e, () => this.emitter.emit(e, this), map);
      });
    }
  }
}
