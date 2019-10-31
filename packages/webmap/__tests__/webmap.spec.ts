const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../../../tests/index.html'), 'utf8');

import { WebMap, AppOptions } from '../src';

import { LeafletMapAdapter as MapAdapter } from '../../leaflet-map-adapter/src/LeafletMapAdapter';

jest.dontMock('fs');

const adapterName = 'LeafletMapAdapter';
const createWebMap = (options?: AppOptions) => {
  return new WebMap({ mapAdapter: new MapAdapter(), ...options });
};

describe('Initialize WebMap', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  afterEach(() => {
    // restore the original func after test
    jest.resetModules();
  });

  it(`Apply adapter ${adapterName}`, () => {
    const mapAdapter = new MapAdapter();
    const webMap = new WebMap({ mapAdapter });
    expect(webMap.mapAdapter).toBe(mapAdapter);
  });

  it('Manual create', () => {
    const webMap = createWebMap();
    const spy = new Promise(resolve => {
      webMap.emitter.on('create', () => {
        resolve();
      });
    });
    webMap.create();
    spy.then(() => {
      expect(document.getElementById('map1')).toBeTruthy();
    });
  });
});
