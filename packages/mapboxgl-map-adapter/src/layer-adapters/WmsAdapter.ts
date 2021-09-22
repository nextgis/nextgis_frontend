import { MainLayerAdapter, WmsAdapterOptions } from '@nextgis/webmap';

import { TileAdapter } from './TileAdapter';

export class WmsAdapter
  extends TileAdapter<WmsAdapterOptions>
  implements MainLayerAdapter
{
  addLayer(options: WmsAdapterOptions): string[] | undefined {
    Object.assign(this.options, options);
    const params: Record<string, string | number> = {
      bbox: '{bbox-epsg-3857}',
      format: options.format || 'image/png',
      service: 'WMS',
      version: '1.1.1',
      request: 'GetMap',
      srs: 'EPSG:3857',
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
