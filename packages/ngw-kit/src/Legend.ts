import type { LayerLegend } from '@nextgis/ngw-connector';

import type { LayerAdapter, WebMap } from '@nextgis/webmap';
import type { LegendSymbol } from '@nextgisweb/render/type/api';

import { LegendSymbolsEnum } from '@nextgisweb/webmap/type/api';

export class Legend implements LayerLegend {
  layerId: string;
  legend: LegendSymbol[];
  layer: LayerAdapter;
  onSymbolRenderChange?: (indexes: number[]) => void;
  resourceId: number;
  webMap: WebMap;
  legendSymbols: LegendSymbolsEnum = 'expand';

  layerVisibility: boolean = true;
  blocked: boolean = false;

  constructor({
    legendSymbols,
    resourceId,
    layerId,
    legend,
    webMap,
    layer,
    onSymbolRenderChange,
  }: LayerLegend & {
    layer: LayerAdapter;
    resourceId: number;
    webMap: WebMap;
    legendSymbols?: LegendSymbolsEnum;
    onSymbolRenderChange?: (indexes: number[]) => void;
  }) {
    if (legendSymbols) {
      this.legendSymbols = legendSymbols;
    }
    this.layer = layer;
    this.layerId = layerId;
    this.legend = this.createLegend(legend);
    this.resourceId = resourceId;
    this.webMap = webMap;
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

  setLegendSymbol(renderIndexes: number[]): void {
    const intervals = this._consolidateIntervals(renderIndexes);
    if (!intervals.length) {
      this._hideLayer();
      this.blocked = true;
    } else {
      this.blocked = false;
      this._showLayer();
    }
    if (this.layer.updateLayer) {
      this.layer.updateLayer({
        params: {
          [`symbols[${this.resourceId}]`]: intervals.join(',') || undefined,
        },
      });
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
