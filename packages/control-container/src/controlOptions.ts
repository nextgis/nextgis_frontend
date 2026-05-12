import type { CreateControlOptions } from './interfaces';

const controlOptions = new WeakMap<object, CreateControlOptions>();

export function resolveControlOptions(
  options: CreateControlOptions = {},
): CreateControlOptions {
  return {
    ...options,
    margin: options.margin ?? options.bar,
  };
}

export function setControlOptions(
  control: object,
  options: CreateControlOptions = {},
): void {
  controlOptions.set(control, resolveControlOptions(options));
}

export function getControlOptions(
  control?: object,
): CreateControlOptions | undefined {
  return control ? controlOptions.get(control) : undefined;
}
