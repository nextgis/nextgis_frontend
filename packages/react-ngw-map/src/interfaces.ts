import type { MutableRefObject, ReactNode } from 'react';
import type {
  NgwMap,
  LayerAdapter,
  NgwMapOptions,
  ControlOptions,
} from '@nextgis/ngw-map';

export interface ControlledLayer {
  addLayer(layer: LayerAdapter): void;
  removeLayer(layer: LayerAdapter): void;
}

export interface MapControlProps extends ControlOptions {
  children?: ReactNode;
  context: NgwMapContextInterface;
  createControl: (portal: MutableRefObject<HTMLDivElement>) => Promise<unknown>;
}

export interface NgwMapContextInterface {
  ngwMap: NgwMap;
  layerContainer?: ControlledLayer;
  overlayContainer?: LayerAdapter;
  pane?: string;
}

export type ReactNgwMapProps = MapContainerProps &
  Required<Pick<MapContainerProps, 'mapAdapter'>>;

export interface ReactElementAttributes {
  children?: ReactNode;
  className?: string;
  id?: string;
  placeholder?: ReactNode;
  style?: Partial<CSSStyleDeclaration>;
}

export interface MapContainerProps<
  M = any,
  L = any,
  C extends object = any,
  O extends NgwMapOptions<M, C> = NgwMapOptions<M, C>,
> extends ReactElementAttributes,
    NgwMapOptions {
  whenCreated?: (map: NgwMap<M, L, C, O>) => void;
}
