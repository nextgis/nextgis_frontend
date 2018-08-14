import { WebMap } from './src/entities/WebMap';
import { AppOptions } from './src/Interfaces/WebMapApp';

export {WebMap, AppOptions};

// Composition root
export async function buildWebMap(opt: AppOptions): Promise<WebMap> {
  const webMap = new WebMap(opt);
  await webMap.create();
  return webMap;
}

declare global {
  interface Window {
    WebMap: WebMap;
    buildWebMap: (config) => Promise<WebMap>;
  }
}

window.buildWebMap = buildWebMap;
