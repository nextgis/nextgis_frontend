import type { AdapterOptions, MainLayerAdapter } from '@nextgis/webmap';
import type { Map } from 'leaflet';

export class BaseAdapter<
  O extends AdapterOptions = AdapterOptions,
  L = any,
> implements MainLayerAdapter<Map, L, O> {
  layer?: L;
  protected pane = 'order-0';

  constructor(
    public map: Map,
    public options: O,
  ) {
    if (options.order !== undefined) {
      const order = options.order;
      const pane = 'order-' + order;
      let exist = map.getPane(pane);
      if (!exist) {
        exist = map.createPane(pane);

        const nextPane = Object.entries(map.getPanes())
          .filter(([name]) => name.startsWith('order-'))
          .map(([name, element]) => ({
            element,
            order: Number(name.slice('order-'.length)),
          }))
          .filter((candidate) => candidate.order > order)
          .sort((a, b) => a.order - b.order)[0]?.element;

        if (nextPane) {
          exist.parentElement?.insertBefore(exist, nextPane);
        }
      }
      exist.style.zIndex = String(Math.round(order * 100));
      this.pane = pane;
    }
  }

  addLayer(options: O): L | Promise<L> | undefined {
    Object.assign(this.options, options);
    return undefined;
  }
}
