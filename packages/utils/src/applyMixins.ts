/**
 * @module utils
 */
type Ctor = any;

export function applyMixins(derivedCtor: Ctor, baseCtors: Ctor[]): void {
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
  derivedCtor: Ctor,
  baseCtor: Ctor,
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
