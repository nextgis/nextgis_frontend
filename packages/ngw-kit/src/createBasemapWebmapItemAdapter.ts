import WebMap, {
  Type,
  BaseLayerAdapter,
  AdapterOptions,
} from '@nextgis/webmap';
import NgwConnector, { BasemapWebmapItem } from '@nextgis/ngw-connector';
import { createAsyncAdapter } from './createAsyncAdapter';

interface CreateOnFirstShowAdapterOptions {
  webMap: WebMap;
  connector: NgwConnector;
  item: BasemapWebmapItem;
  adapterOptions?: Record<string, any>;
  idPrefix?: string;
}

export async function createOnFirstShowAdapter({
  webMap,
  connector,
  item,
  adapterOptions = {},
  idPrefix = 'basemapwebmap',
}: CreateOnFirstShowAdapterOptions): Promise<Type<BaseLayerAdapter>> {
  class OnFirstShowAdapter implements BaseLayerAdapter {
    options: AdapterOptions = {};
    layer: BaseLayerAdapter[] = [];
    _removed = false;

    addLayer() {
      return this.layer;
    }

    removeLayer() {
      this._removed = true;
      this.layer.forEach((x) => webMap.removeLayer(x));
    }

    showLayer() {
      this.options.visibility = true;
      if (this.layer.length) {
        this.layer.forEach((x) => {
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
            const adapter = new Adapter(webMap.mapAdapter.map, {
              ...adapterOptions,
              baseLayer: false,
            });
            adapter.addLayer({}).then((baseLayer: BaseLayerAdapter) => {
              adapter.options.baseLayer = false;
              Object.assign(adapter.options, adapterOptions);
              adapter.id = idPrefix + '-' + item.resource_id;
              adapter.layer = baseLayer;
              if (this._removed) {
                webMap.removeLayer(adapter);
              }
              if (this.options.visibility) {
                webMap.showLayer(adapter);
              }
              this.layer.push(adapter);
            });
          }
        });
      }
    }

    hideLayer() {
      this.options.visibility = false;
      if (this.layer) {
        this.layer.forEach((x) => webMap.hideLayer(x));
      }
    }
  }
  return OnFirstShowAdapter;
}
