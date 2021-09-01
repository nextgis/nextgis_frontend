import type { WebMap, MainLayerAdapter, AdapterOptions } from '@nextgis/webmap';
import type { Type } from '@nextgis/utils';

interface CreateOnFirstShowAdapterOptions {
  webMap: WebMap;
  adapterOptions?: Record<string, any>;
  onLayerAdded?: <L extends MainLayerAdapter = MainLayerAdapter>(
    layer: L,
  ) => void;
  createAdapter: (
    firstShowAdapter: FirstShowAdapter,
  ) => Promise<Type<MainLayerAdapter> | undefined>;
}

interface FirstShowAdapter extends MainLayerAdapter {
  loadLayer: () => Promise<MainLayerAdapter[]>;
  destroyed: () => boolean;
}

export async function createOnFirstShowAdapter({
  webMap,
  adapterOptions = {},
  onLayerAdded,
  createAdapter,
}: CreateOnFirstShowAdapterOptions): Promise<Type<FirstShowAdapter>> {
  class OnFirstShowAdapter implements MainLayerAdapter {
    options: AdapterOptions = {};
    layer: MainLayerAdapter[] = [];
    _removed = false;
    _creatingInProgress = false;

    addLayer() {
      return this.layer;
    }

    removeLayer() {
      this._removed = true;
      this.layer.forEach((x) => webMap.removeLayer(x));
    }

    destroyed() {
      return this._removed;
    }

    showLayer() {
      this.options.visibility = true;
      if (this.layer.length) {
        this.layer.forEach((x) => {
          webMap.showLayer(x);
        });
      } else {
        this.loadLayer();
      }
    }

    async loadLayer() {
      if (!this.layer.length && !this._creatingInProgress) {
        this._creatingInProgress = true;
        const Adapter = await createAdapter(this);
        if (Adapter) {
          const adapter = new Adapter(webMap.mapAdapter.map, {
            ...adapterOptions,
          });
          const realLayer: MainLayerAdapter = await adapter.addLayer({
            order: this.options.order,
            headers: this.options.headers,
            baselayer: this.options.baselayer,
          });
          if (onLayerAdded) {
            onLayerAdded(adapter);
          }
          Object.assign(adapter.options, adapterOptions);
          adapter.layer = realLayer;
          if (this._removed) {
            webMap.removeLayer(adapter);
          }
          if (this.options.visibility) {
            await webMap.showLayer(adapter);
          }
          this.layer.push(adapter);
          this._creatingInProgress = false;
        }
      }
      return this.layer;
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
