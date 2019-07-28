/**
 * @module url-runtime-params
 */

export interface StateData {
  state: { url: string; type?: 'remove'; params?: { [name: string]: string } };
  url: string;
}

export interface Params {
  [paramName: string]: any;
}
