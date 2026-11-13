import { useEffect, useRef, useState } from 'react';

import { useNgwMapContext } from '../context';
import { useShallowMemo } from '../hooks/useShallowMemo';

import type {
  GeoJsonAdapterOptions,
  GeoJsonLayerAdapter,
} from '@nextgis/webmap';

type GeojsonData = NonNullable<GeoJsonAdapterOptions['data']>;

const EMPTY_GEOJSON: GeojsonData = {
  type: 'FeatureCollection',
  features: [],
};

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

export interface ReactGeojsonLayerProps extends Omit<
  GeoJsonAdapterOptions,
  'data' | 'onAdded'
> {
  data?: GeojsonData | null;
  onLoad?: (layer: GeoJsonLayerAdapter) => void;
  onError?: (error: Error) => void;
}

export function ReactGeojsonLayer({
  data,
  paint,
  opacity,
  visibility,
  selectedPaint,
  onError,
  onLoad,
  ...options
}: ReactGeojsonLayerProps): null {
  const { ngwMap } = useNgwMapContext();

  const initialOptions = useShallowMemo(options);
  const current = useRef({ data, paint, selectedPaint, opacity, visibility });
  current.current = { data, paint, selectedPaint, opacity, visibility };

  const handlers = useRef({ onLoad, onError });
  handlers.current = { onLoad, onError };

  const layerRef = useRef<GeoJsonLayerAdapter | null>(null);
  const appliedDataRef = useRef<{
    layer: GeoJsonLayerAdapter;
    data: GeojsonData;
  } | null>(null);
  const latestDataRef = useRef<GeojsonData>(data ?? EMPTY_GEOJSON);
  latestDataRef.current = data ?? EMPTY_GEOJSON;
  const dataQueueRef = useRef<Promise<void>>(Promise.resolve());
  const [created, setCreated] = useState<{
    options: typeof initialOptions;
    layer: GeoJsonLayerAdapter;
  } | null>(null);

  const layer = created?.options === initialOptions ? created.layer : null;

  useEffect(() => {
    let disposed = false;
    let addedLayer: GeoJsonLayerAdapter | undefined;

    async function createLayer() {
      try {
        await ngwMap.onLoad();
        if (disposed) return;

        const initial = current.current;
        const initialData = initial.data ?? EMPTY_GEOJSON;
        const nextLayer = await ngwMap.addGeoJsonLayer({
          ...initialOptions,
          data: initialData,
          paint: initial.paint,
          selectedPaint: initial.selectedPaint,
          opacity: initial.opacity ?? 1,
          visibility: initial.visibility ?? true,
        });
        addedLayer = nextLayer;

        if (disposed) {
          ngwMap.removeLayer(nextLayer);
          return;
        }

        layerRef.current = nextLayer;
        appliedDataRef.current = { layer: nextLayer, data: initialData };
        setCreated({ options: initialOptions, layer: nextLayer });
        handlers.current.onLoad?.(nextLayer);
      } catch (error) {
        if (!disposed) handlers.current.onError?.(asError(error));
      }
    }

    createLayer();

    return () => {
      disposed = true;
      if (addedLayer) {
        if (layerRef.current === addedLayer) layerRef.current = null;
        if (appliedDataRef.current?.layer === addedLayer) {
          appliedDataRef.current = null;
        }
        ngwMap.removeLayer(addedLayer);
      }
    };
  }, [ngwMap, initialOptions]);

  useEffect(() => {
    if (!layer) return;

    const nextData = data ?? EMPTY_GEOJSON;
    // addGeoJsonLayer already received this data; do not clear/re-add it.
    const applied = appliedDataRef.current;
    if (applied?.layer === layer && applied.data === nextData) return;

    dataQueueRef.current = dataQueueRef.current
      .catch(() => undefined)
      .then(async () => {
        if (layerRef.current !== layer) return;
        if (latestDataRef.current !== nextData) return;

        const applied = appliedDataRef.current;
        if (applied?.layer === layer && applied.data === nextData) {
          return;
        }

        await ngwMap.setLayerData(layer, nextData);

        if (layerRef.current === layer) {
          appliedDataRef.current = { layer, data: nextData };
        }
      })
      .catch((error) => {
        if (layerRef.current === layer) {
          handlers.current.onError?.(asError(error));
        }
      })
      .catch((error) => {
        if (layerRef.current === layer) {
          handlers.current.onError?.(asError(error));
        }
      });
  }, [ngwMap, layer, data]);

  useEffect(() => {
    if (layer) ngwMap.setLayerPaint(layer, paint ?? {});
  }, [ngwMap, layer, paint]);

  useEffect(() => {
    if (layer) ngwMap.setLayerSelectedPaint(layer, selectedPaint ?? {});
  }, [ngwMap, layer, selectedPaint]);

  useEffect(() => {
    if (!layer) return;
    ngwMap.toggleLayer(layer, visibility ?? true).catch((error) => {
      if (layerRef.current === layer) {
        handlers.current.onError?.(asError(error));
      }
    });
  }, [ngwMap, layer, visibility]);

  useEffect(() => {
    if (layer) ngwMap.setLayerOpacity(layer, opacity ?? 1);
  }, [ngwMap, layer, opacity]);

  return null;
}

export default ReactGeojsonLayer;
