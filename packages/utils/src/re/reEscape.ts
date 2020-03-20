export function reEscape(s: string) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
