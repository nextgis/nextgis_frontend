/**
 * @module utils
 */
export function applyMixins(derivedCtor: any, baseCtors: any[]): void {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      const descriptor = Object.getOwnPropertyDescriptor(
        baseCtor.prototype,
        name
      );
      if (descriptor) {
        Object.defineProperty(derivedCtor.prototype, name, descriptor);
      }
    });
  });
}

export function mixinProperties(
  derivedCtor: any,
  baseCtor: any,
  properties: string[]
): void {
  properties.forEach((name) => {
    const descriptor = Object.getOwnPropertyDescriptor(
      baseCtor.prototype,
      name
    );
    if (descriptor) {
      Object.defineProperty(derivedCtor.prototype, name, descriptor);
    }
  });
}
