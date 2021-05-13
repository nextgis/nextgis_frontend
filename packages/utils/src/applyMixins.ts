export interface ApplyMixinOptions {
  replace?: boolean;
}

type Ctor = any;

export function applyMixins(
  derivedCtor: Ctor,
  baseCtors: Ctor[],
  opt: ApplyMixinOptions = {},
): void {
  const derivedProperties = allProperties(derivedCtor.prototype);
  const replace = opt.replace !== undefined ? opt.replace : true;
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      const isSomeProp = derivedProperties.indexOf(name) !== -1;
      if ((!replace && !isSomeProp) || replace) {
        const descriptor = Object.getOwnPropertyDescriptor(
          baseCtor.prototype,
          name,
        );
        if (descriptor) {
          Object.defineProperty(derivedCtor.prototype, name, descriptor);
        }
      }
    });
  });
}

export function allProperties(obj: Record<string, unknown>): string[] {
  return _allProperties(obj);
}

export function _allProperties(
  obj: Record<string, unknown>,
  _props: string[] = [],
): string[] {
  for (; obj !== null; obj = Object.getPrototypeOf(obj)) {
    const op = Object.getOwnPropertyNames(obj);
    for (let i = 0; i < op.length; i++) {
      if (_props.indexOf(op[i]) == -1) {
        _props.push(op[i]);
      }
    }
  }
  return _props;
}

export function mixinProperties(
  derivedCtor: Ctor,
  baseCtor: Ctor,
  properties: string[],
): void {
  properties.forEach((name) => {
    const descriptor = Object.getOwnPropertyDescriptor(
      baseCtor.prototype,
      name,
    );
    if (descriptor) {
      Object.defineProperty(derivedCtor.prototype, name, descriptor);
    }
  });
}
