/**
 * Represents an item in a legend, with a name and an associated symbol.
 */
export interface LegendItem {
  /**
   * The name of the legend item.
   */
  name: string;

  /**
   * The symbol associated with this legend item.
   */
  symbol: LegendItemSymbol;
}

/**
 * Represents a symbol in a legend item.
 */
export interface LegendItemSymbol {
  /**
   * The format of the symbol, e.g., 'svg', 'png'.
   */
  format: string;

  /**
   * The actual data of the symbol in a specified format.
   * This could be a base64 encoded string, SVG path, etc.
   */
  data: string;
}

export interface LayerLegend {
  layerId: string;
  legend: LegendItem[];
}
