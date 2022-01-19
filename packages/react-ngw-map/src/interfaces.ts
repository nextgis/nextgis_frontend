import type { CSSProperties, ReactNode } from 'react';
import type { NgwMap, NgwMapOptions, LayerAdapter } from '@nextgis/ngw-map';

export interface ControlledLayer {
  addLayer(layer: LayerAdapter): void;
  removeLayer(layer: LayerAdapter): void;
}

export interface NgwMapContextInterface {
  ngwMap: NgwMap;
  layerContainer?: ControlledLayer;
  overlayContainer?: LayerAdapter;
  pane?: string;
}

export type ReactNgwMapProps = MapContainerProps &
  Required<Pick<MapContainerProps, 'mapAdapter'>>;

export interface MapContainerProps<
  M = any,
  L = any,
  C = any,
  O extends NgwMapOptions<C> = NgwMapOptions<C>,
> extends NgwMapOptions {
  children?: ReactNode;
  className?: string;
  id?: string;
  placeholder?: ReactNode;
  style?: CSSProperties;
  whenCreated?: (map: NgwMap<M, L, C, O>) => void;
}
