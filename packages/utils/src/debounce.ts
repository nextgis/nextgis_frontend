export function debounce<T extends Function>(cb: T, wait = 10) {
  let h = 0;
  const callable = (...args: any) => {
    clearTimeout(h);
    h = window.setTimeout(() => cb(...args), wait);
  };
  return (callable as any) as T;
}
