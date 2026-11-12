import { updateImageParams } from '@nextgis/ngw-kit';

import type {
  ImageAdapterOptions,
  LayerAdapter,
  WebMap,
} from '@nextgis/webmap';

/**
 * Compatibility with scale denominators still consumed by the native raster
 * adapters. Keep these constraints on composed images until the adapters use
 * minZoom/maxZoom exclusively; omit the deprecated HTTP request fields.
 */
type LegacyScaleOptions = {
  minScale?: number;
  maxScale?: number;
};

function getLegacyScaleOptions(
  options: ImageAdapterOptions,
): LegacyScaleOptions {
  const legacy = options as LegacyScaleOptions;
  return { minScale: legacy.minScale, maxScale: legacy.maxScale };
}

type OpacityLayer = {
  options?: { opacity?: number };
  getOpacity?: () => number;
  off?: (event: string, callback: () => void) => unknown;
  on?: (event: string, callback: () => void) => unknown;
  un?: (event: string, callback: () => void) => unknown;
};

type NgwLayerAdapter = LayerAdapter & {
  resourceId?: number;
  ngwImageGroupingSafe?: boolean;
};

type WebmapItem = {
  item_type?: string;
  layer_adapter?: string;
  adapter?: string;
  resourceId?: number;
  __ngwImageGroupingExclude?: boolean;
};

interface Candidate {
  layer: LayerAdapter;
  resourceId: number;
  signature: string;
}

interface Group {
  layer: LayerAdapter;
  members: LayerAdapter[];
}

/**
 * Optional map-wide optimization for NGW IMAGE layers. Individual layer
 * adapters remain registered with WebMap for visibility, identify and legends.
 */
export class NgwImageLayerGrouping {
  private readonly groups = new Map<string, Group>();
  private readonly opacityListeners = new Map<LayerAdapter, () => void>();
  private readonly originalUpdates = new Map<
    LayerAdapter,
    LayerAdapter['updateLayer']
  >();
  private readonly excluded = new Set<LayerAdapter>();
  private readonly detached = new Set<LayerAdapter>();
  private readonly suppressed = new Set<LayerAdapter>();
  private timer?: ReturnType<typeof setTimeout>;
  private pending: Promise<void> = Promise.resolve();
  private disposed = false;
  private revision = 0;

  constructor(
    private readonly webMap: WebMap,
    private readonly chunkSize: number,
  ) {}

  start(): void {
    this.webMap.emitter.on('layer:add', this.onLayerChange);
    this.webMap.emitter.on('layer:show', this.onLayerChange);
    this.webMap.emitter.on('layer:hide', this.onLayerChange);
    this.webMap.emitter.on('layer:remove', this.onLayerChange);
    this.webMap.emitter.on('layer:preremove', this.onBeforeLayerRemove);
    this.webMap.emitter.on('event-symbol-render:change', this.onSymbolChange);
    for (const layer of this.webMap.orderedLayers()) {
      this.observe(layer);
    }
    this.schedule();
  }

  destroy(): void {
    this.disposed = true;
    if (this.timer) clearTimeout(this.timer);
    this.webMap.emitter.removeListener('layer:add', this.onLayerChange);
    this.webMap.emitter.removeListener('layer:show', this.onLayerChange);
    this.webMap.emitter.removeListener('layer:hide', this.onLayerChange);
    this.webMap.emitter.removeListener('layer:remove', this.onLayerChange);
    this.webMap.emitter.removeListener(
      'layer:preremove',
      this.onBeforeLayerRemove,
    );
    this.webMap.emitter.removeListener(
      'event-symbol-render:change',
      this.onSymbolChange,
    );

    for (const [layer, update] of this.originalUpdates) {
      layer.updateLayer = update;
    }
    this.originalUpdates.clear();
    for (const unsubscribe of this.opacityListeners.values()) unsubscribe();
    this.opacityListeners.clear();
    for (const group of this.groups.values()) {
      this.removeGroup(group);
    }
    this.groups.clear();
    for (const layer of this.suppressed) {
      if (this.isVisible(layer) && layer.layer !== undefined) {
        this.webMap.mapAdapter.showLayer(layer.layer);
        this.webMap.mapAdapter.setLayerOrder(layer.layer, layer.order!);
      }
    }
    this.suppressed.clear();
    this.excluded.clear();
    this.detached.clear();
  }

  /** Re-evaluate grouping after any observed layer state change. */
  schedule(): void {
    if (this.disposed) return;
    this.revision++;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.pending = this.pending
        .then(() => this.reconcile())
        .catch((error) => {
          console.error('Could not group NGW IMAGE layers', error);
        });
    }, 0);
  }

  private readonly onLayerChange = (layer: LayerAdapter) => {
    if (!this.isVisible(layer)) {
      // A composite must not keep rendering a hidden or removed member.
      this.invalidateGroupsContaining(layer, true);
    }
    if (this.webMap.allLayers()[String(layer.id)] === layer) {
      this.observe(layer);
    } else {
      const original = this.originalUpdates.get(layer);
      if (original) layer.updateLayer = original;
      this.originalUpdates.delete(layer);
      this.unobserveOpacity(layer);
      this.excluded.delete(layer);
      this.suppressed.delete(layer);
    }
    // A normal showLayer() must not expose an individual image already grouped.
    if (
      this.suppressed.has(layer) &&
      this.isVisible(layer) &&
      layer.layer !== undefined
    ) {
      this.webMap.mapAdapter.hideLayer(layer.layer);
    }
    this.schedule();
  };

  private readonly onBeforeLayerRemove = (layer: LayerAdapter) => {
    this.invalidateGroupsContaining(layer, true);
    // Removing NGW:WEBMAP removes its native child layers, but those children
    // can remain registered in WebMap. Never regroup or restore them.
    const container = layer as LayerAdapter & {
      getDependLayers?: () => Array<{ layer?: LayerAdapter }>;
    };
    if (typeof container.getDependLayers !== 'function') return;
    for (const item of container.getDependLayers()) {
      const child = item.layer;
      if (!child) continue;
      this.detached.add(child);
      this.invalidateGroupsContaining(child, true);
      const update = this.originalUpdates.get(child);
      if (update) child.updateLayer = update;
      this.originalUpdates.delete(child);
      this.unobserveOpacity(child);
    }
    this.schedule();
  };

  private readonly onSymbolChange = (event: { layerId?: string }) => {
    for (const layer of this.webMap.orderedLayers()) {
      if (layer.id === event?.layerId) {
        this.excluded.add(layer);
        this.invalidateGroupsContaining(layer);
        this.schedule();
        break;
      }
    }
  };

  private unobserveOpacity(layer: LayerAdapter): void {
    this.opacityListeners.get(layer)?.();
    this.opacityListeners.delete(layer);
  }

  private observeOpacity(layer: LayerAdapter): void {
    if (this.opacityListeners.has(layer)) return;
    const native = layer.layer as OpacityLayer | undefined;
    if (!native?.on || (!native.off && !native.un)) return;

    const listener = () => {
      if (this.getOpacity(layer) !== 1) {
        this.invalidateGroupsContaining(layer);
      }
      this.schedule();
    };
    // OpenLayers emits change:opacity; the NextGIS Leaflet ImageLayer emits opacitychange.
    native.on('change:opacity', listener);
    native.on('opacitychange', listener);
    this.opacityListeners.set(layer, () => {
      const remove = native.un ?? native.off;
      remove?.call(native, 'change:opacity', listener);
      remove?.call(native, 'opacitychange', listener);
    });
  }

  private getOpacity(layer: LayerAdapter): number {
    const native = layer.layer as OpacityLayer | undefined;
    return (
      native?.getOpacity?.() ??
      native?.options?.opacity ??
      layer.options.opacity ??
      1
    );
  }

  private isVisible(layer: LayerAdapter): boolean {
    return Boolean(
      !this.detached.has(layer) &&
      this.webMap.allLayers()[String(layer.id)] === layer &&
      this.webMap.isLayerVisible(layer),
    );
  }

  private getNgwResourceId(layer: LayerAdapter): number | undefined {
    const opt = layer.options as ImageAdapterOptions;
    const id = Number(opt.params?.resource);
    if (!Number.isSafeInteger(id) || id <= 0) return;

    const item = opt.params?.item as WebmapItem | undefined;
    const webmapChild =
      item?.item_type === 'layer' &&
      !item.__ngwImageGroupingExclude &&
      Number(item.resourceId) === id &&
      (item.adapter || item.layer_adapter)?.toUpperCase() === 'IMAGE';
    const ngw = layer as NgwLayerAdapter;
    const standalone =
      ngw.ngwImageGroupingSafe === true && ngw.resourceId === id;
    if (webmapChild || standalone) return id;
  }

  private observe(layer: LayerAdapter): void {
    if (this.detached.has(layer) || this.originalUpdates.has(layer)) return;
    if (this.getNgwResourceId(layer) === undefined) return;
    this.observeOpacity(layer);
    if (!layer.updateLayer) return;
    const original = layer.updateLayer;
    this.originalUpdates.set(layer, original);
    layer.updateLayer = (options) => {
      // Symbols, filters and other runtime WMS parameters cannot be assumed
      // equivalent to rendering this resource with default settings.
      this.excluded.add(layer);
      this.invalidateGroupsContaining(layer);
      this.schedule();
      return original.call(layer, options);
    };
  }

  private getCandidate(layer: LayerAdapter): Candidate | undefined {
    if (this.excluded.has(layer) || !this.isVisible(layer)) return;
    // Without native opacity notifications, grouping could hide later changes.
    if (!this.opacityListeners.has(layer)) return;
    const id = this.getNgwResourceId(layer);
    if (id === undefined) return;

    const opt = layer.options as ImageAdapterOptions;
    if (
      this.getOpacity(layer) !== 1 ||
      !opt.url ||
      !/\/api\/component\/render\/image\/?$/.test(opt.url) ||
      opt.nativeOptions ||
      (opt.ratio !== undefined && opt.ratio !== 1) ||
      opt.srs !== undefined ||
      opt.baselayer ||
      opt.toplayer ||
      layer.layer === undefined ||
      !Number.isFinite(layer.order)
    )
      return;

    if (
      Object.keys(opt.params ?? {}).some(
        (key) => key !== 'resource' && key !== 'item' && key !== 'nd',
      )
    )
      return;

    const signature = JSON.stringify({
      url: opt.url,
      request: opt.request,
      minZoom: opt.minZoom,
      maxZoom: opt.maxZoom,
      ...getLegacyScaleOptions(opt),
      crossOrigin: opt.crossOrigin,
      setViewDelay: opt.setViewDelay,
      nd: opt.params?.nd ?? 200,
    });
    return { layer, resourceId: id, signature };
  }

  private plan(): Candidate[][] {
    const result: Candidate[][] = [];
    let run: Candidate[] = [];
    let signature: string | undefined;
    const flush = () => {
      let remaining = run.length;
      let chunks = Math.ceil(remaining / this.chunkSize);
      let offset = 0;
      while (chunks > 0) {
        const length = Math.ceil(remaining / chunks);
        if (length >= 2) result.push(run.slice(offset, offset + length));
        offset += length;
        remaining -= length;
        chunks--;
      }
      run = [];
      signature = undefined;
    };

    for (const layer of this.webMap.orderedLayers()) {
      if (!this.isVisible(layer)) continue;
      // NGW:WEBMAP is a logical container, not a rendered layer.
      if (
        typeof (layer as { getDependLayers?: unknown }).getDependLayers ===
        'function'
      ) {
        continue;
      }
      const candidate = this.getCandidate(layer);
      if (!candidate || (signature && signature !== candidate.signature))
        flush();
      if (candidate) {
        run.push(candidate);
        signature = candidate.signature;
      }
    }
    flush();
    return result;
  }

  /** Render-only IMAGE: exists on the native map, not in WebMap._layers. */
  private async createNativeGroup(
    options: ImageAdapterOptions,
  ): Promise<LayerAdapter> {
    const ImageAdapter = this.webMap.getLayerAdapter('IMAGE');
    if (!ImageAdapter) throw new Error('IMAGE adapter is unavailable');

    const adapter = new ImageAdapter(this.webMap.mapAdapter.map, options);
    adapter.options = { ...options, ...adapter.options };
    const native = await adapter.addLayer(adapter.options);
    if (native === undefined)
      throw new Error('IMAGE adapter returned no layer');
    adapter.layer = native;
    return adapter;
  }

  /** Dispose a render-only group without emitting WebMap layer events. */
  private removeGroup(group: Group): void {
    const adapter = group.layer;
    adapter.beforeRemove?.();
    if (adapter.removeLayer) {
      adapter.removeLayer();
    } else if (adapter.layer !== undefined) {
      this.webMap.mapAdapter.removeLayer(adapter.layer);
    }
  }

  /** Remove obsolete composites and restore remaining native members immediately. */
  private invalidateGroupsContaining(
    layer: LayerAdapter,
    skipRestore = false,
  ): void {
    for (const [key, group] of this.groups) {
      if (!group.members.includes(layer)) continue;
      this.removeGroup(group);
      this.groups.delete(key);
      for (const member of group.members) {
        if (!this.suppressed.delete(member)) continue;
        if (member === layer && skipRestore) continue;
        if (this.isVisible(member) && member.layer !== undefined) {
          this.webMap.mapAdapter.showLayer(member.layer);
          this.webMap.mapAdapter.setLayerOrder(member.layer, member.order!);
        }
      }
    }
  }

  private async reconcile(): Promise<void> {
    if (this.disposed) return;
    const revision = this.revision;
    const chunks = this.plan();
    const desired = new Map(
      chunks.map((chunk) => [
        chunk.map((x) => x.layer.id).join('|') + ':' + chunk[0].signature,
        chunk,
      ]),
    );

    for (const [key, group] of this.groups) {
      if (!desired.has(key)) {
        this.removeGroup(group);
        this.groups.delete(key);
      }
    }

    const grouped = new Set(
      Array.from(desired.values()).flatMap((chunk) =>
        chunk.map((x) => x.layer),
      ),
    );
    for (const layer of this.suppressed) {
      if (!grouped.has(layer)) {
        if (this.isVisible(layer) && layer.layer !== undefined) {
          this.webMap.mapAdapter.showLayer(layer.layer);
          this.webMap.mapAdapter.setLayerOrder(layer.layer, layer.order!);
        }
        this.suppressed.delete(layer);
      }
    }

    for (const [key, chunk] of desired) {
      if (this.disposed) return;
      const existing = this.groups.get(key);
      if (existing) {
        if (existing.layer.layer !== undefined) {
          const top = chunk[chunk.length - 1].layer;
          this.webMap.mapAdapter.setLayerOrder(
            existing.layer.layer,
            top.order!,
          );
        }
        continue;
      }
      const first = chunk[0].layer.options as ImageAdapterOptions;
      const resources = chunk.map((x) => x.resourceId);
      const last = chunk[chunk.length - 1].layer;
      const options: ImageAdapterOptions = {
        url: first.url,
        params: { resource: resources.join(','), nd: first.params?.nd ?? 200 },
        request: first.request,
        minZoom: first.minZoom,
        maxZoom: first.maxZoom,
        ...getLegacyScaleOptions(first),
        crossOrigin: first.crossOrigin,
        setViewDelay: first.setViewDelay,
        order: last.order,
        opacity: 1,
        visibility: true,
        updateWmsParams: (params) => updateImageParams(params, resources),
      };
      let layer: LayerAdapter | undefined = undefined;
      try {
        layer = await this.createNativeGroup(options);
        if (this.disposed || this.revision !== revision) {
          // A hide/remove/update happened while creating this composite.
          // Do not expose an image containing obsolete resources.
          this.removeGroup({ layer, members: [] });
          return;
        }
        if (layer.layer !== undefined) {
          this.webMap.mapAdapter.showLayer(layer.layer);
          this.webMap.mapAdapter.setLayerOrder(layer.layer, options.order ?? 0);
        }
      } catch (error) {
        if (layer) {
          this.removeGroup({ layer, members: [] });
        }
        for (const { layer: member } of chunk) {
          this.excluded.add(member);
          if (this.suppressed.has(member)) {
            if (this.isVisible(member) && member.layer !== undefined) {
              this.webMap.mapAdapter.showLayer(member.layer);
              this.webMap.mapAdapter.setLayerOrder(member.layer, member.order!);
            }
            this.suppressed.delete(member);
          }
        }
        console.warn('Could not create NGW image group', error);
        continue;
      }
      if (this.disposed) {
        this.removeGroup({ layer, members: [] });
        return;
      }
      this.groups.set(key, { layer, members: chunk.map((x) => x.layer) });
    }

    for (const group of this.groups.values()) {
      for (const member of group.members) {
        if (member.layer !== undefined) {
          this.webMap.mapAdapter.hideLayer(member.layer);
          this.suppressed.add(member);
        }
      }
    }
  }
}
