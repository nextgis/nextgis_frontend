import {
  getQmsServiceExtent,
  QmsControlController,
  resolveQmsLayer,
} from '@nextgis/qms-core';

import type {
  QmsControlControllerOptions,
  QmsControlElement,
  QmsLayer,
  QmsRequestOptions,
  QmsWmsLayer,
} from '@nextgis/qms-core';
import type {
  FitBoundsOptions,
  IControl,
  LayerSpecification,
  Map,
  RasterSourceSpecification,
  SourceSpecification,
} from 'maplibre-gl';

let ID = 0;

export type QmsMaplibreFitOptions = FitBoundsOptions & QmsRequestOptions;

export interface QmsMaplibreOptions extends QmsRequestOptions {
  id?: string;
  before?: string;
  opacity?: number;
  fit?: boolean | FitBoundsOptions;
}

export type QmsControlOptions = QmsControlControllerOptions<QmsMaplibreLayer>;

function setParam(
  params: URLSearchParams,
  key: string,
  value: string | number | boolean,
) {
  for (const currentKey of Array.from(params.keys())) {
    if (currentKey.toLowerCase() === key.toLowerCase()) {
      params.delete(currentKey);
    }
  }
  params.set(key, String(value));
}

function createWmsUrl(qms: QmsWmsLayer): string {
  const [url, query = ''] = qms.url.split('?');
  const params = new URLSearchParams(query);
  const projectionParam = parseFloat(qms.version) >= 1.3 ? 'crs' : 'srs';
  const wmsParams: Record<string, string | number | boolean> = {
    bbox: '{bbox-epsg-3857}',
    format: qms.format,
    service: 'WMS',
    version: qms.version,
    request: 'GetMap',
    [projectionParam]: 'EPSG:3857',
    styles: '',
    tiled: true,
    transparent: true,
    width: 256,
    height: 256,
    layers: qms.layers,
  };
  for (const [key, value] of Object.entries(wmsParams)) {
    setParam(params, key, value);
  }
  for (const [key, value] of Object.entries(qms.params)) {
    setParam(params, key, value);
  }
  return `${url}?${params}`.replace(
    /%7Bbbox-epsg-3857%7D/gi,
    '{bbox-epsg-3857}',
  );
}

export class QmsMaplibreLayer {
  private _map?: Map;

  constructor(
    readonly sourceId: string,
    readonly source: SourceSpecification,
    readonly layers: LayerSpecification[],
  ) {}

  addTo(map: Map, before?: string): this {
    if (!map.getSource(this.sourceId)) {
      map.addSource(this.sourceId, this.source);
    }
    for (const layer of this.layers) {
      if (!map.getLayer(layer.id)) {
        map.addLayer(layer, before);
      }
    }
    this._map = map;
    return this;
  }

  remove(): void {
    if (!this._map) {
      return;
    }
    for (const layer of [...this.layers].reverse()) {
      if (this._map.getLayer(layer.id)) {
        this._map.removeLayer(layer.id);
      }
    }
    if (this._map.getSource(this.sourceId)) {
      this._map.removeSource(this.sourceId);
    }
    this._map = undefined;
  }
}

function createLayer(
  qms: QmsLayer,
  options: QmsMaplibreOptions = {},
): QmsMaplibreLayer {
  const layerId = options.id || `qms-${qms.service.id}-${ID++}`;
  const sourceId = `${layerId}-source`;

  const rasterSource: RasterSourceSpecification = {
    type: 'raster',
    tiles: [qms.type === 'wms' ? createWmsUrl(qms) : qms.url],
    tileSize: 256,
  };
  if (qms.attribution) {
    rasterSource.attribution = qms.attribution;
  }
  if (qms.type === 'tms') {
    const url = qms.url.replace('{q}', '{quadkey}');
    rasterSource.scheme = qms.scheme;
    rasterSource.tiles = qms.subdomains.length
      ? qms.subdomains.map((subdomain) => url.replace('{s}', subdomain))
      : [url];
    if (qms.minZoom !== undefined) {
      rasterSource.minzoom = qms.minZoom;
    }
    if (qms.maxZoom !== undefined) {
      rasterSource.maxzoom = qms.maxZoom;
    }
  }
  const rasterLayer: LayerSpecification = {
    id: layerId,
    type: 'raster',
    source: sourceId,
  };
  if (options.opacity !== undefined) {
    rasterLayer.paint = { 'raster-opacity': options.opacity };
  }
  return new QmsMaplibreLayer(sourceId, rasterSource, [rasterLayer]);
}

export async function fitQmsService(
  map: Map,
  id: number,
  options: QmsMaplibreFitOptions = {},
): Promise<void> {
  const extent = await getQmsServiceExtent(id, options);
  if (!extent) {
    return;
  }
  const [west, south, east, north] = extent;
  map.fitBounds(
    [
      [west, south],
      [east, north],
    ],
    options,
  );
}

export async function addQmsLayer(
  map: Map,
  id: number,
  options: QmsMaplibreOptions = {},
): Promise<QmsMaplibreLayer> {
  const layer = createLayer(await resolveQmsLayer(id, options), options);
  layer.addTo(map, options.before);
  if (options.fit) {
    await fitQmsService(map, id, {
      signal: options.signal,
      ...(options.fit === true ? {} : options.fit),
    });
  }
  return layer;
}

export class QmsControl implements IControl {
  readonly control: QmsControlElement;

  private readonly _controller: QmsControlController<Map, QmsMaplibreLayer>;

  constructor(options: QmsControlOptions = {}) {
    this._controller = new QmsControlController<Map, QmsMaplibreLayer>(
      options,
      {
        addLayer: (map, layer) => layer.addTo(map),
        beforeAdd: (map) => this._whenLoaded(map),
        createLayer,
        removeLayer: (_map, layer) => layer.remove(),
      },
    );
    this.control = this._controller.control;
    this.control.element.classList.add('maplibregl-ctrl');
  }

  onAdd(map: Map): HTMLElement {
    this._controller.setMap(map);
    return this.control.element;
  }

  onRemove(): void {
    this.control.element.remove();
    this._controller.setMap();
  }

  private _whenLoaded(map: Map): Promise<void> {
    if (map.getStyle()) {
      return Promise.resolve();
    }
    return new Promise((resolve) => map.once('style.load', resolve));
  }
}

export function createQmsControl(options: QmsControlOptions = {}): QmsControl {
  return new QmsControl(options);
}
