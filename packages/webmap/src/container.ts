import type { WebMap } from './WebMap';

const WEB_MAP_CONTAINER: Record<number, any> = {};

export function getWebMap<T extends WebMap = WebMap>(id: number): T {
  return WEB_MAP_CONTAINER[id];
}

export function setWebMap(id: number, webMap: WebMap) {
  WEB_MAP_CONTAINER[id] = webMap;
}
