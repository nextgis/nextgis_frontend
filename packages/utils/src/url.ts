export function fixUrlStr(url: string): string {
  // remove double slash
  return url.replace(/([^:]\/)\/+/g, '$1');
}

export function updateUrlParams(
  urlStr: string,
  params: Record<string, string | undefined>,
) {
  const url = new URL(urlStr);
  const searchParams = new URLSearchParams(url.search);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
  });

  searchParams.set('timestamp', String(new Date().getTime()));

  const newSearch = [...searchParams.entries()]
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return `${url.origin}${url.pathname}?${newSearch}`;
}
