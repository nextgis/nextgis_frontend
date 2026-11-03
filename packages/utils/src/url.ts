export function fixUrlStr(url: string): string {
  // remove double slash
  return url.replace(/([^:]\/)\/+/g, '$1');
}

export function updateUrlParams(
  urlStr: string,
  params: Record<string, string | undefined>,
) {
  const hashIndex = urlStr.indexOf('#');
  const hash = hashIndex === -1 ? '' : urlStr.slice(hashIndex);
  const url = hashIndex === -1 ? urlStr : urlStr.slice(0, hashIndex);
  const queryIndex = url.indexOf('?');
  const baseUrl = queryIndex === -1 ? url : url.slice(0, queryIndex);
  const searchParams = new URLSearchParams(
    queryIndex === -1 ? '' : url.slice(queryIndex + 1),
  );

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

  return `${baseUrl}?${newSearch}${hash}`;
}
