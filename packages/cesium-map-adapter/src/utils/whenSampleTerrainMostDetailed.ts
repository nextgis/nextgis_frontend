import { EllipsoidTerrainProvider, sampleTerrainMostDetailed } from 'cesium';

import type { Cartographic, TerrainProvider } from 'cesium';

export function whenSampleTerrainMostDetailed(
  terrainProvider: TerrainProvider,
  positions: Cartographic[],
  callback: (e: any) => void,
): void {
  if (terrainProvider instanceof EllipsoidTerrainProvider) {
    positions.forEach((x) => (x.height = 0));
    callback(positions);
  } else {
    sampleTerrainMostDetailed(terrainProvider, positions).then(callback);
  }
}
