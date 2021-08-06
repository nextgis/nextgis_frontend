import { expect } from 'chai';
import { mapHtml } from '../mapHtml';
import { MapAdapter, Type, MapOptions } from '../../../packages/webmap/src';
import { WebMap } from '../../../packages/webmap/src/WebMap';
import { baseMapTests, MapAdapterCreateOptions } from './baseMapTests';
import { webMapLayersTests } from './webMapLayersTests';
import { FakeLayerAdapter } from '../classes/FakeLayerAdapter';

export function createWebMap(MA: Type<MapAdapter>, options?: MapOptions): any {
  return new WebMap({ mapAdapter: new MA(), ...options });
}

export async function buildWebMap<W extends WebMap = WebMap>(
  MA: Type<MapAdapter>,
  mapOptions: MapOptions,
  opt?: MapAdapterCreateOptions,
  createWebMap_ = createWebMap,
): Promise<W> {
  const webMap = createWebMap_(MA, {
    target: 'map',
    ...mapOptions,
    create: false,
  }) as W;
  return opt && opt.noCreate ? webMap : webMap.create();
}

export const webMapTests = <W extends WebMap = WebMap>(
  MA: Type<MapAdapter>,
  webMapName = 'WebMap',
  createWebMap_?: (MA: Type<MapAdapter>, options?: MapOptions) => W,
): any => {
  const adapterName = MA.name;

  const _buildWebMap = async (
    mapOptions: MapOptions,
    opt?: MapAdapterCreateOptions,
  ): Promise<W> => {
    return buildWebMap(MA, mapOptions, opt, createWebMap_);
  };

  describe(`${webMapName} with ${adapterName}.`, () => {
    beforeEach(() => {
      document.documentElement.innerHTML = mapHtml;
    });

    afterEach(() => {
      // restore the original func after test
    });

    describe('Constructor', () => {
      it(`Apply adapter ${adapterName}.`, () => {
        const mapAdapter = new MA();
        const webMap = new WebMap({ mapAdapter: mapAdapter });
        expect(webMap.mapAdapter).eq(mapAdapter);
      });
    });

    describe('#create', () => {
      it('Create from target as element ID', async () => {
        const webMap = await _buildWebMap({ target: 'map' });

        expect(document.getElementById('map')).eq(webMap.getContainer());
      });
    });

    baseMapTests(MA, (MA: Type<MapAdapter>, opt: MapOptions = {}) =>
      _buildWebMap(opt),
    );

    const layerAdapters: string[] =
      // @ts-ignore
      ('layerAdapters' in MA && Object.keys(MA.layerAdapters)) || [];
    layerAdapters.forEach((x) => {
      webMapLayersTests(x, _buildWebMap);
    });

    webMapLayersTests(FakeLayerAdapter, _buildWebMap);

    it('Returns undefined if map not initialized but layers added', async () => {
      const map = await _buildWebMap({}, { noCreate: true });
      map.addLayer('TILE', { url: 'file:///dev/null' });
      expect(map.getZoom()).to.be.undefined;
    });
  });
};
