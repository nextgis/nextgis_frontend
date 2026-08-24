/// <reference types="geojson" />

import type {
  MapEventType,
  MapMouseEvent,
  RequestParameters,
  ResourceType,
} from 'maplibre-gl';

interface OnLayerClickLayer {
  unselect: () => void;
  _onLayerClick: (e: MapEventType['click'] & MapMouseEvent) => any;
  _onLayerDoubleClick: (e: MapEventType['dblclick'] & MapMouseEvent) => any;
  options: {
    order?: number;
    unselectOnClick?: boolean;
    unselectOnSecondClick?: boolean;
  };
}

declare module 'maplibre-gl' {
  interface Map {
    transformRequests: ((
      url: string,
      resourceType?: ResourceType,
    ) => RequestParameters | undefined)[];
    _onMapClickLayers: OnLayerClickLayer[];
    _addUnselectCb: (args: () => void) => void;
  }
}
