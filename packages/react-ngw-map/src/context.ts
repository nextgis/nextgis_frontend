import { createContext, useContext } from 'react';

import type { NgwMapContextInterface } from './interfaces';

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
