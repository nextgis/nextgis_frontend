import { MvtAdapterOptions, PropertiesFilter, Operations } from '@nextgis/webmap';
import { VectorAdapter } from './VectorAdapter';
import { TLayer } from '../MapboxglMapAdapter';

import { typeAliasForFilter } from '../util/geom_type';

export const operationsAliases: { [key in Operations]: string } = {
  gt: '>',
  lt: '<',
  ge: '>=',
  le: '<=',
  eq: '==',
  ne: '!=',
  in: 'in',
  notin: '!in',
  // NOT SUPPORTED
  like: '==',
  // NOT SUPPORTED
  ilike: '=='
};

const reversOperations: { [key in Operations]: string } = {
  gt: operationsAliases.le,
  lt: operationsAliases.ge,
  ge: operationsAliases.lt,
  le: operationsAliases.gt,
  eq: operationsAliases.ne,
  ne: operationsAliases.eq,
  in: operationsAliases.notin,
  notin: operationsAliases.in,
  like: operationsAliases.ne,
  ilike: operationsAliases.ne
};

export class MvtAdapter extends VectorAdapter<MvtAdapterOptions> {
  select(properties: PropertiesFilter) {
    if (typeof properties !== 'function') {
      this._updateFilter(properties);
    }
    this.selected = true;
  }

  unselect() {
    this._updateFilter();
    this.selected = false;
  }

  async addLayer(options: MvtAdapterOptions): Promise<TLayer> {
    const layer = await super.addLayer(options);
    this._updateLayerPaint(this.options.type || 'fill');

    return layer;
  }

  protected _getAdditionalLayerOptions() {
    return {
      source: {
        type: 'vector',
        tiles: [this.options.url]
      },
      'source-layer': this.options.sourceLayer
    };
  }

  private _updateFilter(properties?: PropertiesFilter) {
    const layers = this.layer;
    if (layers) {
      this._types.forEach(t => {
        const geomType = typeAliasForFilter[t];
        if (geomType) {
          const geomFilter = ['==', '$type', geomType];
          const layerName = this._getLayerNameFromType(t);
          const selLayerName = this._getSelectionLayerNameFromType(t);
          if (layers.indexOf(selLayerName) !== -1) {
            if (this._selectionName) {
              const filters = properties
                ? this._createFilterDefinitions(properties, operationsAliases)
                : [];
              this.map.setFilter(selLayerName, ['all', geomFilter, ...filters]);
            }
          }
          if (layers.indexOf(layerName) !== -1) {
            const filters = properties
              ? this._createFilterDefinitions(properties, reversOperations)
              : [];
            this.map.setFilter(layerName, ['all', geomFilter, ...filters]);
          }
        }
      });
    }
  }

  private _createFilterDefinitions(
    filters: PropertiesFilter,
    _operationsAliases: { [key in Operations]: string }
  ) {
    return filters.map(x => {
      const [field, operation, value] = x;
      const operationAlias = _operationsAliases[operation];
      if (operation === 'in' || operation === 'notin') {
        return [operationAlias, field, ...value];
      }
      return [operationAlias, field, value];
    });
  }
}
