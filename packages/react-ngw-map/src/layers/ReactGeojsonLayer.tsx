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
        const nextLayer = await ngwMap.addGeoJsonLayer({
          ...initialOptions,
          data: initial.data ?? EMPTY_GEOJSON,
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
        ngwMap.removeLayer(addedLayer);
      }
    };
  }, [ngwMap, initialOptions]);

  useEffect(() => {
    if (!layer) return;

    const nextData = data ?? EMPTY_GEOJSON;

    dataQueueRef.current = dataQueueRef.current
      .catch(() => undefined)
      .then(async () => {
        if (layerRef.current === layer) {
          await ngwMap.setLayerData(layer, nextData);
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
