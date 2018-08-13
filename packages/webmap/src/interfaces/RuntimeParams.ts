export interface RuntimeParams {
  getParams(): {[paramName: string]: any};
  getParam(name: string): any;
  setParam(name: string, value: any): void;
  removeParam(name: string): void;
}
