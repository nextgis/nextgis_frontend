
export interface RuntimeParams {
  params(): { [paramName: string]: any };
  get(name: string): any;
  set(name: string, value: any): void;
  remove(name: string): void;
}
