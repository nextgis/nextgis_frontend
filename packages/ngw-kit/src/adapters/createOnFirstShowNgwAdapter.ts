import { createAsyncAdapter } from './createAsyncAdapter';
import { createOnFirstShowAdapter } from './createOnFirstShowAdapter';

import type NgwConnector from '@nextgis/ngw-connector';
import type { Type } from '@nextgis/utils';
import type { MainLayerAdapter, WebMap } from '@nextgis/webmap';
import type { BasemapWebMapItemRead } from '@nextgisweb/basemap/type/api';

interface CreateOnFirstShowAdapterOptions {
  webMap: WebMap;
  connector: NgwConnector;
  item: BasemapWebMapItemRead;
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
