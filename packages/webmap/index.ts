import { WebMap } from './src/entities/WebMap';
import { AppOptions } from './src/Interfaces/WebMapApp';

export {WebMap, AppOptions};

// Composition root
export async function buildWebMap(opt: AppOptions, config): Promise<WebMap> {
  const webMap = new WebMap(config);
  await webMap.create(opt);
  return webMap;
}

declare global {
  interface Window {
    WebMap: WebMap;
    buildWebMap: (options, config) => Promise<WebMap>;
  }
}

window.buildWebMap = buildWebMap;
