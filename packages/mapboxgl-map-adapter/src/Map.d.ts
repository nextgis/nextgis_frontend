interface OnLayerClickLayer {
  _onLayerClick: (
    e: mapboxgl.MapEventType['click'] & mapboxgl.EventData
  ) => any;
  options: { order?: number };
}

declare namespace mapboxgl {
  export interface Map {
    transformRequests: ((
      url: string,
      resourceType: ResourceType
    ) =>
      | { url: string; headers: Record<string, any> | undefined }
      | undefined)[];
    _onMapClickLayers: OnLayerClickLayer[];
  }
}
