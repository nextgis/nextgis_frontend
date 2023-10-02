import { COLORS } from '../constants/colors';

export type ColorArray = [r: number, g: number, b: number, a?: number];

export type ColorObject = {
  r: number;
  g: number;
  b: number;
  a?: number;
};
export type Color = string | ColorObject;

function isHex(hex: any): hex is string {
  return typeof hex === 'string' && /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex);
}

function isRgb(hex: any): hex is string {
  const r =
    // eslint-disable-next-line max-len
    /^rgb(a?)\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)(?:\s*,\s*([01](?:\.\d+)?))?\s*\)$/;
  return typeof hex === 'string' && r.test(hex);
}

function isColorObj(obj: any): obj is ColorObject {
  if (typeof obj === 'object' && obj !== null) {
    const hasRgb = 'r' in obj && 'g' in obj && 'b' in obj;
    const hasValidAlpha =
      !('a' in obj) || (typeof obj.a === 'number' && obj.a >= 0 && obj.a <= 1);
    return hasRgb && hasValidAlpha;
  }
  return false;
}

function isColorName(name: any): name is keyof typeof COLORS {
  if (typeof name === 'string' && name in COLORS) {
    return true;
  }
  return false;
}

export function isColor(value: any): value is Color {
  return [isColorName, isHex, isRgb, isColorObj].some((c) => c(value));
}

export function toColor(value: Color): ColorArray {
  if (isHex(value)) {
    return hexToColor(value);
  } else if (isColorName(value)) {
    return colorNameToColor(value);
  } else if (isRgb(value)) {
    return rgbToColor(value);
  } else if (isColorObj(value)) {
    return colorObjectToColor(value);
  }
  throw new Error(`The '${value}' cannot be converted to color`);
}

function colorNameToColor(name: keyof typeof COLORS) {
  return hexToColor(COLORS[name]);
}

function hexToColor(hex: string): ColorArray {
  const shortRGB = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/;
  const shortRGBA = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/;
  const longRGB = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/;
  const longRGBA =
    /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/;

  let result;

  if ((result = shortRGB.exec(hex))) {
    return [
      parseInt(result[1] + result[1], 16),
      parseInt(result[2] + result[2], 16),
      parseInt(result[3] + result[3], 16),
    ];
  } else if ((result = shortRGBA.exec(hex))) {
    return [
      parseInt(result[1] + result[1], 16),
      parseInt(result[2] + result[2], 16),
      parseInt(result[3] + result[3], 16),
      parseInt(result[4] + result[4], 16) / 255,
    ];
  } else if ((result = longRGB.exec(hex))) {
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ];
  } else if ((result = longRGBA.exec(hex))) {
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
      parseInt(result[4], 16) / 255,
    ];
  }
  throw new Error(`The '${hex}' Is not valid hex`);
}

function rgbToColor(rgb: string): ColorArray {
  const rgbPattern = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
  const rgbaPattern = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/;

  let matches;

  if ((matches = rgb.match(rgbPattern))) {
    return [
      parseInt(matches[1], 10),
      parseInt(matches[2], 10),
      parseInt(matches[3], 10),
    ];
  } else if ((matches = rgb.match(rgbaPattern))) {
    return [
      parseInt(matches[1], 10),
      parseInt(matches[2], 10),
      parseInt(matches[3], 10),
      parseFloat(matches[4]),
    ];
  }

  throw new Error(`The '${rgb}' Is not valid rgb`);
}

export function colorObjectToColor({ r, g, b, a }: ColorObject): ColorArray {
  return [r, g, b, ...(a !== undefined ? [a] : [])] as ColorArray;
}

export function colorToRGB(array: ColorArray): string {
  return `rgb(${array.join(',')})`;
}
