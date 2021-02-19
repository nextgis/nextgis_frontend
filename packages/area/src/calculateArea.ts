import { GeoJSON, Position } from 'geojson';
import { getCoordinates } from '@nextgis/utils';

// WGS84 params
const mSemiMajor = 6378137.0;
const mSemiMinor = 6356752.3142;

const mPI = 3.14159265358979323846;
const a2 = mSemiMajor * mSemiMajor;
// e2 = 1 - (a2 / (mSemiMinor * mSemiMinor)) - bad one from QGIS 2.x https://github.com/qgis/QGIS/commit/297dbe0786d30b7b05462c8dac49b51f13175a19
const e2 = 1 - (mSemiMinor * mSemiMinor) / a2;

const mTwoPI = mPI + mPI;

const e4 = e2 * e2;
const e6 = e4 * e2;

const mAE = a2 * (1 - e2);

const mQA = (2.0 / 3.0) * e2;
const mQB = (3.0 / 5.0) * e4;
const mQC = (4.0 / 7.0) * e6;

const mQbarA = -1.0 - (2.0 / 3.0) * e2 - (3.0 / 5.0) * e4 - (4.0 / 7.0) * e6;
const mQbarB = (2.0 / 9.0) * e2 + (2.0 / 5.0) * e4 + (4.0 / 7.0) * e6;
const mQbarC = -1 * (3.0 / 25.0) * e4 - (12.0 / 35.0) * e6;
const mQbarD = (4.0 / 49.0) * e6;

const mQp = getQ(mPI / 2);
let mE = 4 * mPI * mQp * mAE;
if (mE < 0.0) {
  mE = -mE;
}

function getQ(x: number): number {
  const sinx = Math.sin(x);
  const sinx2 = sinx * sinx;

  return sinx * (1 + sinx2 * (mQA + sinx2 * (mQB + sinx2 * mQC)));
}

function DEG2RAD(x: number): number {
  return (x * mPI) / 180;
}

function getQbar(x: number): number {
  const cosx = Math.cos(x);
  const cosx2 = cosx * cosx;

  return cosx * (mQbarA + cosx2 * (mQbarB + cosx2 * (mQbarC + cosx2 * mQbarD)));
}

/**
 * @returns Area in meters
 */
export function calculateArea(points: Position[]): number {
  const thresh = 1e-6;
  let area = 0.0;
  const last = points.length - 1;
  let x2 = DEG2RAD(points[last][0]);
  let y2 = DEG2RAD(points[last][1]);
  let Qbar2 = getQbar(y2);

  for (let i = 0; i < points.length; i++) {
    const pnt = points[i];
    let x1 = x2;
    const y1 = y2;
    const Qbar1 = Qbar2;

    x2 = DEG2RAD(pnt[0]);
    y2 = DEG2RAD(pnt[1]);
    Qbar2 = getQbar(y2);

    if (x1 > x2) {
      while (x1 - x2 > mPI) {
        x2 += mTwoPI;
      }
    } else if (x2 > x1) {
      while (x2 - x1 > mPI) {
        x1 += mTwoPI;
      }
    }

    const dx = x2 - x1;
    const dy = y2 - y1;
    if (Math.abs(dy) > thresh) {
      area = area + dx * (mQp - (Qbar2 - Qbar1) / dy);
    } else {
      area = area + dx * (mQp - getQ((y1 + y2) / 2.0));
    }
  }

  area = area * mAE;
  if (area < 0.0) {
    area = -area;
  }

  if (area > mE) {
    area = mE;
  }
  if (area > mE / 2) {
    area = mE - area;
  }

  return area;
}

/**
 * @returns Area in meters
 */
export function geojsonArea(geojson: GeoJSON): number {
  const points = getCoordinates(geojson);
  return calculateArea(points);
}
