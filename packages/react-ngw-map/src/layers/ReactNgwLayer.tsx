import { useEffect, useMemo, useRef } from 'react';

import { useNgwMapContext } from '../context';

import type {
  NgwLayerAdapterType,
  NgwLayerOptions,
  ResourceAdapter,
} from '@nextgis/ngw-kit';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type { AdapterOptions, LayerAdaptersOptions } from '@nextgis/webmap';

export interface ReactNgwLayerProps<
  T extends NgwLayerAdapterType = NgwLayerAdapterType,
  A extends Record<string, any> = Record<string, any>,
> {
  id?: string;
  resource: number;
  adapter?: T;
  fit?: boolean;
  opacity?: number;

  filters?: PropertiesFilter;

  params?: Record<string, string | undefined>;

  visibility?: boolean;
  adapterOptions?: Partial<LayerAdaptersOptions[T] & AdapterOptions<A>>;

  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export function ReactNgwLayer<
  T extends NgwLayerAdapterType = NgwLayerAdapterType,
  A extends Record<string, any> = Record<string, any>,
>({
  id,
  fit,
  adapter,
  opacity,
  filters,
  resource,
  visibility = true,
  adapterOptions,
  onError,
  onLoad,
}: ReactNgwLayerProps<T, A>): null {
  const { ngwMap } = useNgwMapContext();

  const layerRef = useRef<ResourceAdapter | undefined>(undefined);
  const mountedRef = useRef(false);

  const visibilityRef = useRef<boolean | undefined>(visibility);
  const opacityRef = useRef<number | undefined>(opacity);
  const filterRef = useRef<PropertiesFilter | undefined>(filters);

  const initialOptions = useMemo<NgwLayerOptions<T, A>>(() => {
    const nextAdapterOptions: Partial<
      LayerAdaptersOptions[T] & AdapterOptions<A, Record<string, any>>
    > = adapterOptions || {};

    nextAdapterOptions.visibility = visibilityRef.current;

    if (opacityRef.current !== undefined) {
      nextAdapterOptions.opacity = opacityRef.current;
    }
    if (filters) {
      nextAdapterOptions.propertiesFilter = filters;
    }

    const layerOptions: NgwLayerOptions<T, A> = {
      id,
      fit,
      adapter,
      resource,
      adapterOptions: nextAdapterOptions,
    };

    return layerOptions;
  }, [adapterOptions, filters, id, fit, adapter, resource]);

  useEffect(() => {
    let cancelled = false;
    mountedRef.current = true;
    let layer: ResourceAdapter | undefined;

    async function createLayer() {
      try {
        layer = await ngwMap.addNgwLayer(initialOptions);

        if (cancelled) {
          if (layer) {
            await ngwMap.removeLayer(layer);
          }
          return;
        }

        layerRef.current = layer;

        onLoad?.();
      } catch (error) {
        if (!cancelled) {
          onError?.(error as Error);
        }
      }
    }

    createLayer();

    return () => {
      cancelled = true;
      mountedRef.current = false;
      if (layer) {
        ngwMap.removeLayer(layer);
      }
      layerRef.current = undefined;
    };
  }, [ngwMap, initialOptions, onLoad, onError]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !mountedRef.current) {
      return;
    }

    ngwMap.toggleLayer(layer, visibility);

    visibilityRef.current = visibility;
  }, [ngwMap, visibility]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !mountedRef.current) {
      return;
    }

    ngwMap.setLayerOpacity(layer, opacity ?? 0);

    opacityRef.current = opacity;
  }, [ngwMap, opacity]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !mountedRef.current) {
      return;
    }

    const sameFilter = filterRef.current === filters;

    if (sameFilter) {
      return;
    }

    ngwMap.propertiesFilter(layer, filters ?? []);

    filterRef.current = filters;
  }, [filters, ngwMap]);

  return null;
}

export default ReactNgwLayer;
