export interface StateData<P extends Params = Params> {
  state: {
    url: string;
    type?: 'remove';
    params?: { [name in keyof P]: string };
  };
  url: string;
}

export type Params = Record<string, any>;
