import { createQmsAdapter } from '@nextgis/qms-kit';

import type { Type } from '@nextgis/utils';
import type { MainLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';

import type { GetClassAdapterOptions } from '../interfaces';

export async function createBasemapLayerAdapter({
  webMap,
  item,
}: GetClassAdapterOptions): Promise<Type<MainLayerAdapter> | undefined> {
  if (item.basemap_layer) {
    const basemap = item.basemap_layer;
    const { qms, url } = basemap;
    if (qms && typeof qms === 'string') {
      const qms_ = JSON.parse(qms);
      const adapter = Promise.resolve(
        createQmsAdapter(webMap, {
          qms: qms_,
          baselayer: true,
        }),
      );
      return adapter;
    } else if (url) {
      const TileAdapter = webMap.mapAdapter.layerAdapters.TILE as Type<
        MainLayerAdapter<any, any, TileAdapterOptions>
      >;
      if (TileAdapter) {
        class BasemapTileAdapter extends TileAdapter {
          constructor(map: any, options: TileAdapterOptions) {
            super(map, { ...options, baselayer: true, order: 0 });
          }

          async addLayer(opt: TileAdapterOptions) {
            if (url) {
              return super.addLayer({
                ...opt,
                url,
                minZoom: basemap.z_min ?? opt.minZoom,
                maxZoom: basemap.z_max ?? opt.maxZoom,
                attribution: basemap.copyright_text ?? opt.attribution,
              });
            }
          }
        }
        return BasemapTileAdapter;
      }
    }
  }
}
