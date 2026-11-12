import { expect } from 'chai';
import { EventEmitter } from 'events';

import { NgwImageLayerGrouping } from '../../packages/ngw-map/src/NgwImageLayerGrouping';

import type {
  ImageAdapterOptions,
  LayerAdapter,
  WebMap,
} from '../../packages/webmap/src';

type Native = EventEmitter & {
  options: { opacity: number };
  getOpacity: () => number;
};
type Composite = { kind: 'composite'; resources: string };

function nativeImage(): Native {
  const image = new EventEmitter() as Native;
  image.options = { opacity: 1 };
  image.getOpacity = () => image.options.opacity;
  return image;
}

function imageLayer(id: string, resource: number, order: number): LayerAdapter {
  return {
    id,
    resourceId: resource,
    ngwImageGroupingSafe: true,
    order,
    layer: nativeImage(),
    options: {
      id,
      visibility: true,
      opacity: 1,
      url: 'https://example.com/api/component/render/image',
      params: { resource },
    },
    updateLayer: () => undefined,
  } as unknown as LayerAdapter;
}

function harness(deferCreation = false) {
  const a = imageLayer('a', 101, 1);
  const b = imageLayer('b', 102, 2);
  const layers: Record<string, LayerAdapter> = { a, b };
  const shown = new Set<unknown>([a.layer, b.layer]);
  const shownComposites: Composite[] = [];
  const composites: Composite[] = [];
  const pendingAdds: Array<() => void> = [];
  const emitter = new EventEmitter();

  class ImageAdapter {
    layer?: Composite;
    options: ImageAdapterOptions;

    constructor(_map: unknown, options: ImageAdapterOptions) {
      this.options = options;
    }

    addLayer(): Composite | Promise<Composite> {
      const layer: Composite = {
        kind: 'composite',
        resources: String(this.options.params?.resource),
      };
      composites.push(layer);
      if (deferCreation) {
        return new Promise<Composite>((resolve) => {
          pendingAdds.push(() => resolve(layer));
        });
      }
      return layer;
    }
  }

  const webMap = {
    emitter,
    allLayers: () => layers,
    orderedLayers: () =>
      Object.values(layers).sort((x, y) => x.order! - y.order!),
    isLayerVisible: (layer: LayerAdapter) => layer.options.visibility === true,
    getLayerAdapter: () => ImageAdapter,
    mapAdapter: {
      map: {},
      showLayer(layer: unknown) {
        shown.add(layer);
        if ((layer as Composite).kind === 'composite') {
          shownComposites.push(layer as Composite);
        }
      },
      hideLayer(layer: unknown) {
        shown.delete(layer);
      },
      removeLayer(layer: unknown) {
        shown.delete(layer);
      },
      setLayerOrder(_layer: unknown, _order: number) {},
    },
  } as unknown as WebMap;

  const grouping = new NgwImageLayerGrouping(webMap, 5);
  grouping.start();

  return {
    a,
    b,
    layers,
    emitter,
    shown,
    shownComposites,
    composites,
    pendingAdds,
    grouping,
  };
}

async function waitUntil(check: () => boolean): Promise<void> {
  for (let n = 0; n < 100; n++) {
    if (check()) return;
    await new Promise<void>((resolve) => setTimeout(resolve, 5));
  }
  throw new Error('IMAGE grouping did not reach the expected state');
}

describe('NGW IMAGE grouping lifecycle', () => {
  const cleanup: NgwImageLayerGrouping[] = [];
  afterEach(() => {
    for (const grouping of cleanup.splice(0)) grouping.destroy();
  });

  it('removes a composite immediately when a member becomes hidden', async () => {
    const h = harness();
    cleanup.push(h.grouping);
    await waitUntil(() => h.shownComposites.length === 1 && h.shown.size === 1);
    const composite = h.composites[0];

    h.a.options.visibility = false;
    h.emitter.emit('layer:hide', h.a);

    expect(h.shown.has(composite)).to.equal(false);
    expect(h.shown.has(h.b.layer)).to.equal(true);
    expect(h.shown.has(h.a.layer)).to.equal(false);
  });

  it('removes a composite before removing a member from WebMap', async () => {
    const h = harness();
    cleanup.push(h.grouping);
    await waitUntil(() => h.shownComposites.length === 1 && h.shown.size === 1);
    const composite = h.composites[0];

    h.emitter.emit('layer:preremove', h.a);

    expect(h.shown.has(composite)).to.equal(false);
    expect(h.shown.has(h.b.layer)).to.equal(true);
    expect(h.shown.has(h.a.layer)).to.equal(false);

    delete h.layers.a;
    h.emitter.emit('layer:remove', h.a);
  });

  it('restores individual images immediately after an opacity change', async () => {
    const h = harness();
    cleanup.push(h.grouping);
    await waitUntil(() => h.shownComposites.length === 1 && h.shown.size === 1);
    const composite = h.composites[0];
    const image = h.a.layer as Native;

    image.options.opacity = 0.5;
    image.emit('opacitychange');

    expect(h.shown.has(composite)).to.equal(false);
    expect(h.shown.has(h.a.layer)).to.equal(true);
    expect(h.shown.has(h.b.layer)).to.equal(true);
  });

  it('never displays a composite created for an obsolete layer state', async () => {
    const h = harness(true);
    cleanup.push(h.grouping);
    await waitUntil(() => h.pendingAdds.length === 1);

    h.a.options.visibility = false;
    h.emitter.emit('layer:hide', h.a);
    h.pendingAdds.shift()!();

    await waitUntil(() => h.composites.length === 1);
    await new Promise<void>((resolve) => setTimeout(resolve, 20));

    expect(h.shownComposites).to.deep.equal([]);
    expect(h.shown.has(h.b.layer)).to.equal(true);
  });
});
