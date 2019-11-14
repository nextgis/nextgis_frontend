import { expect } from 'chai';
import { MapAdapter, Type, MapOptions, LngLatArray } from '../../../packages/webmap/src';
import { mapHtml } from '../mapHtml';
import asyncTimeout from '../utils/asyncTimeout';

const mapAdapterCreate = async (MA: Type<MapAdapter>, opt?: MapOptions): Promise<MapAdapter> => {
  const mapAdapter = new MA();
  return new Promise(resolve => {
    mapAdapter.emitter.on('create', () => {
      resolve(mapAdapter);
    });
    mapAdapter.create({ target: 'map', ...opt });
  });
};

export const mapAdapterTests = (MA: Type<MapAdapter>) => {
  const adapterName = MA.name;
  let mapAdapter: MapAdapter;
  beforeEach(() => {
    document.documentElement.innerHTML = mapHtml;
    // mapAdapter = await mapAdapterCreate(MA);
  });

  describe(`${adapterName}.`, () => {
    describe('#create', () => {
      it('Should emit "create" event.', async () => {
        const mapAdapter = await mapAdapterCreate(MA);
        expect(mapAdapter instanceof MA).to.equal(true);
      });

      it('Set custom target HTMLElement as ID.', async () => {
        document.body.innerHTML = '<div id="custom-map"></div>';
        await mapAdapterCreate(MA, { target: 'custom-map' });
        const mapContainer = document.getElementById('custom-map') as HTMLElement;
        expect(mapContainer.childElementCount).greaterThan(0);
      });
    });

    describe('#getContainer', () => {
      it('Should return HTMLElement equal target.', async () => {
        const mapAdapter = await mapAdapterCreate(MA);
        const domContainer = document.getElementById('map') as HTMLElement;
        const mapContainer = mapAdapter.getContainer();
        expect(domContainer).to.equal(mapContainer);
      });
    });

    describe('#setView', () => {
      it('Sets the view of the map', async () => {
        const mapAdapter = await mapAdapterCreate(MA);
        if (mapAdapter.setView) {
          mapAdapter.setView([104, 52], 13);
          expect(mapAdapter.getZoom()).to.eq(13);
          const center = mapAdapter.getCenter();
          if (center) {
            // TODO: check Leaflet getCenter
            expect(center.map(Math.round)).to.eql([104, 52].map(Math.round));
          }
        } else {
          expect(1).to.be.ok;
        }
      });

      it('Limits initial zoom when no zoom specified', async () => {
        const mapAdapter = await mapAdapterCreate(MA, { maxZoom: 20 });
        mapAdapter.setZoom(100);
        mapAdapter.setCenter([104, 52]);
        expect(mapAdapter.getZoom()).to.equal(20);
        await asyncTimeout();
        const center = mapAdapter.getCenter() as LngLatArray;
        expect(center.map(Math.round)).to.eql([104, 52].map(Math.round));
      });

      // it('Can be passed without a zoom specified', async () => {
      //   const mapAdapter = await mapAdapterCreate(MA);
      //   if (mapAdapter.setView) {
      //     mapAdapter.setView([104, 52]);

      //     // expect(ma.getZoom()).to.be.undefined;
      //     setTimeout(() => {
      //       const center = mapAdapter.getCenter();
      //       if (center) {
      //         expect(center.map(Math.round)).to.eql([104, 52].map(Math.round));
      //       }
      //     }, 0);
      //   } else {
      //     expect(1).to.be.ok;
      //   }
      // });

      // it('defaults to zoom passed as map option', function() {
      //   map = L.map(document.createElement('div'), { zoom: 13 });
      //   expect(map.setView([51.605, -0.11])).to.be(map);
      //   expect(map.getZoom()).to.be(13);
      // });
    });
  });
};
