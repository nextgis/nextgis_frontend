import { expect } from 'chai';
import { mapHtml } from '../mapHtml';
import { MapAdapter, AppOptions, Type } from '../../../packages/webmap/src';
import { WebMap } from '../../../packages/webmap/src/WebMap';

export const webMapTests = (MA: Type<MapAdapter>) => {
  const adapterName = MA.name;
  const createWebMap = (options?: AppOptions) => {
    return new WebMap({ mapAdapter: new MA(), ...options });
  };

  describe(`Initialize WebMap with ${adapterName}.`, () => {
    beforeEach(() => {
      document.documentElement.innerHTML = mapHtml;
    });

    afterEach(() => {
      // restore the original func after test
    });

    it(`Apply adapter ${adapterName}.`, () => {
      const mapAdapter = new MA();
      const webMap = new WebMap({ mapAdapter });
      expect(webMap.mapAdapter).eq(mapAdapter);
    });

    it('Create from target as element ID.', async () => {
      const webMap = createWebMap();
      await webMap.create({ target: 'map' });

      expect(document.getElementById('map')).eq(webMap.getContainer());
    });
  });
};
