import { type ColorArray, colorToRGB, toColor } from '../../utils/color';

type LinearInterpolation = ['linear'];
type ExponentialInterpolation = [name: 'exponential', base: number];
type CubicBezierInterpolation = [
  name: 'cubic-bezier',
  x1: number,
  y1: number,
  x2: number,
  y2: number,
];
type Interpolation =
  | LinearInterpolation
  | ExponentialInterpolation
  | CubicBezierInterpolation;

type OutputType = any;

type InterpolateArgs = [
  interpolation: Interpolation,
  input: number,
  ...stops: (number | OutputType)[],
];

function linearInterpolation(
  input: number,
  input1: number,
  output1: OutputType,
  input2: number,
  output2: OutputType,
): OutputType {
  if (typeof output1 === 'number' && typeof output2 === 'number') {
    return (
      output1 + ((input - input1) / (input2 - input1)) * (output2 - output1)
    );
  }

  try {
    const outputColor1 = toColor(output1);
    const outputColor2 = toColor(output2);
    return colorToRGB(
      outputColor1.map((val, index) => {
        return Math.ceil(
          linearInterpolation(input, input1, val, input2, outputColor2[index]),
        );
      }) as ColorArray,
    );
  } catch (er) {
    console.log(er);
  }

  throw new Error('Unsupported output type for linear interpolation.');
}

export function interpolate([
  interpolation,
  input,
  ...stops
]: InterpolateArgs): OutputType {
  if (stops.length < 2) {
    throw new Error('At least two stops are required');
  }
  if (typeof input !== 'number') {
    throw new Error('Input must be a number.');
  }
  if (stops.length < 2 || stops.length % 2 !== 0) {
    throw new Error('Invalid stops provided.');
  }

  for (let i = 0; i < stops.length - 2; i += 2) {
    const stopInput1 = stops[i] as number;
    const stopOutput1 = stops[i + 1] as OutputType;
    const stopInput2 = stops[i + 2] as number;
    const stopOutput2 = stops[i + 3] as OutputType;

    if (input >= stopInput1 && input <= stopInput2) {
      if (interpolation[0] === 'linear') {
        return linearInterpolation(
          input,
          stopInput1,
          stopOutput1,
          stopInput2,
          stopOutput2,
        );
      }
      // else if (interpolation[0] === 'exponential') {
      //   const base = interpolation[1];
      //   return exponentialInterpolation(
      //     input,
      //     base,
      //     stopInput1,
      //     stopOutput1,
      //     stopInput2,
      //     stopOutput2,
      //   );
      // }
    }
  }

  throw new Error('Invalid interpolation type.');
}
