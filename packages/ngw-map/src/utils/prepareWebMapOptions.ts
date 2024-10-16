import NgwConnector from '@nextgis/ngw-connector';
import { NgwKit } from '@nextgis/ngw-kit';
import { QmsKit } from '@nextgis/qms-kit';
import { deepmerge } from '@nextgis/utils';
import { getDefaultControls } from '@nextgis/webmap';

import type { MapOptions, StarterKit } from '@nextgis/webmap';

import type { NgwMapOptions } from '../interfaces';

export const OPTIONS: NgwMapOptions = {
  target: 'map',
  baseUrl: '',
  whitlabel: false,
  controls: getDefaultControls(),
  controlsOptions: {
    ZOOM: { position: 'top-left' },
    ATTRIBUTION: {
      position: 'bottom-right',
      customAttribution: [
        '<a href="https://nextgis.com" target="_blank">©NextGIS</a>',
      ],
    },
  },
  pixelRadius: 10,
};

export function prepareWebMapOptions(options: NgwMapOptions): MapOptions {
  const kits: StarterKit[] = [new QmsKit()];
  if (options.starterKits) {
    options.starterKits.forEach((x) => {
      kits.push(x);
    });
  }

  if (!options.connector) {
    options.connector = new NgwConnector({
      baseUrl: options.baseUrl || '',
      auth: options.auth,
      withCredentials: options.withCredentials,
    });
  } else if (options.connector) {
    options.baseUrl = options.connector.options.baseUrl;
  }
  options = deepmerge(OPTIONS, options);

  if (!options.center && !options.bounds) {
    options.bounds = [-179, -90, 180, 90];
    // options.maxBounds = options.bounds;
  }

  if (options.connector) {
    kits.push(
      new NgwKit({
        connector: options.connector,
        auth: options.auth,
      }),
    );
  }
  options = {
    ...options,
    starterKits: kits,
    create: false,
  };
  return options;
}
