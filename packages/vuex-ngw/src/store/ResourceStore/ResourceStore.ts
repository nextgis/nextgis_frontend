import { VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { FeatureItem } from '@nextgis/ngw-connector';

import NgwConnector, { ResourceStoreItem, FeatureLayerField } from '@nextgis/ngw-connector';

import { LookupTables, ForeignResource } from './interfaces';
import { Type } from '@nextgis/webmap';

type KeyName = string;

export class ResourceStore extends VuexModule {
  keyname!: string;
  connector!: NgwConnector;
  resources: { [key in KeyName]?: number } = {};

  foreignResources: { [keyname: string]: ForeignResource } = {};

  turnPointToPlotForeignField = 'plotid';
  turnPointIdField = 'idpnt';

  lookupTableResourceGroupId?: number;
  lookupTables: LookupTables = {};

  store: ResourceStoreItem[] = [];
  fields: FeatureLayerField[] = [];

  _promises: Record<string, Promise<any>> = {};

  @Action({ commit: 'UPDATE_FIELDS' })
  async getFields() {
    if (this.fields.length) {
      return this.fields;
    }
    await this.context.dispatch('getResources');
    const id = this.resources[this.keyname];
    if (id) {
      try {
        const item = await this.connector.get('resource.item', null, { id });
        await this.context.dispatch('loadLookupTables');
        return item.feature_layer ? item.feature_layer.fields : [];
      } catch (er) {
        return [];
      }
    }
  }

  @Action({ commit: 'SET_STORE' })
  async getStore(): Promise<ResourceStoreItem[] | undefined> {
    await this.context.dispatch('getResources');
    const id = this.resources[this.keyname];
    if (id) {
      const store = await this.connector.get('feature_layer.store', null, {
        id
      });
      return store;
    }
  }

  @Action({ commit: 'UPDATE_RESOURCES' })
  async getResources(): Promise<Record<KeyName, number>> {
    const promises: Array<Promise<any>> = [];
    const keyNames = [this.keyname, ...Object.keys(this.foreignResources)];
    if (!this._promises.getResources) {
      keyNames.forEach(keyname => {
        if (!(keyname in this.resources)) {
          const promise = this.connector.get('resource.search', null, { keyname }).then(x => {
            const item = x[0];
            if (item) {
              this.resources[keyname] = item.resource.id;
            }
          });
          promises.push(promise);
        }
      });
      this._promises.getResources = Promise.all(promises);
    }
    await this._promises.getResources;
    delete this._promises.getResources;
    return this.resources as Record<KeyName, number>;
  }

  @Action({ commit: 'UPDATE_LOOKUP_TABLES' })
  async loadLookupTables(): Promise<LookupTables> {
    const lookupTables: { [field: string]: Record<string, string> } = {};
    if (this.lookupTableResourceGroupId) {
      if (Object.keys(this.lookupTables).length) {
        return this.lookupTables;
      }
      const lookupTableResources = await this.connector.get('resource.collection', null, {
        parent: this.lookupTableResourceGroupId
      });

      lookupTableResources.forEach(x => {
        const lookupTable = x.lookup_table;
        if (lookupTable) {
          const keyName = x.resource.keyname;
          const fieldName = keyName.replace(/^lt_/, '');
          lookupTables[fieldName] = lookupTable.items;
        }
      });
    }
    return lookupTables;
  }

  @Mutation
  private UPDATE_LOOKUP_TABLES(lookupTables: LookupTables) {
    this.lookupTables = lookupTables;
  }

  @Mutation
  private UPDATE_RESOURCES(resources?: Record<KeyName, number>) {
    this.resources = { ...this.resources, ...resources };
  }

  @Mutation
  private SET_STORE(plotsStore: ResourceStoreItem[]) {
    this.store = plotsStore;
  }

  @Mutation
  private UPDATE_STORE(item?: FeatureItem) {
    if (item) {
      const storeItems = [...this.store];
      const index = storeItems.findIndex(x => x.id === item.id);
      if (index !== -1) {
        const oldPlot = storeItems[index];
        const newPlot = { ...oldPlot, ...item.fields };
        storeItems.splice(index, 1, newPlot);
      } else {
        storeItems.push({ id: item.id, label: `#${item.id}`, ...item.fields });
      }
      this.store = storeItems;
    }
  }

  @Mutation
  private UPDATE_FIELDS(plotsFields: FeatureLayerField[]) {
    this.fields = plotsFields;
  }
}

export function createResourceStore(options: {
  connector: NgwConnector;
  keyname: string;
}): Type<ResourceStore> {
  class RS extends ResourceStore {
    get connector() {
      return options.connector;
    }
    keyname = options.keyname;
  }
  return RS;
}
