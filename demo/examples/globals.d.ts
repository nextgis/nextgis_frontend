declare function videojs(element: Element | null): {
  src(options: {
    src: string;
    type: string;
    overrideNative?: boolean;
  }): void;
  play(): void | Promise<void>;
  pause(): void;
};

interface Window {
  ngwMap: unknown;
}
