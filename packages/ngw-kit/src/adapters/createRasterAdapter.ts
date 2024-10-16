import { defined } from '@nextgis/utils';

import { ngwApiToAdapterOptions } from '../utils/ngwApiToAdapterOptions';
import { resourceIdFromLayerOptions } from '../utils/resourceIdFromLayerOptions';

import type { LayerLegend } from '@nextgis/ngw-connector';
import type { Type } from '@nextgis/utils';
import type {
  GetLegendOptions,
  ImageAdapterOptions,
  MainLayerAdapter,
} from '@nextgis/webmap';
import type { LegendSymbol } from '@nextgisweb/render/type/api';
import type { CompositeRead, ResourceCls } from '@nextgisweb/resource/type/api';

import type {
  GetClassAdapterOptions,
  NgwLayerAdapterType,
  ResourceAdapter,
} from '../interfaces';

export type LegendSymbols = {
  [symbolIndex: number]: boolean | null;
};

export class Legend implements LayerLegend {
  layerId: string;
  legend: LegendSymbol[];

  onSymbolRenderChange?: (indexes: number[]) => void;

  constructor({
    layerId,
    legend,
    onSymbolRenderChange,
  }: LayerLegend & { onSymbolRenderChange?: (indexes: number[]) => void }) {
    this.layerId = layerId;
    this.legend = this.createLegend(legend);
    this.onSymbolRenderChange = onSymbolRenderChange;
  }

  createLegend(items: LegendSymbol[]): LegendSymbol[] {
    return items.map((params) => ({
      ...params,
      /** @deprecated use display_name instead */
      name: params.display_name,
      /** @deprecated use icon instead */
      symbol: params.icon,
    }));
  }

  setSymbolRender(symbolIndex: number, status: boolean): void {
    const legendItem = this.legend.find((l) => l.index === symbolIndex);
    if (legendItem) {
      const render = legendItem.render;
      if (render !== status) {
        legendItem.render = status;
        if (this.onSymbolRenderChange) {
          this.onSymbolRenderChange(
            this.legend.filter((l) => l.render).map((l) => l.index),
          );
        }
      }
    }
  }
}

export async function createRasterAdapter({
  layerOptions,
  connector,
  webMap,
  item,
}: GetClassAdapterOptions): Promise<Type<MainLayerAdapter> | undefined> {
  const resourceCls = item.resource.cls;
  const clsAdapterAlias: { [key in ResourceCls]?: NgwLayerAdapterType } = {
    wmsserver_service: 'WMS',
    tmsclient_layer: 'IMAGE',
  };
  let adapter =
    layerOptions.adapter ||
    (resourceCls && clsAdapterAlias[resourceCls]) ||
    'IMAGE';
  if (adapter !== undefined) {
    layerOptions.adapter = adapter;
  }
  if (adapter === 'IMAGE') {
    const layerAdapters = webMap.getLayerAdapters();
    const isImageAllowed = layerAdapters ? layerAdapters.IMAGE : true;
    if (!isImageAllowed) {
      adapter = 'TILE';
    }
  }

  const AdapterClass = webMap.mapAdapter.layerAdapters[
    adapter
  ] as Type<MainLayerAdapter>;
  if (AdapterClass) {
    const resourceId = await resourceIdFromLayerOptions(
      layerOptions,
      connector,
    );
    return class RasterAdapter extends AdapterClass implements ResourceAdapter {
      item?: CompositeRead = item;
      resourceId = resourceId;

      private _blocked = false;
      private _layerVisibility?: boolean;

      constructor(
        public map: any,
        _options: any,
      ) {
        super(map, _options);
        const opt = ngwApiToAdapterOptions({
          options: layerOptions,
          webMap,
          baseUrl: connector.options.baseUrl || '',
        });
        if (opt) {
          const layerAdapterOptions: ImageAdapterOptions = {
            ...opt,
            ...layerOptions.adapterOptions,
            params: { resource: resourceId },
            layers: opt.layers || String(resourceId),
            resourceId,
          };
          if (
            layerOptions.adapterOptions &&
            defined(layerOptions.adapterOptions.setViewDelay)
          ) {
            layerAdapterOptions.setViewDelay =
              layerOptions.adapterOptions.setViewDelay;
          }
          this.options = { ...this.options, ...layerAdapterOptions };
        }
      }

      addLayer(addOptions: any) {
        return super.addLayer({ ...this.options, ...addOptions });
      }

      showLayer(): void {
        this._layerVisibility = true;
        if (this.layer) {
          if (!this._blocked) {
            webMap.mapAdapter.showLayer(this.layer);
          }
        }
      }
      hideLayer(): void {
        this._layerVisibility = false;
        if (this.layer) {
          webMap.mapAdapter.hideLayer(this.layer);
        }
      }

      async getIdentificationIds(): Promise<number[]> {
        if (this.item) {
          if (adapter === 'MVT') {
            return [this.item.resource.id];
          }
          if (this.item.resource.parent) {
            const id = this.item.resource.parent.id;
            if (defined(id)) {
              return [id];
            }
          }
        }
        return [];
      }

      async getLegend(options?: GetLegendOptions): Promise<Legend[]> {
        const id = this.options.id;
        if (id !== undefined) {
          const ngwLegend = await connector
            .route('render.legend_symbols', { id: resourceId })
            .get({
              cache: true,
              ...options,
            });
          const legend = new Legend({
            layerId: id,
            legend: ngwLegend,
            onSymbolRenderChange: this._setLegendSymbol.bind(this),
          });
          return [legend];
        }
        return [];
      }

      private _hideLayer(): void {
        if (this.options.id) {
          webMap.mapAdapter.hideLayer(this.layer);
        }
      }

      private _showLayer(): void {
        if (this.options.id) {
          if (this._layerVisibility) {
            webMap.showLayer(this.options.id, { silent: true });
          }
        }
      }

      private _setLegendSymbol(renderIndexes: number[]): void {
        const intervals = this._consolidateIntervals(renderIndexes);
        if (!intervals.length) {
          this._hideLayer();
          this._blocked = true;
        } else {
          this._blocked = false;
          this._showLayer();
        }
        if (this.updateLayer) {
          this.updateLayer({
            params: {
              [`symbols[${resourceId}]`]: intervals.join(',') || undefined,
            },
          });
        }
      }

      private _consolidateIntervals(symbols: number[]): string[] {
        const sortedSymbols = symbols.slice().sort((a, b) => a - b);
        const intervals: string[] = [];
        let start = sortedSymbols[0];
        let end = start;

        for (let i = 1; i <= sortedSymbols.length; i++) {
          if (sortedSymbols[i] === end + 1) {
            end = sortedSymbols[i];
          } else {
            intervals.push(start === end ? `${start}` : `${start}-${end}`);
            start = sortedSymbols[i];
            end = start;
          }
        }

        return intervals;
      }
    };
  } else {
    throw new Error(adapter + ' not supported yet. Only TILE');
  }
}
