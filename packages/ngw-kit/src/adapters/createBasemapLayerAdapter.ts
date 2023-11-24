import { QmsKit } from '@nextgis/qms-kit';

import type { GetClassAdapterOptions } from '../interfaces';
import type { Type } from '@nextgis/utils';
import type { MainLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';

export async function createBasemapLayerAdapter({
  webMap,
  item,
}: GetClassAdapterOptions): Promise<Type<MainLayerAdapter> | undefined> {
  if (item.basemap_layer) {
    const qms = item.basemap_layer.qms;
    const url = item.basemap_layer.url;
    if (qms) {
      const qms_ = JSON.parse(qms);
      const adapter = Promise.resolve(
        QmsKit.utils.createQmsAdapter(webMap, undefined, {
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
          async addLayer(opt: TileAdapterOptions) {
            return super.addLayer({ ...opt, url });
          }
        }
        return BasemapTileAdapter;
      }
    }
  }
}
