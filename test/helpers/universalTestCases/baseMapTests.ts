/**
 * Tests that must be performed for each MapAdapter and for any Class extended from WebMap.
 */

import { expect } from 'chai';
import { MapAdapter, Type, MapOptions, LngLatArray, WebMap } from '../../../packages/webmap/src';
import { mapHtml } from '../mapHtml';
import asyncTimeout from '../utils/asyncTimeout';

export const baseMapTests = (
  MA: Type<MapAdapter>,
  mapAdapterCreate: (MA: Type<MapAdapter>, opt?: MapOptions) => Promise<MapAdapter | WebMap>
) => {
  const adapterName = MA.name;
  // let mapAdapter: MapAdapter;
  beforeEach(() => {
    document.documentElement.innerHTML = mapHtml;
    // mapAdapter = await mapAdapterCreate(MA);
  });

  describe(`${adapterName}.`, () => {
    describe('#getContainer', () => {
      it('Should return HTMLElement equal target', async () => {
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
        if (mapAdapter.setView) {
          mapAdapter.setView([104, 52]);
          await asyncTimeout(100);
          expect(mapAdapter.getZoom()).to.equal(20);
          const center = mapAdapter.getCenter() as LngLatArray;
          expect(center.map(Math.round)).to.eql([104, 52].map(Math.round));
        } else {
          expect(1).to.be.ok;
        }
      });

      it('Can be passed without a zoom specified', async () => {
        const mapAdapter = await mapAdapterCreate(MA, { zoom: 10 });
        if (mapAdapter.setView) {
          mapAdapter.setView([104, 52]);
          await asyncTimeout(100);
          const center = mapAdapter.getCenter() as LngLatArray;
          expect(mapAdapter.getZoom()).to.equal(10);
          expect(center.map(Math.round)).to.eql([104, 52].map(Math.round));
        } else {
          expect(1).to.be.ok;
        }
      });
    });
  });
};
