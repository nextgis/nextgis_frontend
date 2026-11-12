import { objectDeepEqual } from '@nextgis/utils';

import type { NgwConnectorOptions } from './interfaces';
import type { NgwConnector } from './NgwConnector';

export const CONNECTORS: NgwConnector[] = [];

export function addConnector(connector: NgwConnector): void {
  CONNECTORS.push(connector);
}

export function findConnector(
  options: NgwConnectorOptions,
): NgwConnector | undefined {
  return CONNECTORS.find((connector) => {
    const existing = connector.options;
    if (
      existing.baseUrl !== options.baseUrl ||
      existing.route !== options.route ||
      existing.cacheId !== options.cacheId ||
      connector.withCredentials !== options.withCredentials ||
      existing.requestTransform !== options.requestTransform
    ) {
      return false;
    }

    if (!existing.auth || !options.auth) {
      return !existing.auth && !options.auth;
    }
    return objectDeepEqual(existing.auth, options.auth);
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
