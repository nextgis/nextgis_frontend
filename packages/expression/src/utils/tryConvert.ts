export const tryConvert = (
  converter: (arg: any, data: any) => any,
  arg: any,
  data: any,
): any => {
  try {
    const result = converter(arg, data);
    if (result !== undefined) {
      return result;
    }
  } catch {
    // ignore errors
  }
  return undefined;
};
