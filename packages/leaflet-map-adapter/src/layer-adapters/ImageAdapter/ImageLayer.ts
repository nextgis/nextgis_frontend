/*!
 * leaflet.wms.js
 * A collection of Leaflet utilities for working with Web Mapping services.
 * (c) 2014-2016, Houston Engineering, Inc.
 * MIT License
 */

import { debounce, isObject } from '@nextgis/utils';
import { CRS, Layer, Util } from 'leaflet';

import { ImageOverlay } from './ImageOverlay';

import type { Map } from 'leaflet';

interface OverlayOptions {
  crs?: null;
  uppercase?: boolean;
  attribution?: string;
  opacity?: number;
  isBack?: boolean;
  minZoom?: number;
  maxZoom?: number;
  zIndex?: number;
  pane?: string;
  headers?: any;
  withCredentials?: boolean;
  viewPortBuffer?: number;
  setViewDelay?: number;
  params?: Record<string, unknown>;
}

/*
 * Overlay:
 * "Single Tile" WMS image overlay that updates with map changes.
 * Portions of wms.Overlay are directly extracted from L.TileLayer.WMS.
 * See Leaflet license.
 */
export class ImageLayer extends Layer {
  defaultWmsParams = {
    service: 'WMS',
    request: 'GetMap',
    version: '1.1.1',
    layers: '',
    styles: '',
    format: 'image/jpeg',
    transparent: false,
  };

  options: OverlayOptions = {
    crs: null,
    uppercase: false,
    attribution: '',
    opacity: 1,
    isBack: false,
    minZoom: 0,
    maxZoom: undefined,
    pane: 'tilePane',
    headers: null,
    withCredentials: false,
    viewPortBuffer: 0,
    setViewDelay: 100,
  };

  wmsParams: Record<string, string>;
  private _url?: string;
  private _currentUrl?: string;
  private _currentOverlay?: ImageOverlay;
  private _loadedOverlay?: ImageOverlay;

  constructor(url: string, options: OverlayOptions) {
    super(options);
    this._url = url;

    // Move WMS parameters to params object
    const params: any = {};
    const opts: any = {};
    let opt: keyof OverlayOptions;
    for (opt in options) {
      const val = options[opt];
      if (opt in this.options) {
        opts[opt] = val;
      }
    }

    if (options.params) {
      for (const param in options.params) {
        const val = options.params[param];
        if (
          !isObject(val) &&
          !Array.isArray(val) &&
          typeof val !== 'function'
        ) {
          params[param] = val;
        }
      }
    }
    Util.setOptions(this, opts);
    this.wmsParams = Util.extend({}, this.defaultWmsParams, params);
  }

  setParams(params: Record<string, any>): void {
    Util.extend(this.wmsParams, params);
    this.update();
  }

  getAttribution(): string {
    return this.options.attribution || '';
  }

  onAdd(): this {
    this.update();
    return this;
  }

  onRemove(map: Map): this {
    if (this._currentOverlay) {
      this._currentOverlay.cancelLoad();
      map.removeLayer(this._currentOverlay);
      delete this._currentOverlay;
    }
    if (this._currentUrl) {
      delete this._currentUrl;
    }
    return this;
  }

  getEvents(): {
    moveend: () => void;
  } {
    return {
      moveend: debounce(this.update, this.options.setViewDelay),
    };
  }

  update(): void {
    if (!this._map) {
      return;
    }
    // Determine image URL and whether it has changed since last update
    this.updateWmsParams();
    const url = this.getImageUrl();
    if (this._currentUrl === url) {
      return;
    }
    this._currentUrl = url;

    const viewPortBuffer = this.options.viewPortBuffer || 0;
    const bounds = this._map.getBounds().pad(viewPortBuffer);
    if (this._loadedOverlay) {
      this._loadedOverlay.cancelLoad();
      this._loadedOverlay.off('load');
      this._loadedOverlay = undefined;
    }
    const overlay = new ImageOverlay(url, bounds, {
      opacity: 0,
      pane: this.options.pane,
      headers: this.options.headers,
      withCredentials: this.options.withCredentials,
    });
    overlay.addTo(this._map);
    this._loadedOverlay = overlay;

    // Keep current image overlay in place until new one loads
    // (inspired by esri.leaflet)
    overlay.once(
      'load',
      () => {
        if (!this._map) {
          return;
        }
        // @ts-expect-error override private
        if (overlay._url !== this._currentUrl) {
          this._map.removeLayer(overlay);
          return;
        } else if (this._currentOverlay) {
          this._map.removeLayer(this._currentOverlay);
        }
        this._loadedOverlay = undefined;
        this._currentOverlay = overlay;
        overlay.setOpacity(
          this.options.opacity !== undefined ? this.options.opacity : 1,
        );
        if (this.options.isBack === true) {
          overlay.bringToBack();
        }
        if (this.options.isBack === false) {
          overlay.bringToFront();
        }
        if (this.options.zIndex !== undefined) {
          overlay.setZIndex(this.options.zIndex);
        }
      },
      this,
    );
    const { minZoom, maxZoom } = this.options;
    if (
      (minZoom && this._map.getZoom() < minZoom) ||
      (maxZoom && this._map.getZoom() > maxZoom)
    ) {
      this._map.removeLayer(overlay);
    }
  }

  setOpacity(opacity: number): void {
    this.options.opacity = opacity;
    if (this._currentOverlay) {
      this._currentOverlay.setOpacity(opacity);
    }
  }

  bringToBack(): void {
    this.options.isBack = true;
    if (this._currentOverlay) {
      this._currentOverlay.bringToBack();
    }
  }

  bringToFront(): void {
    this.options.isBack = false;
    if (this._currentOverlay) {
      this._currentOverlay.bringToFront();
    }
  }

  setZIndex(zIndex: number): void {
    this.options.zIndex = zIndex;
    if (this._currentOverlay) {
      this._currentOverlay.setZIndex(zIndex);
    }
  }

  // See L.TileLayer.WMS: onAdd() & getTileUrl()
  updateWmsParams(map?: Map): void {
    if (!map) {
      map = this._map;
    }
    // Compute WMS options
    const viewPortBuffer = this.options.viewPortBuffer || 0;
    const bounds = map.getBounds().pad(viewPortBuffer);
    const size = map.getSize();
    if (this.options.viewPortBuffer !== 0) {
      const factor = viewPortBuffer + 1;
      size.x = Math.ceil(size.x * factor);
      size.y = Math.ceil(size.y * factor);
    }
    const wmsVersion = parseFloat(this.wmsParams.version);
    const crs = this.options.crs || map.options.crs;
    const projectionKey = wmsVersion >= 1.3 ? 'crs' : 'srs';
    if (crs) {
      const nw = crs.project(bounds.getNorthWest());
      const se = crs.project(bounds.getSouthEast());

      // Assemble WMS parameter string
      const params: any = {
        width: size.x,
        height: size.y,
      };
      params[projectionKey] = crs.code;
      params.bbox = (
        wmsVersion >= 1.3 && crs === CRS.EPSG4326
          ? [se.y, nw.x, nw.y, se.x]
          : [nw.x, se.y, se.x, nw.y]
      ).join(',');

      Util.extend(this.wmsParams, params);
    }
  }

  getImageUrl(): string {
    const uppercase = this.options.uppercase || false;
    const pstr = Util.getParamString(this.wmsParams, this._url, uppercase);
    return this._url + pstr;
  }
}
