import { useEffect, useMemo, useRef, useState } from 'react';

import { useNgwMapContext } from '../context';
import { useShallowMemo } from '../hooks/useShallowMemo';

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
  order?: number;
  baselayer?: boolean;

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
  order,
  adapter,
  opacity,
  filters,
  resource,
  baselayer,
  visibility = true,
  adapterOptions,
  onError,
  onLoad,
}: ReactNgwLayerProps<T, A>): null {
  const { ngwMap } = useNgwMapContext();

  const layerRef = useRef<ResourceAdapter | undefined>(undefined);
  const mountedRef = useRef(false);
  const [createdLayer, setCreatedLayer] = useState<
    ResourceAdapter | undefined
  >();
  const onLoadRef = useRef(onLoad);
  const onErrorRef = useRef(onError);
  onLoadRef.current = onLoad;
  onErrorRef.current = onError;
  const stableAdapterOptions = useShallowMemo({ ...adapterOptions });

  const isLayerReady = (
    layer: ResourceAdapter | undefined,
  ): layer is ResourceAdapter =>
    Boolean(layer && layer === createdLayer && mountedRef.current);

  const visibilityRef = useRef<boolean | undefined>(visibility);
  const opacityRef = useRef<number | undefined>(opacity);
  const filterRef = useRef<PropertiesFilter | undefined>(filters);

  const initialOptions = useMemo<NgwLayerOptions<T, A>>(() => {
    const nextAdapterOptions = { ...stableAdapterOptions } as Partial<
      LayerAdaptersOptions[T] & AdapterOptions<A>
    >;

    nextAdapterOptions.visibility = visibilityRef.current;

    if (opacityRef.current !== undefined) {
      nextAdapterOptions.opacity = opacityRef.current;
    }
    if (filterRef.current) {
      nextAdapterOptions.propertiesFilter = filterRef.current;
    }
    if (order !== undefined) {
      nextAdapterOptions.order = order;
    }
    if (baselayer !== undefined) {
      nextAdapterOptions.baselayer = baselayer;
    }

    const layerOptions: NgwLayerOptions<T, A> = {
      id,
      fit,
      adapter,
      resource,
      adapterOptions: nextAdapterOptions,
    };

    return layerOptions;
  }, [stableAdapterOptions, id, fit, adapter, resource]);

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

        if (!layer) {
          throw new Error(`Could not add NGW layer ${resource}`);
        }
        layerRef.current = layer;
        setCreatedLayer(layer);

        onLoadRef.current?.();
      } catch (error) {
        if (!cancelled) {
          onErrorRef.current?.(error as Error);
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
  }, [ngwMap, initialOptions]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!isLayerReady(layer) || visibilityRef.current === visibility) {
      return;
    }

    ngwMap.toggleLayer(layer, visibility).catch((error) => {
      if (layerRef.current === layer) onErrorRef.current?.(error as Error);
    });

    visibilityRef.current = visibility;
  }, [ngwMap, visibility, createdLayer]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!isLayerReady(layer) || opacityRef.current === opacity) {
      return;
    }

    ngwMap.setLayerOpacity(layer, opacity ?? stableAdapterOptions.opacity ?? 1);

    opacityRef.current = opacity;
  }, [ngwMap, opacity, createdLayer, stableAdapterOptions]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!isLayerReady(layer)) {
      return;
    }

    const sameFilter = filterRef.current === filters;

    if (sameFilter) {
      return;
    }

    ngwMap.propertiesFilter(layer, filters ?? null).catch((error) => {
      if (layerRef.current === layer) onErrorRef.current?.(error as Error);
    });

    filterRef.current = filters;
  }, [filters, ngwMap, createdLayer, stableAdapterOptions]);

  return null;
}

export default ReactNgwLayer;
