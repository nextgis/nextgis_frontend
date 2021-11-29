export function getUrlsWithSubdomains(
  url: string,
  subdomains?: string | string[],
): string[] {
  const urls: string[] = [];
  const subdomains_: string[] | undefined =
    typeof subdomains === 'string' ? subdomains.split('') : subdomains;
  if (subdomains_?.length) {
    subdomains_.forEach((x) => {
      urls.push(url.replace(/{s}/, x));
    });
  } else {
    urls.push(url);
  }
  return urls;
}
