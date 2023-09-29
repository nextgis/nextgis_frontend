import type {
  ExpressionFunc,
  InterpolationExpressionName,
} from '../interfaces';

type OutputType = number | string | boolean | null;

function step(args: (number | OutputType)[]): OutputType {
  const [input, defaultValue, ...stops] = args;

  if (typeof input !== 'number') {
    return defaultValue as OutputType;
  }

  for (let i = 0; i < stops.length - 2; i += 2) {
    const stopInput = stops[i] as number;
    const stopOutput = stops[i + 1] as OutputType;
    const nextStopInput = stops[i + 2] as number;

    if (input >= stopInput && input < nextStopInput) {
      return stopOutput;
    }
  }

  if (input >= (stops[stops.length - 2] as number)) {
    return stops[stops.length - 1];
  }

  return defaultValue;
}

export const interpolationExpressions: Record<
  InterpolationExpressionName,
  ExpressionFunc
> = {
  step,
};
