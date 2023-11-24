import Cache from '@nextgis/cache';
import CancelablePromise from '@nextgis/cancelable-promise';
import {
  FEATURE_REQUEST_PARAMS,
  parseDate,
  prepareFieldsToNgw,
} from '@nextgis/ngw-kit';
import { defined } from '@nextgis/utils';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import type { ForeignResource, PatchOptions } from '../../interfaces';
import type NgwConnector from '@nextgis/ngw-connector';
import type {
  FeatureItem,
  FeatureLayerField,
  ResourceStoreItem,
  VectorFieldDatatype,
} from '@nextgis/ngw-connector';
import type { FeatureProperties } from '@nextgis/utils';
import type { Type } from '@nextgis/utils';
import type { Feature, Geometry } from 'geojson';
import type { Store } from 'vuex';

type ResourceDef = string | number;

function featureItemToStoreItem<
  P extends FeatureProperties = FeatureProperties,
>(featureItem: FeatureItem<P>): ResourceStoreItem<P> {
  return {
    id: featureItem.id,
    label: `#${featureItem.id}`,
    ...featureItem.fields,
  };
}

export abstract class ResourceStore<
  P extends FeatureProperties = FeatureProperties,
  G extends Geometry | null = Geometry,
> extends VuexModule {
  resource!: string;

  resources: { [key in ResourceDef]?: number } = {};

  /**
   * @deprecated not used
   */
  foreignResources: { [key in ResourceDef]: ForeignResource } = {};

  resourceItems: ResourceStoreItem<P>[] = [];
  fields: FeatureLayerField[] = [];

  _promises: Record<string, Promise<any>> = {};

  formatters: {
    date?: (date: string) => string;
    datetime?: (date: string) => string;
  } = {};

  hooks: {
    onNewItem?: (opt: PatchOptions<G, P>) => Promise<void>;
    onBeforeDelete?: (opt: { fid: number }) => Promise<void>;
    onBeforePatch?: (
      data: Partial<FeatureItem<P, Geometry>>[],
      opt: { id: number },
    ) => Promise<void>;
    delete?: (resourceId: number, featureId: number) => Promise<void>;
  } = {};
  private _connector!: NgwConnector;

  get connector(): NgwConnector {
    return this._connector;
  }
  set connector(val: NgwConnector) {
    this._connector = val;
  }

  @Action({ commit: 'UPDATE_FIELDS' })
  async getFields(): Promise<FeatureLayerField[] | undefined> {
    if (this.fields.length) {
      return this.fields;
    }
    await this.context.dispatch('getResources');
    const id = this.resources[this.resource];
    if (defined(id)) {
      try {
        const item = await this.connector.getResource(id);
        if (item) {
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
    if (this.resourceItems && this.resourceItems.length) {
      return this.resourceItems;
    }
    const id = this.resources[this.resource];
    if (defined(id)) {
      const store = (await this.connector.get(
        'feature_layer.feature.collection',
        { params: { id } },
      )) as FeatureItem<P>[];
      return store.map(featureItemToStoreItem);
    }
  }

  @Action({ commit: 'SET_STORE' })
  async updateStore(opt: {
    item: FeatureItem<P>;
  }): Promise<ResourceStoreItem<P>[] | undefined> {
    await this.context.dispatch('getStore');
    const item = opt.item;
    if (item) {
      const storeItems = [...this.resourceItems];
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
    const resourceDefs = [this.resource]; // ...Object.keys(this.foreignResources)
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

  @Action({ commit: '' })
  async prepareFeatureToNgw<
    G extends Geometry | null = Geometry,
    P extends FeatureProperties = FeatureProperties,
  >(opt: { item: Feature<G, P> }): Promise<Partial<FeatureItem<P>>> {
    const geom = opt.item.geometry as Geometry;
    const featureFields = (await this.context.dispatch(
      'getFields',
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
    if (defined(id)) {
      const feature: Partial<FeatureItem<P>> = await this.context.dispatch(
        'prepareFeatureToNgw',
        opt,
      );

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
        { id, ...FEATURE_REQUEST_PARAMS },
      );

      // Clean cache on update
      const cache = new Cache<any, { params: { id: number; fid: number } }>();
      for (const item of cache.all()) {
        if (item.key === 'feature_layer.feature.item') {
          const params = item.props && item.props.params;
          if (params && params.id === id && params.fid === fid) {
            item.value = CancelablePromise.resolve(item);
          }
        }
      }

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
        const store = [...this.resourceItems];
        const index = store.findIndex((x) => Number(x.id) === fid);
        store.splice(index, 1);
        return store;
      } catch (er) {
        console.error(er);
      }
    }
    return this.resourceItems;
  }

  @Mutation
  protected UPDATE_RESOURCES(resources?: Record<ResourceDef, number>): void {
    this.resources = { ...this.resources, ...resources };
  }

  @Mutation
  protected SET_STORE(store: ResourceStoreItem<P>[]): void {
    let prepared = store;
    const dateFields: VectorFieldDatatype[] = ['DATE', 'DATETIME'];
    const datefields = this.fields.filter((x) =>
      dateFields.includes(x.datatype),
    );
    if (datefields.length) {
      prepared = store.map((x) => {
        for (const k in x) {
          const dateField = datefields.find((d) => d.keyname === k);
          const val = x[k] as string;
          if (dateField && val) {
            let date = parseDate(val);
            if (date) {
              if (dateField.datatype === 'DATE' && this.formatters.date) {
                date = this.formatters.date(date);
              } else if (
                dateField.datatype === 'DATETIME' &&
                this.formatters.datetime
              ) {
                date = this.formatters.datetime(date);
              }
              (x as any)[k] = date;
            }
          }
        }
        return x;
      });
    }
    this.resourceItems = prepared;
  }

  @Mutation
  protected UPDATE_FIELDS(fields: FeatureLayerField[]): void {
    this.fields = fields;
  }
}

export function createResourceStore<
  P extends FeatureProperties = FeatureProperties,
  G extends Geometry | null = Geometry,
>(options: {
  connector: NgwConnector;
  keyname: string;
  store: Store<any>;
}): Type<ResourceStore<P, G>> {
  @Module({ dynamic: true, store: options.store, name: options.keyname })
  class RS extends ResourceStore<P, G> {
    resource = options.keyname;
    get connector() {
      return options.connector;
    }
  }
  return RS;
}
