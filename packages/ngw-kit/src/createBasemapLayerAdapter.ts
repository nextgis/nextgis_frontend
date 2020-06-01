import { Type, BaseLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';
import QmsKit from '@nextgis/qms-kit';
import { GetClassAdapterOptions } from './interfaces';

export async function createBasemapLayerAdapter({
  webMap,
  item,
}: GetClassAdapterOptions): Promise<Type<BaseLayerAdapter> | undefined> {
  if (item.basemap_layer) {
    const qms = item.basemap_layer.qms;
    const url = item.basemap_layer.url;
    if (qms) {
      const adapter = Promise.resolve(QmsKit.utils.createQmsAdapter(webMap));
      adapter.then((x) => {
        if (x && item) {
          const qms_ = JSON.parse(qms);
          x.prototype.qms = qms_;
          x.prototype.baseLayer = true;
        }
      });
      return adapter;
    } else if (url) {
      const TileAdapter = webMap.mapAdapter.layerAdapters.TILE as Type<
        BaseLayerAdapter<any, any, TileAdapterOptions>
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
