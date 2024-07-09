/// <reference types="geojson" />

interface OnLayerClickLayer {
  unselect: () => void;
  _onLayerClick: (
    e: maplibregl.MapEventType['click'] & maplibregl.MapMouseEvent,
  ) => any;
  _onLayerDoubleClick: (
    e: maplibregl.MapEventType['dblclick'] & maplibregl.MapMouseEvent,
  ) => any;
  options: {
    order?: number;
    unselectOnClick?: boolean;
    unselectOnSecondClick?: boolean;
  };
}

declare namespace maplibregl {
  export interface Map {
    transformRequests: ((
      url: string,
      resourceType?: ResourceTypeEnum,
    ) => RequestParameters | undefined)[];
    _onMapClickLayers: OnLayerClickLayer[];
    _addUnselectCb: (args: () => void) => void;
  }
}
