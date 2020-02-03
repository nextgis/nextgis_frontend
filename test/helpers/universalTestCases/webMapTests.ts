import { expect } from 'chai';
import { mapHtml } from '../mapHtml';
import {
  MapAdapter,
  AppOptions,
  Type,
  MapOptions,
  LayerAdapters
} from '../../../packages/webmap/src';
import { WebMap } from '../../../packages/webmap/src/WebMap';
import { baseMapTests, MapAdapterCreateOptions } from './baseMapTests';
import { webMapLayersTests } from './webMapLayersTests';
import { FakeLayerAdapter } from '../classes/FakeLayerAdapter';

export function createWebMap(MA: Type<MapAdapter>, options?: AppOptions) {
  return new WebMap({ mapAdapter: new MA(), ...options });
}

export async function buildWebMap<W extends WebMap = WebMap>(
  MA: Type<MapAdapter>,
  mapOptions: MapOptions,
  appOpt?: AppOptions,
  opt?: MapAdapterCreateOptions,
  createWebMap_ = createWebMap
): Promise<W> {
  const webMap = createWebMap_(MA, appOpt) as W;
  return opt && opt.noCreate
    ? webMap
    : webMap.create({ target: 'map', ...mapOptions });
}

export const webMapTests = <W extends WebMap = WebMap>(
  MA: Type<MapAdapter>,
  webMapName = 'WebMap',
  createWebMap_?: (MA: Type<MapAdapter>, options?: AppOptions) => W
) => {
  const adapterName = MA.name;

  const _buildWebMap = async (
    mapOptions: MapOptions,
    appOpt?: AppOptions,
    opt?: MapAdapterCreateOptions
  ): Promise<W> => {
    return buildWebMap(MA, mapOptions, appOpt, opt, createWebMap_);
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
        const webMap = new WebMap({ mapAdapter });
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
      _buildWebMap(opt)
    );

    webMapLayersTests('GEOJSON', _buildWebMap);
    webMapLayersTests('TILE', _buildWebMap);
    webMapLayersTests('IMAGE', _buildWebMap);
    webMapLayersTests(FakeLayerAdapter, _buildWebMap);

    it('returns undefined if map not initialized but layers added', async () => {
      const map = await _buildWebMap({}, undefined, { noCreate: true });
      map.addLayer('TILE', { url: 'file:///dev/null' });
      expect(map.getZoom()).to.be.undefined;
    });
  });
};
