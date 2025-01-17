import { createLayerSymbolParam } from './utils/createLayerSymbolParam';

import type NgwConnector from '@nextgis/ngw-connector';
import type { GetRequestOptions, LayerLegend } from '@nextgis/ngw-connector';
import type { LayerAdapter, WebMap } from '@nextgis/webmap';
import type { LegendSymbol } from '@nextgisweb/render/type/api';
import type { LegendSymbolsEnum } from '@nextgisweb/webmap/type/api';

export class Legend implements LayerLegend {
  layerId: string;
  layer: LayerAdapter;
  resourceId: number;
  legendSymbols: LegendSymbolsEnum = 'expand';

  legend?: LegendSymbol[];

  // private blocked: boolean = false;
  private layerVisibility: boolean = true;
  // private symbolRenderIndexes?: number[];

  private readonly onSymbolRenderChange?: (indexes: number[]) => void;
  private readonly webMap: WebMap;
  private readonly connector?: NgwConnector;

  constructor({
    legendSymbols,
    resourceId,
    connector,
    layerId,
    legend,
    webMap,
    layer,
    onSymbolRenderChange,
  }: LayerLegend & {
    layer: LayerAdapter;
    webMap: WebMap;
    resourceId: number;
    connector?: NgwConnector;
    onSymbolRenderChange?: (indexes: number[]) => void;
  }) {
    if (legendSymbols) {
      this.legendSymbols = legendSymbols;
    }
    this.connector = connector;
    this.layer = layer;
    this.layerId = layerId;
    if (legend) {
      this.legend = this.createLegend(legend);
    }
    this.resourceId = resourceId;
    this.webMap = webMap;
    this.onSymbolRenderChange = onSymbolRenderChange;
  }

  attachLayer(layer: LayerAdapter) {
    this.layerId = String(layer.id);
    this.layer = layer;
  }

  async create(
    options: GetRequestOptions = {},
  ): Promise<LegendSymbol[] | undefined> {
    if (this.connector) {
      const ngwLegend = await this.connector
        .route('render.legend_symbols', {
          id: this.resourceId,
        })
        .get({
          ...options,
        });
      this.legend = ngwLegend;
      return this.createLegend(ngwLegend);
    }
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
    if (this.legend) {
      const legendItem = this.legend.find((l) => l.index === symbolIndex);
      if (legendItem) {
        const render = legendItem.render;
        if (render !== status) {
          legendItem.render = status;
          const newSymbols = this.legend
            .filter((l) => l.render)
            .map((l) => l.index);
          this.setLegendSymbol(newSymbols);
          if (this.onSymbolRenderChange) {
            this.onSymbolRenderChange(newSymbols);
          }
        }
      }
    }
  }

  setLegendSymbol(symbolRenderIndexes: number[]): void {
    // this.symbolRenderIndexes = symbolRenderIndexes;

    const intervals = this._consolidateIntervals(symbolRenderIndexes);

    if (!intervals.length) {
      this._hideLayer();
      // this.blocked = true;
    }
    if (this.layer.updateLayer) {
      this.layer.updateLayer({
        params: {
          ...createLayerSymbolParam(this.resourceId, intervals),
        },
      });
    }
    if (intervals.length) {
      // this.blocked = false;
      this._showLayer();
    }
  }

  private _hideLayer(): void {
    if (this.layer.options.id) {
      this.webMap.mapAdapter.hideLayer(this.layer.layer);
    }
  }

  private _showLayer(): void {
    if (this.layer.options.id) {
      if (this.layerVisibility) {
        this.webMap.showLayer(this.layer.options.id, { silent: true });
      }
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
}
