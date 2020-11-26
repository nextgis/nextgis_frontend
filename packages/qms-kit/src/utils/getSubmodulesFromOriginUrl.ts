export function getSubdomainsOriginUrl(originUrl: string): [string, string[]] {
  const submodules: string[] = [];
  originUrl = originUrl.replace(/{switch:(.*?)}/, (m, group) => {
    if (typeof group === 'string') {
      group.split(',').forEach((s) => submodules.push(s));
    }
    return '{s}';
  });
  return [originUrl, submodules];
}
