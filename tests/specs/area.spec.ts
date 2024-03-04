import { expect } from 'chai';

import { geojsonArea } from '../../packages/area/src';

import type { Feature, Polygon } from 'geojson';

const AREA = 730215205638.4904;
// const PERIMETER = 4311624.9901016206;
const PERIMETER = 4311624.990101621;

const testGeojson: Feature<Polygon> = {
  type: 'Feature',
  properties: { AREA, PERIMETER },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [51.82, 63.8],
        [43.48, 55.62],
        [75.38, 59.13],
        [51.82, 63.8],
      ],
    ],
  },
};

describe(`Area`, () => {
  it(`calculate geojson`, () => {
    const area = geojsonArea(testGeojson);
    expect(area).to.eql(AREA);
  });
});
