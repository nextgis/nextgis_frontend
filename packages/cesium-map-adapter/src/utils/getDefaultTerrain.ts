import { EllipsoidTerrainProvider } from 'cesium';

export function getDefaultTerrain(): EllipsoidTerrainProvider {
  return new EllipsoidTerrainProvider();
}
