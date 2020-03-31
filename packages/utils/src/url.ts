export function fixUrlStr(url: string): string {
  // remove double slash
  return url.replace(/([^:]\/)\/+/g, '$1');
}
