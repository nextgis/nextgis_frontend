export interface LayerAdapter<M = any> {
  name: string;
  addLayer(map: M, name: string, options): string;
}
