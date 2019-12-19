import { Geometry, GeoJsonProperties, Feature } from 'geojson';
import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators';
import { Store } from 'vuex';
import { FeatureItem } from '@nextgis/ngw-connector';
import NgwConnector, {
  ResourceStoreItem,
  FeatureLayerField
} from '@nextgis/ngw-connector';
import { Type } from '@nextgis/webmap';
import { LookupTables, ForeignResource, PatchOptions } from '../../interfaces';

type KeyName = string;

export abstract class ResourceStore<
  P extends GeoJsonProperties = GeoJsonProperties,
  G extends Geometry | null = Geometry
> extends VuexModule {
  keyname!: string;
  connector!: NgwConnector;
  resources: { [key in KeyName]?: number } = {};

  foreignResources: { [keyname: string]: ForeignResource } = {};

  lookupTableResourceGroupId?: number;
  lookupTables: LookupTables = {};

  resourceItem: ResourceStoreItem<P>[] = [];
  fields: FeatureLayerField[] = [];

  _promises: Record<string, Promise<any>> = {};

  events: {
    onNewItem?: (opt: PatchOptions<G, P>) => Promise<void>;
    onBeforeDelete?: (opt: { fid: number }) => void;
  } = {};

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
    if (this.resourceItem && this.resourceItem.length) {
      return this.resourceItem;
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
  async updateStore(opt: {
    item: FeatureItem<P>;
  }): Promise<ResourceStoreItem<P>[] | undefined> {
    await this.context.dispatch('getStore');
    const item = opt.item;
    if (item) {
      const storeItems = [...this.resourceItem];
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
          const promise = this.connector
            .getResourceByKeyname(keyname)
            .then(item => {
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
      const lookupTableResources = await this.connector.get(
        'resource.collection',
        null,
        {
          parent: this.lookupTableResourceGroupId
        }
      );

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
  async prepareGeomToNgw<
    G extends Geometry | null = Geometry,
    P = GeoJsonProperties
  >(opt: { item: Feature<G, P> }) {
    const { prepareGeomToNgw } = await import('../../utils/prepareGeomToNgw');
    return prepareGeomToNgw(opt.item);
  }

  @Action({ commit: '' })
  async prepareFeatureToNgw<
    G extends Geometry | null = Geometry,
    P = GeoJsonProperties
  >(opt: { item: Feature<G, P> }) {
    const geom = await this.context.dispatch('prepareGeomToNgw', opt);
    const featureFields = await this.fields;
    const fields: P = {} as P;
    featureFields.forEach(x => {
      // @ts-ignore
      const property = opt.item.properties[x.keyname];
      let value: any;
      if (property) {
        if (x.datatype === 'STRING') {
          value = String(property);
        } else if (x.datatype === 'BIGINT') {
          value = parseInt(property, 10);
        } else if (x.datatype === 'REAL') {
          value = parseFloat(property);
        } else if (x.datatype === 'DATE') {
          let dt: Date | undefined;
          if (typeof property === 'object') {
            value = property;
          } else {
            if (property instanceof Date) {
              dt = property;
            } else {
              const parse = Date.parse(property);
              if (parse) {
                dt = new Date(parse);
              }
            }
            if (dt) {
              value = {
                year: dt.getFullYear(),
                month: dt.getMonth(),
                day: dt.getDay()
              };
            }
          }
        }
      }
      // @ts-ignore
      fields[x.keyname] = value || null;
    });

    const feature: Partial<FeatureItem<P>> = {
      fields,
      geom
    };
    return feature;
  }

  @Action({ commit: '' })
  async patch(opt: PatchOptions<G, P>): Promise<FeatureItem<P> | undefined> {
    await this.context.dispatch('getResources');
    const id = this.resources[this.keyname];
    if (id) {
      const feature: Partial<FeatureItem<P>> = await this.context.dispatch(
        'prepareFeatureToNgw',
        opt
      );
      try {
        const { fid } = opt;
        if (fid) {
          feature.id = Number(fid);
        }
        const item = await this.connector.patch(
          'feature_layer.feature.collection',
          { data: [feature] },
          { id }
        );
        const newFeature = feature as FeatureItem<P>;
        const newItem = item && item[0];
        if (newItem) {
          newFeature.id = newItem.id;
          if (this.events.onNewItem) {
            await this.events.onNewItem({ ...opt, fid: newItem.id });
          }
        } else {
          throw new Error('Error on save');
        }
        await this.context.dispatch('updateStore', { item: newFeature });
        return newFeature;
      } catch (er) {
        throw new Error(er);
      }
    }
  }

  @Action({ commit: 'SET_STORE' })
  async delete(fid: number) {
    await this.context.dispatch('getResources');
    const id = this.resources[this.keyname];
    if (id) {
      try {
        if (this.events.onBeforeDelete) {
          await this.events.onBeforeDelete({ fid });
        }
        await this.connector.delete('feature_layer.feature.item', null, {
          id,
          fid
        });
        const store = [...this.resourceItem];
        const index = store.findIndex(x => Number(x.id) === fid);
        store.splice(index, 1);
        return store;
      } catch (er) {
        console.error(er);
      }
    }
    return this.resourceItem;
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
    this.resourceItem = store;
  }

  @Mutation
  private UPDATE_FIELDS(fields: FeatureLayerField[]) {
    this.fields = fields;
  }
}

export function createResourceStore<
  P extends GeoJsonProperties = GeoJsonProperties,
  G extends Geometry | null = Geometry
>(options: {
  connector: NgwConnector;
  keyname: string;
  store: Store<any>;
}): Type<ResourceStore<P, G>> {
  @Module({ dynamic: true, store: options.store, name: options.keyname })
  class RS extends ResourceStore<P, G> {
    get connector() {
      return options.connector;
    }
    keyname = options.keyname;
  }
  return RS;
}
