import { expect } from 'chai';
import { MapAdapter, Type, MapOptions } from '../../../packages/webmap/src';
import { mapHtml } from '../mapHtml';
import { baseMapTests } from './baseMapTests';

const mapAdapterCreate = async (
  MA: Type<MapAdapter>,
  opt?: MapOptions,
): Promise<MapAdapter> => {
  const mapAdapter = new MA();
  return new Promise((resolve) => {
    mapAdapter.emitter.on('create', () => {
      resolve(mapAdapter);
    });
    mapAdapter.create({ target: 'map', ...opt });
  });
};

export const mapAdapterTests = (MA: Type<MapAdapter>): any => {
  const adapterName = MA.name;
  // let mapAdapter: MapAdapter;
  beforeEach(() => {
    document.documentElement.innerHTML = mapHtml;
    // mapAdapter = await mapAdapterCreate(MA);
  });

  describe(`${adapterName}.`, () => {
    describe('#create', () => {
      it('Should emit "create" event', async () => {
        const mapAdapter = await mapAdapterCreate(MA);
        expect(mapAdapter instanceof MA).to.equal(true);
      });

      it('Set custom target HTMLElement as ID', async () => {
        document.body.innerHTML = '<div id="custom-map"></div>';
        await mapAdapterCreate(MA, { target: 'custom-map' });
        const mapContainer = document.getElementById(
          'custom-map',
        ) as HTMLElement;
        expect(mapContainer.childElementCount).greaterThan(0);
      });
    });

    baseMapTests(MA, mapAdapterCreate);
  });
};
