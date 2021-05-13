import { MapControl } from '@nextgis/webmap';
import { Viewer } from 'cesium';

type M = Viewer;

export class MeasureControl implements MapControl {
  onAdd(map?: M): HTMLElement | undefined {
    return undefined;
  }
  onRemove(map?: M): void {
    //
  }
  remove?(): void {
    //
  }
}
