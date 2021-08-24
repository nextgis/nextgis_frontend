import { LngLatArray } from '@nextgis/utils';
import { MapClickEvent } from '@nextgis/webmap';
import { Cartesian2, Cartesian3 } from 'cesium';

export interface CesiumMapClickEvent {
  position: Cartesian2;
}

export interface CesiumAdapterMapClickEvent extends MapClickEvent {
  source: CesiumMapClickEvent & {
    pickedPosition?: Cartesian3;
    pickedPositionLngLat?: LngLatArray;
  };
}
