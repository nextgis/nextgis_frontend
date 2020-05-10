import { EllipsoidTerrainProvider } from 'cesium';

export function getDefaultTerrain() {
  return new EllipsoidTerrainProvider();
}
