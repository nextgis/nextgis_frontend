/**
 * Represents an item in a legend, with additional rendering and indexing information.
 */
export interface LegendItem {
  /**
   * The index of the legend item.
   */
  index: number;

  /**
   * A flag indicating whether this legend item should be rendered.
   */
  render: boolean | null;

  /**
   * The display name of the legend item.
   */
  display_name: string;

  /**
   * The symbol associated with this legend item.
   */
  icon: LegendItemSymbol;
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

/**
 * Represents a legend for a specific layer.
 */
export interface LayerLegend {
  layerId: string;
  legend: LegendItem[];
}
