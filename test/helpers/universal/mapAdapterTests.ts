import { expect } from 'chai';
import { MapAdapter, Type, MapOptions } from '../../../packages/webmap/src';
import { mapHtml } from '../mapHtml';

const mapAdapterCreate = async (MA: Type<MapAdapter>, opt?: MapOptions): Promise<MapAdapter> => {
  const mapAdapter = new MA();
  return new Promise(resolve => {
    mapAdapter.emitter.on('create', () => {
      resolve(mapAdapter);
    });
    mapAdapter.create(opt);
  });
};

export const mapAdapterTests = (MA: Type<MapAdapter>) => {
  const adapterName = MA.name;
  let ma: MapAdapter;
  beforeEach(async () => {
    document.documentElement.innerHTML = mapHtml;
    ma = await mapAdapterCreate(MA);
  });

  describe(`${adapterName}.`, () => {
    describe('#create', () => {
      it('Should emit "create" event.', async () => {
        expect(ma instanceof MA).to.equal(true);
      });

      it('Create map container with null options, should target HTMLElement with id="map".', async () => {
        const mapContainer = document.getElementById('map') as HTMLElement;
        expect(mapContainer.childElementCount).greaterThan(0);
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
        if (ma && ma.setView) {
          ma.setView([104, 52], 13);
          expect(ma.getZoom()).to.eq(13);
          const center = ma.getCenter();
          if (center) {
            // TODO: check Leaflet getCenter
            expect(center.map(Math.round)).to.eql([104, 52].map(Math.round));
          }
        } else {
          expect(1).to.be.ok;
        }
      });

      // it('Can be passed without a zoom specified', async () => {
      //   if (ma && ma.setView) {
      //     ma.setView([104, 52]);
      //     // expect(ma.getZoom()).to.be.undefined;
      //     const center = ma.getCenter();
      //     if (center) {
      //       expect(center.map(Math.round)).to.eql([104, 52].map(Math.round));
      //     }
      //   } else {
      //     expect(1).to.be.ok;
      //   }
      // });

      // it('limits initial zoom when no zoom specified', function() {
      //   map.options.maxZoom = 20;
      //   map.setZoom(100);
      //   expect(map.setView([51.605, -0.11])).to.be(map);
      //   expect(map.getZoom()).to.be(20);
      //   expect(map.getCenter().distanceTo([51.605, -0.11])).to.be.lessThan(5);
      // });

      // it('defaults to zoom passed as map option', function() {
      //   map = L.map(document.createElement('div'), { zoom: 13 });
      //   expect(map.setView([51.605, -0.11])).to.be(map);
      //   expect(map.getZoom()).to.be(13);
      // });
    });
  });
};
