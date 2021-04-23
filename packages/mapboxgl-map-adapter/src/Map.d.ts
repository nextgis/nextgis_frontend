import { MapEventType, EventData, ResourceType } from 'mapbox-gl';

interface OnLayerClickLayer {
  _onLayerClick: (e: MapEventType['click'] & EventData) => any;
  options: { order?: number };
}

declare namespace mapboxgl {
  export interface Map {
    transformRequests: ((
      url: string,
      resourceType: ResourceType,
    ) =>
      | { url: string; headers: Record<string, any> | undefined }
      | undefined)[];
    _onMapClickLayers: OnLayerClickLayer[];
  }
}
