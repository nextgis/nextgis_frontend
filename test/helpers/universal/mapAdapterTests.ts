import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { MapAdapter, Type, MapOptions } from '../../../packages/webmap/src';

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

const mapAdapterCreate = async (MA: Type<MapAdapter>, opt?: MapOptions): Promise<MapAdapter> => {
  const mapAdapter = new MA();
  return new Promise(resolve => {
    mapAdapter.emitter.on('create', () => resolve(mapAdapter));
    mapAdapter.create(opt);
  });
};

export const mapAdapterTests = (MA: Type<MapAdapter>) => {
  const adapterName = MA.name;

  describe(`Tests for ${adapterName}`, () => {
    describe('#create', () => {
      beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
      });

      afterEach(() => {
        // restore the original func after test
      });

      it('Should emit "create" event', async done => {
        const mapAdapter = await mapAdapterCreate(MA);
        expect(mapAdapter instanceof MA).to.equal(true);
        done();
      });

      it('Create map container with null options. Should target DOM element with id="map".', async () => {
        await mapAdapterCreate(MA);
        const mapContainer = document.getElementById('map') as HTMLElement;
        expect(mapContainer.childElementCount).greaterThan(0);
      });

      it('Set custom target DOM element as ID', async () => {
        document.body.innerHTML = '<div id="custom-map"></div>';
        await mapAdapterCreate(MA, { target: 'custom-map' });
        const mapContainer = document.getElementById('custom-map') as HTMLElement;
        expect(mapContainer.childElementCount).greaterThan(0);
      });
    });
  });
};
