import WebMap, { Type, BaseLayerAdapter } from '@nextgis/webmap';
import NgwConnector, { BasemapWebmapItem } from '@nextgis/ngw-connector';
import { createAsyncAdapter } from './createAsyncAdapter';

interface CreateBasemapWebmapOptions {
  webMap: WebMap;
  connector: NgwConnector;
  item: BasemapWebmapItem;
}

export async function createBasemapWebmapItemAdapter({
  webMap,
  connector,
  item,
}: CreateBasemapWebmapOptions): Promise<Type<BaseLayerAdapter>> {
  class BasemapWebmapAdapter implements BaseLayerAdapter {
    options = {};
    _visibility = false;
    _removed = false;
    _basemap: BaseLayerAdapter[] = [];

    addLayer() {
      return this._basemap;
    }

    removeLayer() {
      this._removed = true;
      this._basemap.forEach((x) => webMap.removeLayer(x));
    }

    async showLayer() {
      this._visibility = true;
      if (this._basemap.length) {
        this._basemap.forEach((x) => {
          webMap.showLayer(x);
        });
      } else {
        const Adapter = await createAsyncAdapter(
          {
            resourceId: item.resource_id,
            adapterOptions: {
              name: item.display_name,
              opacity: item.opacity,
            },
          },
          webMap,
          connector
        );
        if (Adapter) {
          const adapter = await webMap.addLayer(Adapter, { order: 0 });
          if (this._removed) {
            webMap.removeLayer(adapter);
          }
          if (this._visibility) {
            webMap.showLayer(adapter);
          }
          this._basemap.push(adapter);
        }
      }
    }

    hideLayer() {
      if (this._basemap) {
        this._basemap.forEach((x) => webMap.hideLayer(x));
      }
    }
  }
  return BasemapWebmapAdapter;
}
