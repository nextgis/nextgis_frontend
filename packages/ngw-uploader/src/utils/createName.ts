import type { FileMeta } from '@nextgis/ngw-connector';
import type { ResourceCreateOptions } from '../interfaces';

export function nameFromOpt(
  opt: ResourceCreateOptions,
): string | number | undefined {
  return opt.displayName || opt.display_name || opt.name || opt.id;
}

export function createResourceName(
  opt: ResourceCreateOptions & { source?: FileMeta },
): string {
  let optName = nameFromOpt(opt);
  if (optName === undefined) {
    const source = opt.source;
    if (source) {
      optName = source.name;
    }
    if (optName === undefined) {
      throw new Error('The options `displayName` is not set');
    }
  }
  let name = String(optName);
  if (opt.createName) {
    name = opt.createName(name);
  } else if (opt.addTimestampToName) {
    name += '_' + new Date().toISOString();
  }
  return name;
}

export function createStyleName(
  parentOpt: ResourceCreateOptions & { source?: FileMeta },
  styleOpt?: ResourceCreateOptions,
): string {
  if (styleOpt) {
    try {
      return createResourceName(styleOpt);
    } catch {
      // ignore
    }
  }
  // if style name is not specified add `style` ending to parent resource name
  return createResourceName(parentOpt) + '_style';
}
