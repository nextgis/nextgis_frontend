import { TileAdapter } from './TileAdapter';

import type { MainLayerAdapter, WmsAdapterOptions } from '@nextgis/webmap';

export class WmsAdapter
  extends TileAdapter<WmsAdapterOptions>
  implements MainLayerAdapter
{
  addLayer(options: WmsAdapterOptions): string[] | undefined {
    Object.assign(this.options, options);
    const version = options.version || '1.1.1';
    const params: Record<string, string | number | boolean> = {
      ...options.params,
      bbox: '{bbox-epsg-3857}',
      format: options.format || 'image/png',
      service: 'WMS',
      version,
      request: 'GetMap',
      [parseFloat(version) >= 1.3 ? 'crs' : 'srs']: 'EPSG:3857',
      transparent: 'true',
      width: options.tileSize || '256',
      height: options.tileSize || '256',
      layers: options.layers || '',
    };
    const paramsStr = Object.keys(params)
      .map((x) => `${x}=${params[x]}`)
      .join('&');
    options.url = options.url + '?' + paramsStr;
    if (options.nativeOptions) {
      Object.assign(options, this.options.nativeOptions);
    }
    return super.addLayer(options);
  }
}
