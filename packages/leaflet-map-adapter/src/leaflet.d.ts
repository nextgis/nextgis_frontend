declare namespace L {
  export interface Map {
    _controlContainer: HTMLElement;
    _addUnselectCb: (args: () => void) => void;
  }
}
