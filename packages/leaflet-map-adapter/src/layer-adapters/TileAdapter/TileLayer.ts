import { TileLayer as TL } from 'leaflet';

import { makeRemote } from '../../utils/makeRemoteTileLayer';

import type { LayerRequestOptions } from '@nextgis/webmap';
import type { TileLayerOptions } from 'leaflet';

export type TileLayerOptionsExtended = TileLayerOptions & {
  /** @deprecated use request.headers instead. */
  headers?: Record<string, any>;
  request?: LayerRequestOptions;
  /** @deprecated use request.credentials instead. */
  withCredentials?: boolean;
  setViewDelay?: number;
};

class TileLayerBase extends TL {
  constructor(urlTemplate: string, options?: TileLayerOptionsExtended) {
    super(urlTemplate, options);
    Object.assign(this.options, options);
  }
}

export const TileLayer = makeRemote(TileLayerBase);
