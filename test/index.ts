import { expect } from 'chai';
import { WebMap } from '../packages/webmap/src/WebMap';
import { LeafletMapAdapter } from '../packages/leaflet-map-adapter/src/LeafletMapAdapter';

describe('Hello', () => {
  it('Renders header', () => {
    const webMap = new WebMap({ mapAdapter: new LeafletMapAdapter() });
    expect(1).to.eq(1);
  });
});

// const testsContext = require.context('.', true, /\.spec.ts$/);
// testsContext.keys().forEach(testsContext);

// // add all ts files to include non referenced files in report
// const srcContext = require.context('../src', true, /^\.\/(?!app(\.ts)?$)/);
// srcContext.keys().forEach(srcContext);
