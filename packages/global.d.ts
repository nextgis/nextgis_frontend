// Global compile-time constants
declare let __DEV__: boolean;
declare let __TEST__: boolean;
declare let __BROWSER__: boolean;
declare let __GLOBAL__: boolean;
declare let __ESM_BUNDLER__: boolean;
declare let __ESM_BROWSER__: boolean;
declare let __NODE_JS__: boolean;
declare let __COMMIT__: string;
declare let __VERSION__: string;

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const value: any;
  export default value;
}
