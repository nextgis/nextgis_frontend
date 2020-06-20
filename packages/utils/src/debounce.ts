export function debounce<T extends (...args: any[]) => void>(
  cb: T,
  wait = 10
): T {
  let h = 0;
  const callable = (...args: any) => {
    clearTimeout(h);
    h = window.setTimeout(() => cb(...args), wait);
  };
  return (callable as any) as T;
}
