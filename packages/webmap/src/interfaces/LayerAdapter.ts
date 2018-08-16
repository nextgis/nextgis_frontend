
export interface MvtOptions extends mapboxgl.Layer {
  url: string;
}

export interface LayerAdapters {
  'MVT': MvtOptions;
  'IMAGE': any;
  'OSM': any;
}

export interface LayerAdapter<M = any, O = any> {
  name: string;
  addLayer(map: M, name: string, options: O): string;
}
