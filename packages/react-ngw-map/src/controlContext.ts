import { createContext, useContext } from 'react';

export interface MapControlContextValue {
  id?: string;
}

export const MapControlContext = createContext<MapControlContextValue | null>(
  null,
);

export function useMapControlContext(): MapControlContextValue | null {
  return useContext(MapControlContext);
}
