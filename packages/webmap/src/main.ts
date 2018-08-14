import { container } from './Config/ioc_config';
import { SERVICES } from './Constrants/identifiers';
import { WebMapApp, AppOptions } from './Interfaces/WebMapApp';

export let webMapApp = container.get<WebMapApp>(SERVICES.App);

// Composition root
export async function buildWebMapApp(opt: AppOptions) {
  webMapApp.create(opt);
  return webMapApp;
}

declare global {
  interface Window {
    webMapApp: WebMapApp;
    buildWebMapApp: (config) => Promise<WebMapApp>;
  }
}

window.buildWebMapApp = buildWebMapApp;
window.webMapApp = webMapApp;
