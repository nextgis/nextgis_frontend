import {
  getQmsServiceExtent,
  getQmsTileQuadKey,
  QmsControlController,
  resolveQmsLayer,
} from '@nextgis/qms-core';
import Control from 'ol/control/Control';
import TileLayer from 'ol/layer/Tile';
import { transformExtent } from 'ol/proj';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';
import TileState from 'ol/TileState';

import type {
  QmsControlControllerOptions,
  QmsControlElement,
  QmsLayer,
  QmsRequestOptions,
} from '@nextgis/qms-core';
import type BaseLayer from 'ol/layer/Base';
import type Map from 'ol/Map';
import type Tile from 'ol/Tile';
import type { LoadFunction } from 'ol/Tile';
import type { FitOptions } from 'ol/View';

export type QmsOlFitOptions = FitOptions & QmsRequestOptions;

export interface QmsOlOptions extends QmsRequestOptions {
  opacity?: number;
  visible?: boolean;
  zIndex?: number;
  crossOrigin?: 'anonymous';
  fit?: boolean | FitOptions;
}

// eslint-disable-next-line max-len
export interface QmsControlOptions extends QmsControlControllerOptions<BaseLayer> {
  target?: HTMLElement | string;
}

const layerLoaders = new WeakMap<BaseLayer, () => void>();

function createTileLoader(): {
  abort: () => void;
  tileLoadFunction: LoadFunction;
} {
  const loading = new globalThis.Map<
    Tile,
    { image: HTMLImageElement; complete: () => void }
  >();
  let active = true;

  const tileLoadFunction: LoadFunction = (tile, src) => {
    if (!active) {
      tile.setState(TileState.ERROR);
      return;
    }
    const image = (
      tile as Tile & { getImage: () => HTMLImageElement }
    ).getImage();
    const complete = () => {
      image.removeEventListener('load', complete);
      image.removeEventListener('error', complete);
      loading.delete(tile);
    };
    loading.set(tile, { image, complete });
    image.addEventListener('load', complete);
    image.addEventListener('error', complete);
    image.src = src;
  };

  return {
    tileLoadFunction,
    abort: () => {
      active = false;
      for (const [tile, { image, complete }] of loading) {
        complete();
        image.removeAttribute('src');
        tile.setState(TileState.ERROR);
      }
    },
  };
}

function stopLayerLoading(layer: BaseLayer): void {
  layerLoaders.get(layer)?.();
}

function createLayer(qms: QmsLayer, options: QmsOlOptions = {}): BaseLayer {
  let layer: BaseLayer;
  const loader = createTileLoader();
  const layerOptions = {
    opacity: options.opacity,
    visible: options.visible,
    zIndex: options.zIndex,
  };

  if (qms.type === 'tms') {
    const url = qms.scheme === 'tms' ? qms.url.replace('{y}', '{-y}') : qms.url;
    const urls = qms.subdomains.length
      ? qms.subdomains.map((subdomain) => url.replace('{s}', subdomain))
      : [url];
    const source = new XYZ({
      urls,
      attributions: qms.attribution ? [qms.attribution] : undefined,
      minZoom: qms.minZoom,
      maxZoom: qms.maxZoom,
      crossOrigin: options.crossOrigin,
      tileLoadFunction: loader.tileLoadFunction,
    });
    if (url.includes('{q}')) {
      const tileUrlFunction = source.getTileUrlFunction();
      source.setTileUrlFunction((tileCoord, pixelRatio, projection) => {
        return tileUrlFunction(tileCoord, pixelRatio, projection)?.replace(
          '{q}',
          getQmsTileQuadKey(tileCoord[1], tileCoord[2], tileCoord[0]),
        );
      });
    }
    layer = new TileLayer({
      ...layerOptions,
      source,
    });
  } else {
    const source = new TileWMS({
      url: qms.url,
      params: {
        LAYERS: qms.layers,
        FORMAT: qms.format,
        VERSION: qms.version,
        TRANSPARENT: true,
        TILED: true,
        ...qms.params,
      },
      attributions: qms.attribution ? [qms.attribution] : undefined,
      crossOrigin: options.crossOrigin,
      tileLoadFunction: loader.tileLoadFunction,
    });
    layer = new TileLayer({
      ...layerOptions,
      source,
    });
  }

  layerLoaders.set(layer, loader.abort);
  return layer;
}

export async function fitQmsService(
  map: Map,
  id: number,
  options: QmsOlFitOptions = {},
): Promise<void> {
  const extent = await getQmsServiceExtent(id, options);
  if (!extent) {
    return;
  }
  const projection = map.getView().getProjection();
  map.getView().fit(transformExtent(extent, 'EPSG:4326', projection), options);
}

export async function addQmsLayer(
  map: Map,
  id: number,
  options: QmsOlOptions = {},
): Promise<BaseLayer> {
  const layer = createLayer(await resolveQmsLayer(id, options), options);
  map.addLayer(layer);
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

  private readonly _controller: QmsControlController<Map, BaseLayer>;

  constructor(options: QmsControlOptions = {}) {
    const controller = new QmsControlController<Map, BaseLayer>(options, {
      addLayer: (map, layer) => map.addLayer(layer),
      createLayer,
      removeLayer: (map, layer) => map.removeLayer(layer),
      stopLayer: stopLayerLoading,
    });
    const control = controller.control;
    control.element.classList.add('ol-control', 'ol-unselectable');
    super({ element: control.element, target: options.target });
    this._controller = controller;
    this.control = control;
  }

  setMap(map: Map | null): void {
    super.setMap(map);
    this._controller.setMap(map || undefined);
  }
}

export function createQmsControl(options: QmsControlOptions = {}): QmsControl {
  return new QmsControl(options);
}
