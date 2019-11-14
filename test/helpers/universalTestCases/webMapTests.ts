import { expect } from 'chai';
import { mapHtml } from '../mapHtml';
import { MapAdapter, AppOptions, Type, MapOptions } from '../../../packages/webmap/src';
import { WebMap } from '../../../packages/webmap/src/WebMap';
import { baseMapTests } from './baseMapTests';

export const webMapTests = (MA: Type<MapAdapter>) => {
  const adapterName = MA.name;

  const createWebMap = (options?: AppOptions) => {
    return new WebMap({ mapAdapter: new MA(), ...options });
  };

  const buildWebMap = (mapOptions: MapOptions, options?: AppOptions): Promise<WebMap> => {
    const webMap = createWebMap(options);
    return webMap.create({ target: 'map', ...mapOptions });
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
  });
};
