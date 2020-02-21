export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
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
) {
  properties.forEach(name => {
    const descriptor = Object.getOwnPropertyDescriptor(
      baseCtor.prototype,
      name
    );
    if (descriptor) {
      Object.defineProperty(derivedCtor.prototype, name, descriptor);
    }
  });
}
