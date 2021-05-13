import {
  WebMap,
  Type,
  MainLayerAdapter,
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

export async function createOnFirstShowNgwAdapter({
  webMap,
  connector,
  item,
  adapterOptions = {},
  idPrefix = 'basemapwebmap',
}: CreateOnFirstShowAdapterOptions): Promise<Type<MainLayerAdapter>> {
  class OnFirstShowAdapter implements MainLayerAdapter {
    options: AdapterOptions = {};
    layer: MainLayerAdapter[] = [];
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
            resource: item.resource_id,
            adapterOptions: {
              name: item.display_name,
              opacity: item.opacity,
            },
          },
          webMap,
          connector,
        ).then((Adapter) => {
          if (Adapter) {
            const adapter = new Adapter(webMap.mapAdapter.map, {
              ...adapterOptions,
              baselayer: false,
            });
            adapter.addLayer({}).then((baselayer: MainLayerAdapter) => {
              adapter.options.baselayer = false;
              Object.assign(adapter.options, adapterOptions);
              adapter.id = idPrefix + '-' + item.resource_id;
              adapter.layer = baselayer;
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
