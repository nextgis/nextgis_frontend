import { Type } from '@nextgis/utils';
import { WebMap, MainLayerAdapter, AdapterOptions } from '@nextgis/webmap';
import NgwConnector, { BasemapWebmapItem } from '@nextgis/ngw-connector';
import { createAsyncAdapter } from './createAsyncAdapter';
import { createOnFirstShowAdapter } from './createOnFirstShowAdapter';

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
  idPrefix = 'first-show-adapter',
}: CreateOnFirstShowAdapterOptions): Promise<Type<MainLayerAdapter>> {
  const createAdapter = () => {
    return createAsyncAdapter(
      {
        resource: item.resource_id,
        adapterOptions: {
          name: item.display_name,
          opacity: item.opacity,
        },
      },
      webMap,
      connector,
    );
  };
  const onLayerAdded = (adapter: MainLayerAdapter) => {
    adapter.options.baselayer = false;
    adapter.id = idPrefix + '-' + item.resource_id;
  };

  const OnFirstNgwShowAdapter = createOnFirstShowAdapter({
    webMap,
    adapterOptions,
    onLayerAdded,
    createAdapter,
  });

  return OnFirstNgwShowAdapter;
}
