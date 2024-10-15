import { BaseProperty } from '@nextgis/item';

import type { ItemBasePropertyOptions } from '../../../item/src/interfaces';
import type { NgwWebmapItem } from '../NgwWebmapItem';

type VAL = number;

export class WebmapLayerOpacityPropertyHandler<
  V extends VAL = VAL,
> extends BaseProperty<VAL, ItemBasePropertyOptions<VAL>, NgwWebmapItem> {
  getProperty(): number {
    const layer = this.item.layer;
    if (layer) {
      return layer &&
        layer.options &&
        layer.options.opacity !== undefined &&
        layer.options.opacity !== null
        ? layer.options.opacity
        : 1;
    }
    return 1;
  }

  update(value: V, options?: ItemBasePropertyOptions<VAL>): void {
    options = options || {};

    if (this.isGroup()) {
      this._value = this._prepareValue(value, options);
      const children = this.getChildren();
      for (const child of children) {
        const property = child.properties.property(this.name);
        if (property) {
          if (options.propagation) {
            property.set(value, options);
          } else {
            property.update(property.get(), options);
          }
        }
      }
    }
    const layer = this.item.layer;
    if (layer) {
      const parents = this.getParents();
      const coef = parents.reduce((s, x) => {
        const prop = x.properties.property(this.name);
        const multiplier = prop ? prop.getValue() : 1;
        return s * multiplier;
      }, 1);
      const val = value * coef;
      this.item.webMap.setLayerOpacity(layer, this._prepareValue(val));
    }
  }

  protected _prepareValue(
    value: number,
    options?: ItemBasePropertyOptions<VAL>,
  ): number {
    if (options && options.propagation && this.isGroup()) {
      return 1;
    }
    // value = Number(value);
    // return value < 0.1 ? 0.1 : value;
    return Number(value);
  }
}
