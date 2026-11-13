import { EventEmitter } from 'events';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createGeoJsonAdapter } from '../../packages/ngw-kit/src/adapters/createGeoJsonAdapter';
import { fetchNgwExtent } from '../../packages/ngw-kit/src/utils/fetchNgwExtent';
import { fetchNgwLayerCount } from '../../packages/ngw-kit/src/utils/fetchNgwLayerCount';
import { fetchNgwLayerFeatureCollection } from '../../packages/ngw-kit/src/utils/fetchNgwLayerFeatureCollection';

import type NgwConnector from '@nextgis/ngw-connector';
import type { FeatureProperties } from '@nextgis/utils';
import type { WebMap } from '@nextgis/webmap';
import type { CompositeRead } from '@nextgisweb/resource/type/api';
import type { Feature, FeatureCollection, Geometry, Point } from 'geojson';
import type { GetClassAdapterOptions } from '../../packages/ngw-kit/src/interfaces';

type NgwFeature = Feature<Geometry | null, FeatureProperties>;
type NgwCollection = FeatureCollection<Geometry | null, FeatureProperties>;

vi.mock('../../packages/ngw-kit/src/utils/fetchNgwLayerFeatureCollection', () => ({
  fetchNgwLayerFeatureCollection: vi.fn(),
}));
vi.mock('../../packages/ngw-kit/src/utils/fetchNgwLayerCount', () => ({
  fetchNgwLayerCount: vi.fn(),
}));
vi.mock('../../packages/ngw-kit/src/utils/fetchNgwExtent', () => ({
  fetchNgwExtent: vi.fn(),
}));

const fetchFeatures = vi.mocked(fetchNgwLayerFeatureCollection);
const fetchCount = vi.mocked(fetchNgwLayerCount);
const fetchExtent = vi.mocked(fetchNgwExtent);

function point(id: number, status = 'active'): Feature<Point, FeatureProperties> {
  return {
    type: 'Feature', id,
    properties: { id, status },
    geometry: { type: 'Point', coordinates: [id, 50] },
  };
}

function collection(...features: NgwFeature[]): NgwCollection {
  return { type: 'FeatureCollection', features };
}

class NativeGeoJsonAdapter {
  options: Record<string, any>;
  data: NgwCollection = collection();
  filtered: NgwFeature[] | undefined;
  setDataCalls = 0;
  addDataCalls = 0;
  filter = vi.fn((predicate: ({ feature }: { feature: NgwFeature }) => boolean) => {
    this.filtered = this.data.features.filter(feature => predicate({ feature }));
    return this.filtered.map(feature => ({ feature }));
  });

  constructor(readonly map: unknown, options: Record<string, any> = {}) {
    this.options = options;
  }

  addLayer(opt: Record<string, any>) {
    this.options = { ...this.options, ...opt };
    if (opt.data) this.setData(opt.data);
    return { id: 'native-geojson' };
  }

  setData(data: NgwCollection) {
    this.setDataCalls++;
    this.data = data;
  }

  addData(data: NgwCollection) {
    this.addDataCalls++;
    this.data = collection(...this.data.features, ...data.features);
  }

  clearLayer() {
    this.data = collection();
  }

  getLayers() {
    return this.data.features.map(feature => ({ feature }));
  }

  getBounds() {
    return [0, 0, 1, 1] as const;
  }
}

function setup(extra: Record<string, unknown> = {}) {
  const emitter = new EventEmitter();
  const events = vi.fn();
  const setLayerData = vi.fn(async (layer: NativeGeoJsonAdapter, data: NgwCollection) => {
    layer.setData(data);
  });
  const addLayerData = vi.fn(async (layer: NativeGeoJsonAdapter, data: NgwCollection) => {
    layer.addData(data);
  });
  const webMap = {
    mapAdapter: { map: { id: 'map' }, layerAdapters: { GEOJSON: NativeGeoJsonAdapter } },
    emitter, _emitLayerEvent: events, setLayerData, addLayerData,
    onLoad: vi.fn().mockResolvedValue(undefined),
    getBounds: vi.fn().mockReturnValue([10, 20, 30, 40]),
    getZoom: vi.fn().mockReturnValue(9),
  } as unknown as WebMap;
  const connector = { options: { baseUrl: 'https://offline.invalid' } } as NgwConnector;
  const item = {
    resource: { id: 42, cls: 'vector_layer' },
    vector_layer: { geometry_type: 'POINT' },
  } as unknown as CompositeRead;
  const props = {
    item, webMap, connector,
    layerOptions: { resource: 42, id: 'roads', ...extra },
    Adapter: NativeGeoJsonAdapter,
  } as unknown as GetClassAdapterOptions;
  return { props, webMap, emitter, events, setLayerData, addLayerData };
}

async function makeLayer(props: GetClassAdapterOptions, options: Record<string, unknown> = {}) {
  const Adapter = await createGeoJsonAdapter(props);
  return new Adapter!({}, options) as unknown as NativeGeoJsonAdapter & {
    updateLayer: (opt?: unknown) => Promise<void>;
    getCount: () => Promise<number | undefined>;
    propertiesFilter: (filters?: unknown) => Promise<void>;
    beforeRemove: () => void;
    emitter: EventEmitter;
    getBounds: () => Promise<unknown>;
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  fetchFeatures.mockResolvedValue(collection(point(1), point(2)));
  fetchCount.mockResolvedValue(2);
  fetchExtent.mockResolvedValue([10, 20, 30, 40]);
});

describe('NGW GeoJSON resource adapter, offline API boundary', () => {
  it('creates a native vector adapter for the requested NGW resource', async () => {
    const { props } = setup();
    const layer = await makeLayer(props);
    await layer.addLayer({ data: collection(point(1)) });

    expect(layer.options.id).toBe('roads');
    expect(layer.getLayers()).toHaveLength(1);
    expect(fetchFeatures).not.toHaveBeenCalled();
  });

  it('automatically loads GeoJSON when initial data was not supplied', async () => {
    const { props, setLayerData, events } = setup();
    const layer = await makeLayer(props);
    await layer.addLayer({});

    expect(fetchFeatures).toHaveBeenCalledWith(expect.objectContaining({
      connector: props.connector, resourceId: 42, cache: true,
    }));
    expect(setLayerData).toHaveBeenCalledWith(layer, collection(point(1), point(2)));
    expect(layer.getLayers()).toHaveLength(2);
    expect(events).toHaveBeenCalledWith('layer:updated', 'roads', expect.objectContaining({
      isFull: true,
    }));
  });

  it('emits preupdate and updated events for successful requests', async () => {
    const { props } = setup();
    const layer = await makeLayer(props);
    const pre = vi.fn();
    const updated = vi.fn();
    layer.emitter.on('preupdate', pre);
    layer.emitter.on('updated', updated);

    await layer.addLayer({});
    expect(pre).toHaveBeenCalledOnce();
    expect(updated).toHaveBeenCalledWith(collection(point(1), point(2)));
  });

  it('preserves filter parameters when updating a layer again', async () => {
    const { props } = setup();
    const layer = await makeLayer(props);
    await layer.addLayer({ data: collection(point(1)) });

    const filters = [['status', 'eq', 'active']] as never;
    await layer.updateLayer({ filters });
    expect(fetchFeatures).toHaveBeenCalledWith(expect.objectContaining({ filters }));
    await layer.updateLayer();
    expect(fetchFeatures).toHaveBeenLastCalledWith(expect.objectContaining({ filters }));
  });

  it('requests the server count for every full load', async () => {
    const { props } = setup();
    const layer = await makeLayer(props);
    await layer.addLayer({});

    expect(fetchCount).toHaveBeenCalledWith({
      connector: props.connector, resourceId: 42, cache: true,
    });
    expect(await layer.getCount()).toBe(2);
  });

  it('gets resource bounds from NGW after data is loaded', async () => {
    const { props } = setup();
    const layer = await makeLayer(props);
    await layer.addLayer({ data: collection(point(1)) });

    await expect(layer.getBounds()).resolves.toEqual([10, 20, 30, 40]);
    expect(fetchExtent).toHaveBeenCalledWith({ connector: props.connector, resourceId: 42 });
  });

  it('falls back to native bounds when there is no data or BBOX strategy', async () => {
    const { props } = setup();
    const layer = await makeLayer(props);
    await layer.addLayer({ data: collection() });

    await expect(layer.getBounds()).resolves.toEqual([0, 0, 1, 1]);
    expect(fetchExtent).not.toHaveBeenCalled();
  });

  it('uses client-side filtering after the entire feature collection is loaded', async () => {
    const { props } = setup();
    const layer = await makeLayer(props);
    await layer.addLayer({});
    fetchFeatures.mockClear();

    await layer.propertiesFilter([['status', 'eq', 'active']] as never);

    expect(layer.filter).toHaveBeenCalled();
    expect(layer.filtered).toHaveLength(2);
    expect(fetchFeatures).not.toHaveBeenCalled();
  });

  it('retrieves a filtered collection when data is not fully loaded', async () => {
    const { props } = setup();
    fetchCount.mockResolvedValue(8);
    const layer = await makeLayer(props);
    await layer.addLayer({});
    fetchFeatures.mockClear();

    const filters = [['status', 'eq', 'active']] as never;
    await layer.propertiesFilter(filters);
    expect(fetchFeatures).toHaveBeenCalledWith(expect.objectContaining({ filters }));
  });

  it('supports incoming layer options overriding the NGW factory options', async () => {
    const { props } = setup({
      adapterOptions: { opacity: 0.5, labelField: 'name' },
    });
    const layer = await makeLayer(props);
    await layer.addLayer({ data: collection(point(1)), opacity: 0.9 });

    expect(layer.options.opacity).toBe(0.9);
    expect(layer.options.labelField).toBe('name');
  });

  it('supports explicit priority for factory adapter options', async () => {
    const { props } = setup({ adapterOptions: { opacity: 0.5 } });
    props.addLayerOptionsPriority = false;
    const layer = await makeLayer(props);
    await layer.addLayer({ data: collection(point(1)), opacity: 0.9 });

    expect(layer.options.opacity).toBe(0.5);
  });

  it('ignores updates after the adapter has been removed', async () => {
    const { props } = setup();
    const layer = await makeLayer(props);
    await layer.addLayer({ data: collection(point(1)) });
    layer.beforeRemove();

    await layer.updateLayer();
    expect(fetchFeatures).not.toHaveBeenCalled();
  });

  it('does not expose an ordinary AbortError as a failed data request', async () => {
    const { props } = setup();
    const layer = await makeLayer(props);
    await layer.addLayer({ data: collection(point(1)) });
    const abort = new Error('cancelled');
    abort.name = 'AbortError';
    fetchFeatures.mockRejectedValueOnce(abort);

    await expect(layer.updateLayer()).resolves.toBeUndefined();
  });

  it('propagates actual data-loading failures', async () => {
    const { props } = setup();
    const layer = await makeLayer(props);
    await layer.addLayer({ data: collection(point(1)) });
    fetchFeatures.mockRejectedValueOnce(new Error('API unavailable'));

    await expect(layer.updateLayer()).rejects.toThrow('API unavailable');
  });
});
