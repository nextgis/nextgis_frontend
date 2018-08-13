import { WebMap } from './src/entities/WebMap';
import { AppOptions } from './src/Interfaces/WebMapApp';


// Composition root
export async function buildWebMap(opt: AppOptions): Promise<WebMap> {
  const webMap = new WebMap();
  await webMap.create(opt);
  return webMap;
}

declare global {
  interface Window {
    WebMap: WebMap;
    buildWebMap: (config) => Promise<WebMap>;
  }
}

window.buildWebMap = buildWebMap;
