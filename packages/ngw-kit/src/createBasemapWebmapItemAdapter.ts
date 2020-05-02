import WebMap, {
  Type,
  BaseLayerAdapter,
  AdapterOptions,
} from '@nextgis/webmap';
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
    options: AdapterOptions = {};
    _removed = false;
    _basemap: BaseLayerAdapter[] = [];

    addLayer() {
      return this._basemap;
    }

    removeLayer() {
      this._removed = true;
      this._basemap.forEach((x) => webMap.removeLayer(x));
    }

    showLayer() {
      this.options.visibility = true;
      if (this._basemap.length) {
        this._basemap.forEach((x) => {
          webMap.showLayer(x);
        });
      } else {
        createAsyncAdapter(
          {
            resourceId: item.resource_id,
            adapterOptions: {
              name: item.display_name,
              opacity: item.opacity,
            },
          },
          webMap,
          connector
        ).then((Adapter) => {
          if (Adapter) {
            const adapter = new Adapter(webMap.mapAdapter.map, {});
            adapter.addLayer({}).then((baseLayer: BaseLayerAdapter) => {
              adapter.options.baseLayer = false;
              adapter.id = 'basemapwebmap-' + item.resource_id;
              adapter.layer = baseLayer;
              if (this._removed) {
                webMap.removeLayer(adapter);
              }
              if (this.options.visibility) {
                webMap.showLayer(adapter);
              }
              this._basemap.push(adapter);
            });
          }
        });
      }
    }

    hideLayer() {
      this.options.visibility = false;
      if (this._basemap) {
        this._basemap.forEach((x) => webMap.hideLayer(x));
      }
    }
  }
  return BasemapWebmapAdapter;
}
