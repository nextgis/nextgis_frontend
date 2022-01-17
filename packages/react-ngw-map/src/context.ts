import { createContext, useContext } from 'react';
import type { NgwMap } from '@nextgis/ngw-map';
import type { LayerAdapter } from '@nextgis/ngw-map';

export const CONTEXT_VERSION = 1;

export interface ControlledLayer {
  addLayer(layer: LayerAdapter): void;
  removeLayer(layer: LayerAdapter): void;
}

export interface NgwMapContextInterface {
  __version: number;
  ngwMap: NgwMap;
  layerContainer?: ControlledLayer;
  overlayContainer?: LayerAdapter;
  pane?: string;
}

export const NgwMapContext = createContext<NgwMapContextInterface | null>(null);

export const NgwMapProvider = NgwMapContext.Provider;

export function useNgwMapContext(): NgwMapContextInterface {
  const context = useContext(NgwMapContext);
  if (context === null) {
    throw new Error(
      'No context provided: useNgwMapContext() can only be used in a descendant of <MapContainer>',
    );
  }
  return context;
}
