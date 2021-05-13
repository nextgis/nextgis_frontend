/**
 * Tests that must be performed for each MapAdapter and for any Class extended from WebMap.
 */

import { expect } from 'chai';
import {
  MapAdapter,
  Type,
  MapOptions,
  LngLatArray,
  WebMap,
} from '../../../packages/webmap/src';
import { mapHtml } from '../mapHtml';
import sleep from '../utils/asyncTimeout';

export interface MapAdapterCreateOptions {
  noCreate?: boolean;
}

export const baseMapTests = (
  MA: Type<MapAdapter>,
  mapAdapterCreate: (
    MA: Type<MapAdapter>,
    opt?: MapOptions,
    param?: MapAdapterCreateOptions
  ) => Promise<MapAdapter | WebMap>
) => {
  // let map: MapAdapter;
  beforeEach(() => {
    document.documentElement.innerHTML = mapHtml;
    // map = await mapAdapterCreate(MA);
  });

  describe(`Map base.`, () => {
    describe('#getContainer', () => {
      it('Should return HTMLElement equal target', async () => {
        const map = await mapAdapterCreate(MA);
        const domContainer = document.getElementById('map') as HTMLElement;
        const mapContainer = map.getContainer();
        expect(domContainer).to.equal(mapContainer);
      });
    });

    describe('#setView', () => {
      it('Sets the view of the map', async () => {
        const map = await mapAdapterCreate(MA);
        if (map.setView) {
          map.setView([104, 52], 13);
          expect(map.getZoom()).to.eq(13);
          const center = map.getCenter();
          if (center) {
            // TODO: check Leaflet getCenter
            expect(center.map(Math.round)).to.eql([104, 52].map(Math.round));
          }
        } else {
          expect(1).to.be.ok;
        }
      });

      it('Limits initial zoom when no zoom specified', async () => {
        const map = await mapAdapterCreate(MA, { maxZoom: 20 });
        map.setZoom(100);
        if (map.setView) {
          map.setView([104, 52]);
          await sleep(100);
          expect(map.getZoom()).to.equal(20);
          const center = map.getCenter() as LngLatArray;
          expect(center.map(Math.round)).to.eql([104, 52].map(Math.round));
        } else {
          expect(1).to.be.ok;
        }
      });

      it('Can be passed without a zoom specified', async () => {
        const map = await mapAdapterCreate(MA, { zoom: 10 });
        if (map.setView) {
          map.setView([104, 52]);
          await sleep(100);
          const center = map.getCenter() as LngLatArray;
          expect(map.getZoom()).to.equal(10);
          expect(center.map(Math.round)).to.eql([104, 52].map(Math.round));
        } else {
          expect(1).to.be.ok;
        }
      });
    });

    describe('#fitBounds', () => {
      const bounds = [102, 51, 104, 53];
      const boundsCenter = [103, 52];

      it('The center of the map should be correct', async () => {
        const map = await mapAdapterCreate(MA, { zoom: 9 });
        map.fitBounds(bounds);
        const center = map.getCenter() as LngLatArray;
        expect(center.map(Math.round)).to.eql(boundsCenter);
      });

      it('The map zoom should be correct', async () => {
        const map = await mapAdapterCreate(MA, { zoom: 9 });
        await map.fitBounds(bounds);
        await sleep(0);
        const zoom = map.getZoom() as number;
        expect(Math.floor(zoom)).to.eql(8);
      });

      it('Snaps zoom level to integer by default', (done) => {
        mapAdapterCreate(MA, { zoom: 21 }).then((map) => {
          (map as WebMap).emitter.once('zoomend', () => {
            expect(Math.floor(map.getZoom() as number)).to.eql(8);
            const center = map.getCenter() as LngLatArray;
            expect(center.map(Math.round)).to.eql(boundsCenter);
            done();
          });
          map.fitBounds(bounds);
        });
      });
    });

    describe('#getZoom', () => {
      it('Returns undefined if map not initialized', async () => {
        const map = await mapAdapterCreate(MA, {}, { noCreate: true });
        expect(map.getZoom()).to.be.undefined;
      });
    });
  });
};
