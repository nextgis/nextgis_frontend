import { AppOptions } from './WebMapApp';

export interface Module {
  [name: string]: any;
}

export interface Router {
  module: Module;

  getModule: (options: AppOptions) => Promise<Module>;
}
