import { objectDeepEqual } from '@nextgis/utils';

import type { NgwConnector } from './NgwConnector';
import type { NgwConnectorOptions } from './interfaces';

export const CONNECTORS: NgwConnector[] = [];

export function addConnector(connector: NgwConnector): void {
  CONNECTORS.push(connector);
}

export function findConnector(
  options: NgwConnectorOptions,
): NgwConnector | undefined {
  return CONNECTORS.find((x) => {
    if (x.options.baseUrl === options.baseUrl) {
      if (options.auth) {
        if (x.options.auth) {
          return objectDeepEqual(x.options.auth, options.auth);
        }
      } else {
        // if auth not in find options; use first connector with same url
        return true;
      }
    }
  });
}

export function removeConnector(connector: NgwConnector): void {
  const index = CONNECTORS.indexOf(connector);
  if (index !== -1) {
    CONNECTORS.splice(index, 1);
  }
}

export function findAndRemoveConnector(options: NgwConnectorOptions): void {
  const exist = findConnector(options);
  if (exist) {
    removeConnector(exist);
  }
}
