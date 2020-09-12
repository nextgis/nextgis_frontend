import { Store } from 'vuex';
import { Geometry, GeoJsonProperties, Feature } from 'geojson';
import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators';
import { prepareFieldsToNgw, FEATURE_REQUEST_PARAMS } from '@nextgis/ngw-kit';
import NgwConnector, {
  ResourceStoreItem,
  FeatureLayerField,
  FeatureItem,
} from '@nextgis/ngw-connector';
import { Type } from '@nextgis/webmap';
import { LookupTables, ForeignResource, PatchOptions } from '../../interfaces';

type ResourceDef = string | number;

export abstract class ResourceStore<
  P extends GeoJsonProperties = GeoJsonProperties,
  G extends Geometry | null = Geometry
> extends VuexModule {
  resource!: string;

  resources: { [key in ResourceDef]?: number } = {};

  foreignResources: { [key in ResourceDef]: ForeignResource } = {};

  lookupTableResourceGroupId?: number | string;
  lookupTables: LookupTables = {};

  resourceItem: ResourceStoreItem<P>[] = [];
  fields: FeatureLayerField[] = [];

  get connector(): NgwConnector {
    return this._connector;
  }
  set connector(val: NgwConnector) {
    this._connector = val;
  }

  _promises: Record<string, Promise<any>> = {};

  hooks: {
    onNewItem?: (opt: PatchOptions<G, P>) => Promise<void>;
    onBeforeDelete?: (opt: { fid: number }) => Promise<void>;
    onBeforePatch?: (
      data: Partial<FeatureItem<P, Geometry>>[],
      opt: { id: number }
    ) => Promise<void>;
    delete?: (resourceId: number, featureId: number) => Promise<void>;
  } = {};
  private _connector!: NgwConnector;

  @Action({ commit: 'UPDATE_FIELDS' })
  async getFields(): Promise<FeatureLayerField[] | undefined> {
    if (this.fields.length) {
      return this.fields;
    }
    await this.context.dispatch('getResources');
    const id = this.resources[this.resource];
    if (id) {
      try {
        const item = await this.connector.getResource(id);
        if (item) {
          await this.context.dispatch('loadLookupTables');
          return item.feature_layer ? item.feature_layer.fields : [];
        }
      } catch (er) {
        //
      }
      return [];
    }
  }

  @Action({ commit: 'SET_STORE' })
  async getStore(): Promise<ResourceStoreItem<P>[] | undefined> {
    await this.context.dispatch('getResources');
    if (this.resourceItem && this.resourceItem.length) {
      return this.resourceItem;
    }
    const id = this.resources[this.resource];
    if (id) {
      const store = (await this.connector.get('feature_layer.store', null, {
        id,
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
      const index = storeItems.findIndex((x) => x.id === item.id);
      if (index !== -1) {
        const oldItem = storeItems[index];
        const newItem = { ...oldItem, ...item.fields };
        storeItems.splice(index, 1, newItem);
      } else {
        storeItems.push({
          id: item.id,
          label: `#${item.id}`,
          ...item.fields,
        });
      }
      return storeItems;
    }
  }

  @Action({ commit: 'UPDATE_RESOURCES' })
  async getResources(): Promise<Record<ResourceDef, number>> {
    const promises: Array<Promise<any>> = [];
    const resourceDefs = [this.resource, ...Object.keys(this.foreignResources)];
    if (!this._promises.getResources) {
      resourceDefs.forEach((resourceDef) => {
        if (!(resourceDef in this.resources)) {
          const promise = this.connector
            .getResource(resourceDef)
            .then((item) => {
              if (item) {
                this.resources[resourceDef] = item.resource.id;
              }
            });
          promises.push(promise);
        }
      });
      this._promises.getResources = Promise.all(promises);
    }
    await this._promises.getResources;
    delete this._promises.getResources;
    return this.resources as Record<ResourceDef, number>;
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
          parent: this.lookupTableResourceGroupId,
        }
      );

      lookupTableResources.forEach((x) => {
        const lookupTable = x.lookup_table;
        if (lookupTable) {
          const keyName = x.resource.keyname;
          if (keyName) {
            const fieldName = keyName.replace(/^lt_/, '');
            lookupTables[fieldName] = lookupTable.items;
          }
        }
      });
    }
    return lookupTables;
  }

  @Action({ commit: '' })
  async prepareFeatureToNgw<
    G extends Geometry | null = Geometry,
    P = GeoJsonProperties
  >(opt: { item: Feature<G, P> }): Promise<Partial<FeatureItem<P>>> {
    const geom = opt.item.geometry as Geometry;
    const featureFields = (await this.context.dispatch(
      'getFields'
    )) as FeatureLayerField[];
    const fields = prepareFieldsToNgw(opt.item.properties, featureFields);
    return {
      fields,
      geom,
    };
  }

  @Action({ commit: '' })
  async patch(opt: PatchOptions<G, P>): Promise<FeatureItem<P> | undefined> {
    await this.context.dispatch('getResources');
    const id = this.resources[this.resource];
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
        const data = [feature];
        if (this.hooks.onBeforePatch) {
          await this.hooks.onBeforePatch(data, { id });
        }
        const item = await this.connector.patch(
          'feature_layer.feature.collection',
          { data },
          { id, ...FEATURE_REQUEST_PARAMS }
        );
        const newFeature = feature as FeatureItem<P>;
        const newItem = item && item[0];
        if (newItem) {
          newFeature.id = newItem.id;
          if (this.hooks.onNewItem) {
            await this.hooks.onNewItem({ ...opt, fid: newItem.id });
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
  async delete(fid: number): Promise<ResourceStoreItem<P>[]> {
    await this.context.dispatch('getResources');
    const resourceId = this.resources[this.resource];
    if (resourceId) {
      try {
        if (this.hooks.onBeforeDelete) {
          await this.hooks.onBeforeDelete({ fid });
        }
        if (this.hooks.delete) {
          await this.hooks.delete(resourceId, fid);
        } else {
          await this.connector.delete('feature_layer.feature.item', null, {
            id: resourceId,
            fid,
          });
        }
        const store = [...this.resourceItem];
        const index = store.findIndex((x) => Number(x.id) === fid);
        store.splice(index, 1);
        return store;
      } catch (er) {
        console.error(er);
      }
    }
    return this.resourceItem;
  }

  @Mutation
  protected UPDATE_LOOKUP_TABLES(lookupTables: LookupTables): void {
    this.lookupTables = lookupTables;
  }

  @Mutation
  protected UPDATE_RESOURCES(resources?: Record<ResourceDef, number>): void {
    this.resources = { ...this.resources, ...resources };
  }

  @Mutation
  protected SET_STORE(store: ResourceStoreItem<P>[]): void {
    this.resourceItem = store;
  }

  @Mutation
  protected UPDATE_FIELDS(fields: FeatureLayerField[]): void {
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
    resource = options.keyname;
  }
  return RS;
}
