import { TileLayer } from 'leaflet';

import { makeRemote } from '../../utils/makeRemoteTileLayer';

import type { LayerRequestOptions } from '@nextgis/webmap';
import type { WMSOptions } from 'leaflet';

type LayerOptions = WMSOptions & {
  /** @deprecated use request.headers instead. */
  headers?: any;
  request?: LayerRequestOptions;
  /** @deprecated use request.credentials instead. */
  withCredentials?: boolean;
};

class WmsLayerBase extends TileLayer.WMS {
  constructor(urlTemplate: string, options: LayerOptions) {
    super(urlTemplate, options);
  }
}

export const WmsLayer = makeRemote(WmsLayerBase);
