import type { LegendSymbol } from '@nextgisweb/render/type/api';
import type { LegendSymbolsEnum } from '@nextgisweb/webmap/type/api';

/**
 * Represents a legend for a specific layer.
 */
export interface LayerLegend {
  layerId: string;
  legend: LegendSymbol[];
  setSymbolRender?: (symbolIndex: number, status: boolean) => void;
  legendSymbols?: LegendSymbolsEnum;
}
