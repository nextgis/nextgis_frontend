import type { AdapterOptions, MainLayerAdapter } from '@nextgis/webmap';
import type Map from 'ol/Map';
import type Base from 'ol/layer/Base';

export class BaseAdapter<L extends Base = Base>
  implements Partial<MainLayerAdapter>
{
  layer?: L;

  constructor(
    public map: Map,
    public options: AdapterOptions,
  ) {}

  setOpacity(val: number): void {
    this.options.opacity = Number(val);
    if (this.layer && this.layer.setOpacity) {
      this.layer.setOpacity(this.options.opacity);
    }
  }
}
