/// <reference types="geojson" />

interface OnLayerClickLayer {
  unselect: () => void;
  _onLayerClick: (
    e: maplibregl.MapEventType['click'] & maplibregl.EventData,
  ) => any;
  options: { order?: number; unselectOnClick?: boolean };
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
    _addUnselectCb: (args: () => void) => void;
  }
  export interface GeoJSONSource {
    _data: { features: GeoJSON.Feature[] };
  }
}
