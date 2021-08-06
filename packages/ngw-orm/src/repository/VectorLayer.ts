import {
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
  GeoJsonTypes,
  Feature,
} from 'geojson';
import { FilterOptions } from '@nextgis/webmap';
import { PropertiesFilter } from '@nextgis/properties-filter';
import { DeepPartial } from '@nextgis/utils';
import {
  GetNgwItemsOptions,
  fetchNgwLayerItems,
  fetchNgwLayerItem,
} from '@nextgis/ngw-kit';
import {
  GeometryType,
  VectorLayerResourceItem,
  FeatureLayerField,
} from '@nextgis/ngw-connector';
// import { ResourceItem } from '@nextgis/ngw-connector';
// import { objectAssign } from '@nextgis/utils';
// import NgwConnector from '@nextgis/ngw-connector';
// import { ObjectType } from '../common/ObjectType';
// import { DeepPartial } from '../common/DeepPartial';
// import { UpdateOptions } from './UpdateOptions';
// import { FindConditions } from '../find-options/FindConditions';
// import { FindManyOptions } from '../find-options/FindManyOptions';
// import { FindOneOptions } from '../find-options/FindOneOptions';
import { getMetadataArgsStorage, Column } from '..';
import { VectorResourceSyncItem } from '../sync-items/VectorResourceSyncItem';
import { FindOneOptions } from '../find-options/FindOneOptions';
import { FindConditions } from '../find-options/FindConditions';
import { CannotExecuteNotConnectedError } from '../error/CannotExecuteNotConnectedError';
import { FindManyOptions } from '../find-options/FindManyOptions';
import {
  itemsToEntities,
  itemToEntity,
} from '../vector-layer-utils/itemsToEntities';
import { saveVectorLayer } from '../vector-layer-utils/saveVectorLayer';
import { ObjectType } from '../common/ObjectType';
import { BaseResource } from './BaseResource';
import { SyncOptions } from './SyncOptions';
import { UpdateOptions } from './UpdateOptions';
import { toTypescript } from '../vector-layer-utils/toTypescript';
import {
  ToTypescript,
  ToTypescriptOptions,
} from '../options/ToTypescriptOptions';
import { ValidateErrorType } from '../types/ValidateErrorType';
import { VectorResourceUpdateItem } from '../sync-items/VectorResourceUpdateItem';
// import { SyncOptions } from './SyncOptions';
// import { Connection } from '../connection/Connection';
// import { ConnectionOptions } from '../connection/ConnectionOptions';
// import { getMetadataArgsStorage } from '..';
// import { VectorLayerMetadataArgs } from '../metadata-args/VectorLayerMetadataArgs';

// type QueryDeepPartialEntity<T> = DeepPartial<T>;
// type InsertResult = any;
// type DeleteResult = any;
// type UpdateResult = any;

type Geometry =
  | Point
  | MultiPoint
  | LineString
  | MultiLineString
  | Polygon
  | MultiPolygon;

export class VectorLayer<G extends Geometry = Geometry> extends BaseResource {
  static geometryType: GeometryType;
  id?: number;
  private _geom!: G;

  get coordinates(): G['coordinates'] {
    return this.geom.coordinates;
  }

  set coordinates(coordinates: G['coordinates']) {
    const constructor = this.getConstructor();
    const aliases: Record<GeometryType, GeoJsonTypes> = {
      POINT: 'Point',
      MULTIPOINT: 'MultiPoint',
      LINESTRING: 'LineString',
      MULTILINESTRING: 'MultiLineString',
      POLYGON: 'Polygon',
      MULTIPOLYGON: 'MultiPolygon',
      POINTZ: 'Point',
      MULTIPOINTZ: 'MultiPoint',
      LINESTRINGZ: 'LineString',
      MULTILINESTRINGZ: 'MultiLineString',
      POLYGONZ: 'Polygon',
      MULTIPOLYGONZ: 'MultiPolygon',
    };
    const type: GeoJsonTypes = aliases[constructor.geometryType];
    const geom = { type, coordinates } as G;
    this._geom = geom;
  }

  get geom(): G {
    return this._geom;
  }

  set geom(geom: G) {
    this._geom = geom;
  }

  static toTypescript(opt?: ToTypescriptOptions): ToTypescript {
    return toTypescript(this, opt);
  }

  static receive(item: VectorLayerResourceItem): typeof VectorLayer {
    const ReceivedResource = BaseResource.receive(
      item,
      this,
    ) as typeof VectorLayer;
    ReceivedResource.geometryType = item.vector_layer.geometry_type;
    item.feature_layer.fields.forEach((x) => {
      const prop = Object.defineProperty(
        ReceivedResource.prototype,
        x.keyname,
        {
          enumerable: true,
          writable: true,
        },
      );
      const column = Column({
        ...x,
      });
      column(prop, x.keyname);
    });

    return ReceivedResource;
  }

  static validate(): ValidateErrorType[] {
    const fields = getMetadataArgsStorage().filterColumns(this);
    const resource = this.item && this.item?.resource;
    const itemFields =
      this.item && this.item.feature_layer && this.item.feature_layer.fields;
    if (!itemFields || !resource) {
      return [{ type: 'resource', message: 'Resource not connected' }];
    }
    const errors: ValidateErrorType[] = [];
    fields.forEach((x) => {
      const exist = itemFields.find((y) => y.keyname === x.propertyName);
      if (!exist) {
        errors.push({
          type: 'field-not-exist',
          message: `resource #${resource.id} does not contain field ${x.propertyName}:${x.options.datatype}`,
          context: [x.propertyName],
        });
      } else {
        if (x.options.datatype !== exist.datatype) {
          errors.push({
            type: 'field-type-not-match',
            message: `resource #${resource.id} type for field ${x.propertyName} does not match model ${exist.datatype} !== ${x.options.datatype}`,
            context: [
              x.propertyName,
              exist.datatype,
              String(x.options.datatype),
            ],
          });
        }
      }
    });
    return errors;
  }

  static getNgwPayload(
    resource: typeof VectorLayer,
    parent: number,
    options: SyncOptions,
  ):
    | DeepPartial<VectorResourceSyncItem | VectorResourceUpdateItem>
    | undefined {
    const metaFields = getMetadataArgsStorage().filterColumns(resource);
    const item = resource.item;
    const existFields = item && item.feature_layer && item.feature_layer.fields;
    const fields = metaFields.map((x) => {
      return {
        keyname: x.propertyName,
        // NGW does not support boolean yet
        datatype:
          x.options.datatype === 'BOOLEAN' ? 'INTEGER' : x.options.datatype,
        grid_visibility: x.options.grid_visibility,
        label_field: x.options.label_field,
        display_name: x.options.display_name,
      };
    }) as FeatureLayerField[];
    if (item) {
      return {
        feature_layer: {
          fields: fields.map((f) => {
            const exist =
              existFields && existFields.find((y) => y.keyname === f.keyname);
            return { ...exist, ...f };
          }),
        },
      } as DeepPartial<VectorResourceUpdateItem>;
    } else {
      return {
        vector_layer: {
          srs: { id: 3857 },
          geometry_type: this.geometryType,
          fields,
        },
      } as DeepPartial<VectorResourceSyncItem>;
    }
  }

  // /**
  //  * Checks entity has an id.
  //  */
  // static hasId(entity: VectorLayer): boolean {
  //   return this.getRepository().hasId(entity);
  // }
  // /**
  //  * Gets entity id.
  //  */
  // static getId<T extends VectorLayer>(
  //   this: ObjectType<T>,
  //   entity: T
  // ): any {
  //   return this.getRepository().getId(entity);
  // }
  // /**
  //  * Creates a new entity instance and copies all entity properties from this object into a new entity.
  //  * Note that it copies only properties that present in entity schema.
  //  */
  // static create<T extends VectorLayer>(
  //   this: ObjectType<T>,
  //   entityOrEntities?: any
  // ): T {
  //   return this.getRepository().create(entityOrEntities);
  // }
  // /**
  //  * Merges multiple entities (or entity-like objects) into a given entity.
  //  */
  // static merge<T extends VectorLayer>(
  //   this: ObjectType<T>,
  //   mergeIntoEntity: T,
  //   ...entityLikes: DeepPartial<T>[]
  // ): T {
  //   return this.getRepository().merge(mergeIntoEntity, ...entityLikes);
  // }
  // /**
  //  * Creates a new entity from the given plan javascript object. If entity already exist in the database, then
  //  * it loads it (and everything related to it), replaces all values with the new ones from the given object
  //  * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
  //  * replaced from the new object.
  //  *
  //  * Note that given entity-like object must have an entity id / primary key to find entity by.
  //  * Returns undefined if entity with given id was not found.
  //  */
  // static preload<T extends VectorLayer>(
  //   this: ObjectType<T>,
  //   entityLike: DeepPartial<T>
  // ): Promise<T | undefined> {
  //   return this.getRepository().preload(entityLike);
  // }
  /**
   * Saves one or many given entities.
   */
  static async save<T extends VectorLayer>(
    this: ObjectType<T>,
    entityOrEntities: T | T[],
    options?: UpdateOptions,
  ): Promise<T[]> {
    const Resource = this as typeof VectorLayer;
    const connection = Resource.connection;
    if (!connection || !Resource.item) {
      throw new CannotExecuteNotConnectedError();
    }
    const items: T[] = Array.isArray(entityOrEntities)
      ? entityOrEntities
      : [entityOrEntities];
    await saveVectorLayer({ items, resource: Resource.item }, connection);
    return items;
  }
  // /**
  //  * Removes one or many given entities.
  //  */
  // static remove<T extends VectorLayer>(
  //   this: ObjectType<T>,
  //   entityOrEntities: T | T[],
  //   options?: UpdateOptions
  // ): Promise<T | T[]> {
  //   return this.getRepository().remove(entityOrEntities as any, options);
  // }
  // /**
  //  * Inserts a given entity into the database.
  //  * Unlike save method executes a primitive operation without cascades, relations and other operations included.
  //  * Executes fast and efficient INSERT query.
  //  * Does not check if entity exist in the database, so query will fail if duplicate entity is being inserted.
  //  */
  // static insert<T extends VectorLayer>(
  //   this: ObjectType<T>,
  //   entity: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
  //   options?: UpdateOptions
  // ): Promise<InsertResult> {
  //   return this.getRepository().insert(entity, options);
  // }
  // /**
  //  * Updates entity partially. Entity can be found by a given conditions.
  //  * Unlike save method executes a primitive operation without cascades, relations and other operations included.
  //  * Executes fast and efficient UPDATE query.
  //  * Does not check if entity exist in the database.
  //  */
  // static update<T extends VectorLayer>(
  //   this: ObjectType<T>,
  //   criteria: string | string[] | number | number[] | FindConditions<T>,
  //   partialEntity: QueryDeepPartialEntity<T>,
  //   options?: UpdateOptions
  // ): Promise<UpdateResult> {
  //   return this.getRepository().update(criteria, partialEntity, options);
  // }
  // /**
  //  * Deletes entities by a given criteria.
  //  * Unlike remove method executes a primitive operation without cascades, relations and other operations included.
  //  * Executes fast and efficient DELETE query.
  //  * Does not check if entity exist in the database.
  //  */
  // static delete<T extends VectorLayer>(
  //   this: ObjectType<T>,
  //   criteria: string | string[] | number | number[] | FindConditions<T>,
  //   options?: UpdateOptions
  // ): Promise<DeleteResult> {
  //   return this.getRepository().delete(criteria, options);
  // }
  /**
   * Counts entities that match given find options or conditions.
   */
  static async count<T extends VectorLayer>(
    this: ObjectType<T>,
    optionsOrConditions?: FindManyOptions<T> | PropertiesFilter<T>,
  ): Promise<number> {
    const Resource = this as typeof VectorLayer;
    const connection = Resource.connection;
    if (!connection || !Resource.item) {
      throw new CannotExecuteNotConnectedError();
    }
    if (!optionsOrConditions) {
      const count = await connection.driver.get(
        'feature_layer.feature.count',
        null,
        {
          id: Resource.item.resource.id,
        },
      );
      return count.total_count;
    } else {
      const find = await Resource.find<T>(optionsOrConditions);
      return find.length;
    }
  }
  /**
   * Finds entities that match given find options or conditions.
   */
  static async find<T extends VectorLayer>(
    this: ObjectType<T>,
    optionsOrConditions?: FindManyOptions<T> | PropertiesFilter<T>,
  ): Promise<T[]> {
    const Resource = this as typeof VectorLayer;
    const connection = Resource.connection;
    if (!connection || !Resource.item) {
      throw new CannotExecuteNotConnectedError();
    }
    const connector = connection.driver;
    const options: GetNgwItemsOptions & FilterOptions<T> = {
      connector,
      resourceId: Resource.item.resource.id,
    };

    if (Array.isArray(optionsOrConditions)) {
      options.filters = optionsOrConditions;
    } else if (optionsOrConditions) {
      const opt: FindManyOptions<T> = optionsOrConditions;
      if (Array.isArray(opt.where)) {
        options.filters = opt.where;
      } else if (opt.where) {
        options.filters = [
          Object.entries(opt.where).map(([key, value]) => {
            return [key, 'eq', value];
          }),
        ];
      }
      if (opt.fields) {
        options.fields = opt.fields;
      }
      options.limit = opt.limit;
      options.offset = opt.offset;
      if (opt.order) {
        const orderBy: (keyof T | string)[] = [];
        Object.entries(opt.order).forEach(([key, value]) => {
          if (value) {
            if (value === 'DESC' || value < 0) {
              orderBy.push(`-${key}`);
            } else {
              orderBy.push(key);
            }
          }
          options.orderBy = orderBy;
        });
      }
    }

    const items = await fetchNgwLayerItems(options);
    if (items) {
      const entities = itemsToEntities(Resource, items) as T[];
      return entities;
    }
    return [];
  }
  // /**
  //  * Finds entities by ids.
  //  * Optionally find options can be applied.
  //  */
  // static findByIds<T extends VectorLayer>(
  //   this: ObjectType<T>,
  //   ids: any[],
  //   optionsOrConditions?: FindManyOptions<T> | FindConditions<T>
  // ): Promise<T[]> {
  //   return this.getRepository().findByIds(ids, optionsOrConditions as any);
  // }
  /**
   * Finds first entity that matches given conditions.
   */
  static async findOne<T extends VectorLayer>(
    this: ObjectType<T>,
    optionsOrConditions?: number | FindOneOptions<T> | FindConditions<T>,
    maybeOptions?: FindOneOptions<T>,
  ): Promise<T | undefined> {
    const Resource = this as typeof VectorLayer;
    const connection = Resource.connection;
    if (!connection || !Resource.item) {
      throw new CannotExecuteNotConnectedError();
    }
    const connector = connection.driver;
    const options: GetNgwItemsOptions & FilterOptions = {
      connector,
      resourceId: Resource.item.resource.id,
    };
    if (typeof optionsOrConditions === 'number') {
      const item = await fetchNgwLayerItem({
        ...options,
        featureId: optionsOrConditions,
      });
      if (item) {
        const entity = itemToEntity(Resource, item) as T;
        return entity;
      }
    } else {
      const options: FindOneOptions<T> = {};
      if (Array.isArray(optionsOrConditions)) {
        options.where = optionsOrConditions;
      } else {
        Object.assign(options, optionsOrConditions);
      }
      Object.assign(options, maybeOptions);

      const items = await Resource.find({
        ...options,
        limit: 1,
      });
      return items[0];
    }
  }
  /**
   * Finds first entity that matches given conditions.
   */
  static async findOneOrFail<T extends VectorLayer>(
    this: ObjectType<T>,
    optionsOrConditions?: number | FindOneOptions<T> | FindConditions<T>,
    maybeOptions?: FindOneOptions<T>,
  ): Promise<T> {
    const Resource = this as typeof VectorLayer;
    const item = await Resource.findOne<T>(optionsOrConditions, maybeOptions);
    if (item) {
      return item;
    }
    throw Error();
  }
  // /**
  //  * Executes a raw SQL query and returns a raw database results.
  //  * Raw query execution is supported only by relational databases (MongoDB is not supported).
  //  */
  // static query<T extends VectorLayer>(
  //   this: ObjectType<T>,
  //   query: string,
  //   parameters?: any[]
  // ): Promise<any> {
  //   return this.getRepository().query(query, parameters);
  // }
  // /**
  //  * Clears all the data from the given table/collection (truncates/drops it).
  //  */
  // static clear<T extends VectorLayer>(
  //   this: ObjectType<T>
  // ): Promise<void> {
  //   return this.getRepository().clear();
  // }
  // // -------------------------------------------------------------------------
  // // Public Methods
  // // -------------------------------------------------------------------------
  getConstructor(): typeof VectorLayer {
    return this.constructor as any;
  }

  toJSON(): string {
    return JSON.stringify(this.toGeoJson());
  }

  toGeoJson(): Feature<G, this> {
    const constructor = this.getConstructor();
    const columns = getMetadataArgsStorage().filterColumns(constructor);
    const properties = {} as Record<keyof this, any>;
    columns.forEach((x) => {
      const key = x.propertyName as keyof this;
      const descriptor = Object.getOwnPropertyDescriptor(this, key);
      if (descriptor) {
        properties[key] = descriptor.value;
      }
    });
    const feature: Feature<G, this> = {
      type: 'Feature',
      properties,
      geometry: this.geom,
    };
    return feature;
  }
  /**
   * Checks if entity has an id.
   */
  hasId(): boolean {
    return this.id !== undefined;
  }
  /**
   * Saves current entity in the NGW target layer.
   * If entity does not exist in the NGW layer then inserts, otherwise updates.
   */
  async save(): Promise<this> {
    const constructor = this.getConstructor();
    const connection = constructor.connection;
    const resource = constructor.item;
    if (!connection || !resource) {
      throw new CannotExecuteNotConnectedError();
    }
    await saveVectorLayer({ resource, items: [this] }, connection);
    return this;
  }

  // /**
  //  * Removes current entity from the database.
  //  */
  // remove(options?: UpdateOptions): Promise<this> {
  //   return (this.constructor as any).getRepository().remove(this, options);
  // }
  // /**
  //  * Reloads entity data from the database.
  //  */
  // async reload(): Promise<void> {
  //   const base: any = this.constructor;
  //   const newestEntity: VectorLayer = await base
  //     .getRepository()
  //     .findOneOrFail(base.getId(this));
  //   objectAssign(this, newestEntity);
  // }
}
