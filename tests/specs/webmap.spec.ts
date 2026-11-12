import { expect } from 'chai';

import { FakeLayerAdapter } from '../helpers/classes/FakeLayerAdapter';
import { FakeMapAdapter } from '../helpers/classes/FakeMapAdapter';
import { mapHtml } from '../helpers/mapHtml';
import { mapAdapterTests } from '../helpers/universalTestCases/mapAdapterTests';
import {
  buildWebMap,
  webMapTests,
} from '../helpers/universalTestCases/webMapTests';

webMapTests(FakeMapAdapter);
mapAdapterTests(FakeMapAdapter);

describe('WebMap base layer registration', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = mapHtml;
  });

  it('removes the first base layer ID without removing later base layers', async () => {
    const map = await buildWebMap(FakeMapAdapter, { target: 'map' });
    try {
      const first = await map.addBaseLayer(FakeLayerAdapter, {
        visibility: false,
      });
      const second = await map.addBaseLayer(FakeLayerAdapter, {
        visibility: false,
      });

      expect(map.getBaseLayersIds()).to.deep.equal([first.id, second.id]);
      map.removeLayer(first);

      expect(map.getBaseLayersIds()).to.deep.equal([second.id]);
      expect(map.getBaseLayers()).to.deep.equal([second]);
      expect(map.isBaseLayer(second)).to.equal(true);
    } finally {
      map.destroy();
    }
  });

  it('does not remove another base layer when removing an already removed layer', async () => {
    const map = await buildWebMap(FakeMapAdapter, { target: 'map' });
    try {
      const first = await map.addBaseLayer(FakeLayerAdapter, {
        visibility: false,
      });
      const second = await map.addBaseLayer(FakeLayerAdapter, {
        visibility: false,
      });

      map.removeLayer(second);
      expect(map.getBaseLayersIds()).to.deep.equal([first.id]);

      // A layer reference can outlive its registration in WebMap.
      map.removeLayer(second);
      expect(map.getBaseLayersIds()).to.deep.equal([first.id]);
      expect(map.getBaseLayers()).to.deep.equal([first]);
    } finally {
      map.destroy();
    }
  });

  it('clears base layer IDs when removing all layers', async () => {
    const map = await buildWebMap(FakeMapAdapter, { target: 'map' });
    try {
      await map.addBaseLayer(FakeLayerAdapter, { visibility: false });
      await map.addBaseLayer(FakeLayerAdapter, { visibility: false });

      map.removeLayers();
      expect(map.getBaseLayersIds()).to.deep.equal([]);
      expect(map.getBaseLayers()).to.deep.equal([]);
    } finally {
      map.destroy();
    }
  });
});
