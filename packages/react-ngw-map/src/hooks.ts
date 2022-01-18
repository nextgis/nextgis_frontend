import { useNgwMapContext } from './context';

import type { NgwMap } from '@nextgis/ngw-map';

export function useNgwMap(): NgwMap {
  return useNgwMapContext().ngwMap;
}
