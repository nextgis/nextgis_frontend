import type { LngLatArray } from '@nextgis/utils';
import type { MapClickEvent } from '@nextgis/webmap';
import type { Cartesian2, Cartesian3 } from 'cesium';

export interface CesiumMapClickEvent {
  position: Cartesian2;
}

export interface CesiumAdapterMapClickEvent extends MapClickEvent {
  source: CesiumMapClickEvent & {
    pickedPosition?: Cartesian3;
    pickedPositionLngLat?: LngLatArray;
  };
}
