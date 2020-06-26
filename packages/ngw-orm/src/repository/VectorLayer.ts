import { Geometry } from 'geojson';
import { Type, DeepPartial } from '@nextgis/utils';
import { GeometryType } from '@nextgis/ngw-connector';
// import { ResourceItem } from '@nextgis/ngw-connector';
// import { objectAssign } from '@nextgis/utils';
// import NgwConnector from '@nextgis/ngw-connector';
// import { ObjectType } from '../common/ObjectType';
// import { DeepPartial } from '../common/DeepPartial';
// import { UpdateOptions } from './UpdateOptions';
// import { FindConditions } from '../find-options/FindConditions';
// import { FindManyOptions } from '../find-options/FindManyOptions';
// import { FindOneOptions } from '../find-options/FindOneOptions';
import { BaseResource } from './BaseResource';
import { getMetadataArgsStorage } from '..';
import { SyncOptions } from './SyncOptions';
import { VectorResourceSyncItem } from '../sync-items/VectorResourceSyncItem';
import { vectorResourceToNgw } from '../utils/vectorResourceToNgw';
// import { SyncOptions } from './SyncOptions';
// import { Connection } from '../connection/Connection';
// import { ConnectionOptions } from '../connection/ConnectionOptions';
// import { getMetadataArgsStorage } from '..';
// import { VectorLayerMetadataArgs } from '../metadata-args/VectorLayerMetadataArgs';

// type QueryDeepPartialEntity<T> = DeepPartial<T>;
// type InsertResult = any;
// type DeleteResult = any;
// type UpdateResult = any;

export class VectorLayer<G extends Geometry = Geometry> extends BaseResource {
  static geometryType: GeometryType;
  id?: number;
  private _geom!: G;

  static getNgwPayload(
    resource: Type<VectorLayer>,
    parent: number,
    options: SyncOptions
  ): DeepPartial<VectorResourceSyncItem> | undefined {
    const fields = getMetadataArgsStorage().filterColumns(resource);

    return {
      vector_layer: {
        srs: { id: 3857 },
        geometry_type: this.geometryType,
        fields: fields.map((x) => ({
          keyname: x.propertyName,
          datatype: x.options.datatype,
          grid_visibility: x.options.grid_visibility,
          label_field: x.options.label_field,
          display_name: x.options.display_name,
        })),
      },
    };
  }

  get geom(): G {
    return this._geom;
  }

  set geom(geom: G) {
    this._geom = geom;
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
  // /**
  //  * Saves one or many given entities.
  //  */
  // static save<T extends VectorLayer>(
  //   this: ObjectType<T>,
  //   entityOrEntities: T | T[],
  //   options?: UpdateOptions
  // ): Promise<T | T[]> {
  //   return this.getRepository().save(entityOrEntities as any, options);
  // }
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
  // /**
  //  * Counts entities that match given find options or conditions.
  //  */
  // static count<T extends VectorLayer>(
  //   this: ObjectType<T>,
  //   optionsOrConditions?: FindManyOptions<T> | FindConditions<T>
  // ): Promise<number> {
  //   return this.getRepository().count(optionsOrConditions as any);
  // }
  // /**
  //  * Finds entities that match given find options or conditions.
  //  */
  // static find<T extends VectorLayer>(
  //   this: ObjectType<T>,
  //   optionsOrConditions?: FindManyOptions<T> | FindConditions<T>
  // ): Promise<T[]> {
  //   return this.getRepository().find(optionsOrConditions as any);
  // }
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
  // /**
  //  * Finds first entity that matches given conditions.
  //  */
  // static findOne<T extends VectorLayer>(
  //   this: ObjectType<T>,
  //   optionsOrConditions?:
  //     | string
  //     | number
  //     | Date
  //     | FindOneOptions<T>
  //     | FindConditions<T>,
  //   maybeOptions?: FindOneOptions<T>
  // ): Promise<T | undefined> {
  //   return this.getRepository().findOne(
  //     optionsOrConditions as any,
  //     maybeOptions
  //   );
  // }
  // /**
  //  * Finds first entity that matches given conditions.
  //  */
  // static findOneOrFail<T extends VectorLayer>(
  //   this: ObjectType<T>,
  //   optionsOrConditions?:
  //     | string
  //     | number
  //     | Date
  //     | FindOneOptions<T>
  //     | FindConditions<T>,
  //   maybeOptions?: FindOneOptions<T>
  // ): Promise<T> {
  //   return this.getRepository().findOneOrFail(
  //     optionsOrConditions as any,
  //     maybeOptions
  //   );
  // }
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
  // /**
  //  * Checks if entity has an id.
  //  * If entity composite compose ids, it will check them all.
  //  */
  // hasId(): boolean {
  //   return (this.constructor as any).getRepository().hasId(this);
  // }
  /**
   * Saves current entity in the NGW target layer.
   * If entity does not exist in the NGW layer then inserts, otherwise updates.
   */
  async save(): Promise<this> {
    const constructor = this.getConstructor();
    const connection = constructor.connection;
    const resource = constructor.item;
    if (connection && resource) {
      const feature = vectorResourceToNgw({ resource, item: this });
      if (this.id) {
        feature.id = this.id;
      }
      const resp = await connection.driver.patch(
        'feature_layer.feature.collection',
        { data: [feature] },
        { id: resource.resource.id }
      );
      if (resp && resp[0] && resp[0].id) {
        this.id = resp[0].id;
      }
    } else {
      throw 'Can\'t save item. Resource is not connected yet';
    }
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
