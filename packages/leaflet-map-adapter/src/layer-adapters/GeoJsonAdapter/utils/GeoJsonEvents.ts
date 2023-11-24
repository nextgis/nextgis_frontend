import { createMouseEvent } from '../../../utils/createMouseEvent';

import type { GeoJsonAdapter } from '../GeoJsonAdapter';
import type { OnLayerMouseOptions } from '@nextgis/webmap';
import type { Layer } from 'leaflet';
import type { LeafletEvent, LeafletMouseEvent } from 'leaflet';

export class GeoJsonEvents {
  private layer: GeoJsonAdapter;

  private _onclick?: (e: LeafletMouseEvent) => void;
  private _mouseout?: (e: LeafletMouseEvent) => void;
  private _mouseover?: (e: LeafletMouseEvent) => void;

  constructor(layer: GeoJsonAdapter) {
    this.layer = layer;
  }

  handleMouseEvents(layer: Layer) {
    const { onClick, onLayerClick, onMouseOut, onMouseOver } =
      this.layer.options;
    // TODO: remove backward compatibility for onLayerClick
    const onClick_ = onClick || onLayerClick;

    if (onClick_) {
      this._onclick = (e: LeafletMouseEvent) => {
        const selected = !!this.layer._getSelected(layer);
        onClick_({
          selected,
          ...this._createMouseEvent(e),
        });
      };
      layer.on('click', this._onclick, this);
    }
    if (onMouseOut) {
      this._mouseout = (e: LeafletMouseEvent) => {
        onMouseOut(this._createMouseEvent(e));
      };
      layer.on('mouseout', this._mouseout, this);
    }
    if (onMouseOver) {
      this._mouseover = (e: LeafletMouseEvent) => {
        onMouseOver(this._createMouseEvent(e));
      };
      layer.on('mouseover', this._mouseover, this);
    }
  }

  stopMouseEvents(layer: Layer) {
    if (this._mouseover) {
      layer.off('mouseover', this._mouseover, this);
    }
    if (this._mouseout) {
      layer.off('mouseout', this._mouseout, this);
    }
    if (this._onclick) {
      layer.off('click', this._onclick, this);
    }
  }

  private _createMouseEvent(source: LeafletEvent): OnLayerMouseOptions {
    return createMouseEvent({
      layer: this.layer,
      source: source as LeafletMouseEvent,
    });
  }
}
