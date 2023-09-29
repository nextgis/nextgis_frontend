export const tryConvert = (converter: (arg: any) => any, arg: any): any => {
  try {
    const result = converter(arg);
    if (result !== undefined) {
      return result;
    }
  } catch {
    // ignore errors
  }
  return undefined;
};
