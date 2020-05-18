import { deepmerge } from '@nextgis/utils';
import { MapAdapter, StarterKit } from '@nextgis/webmap';
import NgwConnector from '@nextgis/ngw-connector';
import QmsKit from '@nextgis/qms-kit';
import NgwKit from '@nextgis/ngw-kit';

import { NgwMapOptions } from '../interfaces';

export const OPTIONS: NgwMapOptions = {
  target: 'map',
  baseUrl: '',
  whitlabel: false,
  controls: ['ZOOM', 'ATTRIBUTION'],
  controlsOptions: {
    ZOOM: { position: 'top-left' },
    ATTRIBUTION: {
      position: 'bottom-right',
      customAttribution: [
        '<a href="http://nextgis.ru" target="_blank">©NextGIS</a>',
      ],
    },
  },
  pixelRadius: 10,
};

export function prepareWebMapOptions(
  mapAdapter: MapAdapter,
  options: NgwMapOptions
) {
  const kits: StarterKit[] = [new QmsKit()];

  if (!options.connector) {
    options.connector = new NgwConnector({
      baseUrl: options.baseUrl || '',
      auth: options.auth,
    });
  } else if (options.connector) {
    options.baseUrl = options.connector.options.baseUrl;
  }
  const opt: NgwMapOptions = deepmerge(OPTIONS, options);
  if (opt.connector) {
    kits.push(
      new NgwKit({
        connector: opt.connector,
        auth: opt.auth,
        identification: opt.identification,
      })
    );
  }
  return {
    mapAdapter,
    starterKits: kits,
    runtimeParams: options.runtimeParams,
  };
}
