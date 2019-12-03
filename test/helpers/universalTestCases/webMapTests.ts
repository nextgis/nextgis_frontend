import { expect } from 'chai';
import { mapHtml } from '../mapHtml';
import {
  MapAdapter,
  AppOptions,
  Type,
  MapOptions
} from '../../../packages/webmap/src';
import { WebMap } from '../../../packages/webmap/src/WebMap';
import { baseMapTests, MapAdapterCreateOptions } from './baseMapTests';
import sinon from 'sinon';
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

    it('returns undefined if map not initialized but layers added', async () => {
      const map = await _buildWebMap({}, undefined, { noCreate: true });
      map.addLayer('TILE', { url: 'file:///dev/null' });
      expect(map.getZoom()).to.be.undefined;
    });

    describe('#addLayer', () => {
      it('Fires a layer:preadd event immediately', async () => {
        const map = await _buildWebMap({}, undefined, { noCreate: true });
        const spy = sinon.spy();
        map.emitter.on('layer:preadd', spy);
        map.addLayer(FakeLayerAdapter, {});
        expect(spy.called).to.be.ok;
      });

      it('Fires a layer:add event immediately if the map is ready', async () => {
        const map = await _buildWebMap({ target: 'map' });
        const spy = sinon.spy();
        map.emitter.on('layer:add', spy);
        map.setView([0, 0], 0);
        await map.addLayer(FakeLayerAdapter, {});
        expect(spy.called).to.be.ok;
      });

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
  });
};
