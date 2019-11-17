import { expect } from 'chai';
import { mapHtml } from '../mapHtml';
import { MapAdapter, AppOptions, Type, MapOptions } from '../../../packages/webmap/src';
import { WebMap } from '../../../packages/webmap/src/WebMap';
import { baseMapTests, MapAdapterCreateOptions } from './baseMapTests';

export const webMapTests = (MA: Type<MapAdapter>) => {
  const adapterName = MA.name;

  const createWebMap = (options?: AppOptions) => {
    return new WebMap({ mapAdapter: new MA(), ...options });
  };

  const buildWebMap = async (
    mapOptions: MapOptions,
    appOpt?: AppOptions,
    opt?: MapAdapterCreateOptions
  ): Promise<WebMap> => {
    const webMap = createWebMap(appOpt);
    return opt && opt.noCreate ? webMap : webMap.create({ target: 'map', ...mapOptions });
  };

  describe(`WebMap with ${adapterName}.`, () => {
    beforeEach(() => {
      document.documentElement.innerHTML = mapHtml;
    });

    afterEach(() => {
      // restore the original func after test
    });

    describe('Constructor', () => {
      it(`Apply adapter ${adapterName}.`, () => {
        const mapAdapter = new MA();
        const webMap = new WebMap({ mapAdapter });
        expect(webMap.mapAdapter).eq(mapAdapter);
      });
    });

    describe('#create', () => {
      it('Create from target as element ID', async () => {
        const webMap = await buildWebMap({ target: 'map' });

        expect(document.getElementById('map')).eq(webMap.getContainer());
      });
    });

    baseMapTests(MA, (MA: Type<MapAdapter>, opt: MapOptions = {}) => buildWebMap(opt));

    it('returns undefined if map not initialized but layers added', async () => {
      const map = await buildWebMap({}, undefined, { noCreate: true });
      map.addLayer('TILE', { url: 'file:///dev/null' });
      expect(map.getZoom()).to.be.undefined;
    });
  });
};
