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
  WebMapEvents,
  EventsAlias
} from '@nextgis/webmap';
import { Map, Control, Layer, ControlPosition, LeafletMouseEvent } from 'leaflet';
import { EventEmitter } from 'events';
import { TileAdapter } from './layer-adapters/TileAdapter/TileAdapter';
import { GeoJsonAdapter } from './layer-adapters/GeoJsonAdapter';
import { AttributionControl } from './controls/Attribution';
import { ImageAdapter } from './layer-adapters/ImageAdapter/ImageAdapter';
import { createControl } from './controls/createControl';
import { createButtonControl } from './controls/createButtonControl';

export interface LeafletMapAdapterOptions extends MapOptions {
  id?: string;
}

export type Type<T> = new (...args: any[]) => T;

export class LeafletMapAdapter implements MapAdapter<Map, any, Control> {

  static layerAdapters: { [name: string]: Type<LayerAdapter<Map, any, any>> } = {
    IMAGE: ImageAdapter,
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
  controlAdapters = LeafletMapAdapter.controlAdapters;

  universalEvents: EventsAlias = [
    'zoomstart',
    'zoom',
    'zoomend',
    'movestart',
    'move',
    'moveend',
  ];

  specialEvents: Array<keyof WebMapEvents> = ['click'];

  emitter = new EventEmitter();

  map?: Map;

  // create(options: MapOptions = {target: 'map'}) {
  create(options: LeafletMapAdapterOptions = { target: 'map' }) {
    this.options = { ...options };
    if (this.options.target) {
      const { maxZoom, minZoom } = this.options;
      this.map = new Map(this.options.target, {
        zoomControl: false,
        attributionControl: false,
        maxZoom,
        minZoom
      });
      this.emitter.emit('create', { map: this.map });
      // create default pane
      const defPane = this.map.createPane('order-0');
      defPane.style.zIndex = String(0);
      this._addMapListeners();
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

  setView(lngLat: LngLatArray, zoom: number) {
    const [lng, lat] = lngLat;
    if (this.map) {
      this.map.setView([lat, lng], zoom);
    }
  }

  setCenter(lngLat: LngLatArray) {
    const [lng, lat] = lngLat;
    if (this.map) {
      this.map.setView([lat, lng], this.map.getZoom());
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
    return this.map && this.map.getZoom();
  }

  // [west, south, east, north]
  fit(e: LngLatBoundsArray) {
    if (this.map) {
      // top, left, bottom, right
      this.map.fitBounds([[e[3], e[0]], [e[1], e[2]]]);
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
    layer.remove();
  }

  showLayer(layer: Layer) {
    if (this.map) {
      layer.addTo(this.map);
    }
  }

  hideLayer(layer: Layer) {
    layer.remove();
  }

  setLayerOpacity(layerName: string, value: number) {
    // ignore
  }

  setLayerOrder(layer: any, order: number, layers: { [x: string]: LayerAdapter }) {
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
    const coord = evt.containerPoint;
    const latLng = evt.latlng;
    this.emitter.emit('click', {
      latLng,
      pixel: { left: coord.x, top: coord.y },
      source: evt,
    });
  }

  private _addMapListeners() {
    if (this.map) {
      this.map.on('click', (evt) => {
        this.onMapClick(evt as LeafletMouseEvent);
      });
    }
  }

}
