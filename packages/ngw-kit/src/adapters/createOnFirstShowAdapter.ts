import type { Type } from '@nextgis/utils';
import type { AdapterOptions, MainLayerAdapter, WebMap } from '@nextgis/webmap';

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
      for (const l of this.layer) {
        webMap.removeLayer(l);
      }
    }

    destroyed() {
      return this._removed;
    }

    async showLayer() {
      this.options.visibility = true;
      if (this.layer.length) {
        for (const x of this.layer) {
          await webMap.showLayer(x);
        }
      } else {
        await this.loadLayer();
      }
    }

    async hideLayer() {
      this.options.visibility = false;
      if (this.layer) {
        for (const x of this.layer) {
          await webMap.hideLayer(x);
        }
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
          this.layer.push(adapter);
          if (this.options.visibility) {
            await webMap.showLayer(adapter);
          }
          this._creatingInProgress = false;
        }
      }
      return this.layer;
    }
  }
  return OnFirstShowAdapter;
}
