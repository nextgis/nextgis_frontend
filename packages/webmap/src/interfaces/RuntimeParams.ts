type Params = Record<string ,any>

export interface RuntimeParams<P extends Params= Params, K = keyof P> {
  params(): P;
  get(name: K): any;
  set(name: K, value: any): void;
  remove(name: K): void;
}
