export const capitalize = (str: string) => {
  str = String(str).toLowerCase();
  return str[0].toUpperCase() + str.slice(1);
};
