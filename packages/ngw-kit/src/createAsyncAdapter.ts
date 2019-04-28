import { CancelablePromise } from '@nextgis/ngw-connector';
import { MapAdapter, LayerAdapter, Type, BaseLayerAdapter } from '@nextgis/webmap';

export function createAsyncAdapter<T extends string = string>(
  type: T, loadFunction: CancelablePromise<any>, map: MapAdapter, onLoad: (data: any) => any): Type<LayerAdapter> {

  const webMapAdapter = map.layerAdapters[type] as Type<BaseLayerAdapter>;

  return class Adapter extends webMapAdapter {
    async addLayer(options: any) {
      const data = await loadFunction;
      const opt = onLoad(data);
      return super.addLayer({ ...options, ...opt });
    }
    beforeRemove() {
      loadFunction.cancel();
    }
  };
}
