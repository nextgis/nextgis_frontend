import {
  getQmsServiceExtent,
  getQmsTileQuadKey,
  QmsControlController,
  resolveQmsLayer,
} from '@nextgis/qms-core';
import { Control, DomEvent, TileLayer } from 'leaflet';

import type {
  QmsControlControllerOptions,
  QmsControlElement,
  QmsLayer,
  QmsRequestOptions,
} from '@nextgis/qms-core';
import type {
  ControlOptions,
  Coords,
  FitBoundsOptions,
  Layer,
  Map,
  TileLayerOptions,
  WMSOptions,
} from 'leaflet';

export type QmsLeafletFitOptions = FitBoundsOptions & QmsRequestOptions;

export interface QmsLeafletOptions extends QmsRequestOptions {
  opacity?: number;
  fit?: boolean | FitBoundsOptions;
}

export interface QmsControlOptions
  extends QmsControlControllerOptions<Layer>,
    ControlOptions {}

const QUADKEY_PLACEHOLDER = 'nextgis-qms-quadkey';

class QmsTileLayer extends TileLayer {
  getTileUrl(coords: Coords): string {
    return super
      .getTileUrl(coords)
      .replace(
        QUADKEY_PLACEHOLDER,
        getQmsTileQuadKey(coords.x, coords.y, coords.z),
      );
  }
}

function getLeafletWmsParams(params: Record<string, string>) {
  const managedParams = new Set([
    'bbox',
    'crs',
    'height',
    'request',
    'service',
    'srs',
    'version',
    'width',
  ]);
  const normalizedParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    const normalizedKey = key.toLowerCase();
    if (!managedParams.has(normalizedKey)) {
      normalizedParams[normalizedKey] = value;
    }
  }
  return normalizedParams;
}

function createLayer(qms: QmsLayer, options: QmsLeafletOptions = {}): Layer {
  let layer: Layer;

  if (qms.type === 'tms') {
    const layerOptions: TileLayerOptions = {
      attribution: qms.attribution,
      minZoom: qms.minZoom,
      maxZoom: qms.maxZoom,
      subdomains: qms.subdomains,
      tms: qms.scheme === 'tms',
      opacity: options.opacity,
    };
    layer = new QmsTileLayer(
      qms.url.replace('{q}', QUADKEY_PLACEHOLDER),
      layerOptions,
    );
  } else {
    const layerOptions: WMSOptions = {
      layers: qms.layers,
      format: qms.format,
      transparent: true,
      version: qms.version,
      ...getLeafletWmsParams(qms.params),
      attribution: qms.attribution,
      opacity: options.opacity,
      uppercase: true,
    };
    layer = new TileLayer.WMS(qms.url, layerOptions);
  }

  return layer;
}

export async function fitQmsService(
  map: Map,
  id: number,
  options: QmsLeafletFitOptions = {},
): Promise<void> {
  const extent = await getQmsServiceExtent(id, options);
  if (!extent) {
    return;
  }
  const [west, south, east, north] = extent;
  map.fitBounds(
    [
      [south, west],
      [north, east],
    ],
    options,
  );
}

export async function addQmsLayer(
  map: Map,
  id: number,
  options: QmsLeafletOptions = {},
): Promise<Layer> {
  const layer = createLayer(await resolveQmsLayer(id, options), options);
  layer.addTo(map);
  if (options.fit) {
    await fitQmsService(map, id, {
      signal: options.signal,
      ...(options.fit === true ? {} : options.fit),
    });
  }
  return layer;
}

export class QmsControl extends Control {
  readonly control: QmsControlElement;

  private readonly _controller: QmsControlController<Map, Layer>;

  constructor(options: QmsControlOptions = {}) {
    super(options.position ? { position: options.position } : undefined);
    this._controller = new QmsControlController<Map, Layer>(options, {
      addLayer: (map, layer) => layer.addTo(map),
      createLayer,
      removeLayer: (map, layer) => map.removeLayer(layer),
    });
    this.control = this._controller.control;
  }

  onAdd(map: Map): HTMLElement {
    this.control.element.classList.add('leaflet-control');
    DomEvent.disableClickPropagation(this.control.element);
    DomEvent.disableScrollPropagation(this.control.element);
    this._controller.setMap(map);
    return this.control.element;
  }

  onRemove(): void {
    this._controller.setMap();
  }
}

export function createQmsControl(options: QmsControlOptions = {}): QmsControl {
  return new QmsControl(options);
}
