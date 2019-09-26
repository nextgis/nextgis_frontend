import { VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { FeatureItem } from '@nextgis/ngw-connector';

import NgwConnector, { ResourceStoreItem, FeatureLayerField } from '@nextgis/ngw-connector';

import { LookupTables, ForeignResource } from './interfaces';
import { Type } from '@nextgis/webmap';
import { Geometry, GeoJsonProperties, Feature } from 'geojson';

type KeyName = string;

export abstract class ResourceStore<
  P extends GeoJsonProperties = GeoJsonProperties
> extends VuexModule {
  keyname!: string;
  connector!: NgwConnector;
  resources: { [key in KeyName]?: number } = {};

  foreignResources: { [keyname: string]: ForeignResource } = {};

  lookupTableResourceGroupId?: number;
  lookupTables: LookupTables = {};

  store: ResourceStoreItem<P>[] = [];
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
  async getStore(): Promise<ResourceStoreItem<P>[] | undefined> {
    await this.context.dispatch('getResources');
    if (this.store && this.store.length) {
      return this.store;
    }
    const id = this.resources[this.keyname];
    if (id) {
      const store = (await this.connector.get('feature_layer.store', null, {
        id
      })) as ResourceStoreItem<P>[];
      return store;
    }
  }

  @Action({ commit: 'SET_STORE' })
  async updateStore(opt: { item: FeatureItem<P> }): Promise<ResourceStoreItem<P>[] | undefined> {
    await this.context.dispatch('getStore');
    const item = opt.item;
    if (item) {
      const storeItems = [...this.store];
      const index = storeItems.findIndex(x => x.id === item.id);
      if (index !== -1) {
        const oldItem = storeItems[index];
        const newItem = { ...oldItem, ...item.fields };
        storeItems.splice(index, 1, newItem);
      } else {
        storeItems.push({ id: item.id, label: `#${item.id}`, ...item.fields });
      }
      return storeItems;
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

  @Action({ commit: '' })
  async prepareFeatureToNgw<G extends Geometry | null = Geometry, P = GeoJsonProperties>(opt: {
    item: Feature<G, P>;
  }) {
    // const { prepareGeomToNgw } = await import('?prepareGeomToNgw');
    // const geom = prepareGeomToNgw(opt.item)
    const feature: Partial<FeatureItem<P>> = {
      fields: opt.item.properties,
      geom: '' // WKT in EPSG:3857
    };
    return feature;
  }

  @Action({ commit: '' })
  async patch<G extends Geometry | null = Geometry>(opt: {
    item: Feature<G, P>;
    fid?: number;
  }): Promise<FeatureItem<P> | undefined> {
    await this.getResources();
    const id = this.resources[this.keyname];
    if (id) {
      // const { prepareGeomToNgw } = await import('../../../../plot/src/utils/prepareFeatureToNgw');
      const feature: Partial<FeatureItem<P>> = await this.context.dispatch('prepareFeatureToNgw');
      try {
        const { fid } = opt;
        if (fid) {
          feature.id = Number(fid);
        }
        const plot = await this.connector.patch(
          'feature_layer.feature.collection',
          { data: [feature] },
          { id }
        );
        const newFeature = feature as FeatureItem<P>;
        const newPlot = plot && plot[0];
        if (newPlot) {
          newFeature.id = newPlot.id;
        } else {
          throw new Error('Error on save');
        }
        this.updateStore({ item: newFeature });
        return newFeature;
      } catch (er) {
        throw new Error(er);
      }
    }
  }

  @Action({ commit: 'SET_STORE' })
  async delete(fid: number) {
    await this.getResources();
    const id = this.resources[this.keyname];
    if (id) {
      try {
        await this.connector.delete('feature_layer.feature.item', null, {
          id,
          fid
        });
        const store = [...this.store];
        const index = store.findIndex(x => Number(x.id) === fid);
        store.splice(index, 1);
        return store;
      } catch (er) {
        console.error(er);
      }
    }
    return this.store;
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
  private SET_STORE(store: ResourceStoreItem<P>[]) {
    this.store = store;
  }

  @Mutation
  private UPDATE_FIELDS(fields: FeatureLayerField[]) {
    this.fields = fields;
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
