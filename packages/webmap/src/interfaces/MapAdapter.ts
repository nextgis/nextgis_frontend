export interface MapOptions {
  target: string | HTMLElement;
  logo?: string;
  controls?: any[];
  minZoom?: number;
}

export interface MapAdapter<M> {

  lonlatProjection: string;
  displayProjection: string;
  map: M;

  create(options?): void;

  addLayer(layerName: string, layerProvider, options: any): any;
  removeLayer(layerName: string): any;

  addBaseLayer(prooviderName, options: any): any;

  showLayer(layerName: string): void;
  hidelayer(layerName: string): void;

  setCenter(latLng: [number, number]): void;
  setZoom(zoom: number): void;
  fit(extent: [number, number, number, number]): void;
  setRotation?(angle: number): void;
}
