import { QmsClient } from '@nextgis/qms-core';
import { mixinProperties } from '@nextgis/utils';

import type { QmsLayer, QmsService, QmsServiceType } from '@nextgis/qms-core';
import type { Type } from '@nextgis/utils';
import type {
  LayerAdaptersOptions,
  MainLayerAdapter,
  WebMap,
} from '@nextgis/webmap';

import type {
  CreateQmsAdapterOptions,
  QmsAdapter as QA,
  QmsAdapterOptions,
} from '../interfaces';

export const alias: {
  [key in QmsServiceType]: keyof LayerAdaptersOptions;
} = {
  tms: 'TILE',
  wms: 'WMS',
};

function qmsLayerToOptions(layer: QmsLayer): Partial<QmsAdapterOptions> {
  if (layer.type === 'tms') {
    return {
      url:
        layer.scheme === 'tms' ? layer.url.replace('{y}', '{-y}') : layer.url,
      subdomains: layer.subdomains,
      maxZoom: layer.maxZoom,
      minZoom: layer.minZoom,
      name: layer.name,
      attribution: layer.attribution,
    };
  }
  return {
    url: layer.url,
    layers: layer.layers,
    format: layer.format,
    version: layer.version,
    params: layer.params,
    name: layer.name,
    attribution: layer.attribution,
  };
}

export function createQmsAdapter(
  options: CreateQmsAdapterOptions,
): Type<MainLayerAdapter>;
export function createQmsAdapter(
  webMap: WebMap,
  createOpt?: Partial<QmsAdapterOptions>,
): Type<MainLayerAdapter>;
export function createQmsAdapter(
  webMapOrOptions: WebMap | CreateQmsAdapterOptions,
  createOpt: Partial<QmsAdapterOptions> = {},
): Type<MainLayerAdapter> {
  let webMap: WebMap;
  if ('webMap' in webMapOrOptions) {
    const { webMap: webMap_, ...adapterOptions } = webMapOrOptions;
    webMap = webMap_;
    createOpt = adapterOptions;
  } else {
    webMap = webMapOrOptions;
  }

  const client = new QmsClient();
  class QmsAdapter<M = any> implements MainLayerAdapter<M>, QA {
    qms?: QmsService;

    options: QmsAdapterOptions;
    map: M;

    constructor(map: M, options: QmsAdapterOptions) {
      this.map = map;
      const opt = { ...createOpt, ...options };
      this.options = opt;
      this.options.baselayer = true;
      if (opt.qms) {
        this.qms = opt.qms;
      }
    }

    async addLayer(options: QmsAdapterOptions): Promise<any> {
      const signal = options.signal ?? this.options.signal;
      const qmsId = options.qmsId ?? this.qms?.id;
      if (qmsId === undefined) {
        return;
      }
      try {
        const layer = await client.getLayer(qmsId, { signal });
        this.qms = layer.service;
        const type = alias[layer.type];
        const WebMapAdapter = webMap.mapAdapter.layerAdapters[type];
        if (WebMapAdapter) {
          mixinProperties(QmsAdapter, WebMapAdapter, [
            'showLayer',
            'hideLayer',
          ]);
          options = {
            ...(type === 'TILE'
              ? {
                  order: 0,
                  maxZoom: webMap.options.maxZoom,
                  minZoom: webMap.options.minZoom,
                }
              : {}),
            ...this.options,
            ...qmsLayerToOptions(layer),
            signal,
          } as QmsAdapterOptions;
          this.options = options;
          const adapter = new WebMapAdapter(this.map, options);
          return adapter.addLayer(options);
        }
      } catch (er) {
        if (signal?.aborted) {
          throw er;
        }
        console.error(er);
      }
    }
  }
  return QmsAdapter;
}
