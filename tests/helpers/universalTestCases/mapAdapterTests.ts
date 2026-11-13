import { expect } from 'vitest';
import { MapAdapter, MapOptions } from '../../../packages/webmap/src';
import { mapHtml } from '../mapHtml';
import { baseMapTests } from './baseMapTests';
import type { MapAdapterCreateOptions } from './baseMapTests';
import type { Type } from '@nextgis/utils';

const mapAdapterCreate = async (
  MA: Type<MapAdapter>,
  opt?: MapOptions,
  param?: MapAdapterCreateOptions,
): Promise<MapAdapter> => {
  const mapAdapter = new MA();

  if (param?.noCreate) {
    return mapAdapter;
  }

  return new Promise((resolve) => {
    mapAdapter.emitter.on('create', () => {
      resolve(mapAdapter);
    });
    mapAdapter.create({ target: 'map', ...opt });
  });
};

export const mapAdapterTests = (MA: Type<MapAdapter>): any => {
  const adapterName = MA.name;
  const adapters: MapAdapter[] = [];
  const createTrackedMapAdapter = async (
    type: Type<MapAdapter>,
    opt?: MapOptions,
    param?: MapAdapterCreateOptions,
  ) => {
    const adapter = await mapAdapterCreate(type, opt, param);
    adapters.push(adapter);
    return adapter;
  };
  // let mapAdapter: MapAdapter;
  beforeEach(() => {
    document.body.innerHTML = mapHtml;
    // mapAdapter = await mapAdapterCreate(MA);
  });

  describe(`${adapterName}.`, () => {
    afterEach(() => {
      for (const adapter of adapters.splice(0)) {
        adapter.destroy?.();
      }
    });

    describe('#create', () => {
      it('Should emit "create" event', async () => {
        const mapAdapter = await createTrackedMapAdapter(MA);
        expect(mapAdapter instanceof MA).to.equal(true);
      });

      it('Set custom target HTMLElement as ID', async () => {
        document.body.innerHTML = '<div id="custom-map"></div>';
        await createTrackedMapAdapter(MA, { target: 'custom-map' });
        const mapContainer = document.getElementById(
          'custom-map',
        ) as HTMLElement;
        expect(mapContainer.childElementCount).greaterThan(0);
      });
    });

    baseMapTests(MA, createTrackedMapAdapter);
  });
};
