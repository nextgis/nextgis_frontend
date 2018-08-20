interface AdapterOptions {
  id: string;
}

interface MvtOptions extends AdapterOptions {
  id: string;
  url: string;
  paint?;
}

export interface LayerAdapters {
  'MVT': MvtOptions;
  'IMAGE': AdapterOptions;
  'OSM': AdapterOptions;
  'TILE': AdapterOptions;
}

export interface LayerAdapter<M = any, O = any> {
  name: string;
  addLayer(map: M, name: string, options: O): string;
}
