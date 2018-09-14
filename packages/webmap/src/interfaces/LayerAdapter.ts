interface AdapterOptions {
  id?: string;
  url?: string;
  transparency?: number;
  // visibility: item.layer_enabled,
  minResolution?: number;
  maxResolution?: number;

  // move out of here
  styleId?: number;
}

interface MvtOptions extends AdapterOptions {
  paint?;
  type?: 'fill' | 'line' | 'circle' | 'point';
  'source-layer'?: string;
}

export interface LayerAdapters {
  'MVT': MvtOptions;
  'IMAGE': AdapterOptions;
  'OSM': AdapterOptions;
  'TILE': AdapterOptions;
  [name: string]: AdapterOptions;
}

export interface LayerAdapter<M = any, O = any> {
  name: string;
  addLayer(map: M, name: string, options: O): string;
}
