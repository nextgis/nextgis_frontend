import type {
  ControlOptions,
  LayerAdapter,
  NgwIdentifyEvent,
  NgwMap,
  NgwMapOptions,
} from '@nextgis/ngw-map';
import type { MutableRefObject, ReactNode } from 'react';

export interface ControlledLayer {
  addLayer(layer: LayerAdapter): void;
  removeLayer(layer: LayerAdapter): void;
}

export interface MapControlProps extends ControlOptions {
  children?: ReactNode;
  context: NgwMapContextInterface;
  createControl: (portal: MutableRefObject<HTMLDivElement>) => Promise<unknown>;
}

export interface NgwMapContextInterface<M = unknown> {
  ngwMap: NgwMap<M>;
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

export interface IdentifyHandlers {
  /** Receives identified features. An empty click returns an empty array. */
  onIdentify?: (
    items: ReturnType<NgwIdentifyEvent['getIdentifyItems']>,
    event: NgwIdentifyEvent | null,
  ) => void;
  /** Called before an identification request starts. */
  onIdentifyStart?: () => void;
  /** Called when the current identification request fails. */
  onIdentifyError?: (error: unknown) => void;
}

export interface MapContainerProps<
  M = any,
  L = any,
  C extends object = any,
  O extends NgwMapOptions<M, C> = NgwMapOptions<M, C>,
>
  extends ReactElementAttributes, NgwMapOptions, IdentifyHandlers {
  whenCreated?: (map: NgwMap<M, L, C, O>) => void;
}
