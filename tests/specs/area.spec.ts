import { expect } from 'chai';
import { Feature, Polygon } from 'geojson';
import { geojsonArea } from '../../packages/area/src';

// const AREA = 725502762643.03308;
const AREA = 730215205638.4752;
const PERIMETER = 4311624.9901016206;

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
