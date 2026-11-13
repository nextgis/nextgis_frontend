import { expect } from 'chai';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

import { NgwMapProvider } from '../../packages/react-ngw-map/src/context';
import { ReactGeojsonLayer } from '../../packages/react-ngw-map/src/layers/ReactGeojsonLayer';

import type { Root } from 'react-dom/client';
import type { GeoJsonAdapterOptions } from '../../packages/webmap/src';

type Data = NonNullable<GeoJsonAdapterOptions['data']>;
const data = (id: number): Data => ({
  type: 'FeatureCollection',
  features: [{
    type: 'Feature', properties: { id },
    geometry: { type: 'Point', coordinates: [id, id] },
  }],
});

describe('ReactGeojsonLayer data updates', () => {
  let root: Root;
  let container: HTMLDivElement;
  let map: any;
  let added: Data[];
  let updates: Data[];
  let previousActEnvironment: boolean | undefined;
  const environment = globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  };

  before(() => {
    previousActEnvironment = environment.IS_REACT_ACT_ENVIRONMENT;
    environment.IS_REACT_ACT_ENVIRONMENT = true;
  });
  after(() => { environment.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment; });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    added = [];
    updates = [];
    const layer = { id: 'geojson', options: {} };
    map = {
      onLoad: async () => undefined,
      addGeoJsonLayer: async (options: { data: Data }) => {
        added.push(options.data);
        return layer;
      },
      setLayerData: async (_layer: unknown, value: Data) => { updates.push(value); },
      removeLayer: () => undefined,
      setLayerPaint: () => undefined,
      setLayerSelectedPaint: () => undefined,
      toggleLayer: async () => undefined,
      setLayerOpacity: () => undefined,
    };
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  async function render(value: Data | null) {
    await act(async () => {
      root.render(createElement(
        NgwMapProvider,
        { value: { ngwMap: map } },
        createElement(ReactGeojsonLayer, { data: value }),
      ));
    });
    // Drain Promise chains used by the GeoJSON data queue.
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });
  }

  it('does not apply the initial GeoJSON twice', async () => {
    const initial = data(1);
    await render(initial);
    expect(added).to.deep.equal([initial]);
    expect(updates).to.deep.equal([]);
  });

  it('applies a new dataset once and ignores a same-reference rerender', async () => {
    const first = data(1);
    const second = data(2);
    await render(first);
    await render(second);
    await render(second);
    expect(updates).to.deep.equal([second]);
  });

  it('clears the layer when data becomes null', async () => {
    await render(data(1));
    await render(null);
    expect(updates).to.have.length(1);
    expect(updates[0]).to.deep.equal({ type: 'FeatureCollection', features: [] });
  });
});
