import { prepareQmsCatalogLayer } from './catalog';
import { QmsControlElement } from './QmsControl';
import { resolveQmsLayer } from './QmsService';

import type { QmsLayer } from './interfaces';
import type { QmsControlElementOptions, QmsControlItem } from './QmsControl';

export type QmsControlControllerOptions<L> = Omit<
  QmsControlElementOptions,
  'onSelect'
> & {
  initialLayer?: number | (() => L);
  onSelect?: (item: QmsControlItem) => Promise<L>;
};

export interface QmsControlLayerAdapter<M, L> {
  addLayer: (map: M, layer: L) => void;
  stopLayer?: (layer: L) => void;
  beforeAdd?: (map: M) => Promise<void>;
  removeLayer: (map: M, layer: L) => void;
  createLayer: (layer: QmsLayer) => L;
}

export class QmsControlController<M, L> {
  readonly control: QmsControlElement;

  private _activeItemKey?: string;
  private _activeLayer?: L;
  private _initialized = false;
  private _map?: M;
  private _selection = 0;
  private readonly _adapter: QmsControlLayerAdapter<M, L>;
  private readonly _initialLayer?: QmsControlControllerOptions<L>['initialLayer'];
  private readonly _onSelect?: QmsControlControllerOptions<L>['onSelect'];

  constructor(
    options: QmsControlControllerOptions<L>,
    adapter: QmsControlLayerAdapter<M, L>,
  ) {
    const { initialLayer, onSelect, ...controlOptions } = options;
    this.control = new QmsControlElement(controlOptions);
    this._adapter = adapter;
    this._initialLayer = initialLayer;
    this._onSelect = onSelect;
    this.control.onSelect = (item) => this._select(item);
  }

  setMap(map?: M): void {
    this._map = map;
    if (map && !this._initialized) {
      this._initialized = true;
      this._setInitialLayer(map);
    }
  }

  private async _select(item: QmsControlItem): Promise<void> {
    const map = this._map;
    if (!map) {
      return;
    }
    const itemKey = `${item.source}:${item.service.id}`;
    if (itemKey === this._activeItemKey) {
      return;
    }
    if (this._activeLayer) {
      this._adapter.stopLayer?.(this._activeLayer);
    }
    const selection = ++this._selection;
    const layer = this._onSelect
      ? await this._onSelect(item)
      : this._adapter.createLayer(
          item.source === 'qms'
            ? await resolveQmsLayer(item.service.id)
            : prepareQmsCatalogLayer(item.service),
        );
    if (selection !== this._selection) {
      return;
    }
    if (this._activeLayer) {
      this._adapter.removeLayer(map, this._activeLayer);
    }
    if (!this._onSelect) {
      await this._adapter.beforeAdd?.(map);
      if (selection !== this._selection) {
        return;
      }
      this._adapter.addLayer(map, layer);
    }
    this._activeLayer = layer;
    this._activeItemKey = itemKey;
  }

  private async _setInitialLayer(map: M): Promise<void> {
    if (this._initialLayer === undefined) {
      return;
    }
    const selection = ++this._selection;
    const layer =
      typeof this._initialLayer === 'number'
        ? this._adapter.createLayer(await resolveQmsLayer(this._initialLayer))
        : await this._initialLayer();
    if (selection !== this._selection) {
      return;
    }
    if (typeof this._initialLayer === 'number') {
      await this._adapter.beforeAdd?.(map);
      if (selection !== this._selection) {
        return;
      }
      this._adapter.addLayer(map, layer);
      this._activeItemKey = `qms:${this._initialLayer}`;
    }
    this._activeLayer = layer;
  }
}
