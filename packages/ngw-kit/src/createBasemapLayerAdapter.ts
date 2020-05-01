import { Type, BaseLayerAdapter } from '@nextgis/webmap';
import QmsKit from '@nextgis/qms-kit';
import { GetClassAdapterOptions } from './interfaces';

export async function createBasemapLayerAdapter({
  webMap,
  item,
}: GetClassAdapterOptions): Promise<Type<BaseLayerAdapter>> {
  const adapter = Promise.resolve(QmsKit.utils.createQmsAdapter(webMap));
  adapter.then((x) => {
    if (x && item && item.basemap_layer && item.basemap_layer.qms) {
      const qms = JSON.parse(item.basemap_layer.qms);
      x.prototype.qms = qms;
      x.prototype.baseLayer = true;
    }
  });
  return adapter;
}
