import { BoundingSphere, defined, Entity, SceneMode, Viewer } from 'cesium';

const boundingSphereScratch = new BoundingSphere();

export function getEntitiesBoundingSphere(
  viewer: Viewer,
  entities: Entity[],
): BoundingSphere | undefined {
  if (!defined(entities) || viewer.scene.mode === SceneMode.MORPHING) {
    return;
  }

  const boundingSpheres = [];
  for (let i = 0, len = entities.length; i < len; i++) {
    // @ts-ignore
    const state = viewer._dataSourceDisplay.getBoundingSphere(
      entities[i],
      false,
      boundingSphereScratch,
    );
    if (state !== 0) {
      return;
    } else if (state === 0) {
      boundingSpheres.push(BoundingSphere.clone(boundingSphereScratch));
    }
  }

  return BoundingSphere.fromBoundingSpheres(boundingSpheres);
}
