import { expect } from 'chai';
import sinon from 'sinon';
import { mapHtml } from '../mapHtml';
import { MapOptions, LayerAdapters, Type } from '../../../packages/webmap/src';
import { WebMap } from '../../../packages/webmap/src/WebMap';
import { MapAdapterCreateOptions } from './baseMapTests';

export const webMapLayersTests = <
  K extends keyof LayerAdapters,
  W extends WebMap = WebMap,
>(
  layerAdapter:
    | K
    | Type<LayerAdapters[K]>
    | Promise<Type<LayerAdapters[K]> | undefined>,
  buildWebMap: (
    mapOptions: MapOptions,
    opt?: MapAdapterCreateOptions,
  ) => Promise<W>,
): any => {
  const layerAdapterName =
    typeof layerAdapter === 'string' ? layerAdapter : 'Layer';

  describe(`${layerAdapterName}.`, () => {
    beforeEach(() => {
      document.documentElement.innerHTML = mapHtml;
    });

    afterEach(() => {
      // restore the original func after test
    });

    describe('#addLayer', () => {
      it('Fires a layer:preadd event after adapter received', async () => {
        const map = await buildWebMap({ target: 'map' });
        const spy = sinon.spy();
        map.emitter.on('layer:preadd', (adapter) => {
          // expect(adapter.layer).to.be.undefined;
          spy();
        });
        await map.addLayer(layerAdapter);
        expect(spy.called).to.be.ok;
      });

      it('Fires a layer:add event immediately if the map is ready', async () => {
        const map = await buildWebMap({ target: 'map' });
        const spy = sinon.spy();
        map.emitter.on('layer:add', spy);
        map.setView([0, 0], 0);
        await map.addLayer(layerAdapter);
        expect(spy.called).to.be.ok;
      });

      it('Start ordering from 1 level', async () => {
        const map = await buildWebMap({ target: 'map' });
        const layer = await map.addLayer(layerAdapter);
        expect(layer.options.order).to.be.eq(1);
      });

      it('Reserve layer order position immediately after function call', async () => {
        const map = await buildWebMap({ target: 'map' });
        map.addLayer(layerAdapter);
        map.addLayer(layerAdapter);
        const layer = await map.addLayer(layerAdapter);
        expect(layer.options.order).to.be.eq(3);
      });

      //-----------------------------------------------------------

      // it('fires a layeradd event when the map becomes ready', function() {
      //   let layer = layerSpy(),
      //     spy = sinon.spy();
      //   map.on('layeradd', spy);
      //   map.addLayer(layer);
      //   expect(spy.called).not.to.be.ok();
      //   map.setView([0, 0], 0);
      //   expect(spy.called).to.be.ok();
      // });

      // it('does not fire a layeradd event if the layer is removed before the map becomes ready', function() {
      //   let layer = layerSpy(),
      //     spy = sinon.spy();
      //   map.on('layeradd', spy);
      //   map.addLayer(layer);
      //   map.removeLayer(layer);
      //   map.setView([0, 0], 0);
      //   expect(spy.called).not.to.be.ok();
      // });

      // it('adds the layer before firing layeradd', function(done) {
      //   let layer = layerSpy();
      //   map.on('layeradd', function() {
      //     expect(map.hasLayer(layer)).to.be.ok();
      //     done();
      //   });
      //   map.setView([0, 0], 0);
      //   map.addLayer(layer);
      // });

      // it('throws if adding something which is not a layer', function() {
      //   let control = L.control.layers();
      //   expect(function() {
      //     map.addLayer(control);
      //   }).to.throwError();
      // });

      // describe('When the first layer is added to a map', function() {
      //   it('fires a zoomlevelschange event', function() {
      //     let spy = sinon.spy();
      //     map.on('zoomlevelschange', spy);
      //     expect(spy.called).not.to.be.ok();
      //     L.tileLayer('{z}{x}{y}', { minZoom: 0, maxZoom: 10 }).addTo(map);
      //     expect(spy.called).to.be.ok();
      //   });
      // });

      // describe('when a new layer with greater zoomlevel coverage than the current layer is added to a map', function() {
      //   it('fires a zoomlevelschange event', function() {
      //     let spy = sinon.spy();
      //     L.tileLayer('{z}{x}{y}', { minZoom: 0, maxZoom: 10 }).addTo(map);
      //     map.on('zoomlevelschange', spy);
      //     expect(spy.called).not.to.be.ok();
      //     L.tileLayer('{z}{x}{y}', { minZoom: 0, maxZoom: 15 }).addTo(map);
      //     expect(spy.called).to.be.ok();
      //   });
      // });

      // describe('when a new layer with the same or lower zoomlevel coverage as the current layer is added to a map', function() {
      //   it('fires no zoomlevelschange event', function() {
      //     let spy = sinon.spy();
      //     L.tileLayer('{z}{x}{y}', { minZoom: 0, maxZoom: 10 }).addTo(map);
      //     map.on('zoomlevelschange', spy);
      //     expect(spy.called).not.to.be.ok();
      //     L.tileLayer('{z}{x}{y}', { minZoom: 0, maxZoom: 10 }).addTo(map);
      //     expect(spy.called).not.to.be.ok();
      //     L.tileLayer('{z}{x}{y}', { minZoom: 0, maxZoom: 5 }).addTo(map);
      //     expect(spy.called).not.to.be.ok();
      //   });
      // });
    });

    describe('#removeLayer', () => {
      it('Fires a layer:preremove event before layer object is destroyed', async () => {
        const map = await buildWebMap({ target: 'map' });
        const spy = sinon.spy();
        const layer = await map.addLayer(layerAdapter, {});
        map.emitter.on('layer:preremove', (adapter) => {
          expect(adapter.options).to.be.ok;
          spy();
        });
        map.removeLayer(layer);
        expect(spy.called).to.be.ok;
      });
    });
  });
};
