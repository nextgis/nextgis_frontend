/// <reference types="geojson" />

interface OnLayerClickLayer {
  _onLayerClick: (
    e: maplibregl.MapEventType['click'] & maplibregl.EventData,
  ) => any;
  options: { order?: number };
}

declare namespace maplibregl {
  export interface Map {
    transformRequests: ((
      url: string,
      resourceType: ResourceType,
    ) =>
      | { url: string; headers: Record<string, any> | undefined }
      | undefined)[];
    _onMapClickLayers: OnLayerClickLayer[];
  }
  export interface GeoJSONSource {
    _data: { features: GeoJSON.Feature[] };
  }
}
