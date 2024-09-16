/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '@nextgisweb/pyramid/type/api' {
  import type * as ns355 from '@nextgisweb/resource/type/api';
  import type * as ns650 from '@nextgisweb/tracker/type/api';
  import type * as ns155 from '@nextgisweb/file-upload/type/api';
  import type * as ns426 from '@nextgisweb/webmap/type/api';

  export {};
  export type HealthcheckResponse = {
    success: boolean;
    component: Record<string, any>;
  };
  export type PingResponse = {
    current: number /* float */;
    started: number /* float */;
  };
  export type StorageStatusResponse = { estimation_running: boolean };
  export type StorageResponseValue = {
    estimated: string /* datetime */ | null;
    updated: string /* datetime */ | null;
    data_volume: number /* int */;
  };
  export type FontCUpdateBody = {
    add: ns155.FileUploadRef[];
    remove: string[];
  };
  export type FontCUpdateResponse = {
    restarted: boolean;
    timestamp: number /* float */;
  };
  export type PyramidCSetting =
    | 'all'
    | 'allow_origin'
    | 'custom_css'
    | 'header_logo'
    | 'full_name'
    | 'home_path'
    | 'metrics';
  export type LogoMimeType = 'image/png' | 'image/svg+xml';
  export type GoogleAnalytics = { id: string };
  export type YandexMetrica = {
    id: string;
    webvisor: boolean;
  };
  export type Metrics = {
    google_analytics?: GoogleAnalytics;
    yandex_metrica?: YandexMetrica;
  };
  export type PyramidCSettingsRead = {
    allow_origin?: string[];
    custom_css?: string;
    header_logo?: [LogoMimeType, string /* bytes */];
    full_name?: string | null;
    home_path?: string | null;
    metrics?: Metrics;
  };
  export type CSettingsRead = {
    pyramid?: PyramidCSettingsRead;
    tracker?: ns650.TrackerCSettingsRead;
    resource?: ns355.ResourceCSettingsRead;
    webmap?: ns426.WebMapCSettingsRead;
  };
  export type PyramidCSettingsUpdate = {
    allow_origin?: string[] | null;
    custom_css?: string | null;
    header_logo?: ns155.FileUploadRef | null;
    full_name?: string | null | null;
    home_path?: string | null | null;
    metrics?: Metrics | null;
  };
  export type CSettingsUpdate = {
    pyramid?: PyramidCSettingsUpdate;
    tracker?: ns650.TrackerCSettingsUpdate;
    resource?: ns355.ResourceCSettingsUpdate;
    webmap?: ns426.WebMapCSettingsUpdate;
  };
}

declare module '@nextgisweb/core/type/api' {
  export {};
  export type SystemFont = {
    type: 'system';
    label: string;
    format: string;
  };
  export type CustomFont = {
    type: 'custom';
    key: string;
    label: string;
    format: string;
  };
}

declare module '@nextgisweb/file-upload/type/api' {
  export {};
  export type FileUploadRef = { id: string };
  export type FileUploadObject = {
    id: string;
    size: number /* int */;
    name?: string;
    mime_type?: string;
  };
  export type FileUploadFormPost = { upload_meta: FileUploadObject[] };
}

declare module '@nextgisweb/auth/type/api' {
  export {};
  export type Permission =
    | 'auth.view'
    | 'auth.manage'
    | 'spatial_ref_sys.view'
    | 'spatial_ref_sys.manage'
    | 'pyramid.cors.view'
    | 'pyramid.cors.manage';
  export type UserRead = {
    id: number /* int */;
    system: boolean;
    keyname: string;
    display_name: string;
    description: string | null;
    superuser: boolean;
    disabled: boolean;
    password: boolean | string;
    last_activity: string /* datetime */ | null;
    language: string | null;
    oauth_subject: string | null;
    oauth_tstamp: string /* datetime */ | null;
    member_of: number /* int */[];
    permissions: Permission[];
    alink: boolean | string;
    is_administrator: boolean;
  };
  export type UserReadBrief = {
    id: number /* int */;
    system: boolean;
    keyname: string;
    display_name: string;
    disabled: boolean;
    password: boolean | string;
    last_activity: string /* datetime */ | null;
    oauth_subject: string | null;
    is_administrator: boolean;
  };
  export type UserCreate = {
    keyname: string;
    display_name: string;
    description?: string | null;
    disabled?: boolean;
    password?: boolean | string;
    language?: string | null;
    member_of?: number /* int */[];
    permissions?: Permission[];
    alink?: boolean | string;
  };
  export type UserRef = { id: number /* int */ };
  export type UserUpdate = {
    keyname?: string;
    display_name?: string;
    description?: string | null;
    disabled?: boolean;
    password?: boolean | string;
    language?: string | null;
    member_of?: number /* int */[];
    permissions?: Permission[];
    alink?: boolean | string;
  };
  export type ProfileRead = {
    oauth_subject: string | null;
    language: string | null;
  };
  export type ProfileUpdate = { language?: string | null };
  export type GroupRead = {
    id: number /* int */;
    system: boolean;
    keyname: string;
    display_name: string;
    description: string | null;
    register: boolean;
    oauth_mapping: boolean;
    members: number /* int */[];
    permissions: Permission[];
  };
  export type GroupReadBrief = {
    id: number /* int */;
    system: boolean;
    keyname: string;
    display_name: string;
  };
  export type GroupCreate = {
    keyname: string;
    display_name: string;
    description?: string | null;
    register?: boolean;
    oauth_mapping?: boolean;
    members?: number /* int */[];
    permissions?: Permission[];
  };
  export type GroupRef = { id: number /* int */ };
  export type GroupUpdate = {
    keyname?: string;
    display_name?: string;
    description?: string | null;
    register?: boolean;
    oauth_mapping?: boolean;
    members?: number /* int */[];
    permissions?: Permission[];
  };
  export type AuthMedium = 'session' | 'basic' | 'bearer';
  export type AuthProvider = 'local_pw' | 'oauth_ac' | 'oauth_pw' | 'invite';
  export type CurrentUser = {
    id: number /* int */;
    keyname: string;
    display_name: string;
    language: string;
    auth_medium: AuthMedium | null;
    auth_provider: AuthProvider | null;
  };
  export type LoginResponse = {
    id: number /* int */;
    keyname: string;
    display_name: string;
    home_url?: string;
  };
}

declare module '@nextgisweb/resource/type/api' {
  import type * as ns532 from '@nextgisweb/tileset/type/api';
  import type * as ns416 from '@nextgisweb/render/type/api';
  import type * as ns535 from '@nextgisweb/basemap/type/api';
  import type * as ns544 from '@nextgisweb/qgis/type/api';
  import type * as ns635 from '@nextgisweb/scene-3d/type/api';
  import type * as ns647 from '@nextgisweb/tileset-3d/type/api';
  import type * as ns464 from '@nextgisweb/postgis/type/api';
  import type * as ns650 from '@nextgisweb/tracker/type/api';
  import type * as ns592 from '@nextgisweb/mapserver/type/api';
  import type * as ns598 from '@nextgisweb/terrain-provider/type/api';
  import type * as ns482 from '@nextgisweb/wfsserver/type/api';
  import type * as ns421 from '@nextgisweb/svg-marker-library/type/api';
  import type * as ns601 from '@nextgisweb/model-3d/type/api';
  import type * as ns491 from '@nextgisweb/wfsclient/type/api';
  import type * as ns619 from '@nextgisweb/style-3d/type/api';
  import type * as ns579 from '@nextgisweb/gpdobj/type/api';
  import type * as ns469 from '@nextgisweb/raster-layer/type/api';
  import type * as ns527 from '@nextgisweb/tmsclient/type/api';
  import type * as ns475 from '@nextgisweb/raster-mosaic/type/api';
  import type * as ns426 from '@nextgisweb/webmap/type/api';
  import type * as ns389 from '@nextgisweb/resmeta/type/api';
  import type * as ns502 from '@nextgisweb/wmsclient/type/api';
  import type * as ns392 from '@nextgisweb/social/type/api';
  import type * as ns511 from '@nextgisweb/wmsserver/type/api';
  import type * as ns517 from '@nextgisweb/ogcfserver/type/api';
  import type * as ns395 from '@nextgisweb/lookup-table/type/api';
  import type * as ns459 from '@nextgisweb/vector-layer/type/api';
  import type * as ns410 from '@nextgisweb/feature-layer/type/api';

  export {};
  export type ResourceCls =
    | 'resource'
    | 'resource_group'
    | 'lookup_table'
    | 'svg_marker_library'
    | 'webmap'
    | 'vector_layer'
    | 'postgis_connection'
    | 'postgis_layer'
    | 'raster_layer'
    | 'raster_mosaic'
    | 'raster_style'
    | 'wfsserver_service'
    | 'wfsclient_connection'
    | 'wfsclient_layer'
    | 'wmsclient_connection'
    | 'wmsclient_layer'
    | 'wmsserver_service'
    | 'ogcfserver_service'
    | 'tmsclient_connection'
    | 'tmsclient_layer'
    | 'tileset'
    | 'basemap_layer'
    | 'demo_project'
    | 'qgis_raster_style'
    | 'qgis_vector_style'
    | 'eeko_storage'
    | 'gallery'
    | 'gpdobj_storage'
    | 'gpdobj_group'
    | 'gpdobj_dm'
    | 'gpdobj_dm_section'
    | 'gpdobj_dm_group'
    | 'gpdobj_pi_dm'
    | 'gpdobj_oper_dm'
    | 'gpdobj_pir_obj'
    | 'gpdobj_pir_oip'
    | 'gpdobj_pir_dm'
    | 'mapserver_style'
    | 'terrain_provider'
    | 'model_3d'
    | 'style_3d'
    | 'scene_3d'
    | 'tileset_3d'
    | 'trackers_group'
    | 'tracker';
  export type ResourceInterface =
    | 'IBboxLayer'
    | 'IFeatureLayer'
    | 'IFieldEditableFeatureLayer'
    | 'IGeometryEditableFeatureLayer'
    | 'IWritableFeatureLayer'
    | 'IVersionableFeatureLayer'
    | 'IRenderableStyle'
    | 'ILegendableStyle'
    | 'IRenderableNonCached'
    | 'IRenderableScaleRange'
    | 'ILegendSymbols';
  export type ResourceScope =
    | 'resource'
    | 'data'
    | 'connection'
    | 'service'
    | 'webmap';
  export type BlueprintResource = {
    identity: ResourceCls;
    label: string;
    base_classes: ResourceCls[];
    interfaces: ResourceInterface[];
    scopes: ResourceScope[];
    category: string;
    order: number /* int */;
  };
  export type BlueprintPermission = {
    identity: string;
    label: string;
  };
  export type BlueprintScope = {
    identity: ResourceScope;
    label: string;
    permissions: Record<string, BlueprintPermission>;
  };
  export type BlueprintCategory = {
    identity: string;
    label: string;
    order: number /* int */;
  };
  export type Blueprint = {
    resources: Record<ResourceCls, BlueprintResource>;
    scopes: Record<ResourceScope, BlueprintScope>;
    categories: Record<string, BlueprintCategory>;
  };
  export type ResourceRefOptional = { id: number /* int */ | null };
  export type ResourceRefWithParent = {
    id: number /* int */;
    parent: ResourceRefOptional;
  };
  export type RelationshipRef = { id: number /* int */ };
  export type ACLRuleAction = 'allow' | 'deny';
  export type PrincipalRef = { id: number /* int */ };
  export type ACLRule = {
    action: ACLRuleAction;
    principal: PrincipalRef;
    identity: ResourceCls | '';
    scope: string;
    permission: string;
    propagate: boolean;
  };
  export type ResourceRead = {
    id: number /* int */;
    cls: ResourceCls;
    creation_date: string /* datetime */;
    parent: ResourceRefWithParent | null;
    owner_user: RelationshipRef;
    permissions: ACLRule[];
    keyname: string | null;
    display_name: string;
    description: string | null;
    children: boolean;
    interfaces: ResourceInterface[];
    scopes: ResourceScope[];
  };
  export type ResourceRef = { id: number /* int */ };
  export type CompositeRead = {
    resource: ResourceRead;
    resmeta?: ns389.ResmetaRead;
    social?: ns392.SocialRead;
    lookup_table?: ns395.LookupTableRead;
    feature_layer?: ns410.FeatureLayerRead;
    tile_cache?: ns416.TileCacheRead;
    svg_marker_library?: ns421.SVGMarkerLibraryRead;
    webmap?: ns426.WebMapRead;
    vector_layer?: ns459.VectorLayerRead;
    postgis_connection?: ns464.PostgisConnectionRead;
    postgis_layer?: ns464.PostgisLayerRead;
    raster_layer?: ns469.RasterLayerRead;
    raster_mosaic?: ns475.RasterMosaicRead;
    wfsserver_service?: ns482.ServiceRead;
    wfsclient_connection?: ns491.WFSConnectionRead;
    wfsclient_layer?: ns491.WFSLayerRead;
    wmsclient_connection?: ns502.ConnectionRead;
    wmsclient_layer?: ns502.LayerRead;
    wmsserver_service?: ns511.ServiceRead;
    ogcfserver_service?: ns517.ServiceRead;
    tmsclient_connection?: ns527.ConnectionRead;
    tmsclient_layer?: ns527.LayerRead;
    tileset?: ns532.TilesetRead;
    basemap_layer?: ns535.BasemapLayerRead;
    basemap_webmap?: ns535.BasemapWebMapRead;
    qgis_vector_style?: ns544.QgisVectorStyleRead;
    qgis_raster_style?: ns544.QgisRasterStyleRead;
    gallery?: any;
    gpdobj_dm_section?: ns579.GPDObjDMSectionRead;
    gpdobj_dm?: ns579.GPDObjDMRead;
    gpdobj_pi_dm?: ns579.GPDObjPIDMRead;
    gpdobj_pir_obj?: ns579.GPDObjPIRObjRead;
    gpdobj_pir_oip?: ns579.GPDObjPIROIPRead;
    gpdobj_pir_dm?: ns579.GPDObjPIRDMRead;
    mapserver_style?: ns592.MapserverStyleRead;
    terrain_provider?: ns598.TerrainProviderRead;
    model_3d?: ns601.Model3DRead;
    style_3d?: ns619.Style3DRead;
    scene_3d?: ns635.Scene3DRead;
    scene3d_basemap?: ns635.Scene3DBasemapRead;
    scene3d_terrain?: ns635.Scene3DTerrainRead;
    tileset_3d?: ns647.Tileset3DRead;
    tracker?: ns650.TrackerRead;
  };
  export type ResourceUpdate = {
    parent?: ResourceRef;
    owner_user?: RelationshipRef;
    permissions?: ACLRule[];
    keyname?: string | null;
    display_name?: string;
    description?: string | null;
  };
  export type CompositeUpdate = {
    resource?: ResourceUpdate;
    resmeta?: ns389.ResmetaUpdate;
    social?: ns392.SocialUpdate;
    lookup_table?: ns395.LookupTableUpdate;
    feature_layer?: ns410.FeatureLayerUpdate;
    tile_cache?: ns416.TileCacheUpdate;
    svg_marker_library?: ns421.SVGMarkerLibraryUpdate;
    webmap?: ns426.WebMapUpdate;
    vector_layer?: ns459.VectorLayerUpdate;
    postgis_connection?: ns464.PostgisConnectionUpdate;
    postgis_layer?: ns464.PostgisLayerUpdate;
    raster_layer?: ns469.RasterLayerUpdate;
    raster_mosaic?: ns475.RasterMosaicUpdate;
    wfsserver_service?: ns482.ServiceUpdate;
    wfsclient_connection?: ns491.WFSConnectionUpdate;
    wfsclient_layer?: ns491.WFSLayerUpdate;
    wmsclient_connection?: ns502.ConnectionUpdate;
    wmsclient_layer?: ns502.LayerUpdate;
    wmsserver_service?: ns511.ServiceUpdate;
    ogcfserver_service?: ns517.ServiceUpdate;
    tmsclient_connection?: ns527.ConnectionUpdate;
    tmsclient_layer?: ns527.LayerUpdate;
    tileset?: ns532.TilesetUpdate;
    basemap_layer?: ns535.BasemapLayerUpdate;
    basemap_webmap?: ns535.BasemapWebMapUpdate;
    qgis_vector_style?: ns544.QgisVectorStyleUpdate;
    qgis_raster_style?: ns544.QgisRasterStyleUpdate;
    gallery?: any;
    gpdobj_dm_section?: ns579.GPDObjDMSectionUpdate;
    gpdobj_dm?: ns579.GPDObjDMUpdate;
    gpdobj_pi_dm?: ns579.GPDObjPIDMUpdate;
    gpdobj_pir_obj?: ns579.GPDObjPIRObjUpdate;
    gpdobj_pir_oip?: ns579.GPDObjPIROIPUpdate;
    gpdobj_pir_dm?: ns579.GPDObjPIRDMUpdate;
    mapserver_style?: ns592.MapserverStyleUpdate;
    terrain_provider?: ns598.TerrainProviderUpdate;
    model_3d?: ns601.Model3DUpdate;
    style_3d?: ns619.Style3DUpdate;
    scene_3d?: ns635.Scene3DUpdate;
    scene3d_basemap?: ns635.Scene3DBasemapUpdate;
    scene3d_terrain?: ns635.Scene3DTerrainUpdate;
    tileset_3d?: ns647.Tileset3DUpdate;
    tracker?: ns650.TrackerUpdate;
  };
  export type ResourceCreate = {
    cls: ResourceCls;
    parent: ResourceRef;
    owner_user?: RelationshipRef;
    permissions?: ACLRule[];
    keyname?: string | null;
    display_name: string;
    description?: string | null;
  };
  export type CompositeCreate = {
    resource: ResourceCreate;
    resmeta?: ns389.ResmetaCreate;
    social?: ns392.SocialCreate;
    lookup_table?: ns395.LookupTableCreate;
    feature_layer?: ns410.FeatureLayerCreate;
    tile_cache?: ns416.TileCacheCreate;
    svg_marker_library?: ns421.SVGMarkerLibraryCreate;
    webmap?: ns426.WebMapCreate;
    vector_layer?: ns459.VectorLayerCreate;
    postgis_connection?: ns464.PostgisConnectionCreate;
    postgis_layer?: ns464.PostgisLayerCreate;
    raster_layer?: ns469.RasterLayerCreate;
    raster_mosaic?: ns475.RasterMosaicCreate;
    wfsserver_service?: ns482.ServiceCreate;
    wfsclient_connection?: ns491.WFSConnectionCreate;
    wfsclient_layer?: ns491.WFSLayerCreate;
    wmsclient_connection?: ns502.ConnectionCreate;
    wmsclient_layer?: ns502.LayerCreate;
    wmsserver_service?: ns511.ServiceCreate;
    ogcfserver_service?: ns517.ServiceCreate;
    tmsclient_connection?: ns527.ConnectionCreate;
    tmsclient_layer?: ns527.LayerCreate;
    tileset?: ns532.TilesetCreate;
    basemap_layer?: ns535.BasemapLayerCreate;
    basemap_webmap?: ns535.BasemapWebMapCreate;
    qgis_vector_style?: ns544.QgisVectorStyleCreate;
    qgis_raster_style?: ns544.QgisRasterStyleCreate;
    gallery?: any;
    gpdobj_dm_section?: ns579.GPDObjDMSectionCreate;
    gpdobj_dm?: ns579.GPDObjDMCreate;
    gpdobj_pi_dm?: ns579.GPDObjPIDMCreate;
    gpdobj_pir_obj?: ns579.GPDObjPIRObjCreate;
    gpdobj_pir_oip?: ns579.GPDObjPIROIPCreate;
    gpdobj_pir_dm?: ns579.GPDObjPIRDMCreate;
    mapserver_style?: ns592.MapserverStyleCreate;
    terrain_provider?: ns598.TerrainProviderCreate;
    model_3d?: ns601.Model3DCreate;
    style_3d?: ns619.Style3DCreate;
    scene_3d?: ns635.Scene3DCreate;
    scene3d_basemap?: ns635.Scene3DBasemapCreate;
    scene3d_terrain?: ns635.Scene3DTerrainCreate;
    tileset_3d?: ns647.Tileset3DCreate;
    tracker?: ns650.TrackerCreate;
  };
  export type ResourceScopePermissions = {
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    manage_children: boolean;
    change_permissions: boolean;
  };
  export type DataScopePermissions = {
    read: boolean;
    write: boolean;
  };
  export type ConnectionScopePermissions = {
    read: boolean;
    write: boolean;
    connect: boolean;
  };
  export type ServiceScopePermissions = {
    connect: boolean;
    configure: boolean;
  };
  export type EffectivePermissions = {
    resource: ResourceScopePermissions;
    data?: DataScopePermissions;
    connection?: ConnectionScopePermissions;
    service?: ServiceScopePermissions;
    webmap?: ns426.WebMapScopePermissions;
  };
  export type ResourceVolume = { volume: number /* int */ };
  export type QuotaCheckBody = Record<string, number /* int */>;
  export type QuotaCheckSuccess = { success: boolean };
  export type QuotaCheckFailure = {
    cls: string | null;
    required: number /* int */;
    available: number /* int */;
    message: string;
  };
  export type ResourceFavoriteSchemaItem = {
    identity: string;
    label: string;
    icon: string;
    route: string | null;
  };
  export type ResourceFavoriteRead = {
    id: number /* int */;
    identity: string;
    resource: ResourceRef;
    label: string | null;
    created: string /* datetime */;
    url: string;
  };
  export type ResourceFavoriteResourceInfo = {
    id: number /* int */;
    cls: ResourceCls;
    parent: ResourceRef | null;
    display_name: string;
  };
  export type ResourceFavoriteCollectionGetResponse = {
    items: ResourceFavoriteRead[];
    resources: ResourceFavoriteResourceInfo[];
  };
  export type ResourceShowFavorite = {
    identity: 'resource.show';
    resource: ResourceRef;
  };
  export type ResourceUpdateFavorite = {
    identity: 'resource.update';
    resource: ResourceRef;
  };
  export type LayerPreviewMapFavorite = {
    identity: 'layer_preview.map';
    resource: ResourceRef;
  };
  export type FeatureLayerFeatureBrowseFavorite = {
    identity: 'feature_layer.feature.browse';
    resource: ResourceRef;
  };
  export type WebmapDisplayFavorite = {
    identity: 'webmap.display';
    resource: ResourceRef;
  };
  export type ResourceFavoriteCreate =
    | ResourceShowFavorite
    | ResourceUpdateFavorite
    | LayerPreviewMapFavorite
    | FeatureLayerFeatureBrowseFavorite
    | WebmapDisplayFavorite
    | ns426.WebMapFragmentFavorite;
  export type ResourceFavoriteRef = { id: number /* int */ };
  export type FeatureFavoriteItemPutBody = { label?: string | null };
  export type ResourceCSetting = 'all' | 'resource_export';
  export type ResourceExport = 'data_read' | 'data_write' | 'administrators';
  export type ResourceCSettingsRead = { resource_export?: ResourceExport };
  export type ResourceCSettingsUpdate = {
    resource_export?: ResourceExport | null;
  };
}

declare module '@nextgisweb/resmeta/type/api' {
  export {};
  export type ResmetaRead = {
    items: Record<
      string,
      string | number /* int */ | boolean | number /* float */ | null
    >;
  };
  export type ResmetaUpdate = {
    items?: Record<
      string,
      string | number /* int */ | boolean | number /* float */ | null
    >;
  };
  export type ResmetaCreate = {
    items?: Record<
      string,
      string | number /* int */ | boolean | number /* float */ | null
    >;
  };
}

declare module '@nextgisweb/social/type/api' {
  import type * as ns155 from '@nextgisweb/file-upload/type/api';

  export {};
  export type SocialRead = {
    image_exists: boolean;
    description: string | null;
  };
  export type SocialUpdate = {
    file_upload?: ns155.FileUploadRef | null;
    description?: string | null;
  };
  export type SocialCreate = {
    file_upload?: ns155.FileUploadRef | null;
    description?: string | null;
  };
}

declare module '@nextgisweb/lookup-table/type/api' {
  export {};
  export type LookupTableRead = { items: Record<string, string> };
  export type LookupTableUpdate = { items?: Record<string, string> };
  export type LookupTableCreate = { items?: Record<string, string> };
}

declare module '@nextgisweb/feature-layer/type/api' {
  import type * as ns355 from '@nextgisweb/resource/type/api';
  import type * as ns227 from '@nextgisweb/auth/type/api';

  export {};
  export type FeatureLayerFieldRead = {
    id: number /* int */;
    keyname: string;
    display_name: string;
    datatype:
      | 'INTEGER'
      | 'BIGINT'
      | 'REAL'
      | 'STRING'
      | 'DATE'
      | 'TIME'
      | 'DATETIME';
    typemod: any;
    label_field: boolean;
    grid_visibility: boolean;
    text_search: boolean;
    lookup_table: ns355.ResourceRef | null;
  };
  export type FVersioningRead = {
    enabled: boolean;
    epoch?: number /* int */;
    latest?: number /* int */;
  };
  export type FeatureLayerRead = {
    fields: FeatureLayerFieldRead[];
    versioning: FVersioningRead | null;
  };
  export type FeatureLayerFieldWrite = {
    id?: number /* int */;
    delete?: boolean;
    keyname?: string;
    display_name?: string;
    datatype?:
      | 'INTEGER'
      | 'BIGINT'
      | 'REAL'
      | 'STRING'
      | 'DATE'
      | 'TIME'
      | 'DATETIME';
    typemod?: any;
    label_field?: boolean;
    grid_visibility?: boolean;
    text_search?: boolean;
    lookup_table?: ns355.ResourceRef | null;
  };
  export type FVersioningUpdate = { enabled?: boolean };
  export type FeatureLayerUpdate = {
    fields?: FeatureLayerFieldWrite[];
    versioning?: FVersioningUpdate;
  };
  export type FeatureLayerCreate = {
    fields?: FeatureLayerFieldWrite[];
    versioning?: FVersioningUpdate;
  };
  export type TransactionCreateBody = { epoch?: number /* int */ };
  export type TransactionCreatedResponse = {
    id: number /* int */;
    started: string /* datetime */;
  };
  export type FeatureCreateResult = {
    action: 'feature.create';
    fid: number /* int */;
  };
  export type FeatureUpdateResult = Record<string, never>;
  export type FeatureDeleteResult = Record<string, never>;
  export type FeatureRestoreResult = Record<string, never>;
  export type FeatureNotFound = {
    error: 'feature.not_found';
    status_code: number /* int */;
    message: string;
  };
  export type FeatureConflict = {
    error: 'feature.conflict';
    status_code: number /* int */;
    message: string;
  };
  export type CommitErrors = {
    status: 'errors';
    errors: [number /* int */, FeatureNotFound | FeatureConflict][];
  };
  export type CommitSuccess = {
    status: 'committed';
    committed: string /* datetime */;
  };
  export type FeatureCreate = {
    action: 'feature.create';
    geom?: string /* bytes */ | null;
    fields?: [number /* int */, any][] | Record<string, any>;
  };
  export type FeatureUpdate = {
    action: 'feature.update';
    fid: number /* int */;
    vid?: number /* int */;
    geom?: string /* bytes */ | null;
    fields?: [number /* int */, any][] | Record<string, any>;
  };
  export type FeatureDelete = {
    action: 'feature.delete';
    fid: number /* int */;
    vid?: number /* int */;
  };
  export type FeatureRestore = {
    action: 'feature.restore';
    fid: number /* int */;
    vid?: number /* int */;
    geom?: string /* bytes */ | null;
    fields?: [number /* int */, any][] | Record<string, any>;
  };
  export type SRSReference = { id: number /* int */ };
  export type FieldSummary = {
    id: number /* int */;
    keyname: string;
    datatype: string;
  };
  export type ChangesCheckResponse = {
    epoch: number /* int */;
    initial: number /* int */;
    target: number /* int */;
    tstamp: string /* datetime */;
    geometry_type: string;
    srs: SRSReference;
    fields: FieldSummary[];
    fetch: string;
  };
  export type ChangesContinue = {
    action: 'continue';
    url: string;
  };
  export type OperationFieldValue = [id: number /* int */, val: any];

  export type VersionRead = {
    id: number /* int */;
    tstamp: string /* datetime */;
    user: ns227.UserReadBrief | null;
  };
}

declare module '@nextgisweb/render/type/api' {
  export {};
  export type TileCacheRead = {
    enabled: boolean;
    image_compose: boolean;
    max_z: number /* int */ | null;
    ttl: number /* int */ | null;
  };
  export type TileCacheUpdate = {
    flush?: boolean | null;
    enabled?: boolean;
    image_compose?: boolean;
    max_z?: number /* int */ | null;
    ttl?: number /* int */ | null;
  };
  export type TileCacheCreate = {
    flush?: boolean | null;
    enabled?: boolean;
    image_compose?: boolean;
    max_z?: number /* int */ | null;
    ttl?: number /* int */ | null;
  };
  export type LegendIcon = {
    format: 'png';
    data: string /* bytes */;
  };
  export type LegendSymbol = {
    index: number /* int */;
    render: boolean | null;
    display_name: string;
    icon: LegendIcon;
  };
}

declare module '@nextgisweb/svg-marker-library/type/api' {
  import type * as ns155 from '@nextgisweb/file-upload/type/api';

  export {};
  export type FilesItemRead = { name: string };
  export type SVGMarkerLibraryRead = { files: FilesItemRead[] };
  export type FilesItemUpdate = {
    name: string;
    id?: string;
  };
  export type SVGMarkerLibraryUpdate = {
    archive?: ns155.FileUploadRef;
    files?: FilesItemUpdate[];
  };
  export type SVGMarkerLibraryCreate = {
    archive?: ns155.FileUploadRef;
    files?: FilesItemUpdate[];
  };
}

declare module '@nextgisweb/webmap/type/api' {
  import type * as ns355 from '@nextgisweb/resource/type/api';

  export {};
  export type ExtentWSEN = [
    west: number /* float */,
    south: number /* float */,
    east: number /* float */,
    north: number /* float */,
  ];
  export type LegendSymbolsEnum = 'expand' | 'collapse' | 'disable';
  export type WebMapItemGroupRead = {
    item_type: 'group';
    display_name: string;
    group_expanded: boolean;
    group_exclusive: boolean;
    children: (WebMapItemGroupRead | WebMapItemLayerRead)[];
  };
  export type WebMapItemLayerRead = {
    item_type: 'layer';
    display_name: string;
    layer_enabled: boolean;
    layer_identifiable: boolean;
    layer_transparency: number /* float */ | null;
    layer_style_id: number /* int */;
    style_parent_id: number /* int */ | null;
    layer_min_scale_denom: number /* int */ | null;
    layer_max_scale_denom: number /* int */ | null;
    layer_adapter: string;
    draw_order_position: number /* int */ | null;
    legend_symbols: LegendSymbolsEnum | null;
  };
  export type WebMapItemRootRead = {
    item_type: 'root';
    children: (WebMapItemGroupRead | WebMapItemLayerRead)[];
  };
  export type WebMapRead = {
    initial_extent: ExtentWSEN | null;
    constraining_extent: ExtentWSEN | null;
    title: string | null;
    draw_order_enabled: boolean | null;
    editable: boolean;
    annotation_enabled: boolean;
    annotation_default: 'no' | 'yes' | 'messages';
    legend_symbols: LegendSymbolsEnum | null;
    measure_srs: ns355.RelationshipRef | null;
    bookmark_resource: ns355.ResourceRefWithParent | null;
    root_item: WebMapItemRootRead;
    extent_left: null | number /* float */;
    extent_right: null | number /* float */;
    extent_bottom: null | number /* float */;
    extent_top: null | number /* float */;
    extent_const_left: null | number /* float */;
    extent_const_right: null | number /* float */;
    extent_const_bottom: null | number /* float */;
    extent_const_top: null | number /* float */;
  };
  export type WebMapItemGroupWrite = {
    item_type: 'group';
    display_name: string;
    group_expanded: boolean;
    group_exclusive: boolean;
    children: (WebMapItemGroupWrite | WebMapItemLayerWrite)[];
  };
  export type WebMapItemLayerWrite = {
    item_type: 'layer';
    display_name: string;
    layer_enabled: boolean;
    layer_identifiable: boolean;
    layer_transparency: number /* float */ | null;
    layer_style_id: number /* int */;
    layer_min_scale_denom: number /* int */ | null;
    layer_max_scale_denom: number /* int */ | null;
    layer_adapter: string;
    draw_order_position: number /* int */ | null;
    legend_symbols: LegendSymbolsEnum | null;
  };
  export type WebMapItemRootWrite = {
    item_type: 'root';
    children: (WebMapItemGroupWrite | WebMapItemLayerWrite)[];
  };
  export type WebMapUpdate = {
    initial_extent?: ExtentWSEN | null;
    constraining_extent?: ExtentWSEN | null;
    title?: string | null;
    draw_order_enabled?: boolean | null;
    editable?: boolean;
    annotation_enabled?: boolean;
    annotation_default?: 'no' | 'yes' | 'messages';
    legend_symbols?: LegendSymbolsEnum | null;
    measure_srs?: ns355.RelationshipRef | null;
    bookmark_resource?: ns355.ResourceRef | null;
    root_item?: WebMapItemRootWrite;
    extent_left?: null | number /* float */;
    extent_right?: null | number /* float */;
    extent_bottom?: null | number /* float */;
    extent_top?: null | number /* float */;
    extent_const_left?: null | number /* float */;
    extent_const_right?: null | number /* float */;
    extent_const_bottom?: null | number /* float */;
    extent_const_top?: null | number /* float */;
  };
  export type WebMapCreate = {
    initial_extent?: ExtentWSEN | null;
    constraining_extent?: ExtentWSEN | null;
    title?: string | null;
    draw_order_enabled?: boolean | null;
    editable?: boolean;
    annotation_enabled?: boolean;
    annotation_default?: 'no' | 'yes' | 'messages';
    legend_symbols?: LegendSymbolsEnum | null;
    measure_srs?: ns355.RelationshipRef | null;
    bookmark_resource?: ns355.ResourceRef | null;
    root_item?: WebMapItemRootWrite;
    extent_left?: null | number /* float */;
    extent_right?: null | number /* float */;
    extent_bottom?: null | number /* float */;
    extent_top?: null | number /* float */;
    extent_const_left?: null | number /* float */;
    extent_const_right?: null | number /* float */;
    extent_const_bottom?: null | number /* float */;
    extent_const_top?: null | number /* float */;
  };
  export type WebMapScopePermissions = {
    annotation_read: boolean;
    annotation_write: boolean;
    annotation_manage: boolean;
  };
  export type WebMapFragmentFavorite = {
    identity: 'webmap.fragment';
    resource: ns355.ResourceRef;
    label: string | null;
    query_string: string;
  };
  export type MapContent = {
    x: number /* float */;
    y: number /* float */;
    width: number /* float */;
    height: number /* float */;
    content: string /* bytes */;
  };
  export type PrintFormat = 'png' | 'jpeg' | 'tiff' | 'pdf';
  export type LegendTreeNode = {
    title: string;
    is_group: boolean;
    is_legend: boolean;
    children: LegendTreeNode[];
    icon?: string;
  };
  export type LegendElement = {
    x: number /* float */;
    y: number /* float */;
    width: number /* float */;
    height: number /* float */;
    legend_columns: number /* int */;
    legend_items?: LegendTreeNode[];
  };
  export type ElementContent = {
    x: number /* float */;
    y: number /* float */;
    width: number /* float */;
    height: number /* float */;
    content: string;
  };
  export type PrintBody = {
    width: number /* int */;
    height: number /* int */;
    margin: number /* int */;
    map: MapContent;
    format: PrintFormat;
    legend?: LegendElement;
    title?: ElementContent;
  };
  export type WebMapCSetting =
    | 'all'
    | 'identify_radius'
    | 'identify_attributes'
    | 'show_geometry_info'
    | 'popup_width'
    | 'popup_height'
    | 'address_search_enabled'
    | 'address_search_extent'
    | 'address_geocoder'
    | 'yandex_api_geocoder_key'
    | 'nominatim_countrycodes'
    | 'units_length'
    | 'units_area'
    | 'degree_format'
    | 'measurement_srid'
    | 'legend_symbols'
    | 'hide_nav_menu'
    | 'identify_panel';
  export type AddressGeocoder = 'nominatim' | 'yandex';
  export type LengthUnits = 'm' | 'km' | 'metric' | 'ft' | 'mi' | 'imperial';
  export type AreaUnits =
    | 'sq_m'
    | 'sq_km'
    | 'metric'
    | 'ha'
    | 'ac'
    | 'sq_mi'
    | 'imperial'
    | 'sq_ft';
  export type DegreeFormat = 'dd' | 'ddm' | 'dms';
  export type WebMapCSettingsRead = {
    identify_radius?: number /* float */;
    identify_attributes?: boolean;
    show_geometry_info?: boolean;
    popup_width?: number /* int */;
    popup_height?: number /* int */;
    address_search_enabled?: boolean;
    address_search_extent?: boolean;
    address_geocoder?: AddressGeocoder;
    yandex_api_geocoder_key?: string | null;
    nominatim_countrycodes?: string | null;
    units_length?: LengthUnits;
    units_area?: AreaUnits;
    degree_format?: DegreeFormat;
    measurement_srid?: number /* int */;
    legend_symbols?: string | null;
    hide_nav_menu?: boolean;
    identify_panel?: boolean;
  };
  export type WebMapCSettingsUpdate = {
    identify_radius?: number /* float */ | null;
    identify_attributes?: boolean | null;
    show_geometry_info?: boolean | null;
    popup_width?: number /* int */ | null;
    popup_height?: number /* int */ | null;
    address_search_enabled?: boolean | null;
    address_search_extent?: boolean | null;
    address_geocoder?: AddressGeocoder | null;
    yandex_api_geocoder_key?: string | null | null;
    nominatim_countrycodes?: string | null | null;
    units_length?: LengthUnits | null;
    units_area?: AreaUnits | null;
    degree_format?: DegreeFormat | null;
    measurement_srid?: number /* int */ | null;
    legend_symbols?: string | null | null;
    hide_nav_menu?: boolean | null;
    identify_panel?: boolean | null;
  };
}

declare module '@nextgisweb/vector-layer/type/api' {
  import type * as ns355 from '@nextgisweb/resource/type/api';
  import type * as ns155 from '@nextgisweb/file-upload/type/api';

  export {};
  export type VectorLayerRead = {
    srs: ns355.RelationshipRef;
    geometry_type:
      | 'POINT'
      | 'LINESTRING'
      | 'POLYGON'
      | 'MULTIPOINT'
      | 'MULTILINESTRING'
      | 'MULTIPOLYGON'
      | 'POINTZ'
      | 'LINESTRINGZ'
      | 'POLYGONZ'
      | 'MULTIPOINTZ'
      | 'MULTILINESTRINGZ'
      | 'MULTIPOLYGONZ';
  };
  export type VectorLayerUpdate = {
    srs?: ns355.RelationshipRef;
    source?: ns155.FileUploadRef;
    source_layer?: string;
    fix_errors?: 'NONE' | 'SAFE' | 'LOSSY';
    skip_errors?: boolean;
    skip_other_geometry_types?: boolean;
    cast_geometry_type?: null | 'POINT' | 'LINESTRING' | 'POLYGON';
    cast_is_multi?: boolean | null;
    cast_has_z?: boolean | null;
    fid_source?: 'AUTO' | 'SEQUENCE' | 'FIELD';
    fid_field?: string[] | string;
    geometry_type?:
      | 'POINT'
      | 'LINESTRING'
      | 'POLYGON'
      | 'MULTIPOINT'
      | 'MULTILINESTRING'
      | 'MULTIPOLYGON'
      | 'POINTZ'
      | 'LINESTRINGZ'
      | 'POLYGONZ'
      | 'MULTIPOINTZ'
      | 'MULTILINESTRINGZ'
      | 'MULTIPOLYGONZ';
    fields?: Record<string, any>[];
    delete_all_features?: boolean;
  };
  export type VectorLayerCreate = {
    srs: ns355.RelationshipRef;
    source?: ns155.FileUploadRef;
    source_layer?: string;
    fix_errors?: 'NONE' | 'SAFE' | 'LOSSY';
    skip_errors?: boolean;
    skip_other_geometry_types?: boolean;
    cast_geometry_type?: null | 'POINT' | 'LINESTRING' | 'POLYGON';
    cast_is_multi?: boolean | null;
    cast_has_z?: boolean | null;
    fid_source?: 'AUTO' | 'SEQUENCE' | 'FIELD';
    fid_field?: string[] | string;
    geometry_type?:
      | 'POINT'
      | 'LINESTRING'
      | 'POLYGON'
      | 'MULTIPOINT'
      | 'MULTILINESTRING'
      | 'MULTIPOLYGON'
      | 'POINTZ'
      | 'LINESTRINGZ'
      | 'POLYGONZ'
      | 'MULTIPOINTZ'
      | 'MULTILINESTRINGZ'
      | 'MULTIPOLYGONZ';
    fields?: Record<string, any>[];
    delete_all_features?: boolean;
  };
  export type InspectResponse = { layers: string[] };
}

declare module '@nextgisweb/postgis/type/api' {
  import type * as ns355 from '@nextgisweb/resource/type/api';

  export {};
  export type PostgisConnectionRead = {
    hostname?: string;
    port?: number /* int */ | null;
    username?: string;
    password?: string;
    database?: string;
  };
  export type PostgisLayerRead = {
    connection: ns355.ResourceRefWithParent;
    schema: string;
    table: string;
    column_id: string;
    column_geom: string;
    geometry_type: string;
    geometry_srid: number /* int */;
    srs: ns355.RelationshipRef;
  };
  export type PostgisConnectionUpdate = {
    hostname?: string;
    port?: number /* int */ | null;
    username?: string;
    password?: string;
    database?: string;
  };
  export type PostgisLayerUpdate = {
    connection?: ns355.ResourceRef;
    schema?: string;
    table?: string;
    column_id?: string;
    column_geom?: string;
    geometry_type?: string | null;
    geometry_srid?: number /* int */ | null;
    srs?: ns355.RelationshipRef;
    fields?: 'update' | 'keep';
  };
  export type PostgisConnectionCreate = {
    hostname: string;
    port?: number /* int */ | null;
    username: string;
    password: string;
    database: string;
  };
  export type PostgisLayerCreate = {
    connection: ns355.ResourceRef;
    schema?: string;
    table: string;
    column_id: string;
    column_geom: string;
    geometry_type?: string | null;
    geometry_srid?: number /* int */ | null;
    srs: ns355.RelationshipRef;
    fields?: 'update' | 'keep';
  };
  export type SchemaObject = {
    schema: string;
    views: string[];
    tables: string[];
  };
  export type ColumnObject = {
    name: string;
    type: string;
  };
  export type ConnectionObject = {
    id?: number /* int */;
    hostname?: string;
    port?: number /* int */;
    database?: string;
    username?: string;
    password?: string;
  };
  export type FieldObject = {
    keyname: string;
    datatype: string;
    column_name: string;
  };
  export type LayerObject = {
    id?: number /* int */;
    schema?: string;
    table?: string;
    column_id?: string;
    column_geom?: string;
    geometry_type?: string;
    geometry_srid?: number /* int */;
    fields?: FieldObject[];
  };
  export type CheckBody = {
    connection: ConnectionObject | null;
    layer: LayerObject | null;
  };
  export type StatusEnum = 'success' | 'warning' | 'error';
  export type CheckMessage = {
    status: StatusEnum | null;
    text?: string;
  };
  export type CheckResult = {
    status: StatusEnum;
    group: string;
    title?: string;
    messages: CheckMessage[];
  };
  export type CheckResponse = {
    status: StatusEnum | null;
    checks: CheckResult[];
  };
}

declare module '@nextgisweb/raster-layer/type/api' {
  import type * as ns355 from '@nextgisweb/resource/type/api';
  import type * as ns155 from '@nextgisweb/file-upload/type/api';

  export {};
  export type RasterLayerRead = {
    srs: ns355.RelationshipRef;
    xsize: number /* int */;
    ysize: number /* int */;
    band_count: number /* int */;
    dtype: string;
    color_interpretation: string[];
    cog: boolean;
  };
  export type RasterLayerUpdate = {
    srs?: ns355.RelationshipRef;
    source?: ns155.FileUploadRef;
    cog?: boolean | null;
  };
  export type RasterLayerCreate = {
    srs: ns355.RelationshipRef;
    source: ns155.FileUploadRef;
    cog?: boolean | null;
  };
}

declare module '@nextgisweb/raster-mosaic/type/api' {
  import type * as ns355 from '@nextgisweb/resource/type/api';
  import type * as ns155 from '@nextgisweb/file-upload/type/api';

  export {};
  export type RasterMosaicItemRead = {
    id: number /* int */;
    display_name: string | null;
  };
  export type RasterMosaicRead = {
    srs: ns355.RelationshipRef;
    items?: RasterMosaicItemRead[];
  };
  export type RasterMosaicItemWrite = {
    id?: number /* int */;
    display_name?: string | null;
    file_upload?: ns155.FileUploadRef;
  };
  export type RasterMosaicUpdate = {
    srs?: ns355.RelationshipRef;
    items?: RasterMosaicItemWrite[];
  };
  export type RasterMosaicCreate = {
    srs: ns355.RelationshipRef;
    items?: RasterMosaicItemWrite[];
  };
}

declare module '@nextgisweb/wfsserver/type/api' {
  export {};
  export type WFSServerLayer = {
    resource_id: number /* int */;
    keyname: string;
    display_name: string;
    maxfeatures: number /* int */ | null;
  };
  export type ServiceRead = { layers?: WFSServerLayer[] };
  export type ServiceUpdate = { layers?: WFSServerLayer[] };
  export type ServiceCreate = { layers?: WFSServerLayer[] };
}

declare module '@nextgisweb/wfsclient/type/api' {
  import type * as ns355 from '@nextgisweb/resource/type/api';

  export {};
  export type VersionEnum = '1.0.0' | '1.1.0' | '2.0.0' | '2.0.2';
  export type WFSConnectionRead = {
    path?: string;
    version?: VersionEnum;
    username?: string | null;
    password?: string | null;
  };
  export type WFSLayerRead = {
    connection: ns355.ResourceRefWithParent;
    layer_name: string;
    column_geom: string;
    geometry_type: string;
    geometry_srid: number /* int */;
    srs: ns355.RelationshipRef;
  };
  export type WFSConnectionUpdate = {
    path?: string;
    version?: VersionEnum;
    username?: string | null;
    password?: string | null;
  };
  export type WFSLayerUpdate = {
    connection?: ns355.ResourceRef;
    layer_name?: string;
    column_geom?: string;
    geometry_type?: string | null;
    geometry_srid?: number /* int */ | null;
    srs?: ns355.RelationshipRef;
    fields?: 'update' | 'keep';
  };
  export type WFSConnectionCreate = {
    path: string;
    version: VersionEnum;
    username?: string | null;
    password?: string | null;
  };
  export type WFSLayerCreate = {
    connection: ns355.ResourceRef;
    layer_name: string;
    column_geom: string;
    geometry_type?: string | null;
    geometry_srid?: number /* int */ | null;
    srs: ns355.RelationshipRef;
    fields?: 'update' | 'keep';
  };
  export type LayerObject = {
    name: string;
    srid: number /* int */;
    bbox: [
      number /* float */,
      number /* float */,
      number /* float */,
      number /* float */,
    ];
  };
  export type InspectResponse = { layers: LayerObject[] };
  export type FieldObject = {
    name: string;
    type: string;
  };
  export type InspectLayerResponse = { fields: FieldObject[] };
}

declare module '@nextgisweb/wmsclient/type/api' {
  import type * as ns355 from '@nextgisweb/resource/type/api';

  export {};
  export type VersionEnum = '1.1.1' | '1.3.0';
  export type ConnectionRead = {
    url?: string;
    version?: VersionEnum;
    username?: string | null;
    password?: string | null;
    capcache?: any;
  };
  export type LayerRead = {
    connection: ns355.ResourceRefWithParent;
    wmslayers: string;
    imgformat: string;
    vendor_params: Record<string, string>;
    srs: ns355.RelationshipRef;
  };
  export type CapCacheEnum = 'query' | 'clear';
  export type ConnectionUpdate = {
    url?: string;
    version?: VersionEnum;
    username?: string | null;
    password?: string | null;
    capcache?: CapCacheEnum;
  };
  export type LayerUpdate = {
    connection?: ns355.ResourceRef;
    wmslayers?: string;
    imgformat?: string;
    vendor_params?: Record<string, string>;
    srs?: ns355.RelationshipRef;
  };
  export type ConnectionCreate = {
    url: string;
    version: VersionEnum;
    username?: string | null;
    password?: string | null;
    capcache?: CapCacheEnum;
  };
  export type LayerCreate = {
    connection: ns355.ResourceRef;
    wmslayers: string;
    imgformat: string;
    vendor_params?: Record<string, string>;
    srs: ns355.RelationshipRef;
  };
}

declare module '@nextgisweb/wmsserver/type/api' {
  export {};
  export type WMSServiceLayer = {
    resource_id: number /* int */;
    keyname: string;
    display_name: string;
    min_scale_denom: number /* float */ | null;
    max_scale_denom: number /* float */ | null;
  };
  export type ServiceRead = { layers?: WMSServiceLayer[] };
  export type ServiceUpdate = { layers?: WMSServiceLayer[] };
  export type ServiceCreate = { layers: WMSServiceLayer[] };
}

declare module '@nextgisweb/ogcfserver/type/api' {
  export {};
  export type OGCFServerCollection = {
    resource_id: number /* int */;
    keyname: string;
    display_name: string;
    maxfeatures: number /* int */ | null;
  };
  export type ServiceRead = { collections?: OGCFServerCollection[] };
  export type ServiceUpdate = { collections?: OGCFServerCollection[] };
  export type ServiceCreate = { collections?: OGCFServerCollection[] };
}

declare module '@nextgisweb/tmsclient/type/api' {
  import type * as ns355 from '@nextgisweb/resource/type/api';

  export {};
  export type ConnectionRead = {
    url_template?: string;
    apikey?: string | null;
    apikey_param?: string | null;
    username?: string | null;
    password?: string | null;
    scheme?: 'xyz' | 'tms';
    insecure?: boolean;
    capmode?: 'nextgis_geoservices' | null;
  };
  export type LayerRead = {
    connection: ns355.ResourceRefWithParent;
    layer_name: string | null;
    tilesize: number /* int */;
    minzoom: number /* int */;
    maxzoom: number /* int */;
    extent_left: number /* float */ | null;
    extent_right: number /* float */ | null;
    extent_bottom: number /* float */ | null;
    extent_top: number /* float */ | null;
    srs: ns355.RelationshipRef;
  };
  export type ConnectionUpdate = {
    url_template?: string | null;
    apikey?: string | null;
    apikey_param?: string | null;
    username?: string | null;
    password?: string | null;
    scheme?: 'xyz' | 'tms' | null;
    insecure?: boolean;
    capmode?: 'nextgis_geoservices' | null;
  };
  export type LayerUpdate = {
    connection?: ns355.ResourceRef;
    layer_name?: string | null;
    tilesize?: number /* int */;
    minzoom?: number /* int */;
    maxzoom?: number /* int */;
    extent_left?: number /* float */ | null;
    extent_right?: number /* float */ | null;
    extent_bottom?: number /* float */ | null;
    extent_top?: number /* float */ | null;
    srs?: ns355.RelationshipRef;
  };
  export type ConnectionCreate = {
    url_template: string | null;
    apikey?: string | null;
    apikey_param?: string | null;
    username?: string | null;
    password?: string | null;
    scheme?: 'xyz' | 'tms' | null;
    insecure?: boolean;
    capmode?: 'nextgis_geoservices' | null;
  };
  export type LayerCreate = {
    connection: ns355.ResourceRef;
    layer_name?: string | null;
    tilesize?: number /* int */;
    minzoom?: number /* int */;
    maxzoom?: number /* int */;
    extent_left?: number /* float */ | null;
    extent_right?: number /* float */ | null;
    extent_bottom?: number /* float */ | null;
    extent_top?: number /* float */ | null;
    srs: ns355.RelationshipRef;
  };
  export type LayerObject = {
    layer: string;
    description: string;
    tilesize: number /* int */;
    minzoom: number /* int */;
    maxzoom: number /* int */;
    bounds: [
      number /* float */,
      number /* float */,
      number /* float */,
      number /* float */,
    ];
  };
  export type InspectResponse = { layers: LayerObject[] };
}

declare module '@nextgisweb/tileset/type/api' {
  import type * as ns355 from '@nextgisweb/resource/type/api';
  import type * as ns155 from '@nextgisweb/file-upload/type/api';

  export {};
  export type TilesetRead = { srs: ns355.RelationshipRef };
  export type TilesetUpdate = {
    srs?: ns355.RelationshipRef;
    source?: ns155.FileUploadRef;
  };
  export type TilesetCreate = {
    srs: ns355.RelationshipRef;
    source?: ns155.FileUploadRef;
  };
}

declare module '@nextgisweb/basemap/type/api' {
  export {};
  export type BasemapLayerRead = {
    url?: string;
    qms?: string | null;
    copyright_text?: string | null;
    copyright_url?: string | null;
  };
  export type BasemapWebMapItemRead = {
    resource_id: number /* int */;
    display_name: string;
    enabled: boolean;
    opacity: number /* float */ | null;
  };
  export type BasemapWebMapRead = { basemaps: BasemapWebMapItemRead[] };
  export type BasemapLayerUpdate = {
    url?: string;
    qms?: string | null;
    copyright_text?: string | null;
    copyright_url?: string | null;
  };
  export type BasemapWebMapItemWrite = {
    resource_id: number /* int */;
    display_name: string;
    enabled?: boolean;
    opacity?: number /* float */ | null;
  };
  export type BasemapWebMapUpdate = { basemaps?: BasemapWebMapItemWrite[] };
  export type BasemapLayerCreate = {
    url: string;
    qms?: string | null;
    copyright_text?: string | null;
    copyright_url?: string | null;
  };
  export type BasemapWebMapCreate = { basemaps?: BasemapWebMapItemWrite[] };
}

declare module '@nextgisweb/qgis/type/api' {
  import type * as ns355 from '@nextgisweb/resource/type/api';
  import type * as ns558 from '@nextgisweb/sld/type/api';
  import type * as ns155 from '@nextgisweb/file-upload/type/api';

  export {};
  export type QgisStyleFormat = 'default' | 'qml_file' | 'sld_file' | 'sld';
  export type QgisVectorStyleRead = {
    format: QgisStyleFormat;
    sld?: ns558.Style;
    svg_marker_library: ns355.ResourceRefWithParent | null;
  };
  export type QgisRasterStyleRead = {
    format: QgisStyleFormat;
    sld?: ns558.Style;
  };
  export type QgisVectorStyleUpdate = {
    format?: QgisStyleFormat;
    sld?: ns558.Style;
    file_upload?: ns155.FileUploadRef;
    copy_from?: ns355.ResourceRef;
    svg_marker_library?: ns355.ResourceRef | null;
  };
  export type QgisRasterStyleUpdate = {
    format?: QgisStyleFormat;
    sld?: ns558.Style;
    file_upload?: ns155.FileUploadRef;
    copy_from?: ns355.ResourceRef;
  };
  export type QgisVectorStyleCreate = {
    format?: QgisStyleFormat;
    sld?: ns558.Style;
    file_upload?: ns155.FileUploadRef;
    copy_from?: ns355.ResourceRef;
    svg_marker_library?: ns355.ResourceRef | null;
  };
  export type QgisRasterStyleCreate = {
    format?: QgisStyleFormat;
    sld?: ns558.Style;
    file_upload?: ns155.FileUploadRef;
    copy_from?: ns355.ResourceRef;
  };
  export type OriginalEnum = 'prefer' | 'require' | 'process';
}

declare module '@nextgisweb/sld/type/api' {
  export {};
  export type WellKnownName =
    | 'square'
    | 'circle'
    | 'triangle'
    | 'star'
    | 'cross';
  export type Fill = {
    opacity?: number /* float */;
    color?: string;
  };
  export type Stroke = {
    opacity?: number /* float */;
    color?: string;
    width?: number /* float */;
  };
  export type Mark = {
    well_known_name?: WellKnownName;
    fill?: Fill;
    stroke?: Stroke;
  };
  export type Graphic = {
    opacity?: number /* float */;
    mark?: Mark;
    size?: number /* float */;
  };
  export type PointSymbolizer = {
    type: 'point';
    graphic: Graphic;
  };
  export type LineSymbolizer = {
    type: 'line';
    stroke: Stroke;
  };
  export type PolygonSymbolizer = {
    type: 'polygon';
    stroke?: Stroke;
    fill?: Fill;
  };
  export type Algorithm = 'stretch' | 'clip' | 'clip_to_zero';
  export type NormalizeEnhancement = {
    algorithm: Algorithm;
    min_value: number /* float */;
    max_value: number /* float */;
  };
  export type ContrastEnhancement = { normalize: NormalizeEnhancement };
  export type Channel = {
    source_channel: number /* int */;
    contrast_enhancement?: ContrastEnhancement;
  };
  export type Channels = {
    red?: Channel;
    green?: Channel;
    blue?: Channel;
  };
  export type RasterSymbolizer = {
    type: 'raster';
    channels: Channels;
    opacity?: number /* float */;
  };
  export type Rule = {
    symbolizers: (
      | PointSymbolizer
      | LineSymbolizer
      | PolygonSymbolizer
      | RasterSymbolizer
    )[];
  };
  export type Style = { rules: Rule[] };
}

declare module '@nextgisweb/gpdobj/type/api' {
  export {};
  export type GPDObjDMSectionRead = {
    name: string;
    cpref: string;
  };
  export type GPDObjDMRead = {
    sections: string[];
    archive: boolean;
  };
  export type GPDObjPIDMRead = { code: string };
  export type GPDObjPIRObjRead = {
    code: string;
    subp_name: string | null;
    subp_industry: string | null;
    invp_code: string | null;
  };
  export type GPDObjPIROIPRead = {
    code: string;
    ckind: string | null;
    customer: string | null;
    iform: string | null;
    status: string | null;
    year: number /* int */ | null;
  };
  export type GPDObjPIRDMRead = { code: string };
  export type GPDObjDMSectionUpdate = Record<string, never>;
  export type GPDObjDMUpdate = {
    sections?: string[];
    archive?: boolean;
  };
  export type GPDObjPIDMUpdate = { code?: string };
  export type GPDObjPIRObjUpdate = {
    code?: string;
    subp_name?: string | null;
    subp_industry?: string | null;
    invp_code?: string | null;
  };
  export type GPDObjPIROIPUpdate = {
    code?: string;
    ckind?: string | null;
    customer?: string | null;
    iform?: string | null;
    status?: string | null;
    year?: number /* int */ | null;
  };
  export type GPDObjPIRDMUpdate = { code?: string };
  export type GPDObjDMSectionCreate = Record<string, never>;
  export type GPDObjDMCreate = {
    sections?: string[];
    archive?: boolean;
  };
  export type GPDObjPIDMCreate = { code?: string };
  export type GPDObjPIRObjCreate = {
    code?: string;
    subp_name?: string | null;
    subp_industry?: string | null;
    invp_code?: string | null;
  };
  export type GPDObjPIROIPCreate = {
    code?: string;
    ckind?: string | null;
    customer?: string | null;
    iform?: string | null;
    status?: string | null;
    year?: number /* int */ | null;
  };
  export type GPDObjPIRDMCreate = { code?: string };
  export type GPDObjCSection = {
    name: string;
    alias: string;
    cpref: string;
  };
  export type GPDObjCSections = {
    PI: Record<string, GPDObjCSection>;
    PIR: Record<string, GPDObjCSection>;
    OPER: Record<string, GPDObjCSection>;
  };
}

declare module '@nextgisweb/mapserver/type/api' {
  export {};
  export type MapserverStyleRead = { xml: string };
  export type MapserverStyleUpdate = { xml?: string };
  export type MapserverStyleCreate = { xml: string };
}

declare module '@nextgisweb/terrain-provider/type/api' {
  export {};
  export type EncodingEnum = 'MAPZEN_TERRARIUM' | 'MAPBOX_TERRAIN_RGB';
  export type TerrainProviderRead = { encoding_type: EncodingEnum };
  export type TerrainProviderUpdate = { encoding_type?: EncodingEnum };
  export type TerrainProviderCreate = { encoding_type?: EncodingEnum };
}

declare module '@nextgisweb/model-3d/type/api' {
  import type * as ns155 from '@nextgisweb/file-upload/type/api';

  export {};
  export type Model3DRead = Record<string, never>;
  export type Model3DUpdate = { source?: ns155.FileUploadRef };
  export type Model3DCreate = { source?: ns155.FileUploadRef };
}

declare module '@nextgisweb/style-3d/type/api' {
  export {};
  export type Style3DRead = {
    style_type?: 'POI' | 'GEOJSON' | 'MODEL' | 'SPHERE' | 'ELLIPSOID';
    z_offset?: number /* float */ | null;
    poi_icon?: string | null;
    poi_icon_field?: number /* int */ | null;
    poi_icon_type?: 'VALUE' | 'FIELD';
    poi_color?: string | null;
    poi_color_field?: number /* int */ | null;
    poi_color_type?: 'VALUE' | 'FIELD';
    poi_priority_field?: number /* int */ | null;
    poi_priority_inverse?: boolean | null;
    poi_limit?: number /* int */ | null;
    gj_stroke?: string | null;
    gj_stroke_field?: number /* int */ | null;
    gj_stroke_type?: 'VALUE' | 'FIELD';
    gj_stroke_width?: string | null;
    gj_stroke_width_field?: number /* int */ | null;
    gj_stroke_width_type?: 'VALUE' | 'FIELD';
    gj_stroke_fill?: string | null;
    gj_stroke_fill_field?: number /* int */ | null;
    gj_stroke_fill_type?: 'VALUE' | 'FIELD';
    gj_height?: number /* float */ | null;
    gj_height_field?: number /* int */ | null;
    gj_height_type?: 'VALUE' | 'FIELD';
    sphere_stroke?: string | null;
    sphere_stroke_field?: number /* int */ | null;
    sphere_stroke_type?: 'VALUE' | 'FIELD';
    sphere_stroke_width?: string | null;
    sphere_stroke_width_field?: number /* int */ | null;
    sphere_stroke_width_type?: 'VALUE' | 'FIELD';
    sphere_stroke_fill?: string | null;
    sphere_stroke_fill_field?: number /* int */ | null;
    sphere_stroke_fill_type?: 'VALUE' | 'FIELD';
    sphere_radius?: number /* float */ | null;
    sphere_radius_field?: number /* int */ | null;
    sphere_radius_type?: 'VALUE' | 'FIELD';
    ellipsoid_stroke?: string | null;
    ellipsoid_stroke_field?: number /* int */ | null;
    ellipsoid_stroke_type?: 'VALUE' | 'FIELD';
    ellipsoid_stroke_width?: string | null;
    ellipsoid_stroke_width_field?: number /* int */ | null;
    ellipsoid_stroke_width_type?: 'VALUE' | 'FIELD';
    ellipsoid_stroke_fill?: string | null;
    ellipsoid_stroke_fill_field?: number /* int */ | null;
    ellipsoid_stroke_fill_type?: 'VALUE' | 'FIELD';
    ellipsoid_length?: number /* float */ | null;
    ellipsoid_length_field?: number /* int */ | null;
    ellipsoid_length_type?: 'VALUE' | 'FIELD';
    ellipsoid_width?: number /* float */ | null;
    ellipsoid_width_field?: number /* int */ | null;
    ellipsoid_width_type?: 'VALUE' | 'FIELD';
    ellipsoid_height?: number /* float */ | null;
    ellipsoid_height_field?: number /* int */ | null;
    ellipsoid_height_type?: 'VALUE' | 'FIELD';
    model_id?: number /* int */ | null;
    model_id_field?: number /* int */ | null;
    model_id_type?: 'VALUE' | 'FIELD';
    model_scale?: number /* float */ | null;
    model_scale_field?: number /* int */ | null;
    model_scale_type?: 'VALUE' | 'FIELD';
    model_rotate?: number /* float */ | null;
    model_rotate_field?: number /* int */ | null;
    model_rotate_type?: 'VALUE' | 'FIELD';
  };
  export type Style3DUpdate = {
    style_type?: 'POI' | 'GEOJSON' | 'MODEL' | 'SPHERE' | 'ELLIPSOID';
    z_offset?: number /* float */ | null;
    poi_icon?: string | null;
    poi_icon_field?: number /* int */ | null;
    poi_icon_type?: 'VALUE' | 'FIELD';
    poi_color?: string | null;
    poi_color_field?: number /* int */ | null;
    poi_color_type?: 'VALUE' | 'FIELD';
    poi_priority_field?: number /* int */ | null;
    poi_priority_inverse?: boolean | null;
    poi_limit?: number /* int */ | null;
    gj_stroke?: string | null;
    gj_stroke_field?: number /* int */ | null;
    gj_stroke_type?: 'VALUE' | 'FIELD';
    gj_stroke_width?: string | null;
    gj_stroke_width_field?: number /* int */ | null;
    gj_stroke_width_type?: 'VALUE' | 'FIELD';
    gj_stroke_fill?: string | null;
    gj_stroke_fill_field?: number /* int */ | null;
    gj_stroke_fill_type?: 'VALUE' | 'FIELD';
    gj_height?: number /* float */ | null;
    gj_height_field?: number /* int */ | null;
    gj_height_type?: 'VALUE' | 'FIELD';
    sphere_stroke?: string | null;
    sphere_stroke_field?: number /* int */ | null;
    sphere_stroke_type?: 'VALUE' | 'FIELD';
    sphere_stroke_width?: string | null;
    sphere_stroke_width_field?: number /* int */ | null;
    sphere_stroke_width_type?: 'VALUE' | 'FIELD';
    sphere_stroke_fill?: string | null;
    sphere_stroke_fill_field?: number /* int */ | null;
    sphere_stroke_fill_type?: 'VALUE' | 'FIELD';
    sphere_radius?: number /* float */ | null;
    sphere_radius_field?: number /* int */ | null;
    sphere_radius_type?: 'VALUE' | 'FIELD';
    ellipsoid_stroke?: string | null;
    ellipsoid_stroke_field?: number /* int */ | null;
    ellipsoid_stroke_type?: 'VALUE' | 'FIELD';
    ellipsoid_stroke_width?: string | null;
    ellipsoid_stroke_width_field?: number /* int */ | null;
    ellipsoid_stroke_width_type?: 'VALUE' | 'FIELD';
    ellipsoid_stroke_fill?: string | null;
    ellipsoid_stroke_fill_field?: number /* int */ | null;
    ellipsoid_stroke_fill_type?: 'VALUE' | 'FIELD';
    ellipsoid_length?: number /* float */ | null;
    ellipsoid_length_field?: number /* int */ | null;
    ellipsoid_length_type?: 'VALUE' | 'FIELD';
    ellipsoid_width?: number /* float */ | null;
    ellipsoid_width_field?: number /* int */ | null;
    ellipsoid_width_type?: 'VALUE' | 'FIELD';
    ellipsoid_height?: number /* float */ | null;
    ellipsoid_height_field?: number /* int */ | null;
    ellipsoid_height_type?: 'VALUE' | 'FIELD';
    model_id?: number /* int */ | null;
    model_id_field?: number /* int */ | null;
    model_id_type?: 'VALUE' | 'FIELD';
    model_scale?: number /* float */ | null;
    model_scale_field?: number /* int */ | null;
    model_scale_type?: 'VALUE' | 'FIELD';
    model_rotate?: number /* float */ | null;
    model_rotate_field?: number /* int */ | null;
    model_rotate_type?: 'VALUE' | 'FIELD';
  };
  export type Style3DCreate = {
    style_type?: 'POI' | 'GEOJSON' | 'MODEL' | 'SPHERE' | 'ELLIPSOID';
    z_offset?: number /* float */ | null;
    poi_icon?: string | null;
    poi_icon_field?: number /* int */ | null;
    poi_icon_type?: 'VALUE' | 'FIELD';
    poi_color?: string | null;
    poi_color_field?: number /* int */ | null;
    poi_color_type?: 'VALUE' | 'FIELD';
    poi_priority_field?: number /* int */ | null;
    poi_priority_inverse?: boolean | null;
    poi_limit?: number /* int */ | null;
    gj_stroke?: string | null;
    gj_stroke_field?: number /* int */ | null;
    gj_stroke_type?: 'VALUE' | 'FIELD';
    gj_stroke_width?: string | null;
    gj_stroke_width_field?: number /* int */ | null;
    gj_stroke_width_type?: 'VALUE' | 'FIELD';
    gj_stroke_fill?: string | null;
    gj_stroke_fill_field?: number /* int */ | null;
    gj_stroke_fill_type?: 'VALUE' | 'FIELD';
    gj_height?: number /* float */ | null;
    gj_height_field?: number /* int */ | null;
    gj_height_type?: 'VALUE' | 'FIELD';
    sphere_stroke?: string | null;
    sphere_stroke_field?: number /* int */ | null;
    sphere_stroke_type?: 'VALUE' | 'FIELD';
    sphere_stroke_width?: string | null;
    sphere_stroke_width_field?: number /* int */ | null;
    sphere_stroke_width_type?: 'VALUE' | 'FIELD';
    sphere_stroke_fill?: string | null;
    sphere_stroke_fill_field?: number /* int */ | null;
    sphere_stroke_fill_type?: 'VALUE' | 'FIELD';
    sphere_radius?: number /* float */ | null;
    sphere_radius_field?: number /* int */ | null;
    sphere_radius_type?: 'VALUE' | 'FIELD';
    ellipsoid_stroke?: string | null;
    ellipsoid_stroke_field?: number /* int */ | null;
    ellipsoid_stroke_type?: 'VALUE' | 'FIELD';
    ellipsoid_stroke_width?: string | null;
    ellipsoid_stroke_width_field?: number /* int */ | null;
    ellipsoid_stroke_width_type?: 'VALUE' | 'FIELD';
    ellipsoid_stroke_fill?: string | null;
    ellipsoid_stroke_fill_field?: number /* int */ | null;
    ellipsoid_stroke_fill_type?: 'VALUE' | 'FIELD';
    ellipsoid_length?: number /* float */ | null;
    ellipsoid_length_field?: number /* int */ | null;
    ellipsoid_length_type?: 'VALUE' | 'FIELD';
    ellipsoid_width?: number /* float */ | null;
    ellipsoid_width_field?: number /* int */ | null;
    ellipsoid_width_type?: 'VALUE' | 'FIELD';
    ellipsoid_height?: number /* float */ | null;
    ellipsoid_height_field?: number /* int */ | null;
    ellipsoid_height_type?: 'VALUE' | 'FIELD';
    model_id?: number /* int */ | null;
    model_id_field?: number /* int */ | null;
    model_id_type?: 'VALUE' | 'FIELD';
    model_scale?: number /* float */ | null;
    model_scale_field?: number /* int */ | null;
    model_scale_type?: 'VALUE' | 'FIELD';
    model_rotate?: number /* float */ | null;
    model_rotate_field?: number /* int */ | null;
    model_rotate_type?: 'VALUE' | 'FIELD';
  };
}

declare module '@nextgisweb/scene-3d/type/api' {
  import type * as ns355 from '@nextgisweb/resource/type/api';

  export {};
  export type Scene3DGroupRead = {
    item_type: 'group';
    display_name: string;
    group_expanded: boolean;
    children: (Scene3DGroupRead | Scene3DItemRead)[];
  };
  export type Scene3DItemRead = {
    item_type: 'item';
    display_name: string;
    parent: number /* int */;
    resource_id: number /* int */;
    resource_cls: string;
    visible: boolean;
    classification_layer: ns355.ResourceRef | null;
    tileset_3d_color: string | null;
    payload: any;
    id: number /* int */;
  };
  export type Scene3DRootRead = {
    item_type: 'root';
    children: (Scene3DGroupRead | Scene3DItemRead)[];
  };
  export type Scene3DRead = {
    extent_left: number /* float */ | null;
    extent_right: number /* float */ | null;
    extent_bottom: number /* float */ | null;
    extent_top: number /* float */ | null;
    enable_ya_panoramas: boolean | null;
    ya_panoramas_api_key: string | null;
    enable_google_street_view: boolean | null;
    google_street_view_api_key: string | null;
    view: 'GLOBUS' | 'PLANE';
    quality: 'MIN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'MAX';
    pinch: number /* float */ | null;
    rotate: number /* float */ | null;
    root_item: Scene3DRootRead;
  };
  export type Scene3DBasemapsItemRead = {
    resource_id: number /* int */;
    display_name: string;
    enabled: boolean;
    opacity: number /* float */ | null;
  };
  export type Scene3DBasemapRead = { basemaps3d: Scene3DBasemapsItemRead[] };
  export type Scene3DTerrainItem = {
    resource_id: number /* int */;
    display_name: string;
    enabled: boolean;
  };
  export type Scene3DTerrainRead = { terrains3d: Scene3DTerrainItem[] };
  export type Scene3DGroupWrite = {
    item_type: 'group';
    display_name: string;
    group_expanded: boolean;
    children: (Scene3DGroupWrite | Scene3DItemWrite)[];
  };
  export type Scene3DItemWrite = {
    item_type: 'item';
    display_name: string;
    resource_id: number /* int */;
    visible: boolean;
    classification_layer: ns355.ResourceRef | null;
    tileset_3d_color: string | null;
  };
  export type Scene3DRootWrite = {
    item_type: 'root';
    children: (Scene3DGroupWrite | Scene3DItemWrite)[];
  };
  export type Scene3DUpdate = {
    extent_left?: number /* float */ | null;
    extent_right?: number /* float */ | null;
    extent_bottom?: number /* float */ | null;
    extent_top?: number /* float */ | null;
    enable_ya_panoramas?: boolean | null;
    ya_panoramas_api_key?: string | null;
    enable_google_street_view?: boolean | null;
    google_street_view_api_key?: string | null;
    view?: 'GLOBUS' | 'PLANE';
    quality?: 'MIN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'MAX';
    pinch?: number /* float */ | null;
    rotate?: number /* float */ | null;
    root_item?: Scene3DRootWrite;
  };
  export type Scene3DBasemapsItemWrite = {
    resource_id: number /* int */;
    display_name: string;
    enabled?: boolean;
    opacity?: number /* float */ | null;
  };
  export type Scene3DBasemapUpdate = {
    basemaps3d?: Scene3DBasemapsItemWrite[];
  };
  export type Scene3DTerrainUpdate = { terrains3d?: Scene3DTerrainItem[] };
  export type Scene3DCreate = {
    extent_left?: number /* float */ | null;
    extent_right?: number /* float */ | null;
    extent_bottom?: number /* float */ | null;
    extent_top?: number /* float */ | null;
    enable_ya_panoramas?: boolean | null;
    ya_panoramas_api_key?: string | null;
    enable_google_street_view?: boolean | null;
    google_street_view_api_key?: string | null;
    view?: 'GLOBUS' | 'PLANE';
    quality?: 'MIN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'MAX';
    pinch?: number /* float */ | null;
    rotate?: number /* float */ | null;
    root_item?: Scene3DRootWrite;
  };
  export type Scene3DBasemapCreate = {
    basemaps3d?: Scene3DBasemapsItemWrite[];
  };
  export type Scene3DTerrainCreate = { terrains3d?: Scene3DTerrainItem[] };
}

declare module '@nextgisweb/tileset-3d/type/api' {
  import type * as ns155 from '@nextgisweb/file-upload/type/api';

  export {};
  export type Tileset3DRead = {
    with_terrain_height: boolean | null;
    z_offset: number /* float */ | null;
    main_tileset?: string | null;
  };
  export type Tileset3DUpdate = {
    with_terrain_height?: boolean | null;
    z_offset?: number /* float */ | null;
    source?: ns155.FileUploadRef;
  };
  export type Tileset3DCreate = {
    with_terrain_height?: boolean | null;
    z_offset?: number /* float */ | null;
    source?: ns155.FileUploadRef;
  };
}

declare module '@nextgisweb/tracker/type/api' {
  export {};
  export type TrackerRead = {
    unique_id?: string;
    device_type?: string;
    is_registered?: boolean | null;
    description?: string | null;
    consumption_lpkm?: number /* float */ | null;
  };
  export type TrackerUpdate = {
    unique_id?: string;
    device_type?: string;
    is_registered?: boolean | null;
    description?: string | null;
    consumption_lpkm?: number /* float */ | null;
  };
  export type TrackerCreate = {
    unique_id: string;
    device_type: string;
    is_registered?: boolean | null;
    description?: string | null;
    consumption_lpkm?: number /* float */ | null;
  };
  export type TrackerCSetting =
    | 'all'
    | 'stop_min_speed'
    | 'stop_min_time'
    | 'time_zone'
    | 'split_time_diff';
  export type TrackerCSettingsRead = {
    stop_min_speed?: number /* float */;
    stop_min_time?: number /* float */;
    time_zone?: number /* float */;
    split_time_diff?: number /* int */;
  };
  export type TrackerCSettingsUpdate = {
    stop_min_speed?: number /* float */ | null;
    stop_min_time?: number /* float */ | null;
    time_zone?: number /* float */ | null;
    split_time_diff?: number /* int */ | null;
  };
}

declare module '@nextgisweb/spatial-ref-sys/type/api' {
  export {};
  export type SRSRead = {
    id: number /* int */;
    display_name: string;
    auth_name: string | null;
    auth_srid: number /* int */ | null;
    wkt: string;
    catalog_id: number /* int */ | null;
    system: boolean;
    protected: boolean;
    geographic: boolean;
  };
  export type SRSCreate = {
    display_name: string;
    wkt: string;
  };
  export type SRSRef = { id: number /* int */ };
  export type SRSFormat = 'proj4' | 'epsg' | 'esri' | 'mapinfo' | 'wkt';
  export type ConvertBody = {
    format: SRSFormat;
    projStr: string;
  };
  export type ConvertResponse = { wkt: string };
  export type GeomTransformBatchBody = {
    srs_from: number /* int */;
    srs_to: number /* int */[];
    geom: string;
  };
  export type GeomTransformBatchResponse = {
    srs_id: string;
    geom: string;
  };
  export type GeomTransformBody = {
    srs: number /* int */;
    geom: string;
  };
  export type GeomTransformResponse = { geom: string };
  export type GeometryPropertyGeomFormat = 'geojson' | 'wkt';
  export type GeometryPropertyBody = {
    srs?: number /* int */;
    geom_format?: GeometryPropertyGeomFormat;
    geom: string | Record<string, any>;
  };
  export type GeometryPropertyResponse = { value: number /* float */ };
  export type SRSUpdate = {
    display_name?: string;
    wkt?: string;
  };
  export type SRSCatalogRecord = {
    id: number /* int */;
    display_name: string;
    auth_name: string;
    auth_srid: number /* int */;
  };
  export type SRSCatalogItem = {
    display_name: string;
    wkt: string;
  };
  export type SRSCatalogImportBody = { catalog_id: number /* int */ };
  export type SRSCatalogImportResponse = { id: number /* int */ };
}

declare module '@nextgisweb/feature-description/type/api' {
  export {};
  export type DescriptionPut = {
    action: 'description.put';
    fid: number /* int */;
    vid: number /* int */;
    value: string | null;
  };
}

declare module '@nextgisweb/feature-attachment/type/api' {
  export {};
  export type AttachmentCreate = {
    action: 'attachment.create';
    fid: number /* int */;
    aid: number /* int */;
    vid: number /* int */;
    fileobj: number /* int */;
    keyname?: string;
    name?: string;
    mime_type: string;
    description?: string;
  };
  export type AttachmentUpdate = {
    action: 'attachment.update';
    fid: number /* int */;
    aid: number /* int */;
    vid: number /* int */;
    fileobj?: number /* int */;
    keyname?: string | null;
    name?: string | null;
    mime_type?: string;
    description?: string | null;
  };
  export type AttachmentDelete = {
    action: 'attachment.delete';
    fid: number /* int */;
    vid: number /* int */;
    aid: number /* int */;
  };
  export type BundleItem = {
    resource: number /* int */;
    attachment: number /* int */;
  };
  export type BundleBody = { items: BundleItem[] };
}

declare module '@nextgisweb/audit/type/api' {
  export {};
  export type QueryFormat = 'array' | 'object' | 'csv';
  export type AuditArrayLogEntry = [
    string,
    (string | number /* int */ | null)[],
  ];
  export type RequestObject = {
    path: string;
    method: string;
    remote_addr: string;
  };
  export type ResponseObject = {
    route_name: string;
    status_code: number /* int */;
  };
  export type UserObject = {
    id: number /* int */;
    keyname: string;
    display_name: string;
  };
  export type AuditObject = {
    request: RequestObject;
    response: ResponseObject;
    user: UserObject | null;
  };
}

declare module '@nextgisweb/gpcrossreport/type/api' {
  export {};
  export type CrossReportParams = {
    format: 'pdf' | 'odt' | 'ods' | 'html';
    geom: Record<string, any>;
    srid: number /* int */;
    layers: number /* int */[];
  };
}

declare module '@nextgisweb/gplprofile/type/api' {
  export {};
  export type ProfileParams = {
    data_source: 'raster' | 'vector';
    scale: '1m' | '200k' | '100k' | '50k' | '25k';
    geom: Record<string, any>;
    srid: number /* int */;
    step: number /* int */;
  };
  export type ProfileResponse = {
    points: [number /* float */, number /* float */][];
  };
  export type ExportFormat = 'csv';
  export type ExportProfileParams = {
    data_source: 'raster' | 'vector';
    scale: '1m' | '200k' | '100k' | '50k' | '25k';
    geom: Record<string, any>;
    srid: number /* int */;
    step: number /* int */;
    format: ExportFormat;
  };
}

declare module '@nextgisweb/gputil/type/api' {
  export {};
  export type RasterMetadataGroupsSettings = {
    raster_metadata_groups: number /* int */[];
  };
}

declare module '@nextgisweb/pyramid/type/route' {
  import type * as ns227 from '@nextgisweb/auth/type/api';
  import type * as ns1612 from '@nextgisweb/gputil/type/api';
  import type * as ns416 from '@nextgisweb/render/type/api';
  import type * as ns355 from '@nextgisweb/resource/type/api';
  import type * as ns544 from '@nextgisweb/qgis/type/api';
  import type * as ns1270 from '@nextgisweb/feature-description/type/api';
  import type * as ns464 from '@nextgisweb/postgis/type/api';
  import type * as ns650 from '@nextgisweb/tracker/type/api';
  import type * as ns1272 from '@nextgisweb/feature-attachment/type/api';
  import type * as ns1571 from '@nextgisweb/gpcrossreport/type/api';
  import type * as ns491 from '@nextgisweb/wfsclient/type/api';
  import type * as ns149 from '@nextgisweb/core/type/api';
  import type * as ns155 from '@nextgisweb/file-upload/type/api';
  import type * as ns1049 from '@nextgisweb/spatial-ref-sys/type/api';
  import type * as ns579 from '@nextgisweb/gpdobj/type/api';
  import type * as ns527 from '@nextgisweb/tmsclient/type/api';
  import type * as ns106 from '@nextgisweb/pyramid/type/api';
  import type * as ns426 from '@nextgisweb/webmap/type/api';
  import type * as ns1506 from '@nextgisweb/audit/type/api';
  import type * as ns1597 from '@nextgisweb/gplprofile/type/api';
  import type * as ns459 from '@nextgisweb/vector-layer/type/api';
  import type * as ns410 from '@nextgisweb/feature-layer/type/api';

  export {};
  export type Routes = {
    'pyramid.static': {
      pathObj: { skey: string };
      pathArr: [skey: string];
    };
    'pyramid.asset.favicon': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.asset.css': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.asset.hlogo': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.asset.blogo': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.openapi_json': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.openapi_json_test': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.swagger': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.control_panel': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.control_panel.sysinfo': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.control_panel.fonts': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.control_panel.backup.browse': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.control_panel.backup.download': {
      pathObj: { filename: string };
      pathArr: [filename: string];
    };
    'pyramid.control_panel.cors': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.control_panel.custom_css': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.control_panel.logo': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.control_panel.system_name': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.control_panel.home_path': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.control_panel.metrics': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.locale': {
      pathObj: { locale: string };
      pathArr: [locale: string];
    };
    'pyramid.test_request': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.test_exception_handled': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.test_exception_unhandled': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.test_exception_transaction': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.test_exception_template': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.test_timeout': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.settings': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: {
        query: {
          component:
            | 'pyramid'
            | 'auth'
            | 'resource'
            | 'file_upload'
            | 'spatial_ref_sys'
            | 'feature_layer'
            | 'feature_attachment'
            | 'render'
            | 'webmap'
            | 'raster_layer'
            | 'wmsclient'
            | 'tmsclient'
            | 'basemap'
            | 'demo'
            | 'gpdobj'
            | 'terrain_provider'
            | 'tracker';
        };
        response: Record<string, any>;
      };
    };
    'pyramid.route': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: Record<string, string[]> };
    };
    'pyramid.pkg_version': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: Record<string, string> };
    };
    'pyramid.healthcheck': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: ns106.HealthcheckResponse | ns106.HealthcheckResponse };
    };
    'pyramid.ping': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: ns106.PingResponse };
    };
    'pyramid.statistics': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: Record<string, Record<string, any>> };
    };
    'pyramid.estimate_storage': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: { response: Record<string, never> };
    };
    'pyramid.storage_status': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: ns106.StorageStatusResponse };
    };
    'pyramid.storage': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: Record<string, ns106.StorageResponseValue> };
    };
    'pyramid.kind_of_data': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: Record<string, string> };
    };
    'pyramid.font': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: (ns149.SystemFont | ns149.CustomFont)[] };
      put: {
        body: ns106.FontCUpdateBody;
        response: ns106.FontCUpdateResponse;
      };
    };
    'pyramid.codegen_api_type': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.uacompat': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'lunkwill.summary': {
      pathObj: { id: string };
      pathArr: [id: string];
    };
    'lunkwill.response': {
      pathObj: { id: string };
      pathArr: [id: string];
    };
    'jsrealm.testentry': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'auth.login': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'auth.session_invite': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'auth.alink': {
      pathObj: { token: string };
      pathArr: [token: string];
    };
    'auth.oauth': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'auth.logout': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'auth.settings': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'auth.user.browse': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'auth.user.create': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'auth.user.edit': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'auth.group.browse': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'auth.group.create': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'auth.group.edit': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'auth.user.collection': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: {
        query: { brief?: boolean };
        response: ns227.UserRead[] | ns227.UserReadBrief[];
      };
      post: {
        body: ns227.UserCreate;
        response: ns227.UserRef;
      };
    };
    'auth.user.item': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: {
        query: { brief?: boolean };
        response: ns227.UserRead | ns227.UserReadBrief;
      };
      put: {
        body: ns227.UserUpdate;
        response: ns227.UserRef;
      };
      delete: { response: Record<string, never> };
    };
    'auth.profile': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: ns227.ProfileRead };
      put: {
        body: ns227.ProfileUpdate;
        response: Record<string, never>;
      };
    };
    'auth.group.collection': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: {
        query: { brief?: boolean };
        response: ns227.GroupRead[] | ns227.GroupReadBrief[];
      };
      post: {
        body: ns227.GroupCreate;
        response: ns227.GroupRef;
      };
    };
    'auth.group.item': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: {
        query: { brief?: boolean };
        response: ns227.GroupRead | ns227.GroupReadBrief;
      };
      put: {
        body: ns227.GroupUpdate;
        response: ns227.GroupRef;
      };
      delete: { response: Record<string, never> };
    };
    'auth.current_user': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: {
        query: {
          require_authenticated?: boolean;
          refresh_session?: boolean;
        };
        response: ns227.CurrentUser;
      };
    };
    'auth.login_cookies': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: { response: ns227.LoginResponse };
    };
    'auth.logout_cookies': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: { response: Record<string, never> };
    };
    'auth.permission': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: Record<ns227.Permission, string> };
    };
    'resource.schema': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'resource.root': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'resource.widget': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'resource.show': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'resource.json': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'resource.effective_permissions': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'resource.export.page': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'resource.control_panel.resource_export': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'resource.create': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'resource.update': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'resource.delete': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'resource.favorite.page': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'resource.blueprint': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: ns355.Blueprint };
    };
    'resource.item': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: ns355.CompositeRead };
      put: {
        body: ns355.CompositeUpdate;
        response: Record<string, never>;
      };
      delete: { response: Record<string, never> };
    };
    'resource.collection': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: {
        query: { parent?: number /* int */ };
        response: ns355.CompositeRead[];
      };
      post: {
        body: ns355.CompositeCreate;
        response: ns355.ResourceRefWithParent;
      };
    };
    'resource.permission': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: {
        query: { user?: number /* int */ };
        response: ns355.EffectivePermissions;
      };
    };
    'resource.permission.explain': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: any };
    };
    'resource.volume': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: {
        query: { recursive?: boolean };
        response: ns355.ResourceVolume;
      };
    };
    'resource.search': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: {
        query: { serialization?: 'resource' | 'full' };
        response: ns355.CompositeRead[];
      };
    };
    'resource.quota_check': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: {
        body: ns355.QuotaCheckBody;
        response: ns355.QuotaCheckSuccess | ns355.QuotaCheckFailure;
      };
    };
    'resource.favorite.schema': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: Record<string, ns355.ResourceFavoriteSchemaItem> };
    };
    'resource.favorite.collection': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: ns355.ResourceFavoriteCollectionGetResponse };
      post: {
        body: ns355.ResourceFavoriteCreate;
        response: ns355.ResourceFavoriteRef;
      };
    };
    'resource.favorite.item': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      put: {
        body: ns355.FeatureFavoriteItemPutBody;
        response: Record<string, never>;
      };
      delete: { response: Record<string, never> };
    };
    'resource.export': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: {
        query: {
          srs?: number /* int */;
          bands?: number /* int */[];
          format?: 'GTiff' | 'HFA' | 'RMF';
        };
        response:
          | unknown /* <class 'pyramid.response.FileResponse'> */
          | unknown /* <class 'pyramid.response.Response'> */;
      };
    };
    'resource.file_download': {
      pathObj: {
        id: number /* int */;
        name: string;
      };
      pathArr: [id: number /* int */, name: string];
    };
    'resource.preview': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'file_upload.upload': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: { response: ns155.FileUploadFormPost | null };
      put: { response: ns155.FileUploadObject };
    };
    'file_upload.collection': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: { response: ns155.FileUploadFormPost | null };
      put: { response: ns155.FileUploadObject };
    };
    'file_upload.item': {
      pathObj: { id: string };
      pathArr: [id: string];
      get: { response: ns155.FileUploadObject };
      delete: { response: null };
      patch: { response: null };
    };
    'srs.browse': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'srs.create': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'srs.edit': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'srs.catalog': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'srs.catalog.import': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'spatial_ref_sys.collection': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: ns1049.SRSRead[] };
      post: {
        body: ns1049.SRSCreate;
        response: ns1049.SRSRef;
      };
    };
    'spatial_ref_sys.convert': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: {
        body: ns1049.ConvertBody;
        response: ns1049.ConvertResponse;
      };
    };
    'spatial_ref_sys.geom_transform.batch': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: {
        body: ns1049.GeomTransformBatchBody;
        response: ns1049.GeomTransformBatchResponse[];
      };
    };
    'spatial_ref_sys.geom_transform': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      post: {
        body: ns1049.GeomTransformBody;
        response: ns1049.GeomTransformResponse;
      };
    };
    'spatial_ref_sys.geom_length': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      post: {
        body: ns1049.GeometryPropertyBody;
        response: ns1049.GeometryPropertyResponse;
      };
    };
    'spatial_ref_sys.geom_area': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      post: {
        body: ns1049.GeometryPropertyBody;
        response: ns1049.GeometryPropertyResponse;
      };
    };
    'spatial_ref_sys.item': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: ns1049.SRSRead };
      put: {
        body: ns1049.SRSUpdate;
        response: ns1049.SRSRef;
      };
      delete: { response: Record<string, never> };
    };
    'spatial_ref_sys.catalog.collection': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: {
        query: {
          q?: string;
          lat?: number /* float */;
          lon?: number /* float */;
        };
        response: ns1049.SRSCatalogRecord[];
      };
    };
    'spatial_ref_sys.catalog.item': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: ns1049.SRSCatalogItem };
    };
    'spatial_ref_sys.catalog.import': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: {
        body: ns1049.SRSCatalogImportBody;
        response: ns1049.SRSCatalogImportResponse;
      };
    };
    'layer.extent': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: any };
    };
    'layer_preview.map': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'feature_layer.export_multiple': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'feature_layer.feature.browse': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'feature_layer.feature.show': {
      pathObj: {
        id: number /* int */;
        feature_id: number /* int */;
      };
      pathArr: [id: number /* int */, feature_id: number /* int */];
    };
    'feature_layer.feature.update': {
      pathObj: {
        id: number /* int */;
        feature_id: number /* int */;
      };
      pathArr: [id: number /* int */, feature_id: number /* int */];
    };
    'feature_layer.test_mvt': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'feature_layer.feature.item': {
      pathObj: {
        id: number /* int */;
        fid: number /* int */;
      };
      pathArr: [id: number /* int */, fid: number /* int */];
      get: {
        query: {
          label?: boolean;
          geom?: boolean;
          geom_format?: 'wkt' | 'geojson';
          dt_format?: 'iso' | 'obj';
          fields?: string[];
          extensions?: string[];
          srs?: number /* int */;
          version?: number /* int */;
          epoch?: number /* int */;
        };
        response: any;
      };
      put: {
        query: {
          geom_null?: boolean;
          geom_format?: 'wkt' | 'geojson';
          dt_format?: 'iso' | 'obj';
          srs?: number /* int */;
        };
        response: any;
      };
      delete: { response: any };
    };
    'feature_layer.feature.item_extent': {
      pathObj: {
        id: number /* int */;
        fid: number /* int */;
      };
      pathArr: [id: number /* int */, fid: number /* int */];
      get: { response: any };
    };
    'feature_layer.feature.geometry_info': {
      pathObj: {
        id: number /* int */;
        fid: number /* int */;
      };
      pathArr: [id: number /* int */, fid: number /* int */];
      get: { response: any };
    };
    'feature_layer.feature.collection': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: {
        query: {
          label?: boolean;
          geom?: boolean;
          geom_format?: 'wkt' | 'geojson';
          dt_format?: 'iso' | 'obj';
          fields?: string[];
          extensions?: string[];
          srs?: number /* int */;
          version?: number /* int */;
          epoch?: number /* int */;
          order_by?: string;
          limit?: number /* int */;
          offset?: number /* int */;
        };
        response: any;
      };
      post: {
        query: {
          geom_null?: boolean;
          geom_format?: 'wkt' | 'geojson';
          dt_format?: 'iso' | 'obj';
          srs?: number /* int */;
        };
        response: any;
      };
      delete: { response: any };
      patch: {
        query: {
          geom_null?: boolean;
          geom_format?: 'wkt' | 'geojson';
          dt_format?: 'iso' | 'obj';
          srs?: number /* int */;
        };
        response: any;
      };
    };
    'feature_layer.feature.count': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: any };
    };
    'feature_layer.feature.extent': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: any };
    };
    'feature_layer.geojson': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'feature_layer.export': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'feature_layer.identify': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: { response: any };
    };
    'feature_layer.mvt': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: {
        query: {
          resource: number /* int */[];
          z: number /* int */;
          x: number /* int */;
          y: number /* int */;
          extent?: number /* int */;
          simplification?: number /* float */;
          padding?: number /* float */;
        };
        response: null | null;
      };
    };
    'feature_layer.transaction.collection': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      post: {
        body: ns410.TransactionCreateBody;
        response: ns410.TransactionCreatedResponse;
      };
    };
    'feature_layer.transaction.item': {
      pathObj: {
        id: number /* int */;
        tid: number /* int */;
      };
      pathArr: [id: number /* int */, tid: number /* int */];
      get: {
        response: [
          number /* int */,
          (
            | ns410.FeatureCreateResult
            | ns410.FeatureUpdateResult
            | ns410.FeatureDeleteResult
            | ns410.FeatureRestoreResult
          ),
        ][];
      };
      post: { response: ns410.CommitErrors | ns410.CommitSuccess };
      put: {
        body: [
          number /* int */,
          (
            | ns410.FeatureCreate
            | ns410.FeatureUpdate
            | ns410.FeatureDelete
            | ns410.FeatureRestore
            | null
          ),
        ][];
        response: null;
      };
      delete: { response: null };
    };
    'feature_layer.changes_check': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: {
        query: {
          initial?: number /* int */;
          target?: number /* int */;
          epoch?: number /* int */;
          extensions?: ('description' | 'attachment')[];
        };
        response: ns410.ChangesCheckResponse | null;
      };
    };
    'feature_layer.changes_fetch': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: {
        query: {
          epoch: number /* int */;
          initial: number /* int */;
          target: number /* int */;
          cursor: string;
        };
        response: (
          | ns410.ChangesContinue
          | ns410.FeatureCreate
          | ns410.FeatureUpdate
          | ns410.FeatureDelete
          | ns410.FeatureRestore
          | ns1270.DescriptionPut
          | ns1272.AttachmentCreate
          | ns1272.AttachmentUpdate
          | ns1272.AttachmentDelete
        )[];
      };
    };
    'feature_layer.version.item': {
      pathObj: {
        id: number /* int */;
        vid: number /* int */;
      };
      pathArr: [id: number /* int */, vid: number /* int */];
      get: { response: ns410.VersionRead };
    };
    'feature_description.export': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'feature_attachment.download': {
      pathObj: {
        id: number /* int */;
        fid: number /* int */;
        aid: number /* int */;
      };
      pathArr: [
        id: number /* int */,
        fid: number /* int */,
        aid: number /* int */,
      ];
      get: { query: { fileobj?: number /* int */ } };
    };
    'feature_attachment.image': {
      pathObj: {
        id: number /* int */;
        fid: number /* int */;
        aid: number /* int */;
      };
      pathArr: [
        id: number /* int */,
        fid: number /* int */,
        aid: number /* int */,
      ];
    };
    'feature_attachment.item': {
      pathObj: {
        id: number /* int */;
        fid: number /* int */;
        aid: number /* int */;
      };
      pathArr: [
        id: number /* int */,
        fid: number /* int */,
        aid: number /* int */,
      ];
      get: { response: any };
      put: { response: any };
      delete: { response: any };
    };
    'feature_attachment.collection': {
      pathObj: {
        id: number /* int */;
        fid: number /* int */;
      };
      pathArr: [id: number /* int */, fid: number /* int */];
      get: { response: any };
      post: { response: any };
    };
    'feature_attachment.export': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'feature_attachment.import': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      put: { response: any };
    };
    'feature_attachment.bundle': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: { body: ns1272.BundleBody };
    };
    'feature_attachment.page': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'render.tile': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: {
        query: {
          resource: number /* int */[];
          z: number /* int */;
          x: number /* int */;
          y: number /* int */;
          symbols: Record<number /* int */, string[]>;
          nd?: 200 | 204 | 404;
          cache?: boolean;
        };
        response:
          | unknown /* <class 'pyramid.response.Response'> */
          | unknown /* <class 'pyramid.response.Response'> */
          | unknown /* <class 'pyramid.response.Response'> */;
      };
    };
    'render.image': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: {
        query: {
          resource: number /* int */[];
          extent: number /* float */[];
          size: number /* int */[];
          symbols: Record<number /* int */, string[]>;
          nd?: 200 | 204 | 404;
          cache?: boolean;
          tdi?: boolean;
        };
        response:
          | unknown /* <class 'pyramid.response.Response'> */
          | unknown /* <class 'pyramid.response.Response'> */
          | unknown /* <class 'pyramid.response.Response'> */;
      };
    };
    'render.legend': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'render.legend_symbols': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: {
        query: { icon_size?: number /* int */ };
        response: ns416.LegendSymbol[];
      };
    };
    'webmap.annotation.collection': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: any };
      post: { response: any };
    };
    'webmap.annotation.item': {
      pathObj: {
        id: number /* int */;
        annotation_id: number /* int */;
      };
      pathArr: [id: number /* int */, annotation_id: number /* int */];
      get: { response: any };
      put: { response: any };
      delete: { response: any };
    };
    'webmap.extent': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: any };
    };
    'webmap.print': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      post: { body: ns426.PrintBody };
    };
    'webmap.display': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'webmap.display.tiny': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'webmap.clone': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'webmap.preview_embedded': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'webmap.control_panel.settings': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'vector_layer.inspect': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: {
        body: ns155.FileUploadRef;
        response: ns459.InspectResponse;
      };
    };
    'postgis.connection.inspect': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: ns464.SchemaObject[] };
    };
    'postgis.connection.inspect.table': {
      pathObj: {
        id: number /* int */;
        table_name: string;
      };
      pathArr: [id: number /* int */, table_name: string];
      get: { response: ns464.ColumnObject[] };
    };
    'postgis.diagnostics': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: {
        body: ns464.CheckBody;
        response: ns464.CheckResponse;
      };
    };
    'postgis.diagnostics_page': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'raster_layer.cog': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'raster_layer.download': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: unknown /* <class 'pyramid.response.FileResponse'> */ };
    };
    'wfsserver.wfs': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'wfsclient.connection.inspect': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: ns491.InspectResponse };
    };
    'wfsclient.connection.inspect.layer': {
      pathObj: {
        id: number /* int */;
        layer: string;
      };
      pathArr: [id: number /* int */, layer: string];
      get: { response: ns491.InspectLayerResponse };
    };
    'wmsserver.wms': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'ogcfserver.landing_page': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: any };
    };
    'ogcfserver.openapi': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: any };
    };
    'ogcfserver.conformance': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: any };
    };
    'ogcfserver.collections': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: any };
    };
    'ogcfserver.collection': {
      pathObj: {
        id: number /* int */;
        collection_id: string;
      };
      pathArr: [id: number /* int */, collection_id: string];
      get: { response: any };
    };
    'ogcfserver.items': {
      pathObj: {
        id: number /* int */;
        collection_id: string;
      };
      pathArr: [id: number /* int */, collection_id: string];
      get: { response: any };
      post: { response: any };
    };
    'ogcfserver.item': {
      pathObj: {
        id: number /* int */;
        collection_id: string;
        item_id: number /* int */;
      };
      pathArr: [
        id: number /* int */,
        collection_id: string,
        item_id: number /* int */,
      ];
      get: { response: any };
      put: { response: any };
      delete: { response: any };
    };
    'tmsclient.connection.inspect': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: ns527.InspectResponse };
    };
    'audit.dbase': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: {
        query: {
          format: ns1506.QueryFormat;
          eq?: string;
          gt?: string;
          ge?: string;
          lt?: string;
          le?: string;
          fields?: string[];
          filter?: string;
          limit?: number /* int */;
        };
        response: ns1506.AuditArrayLogEntry[] | ns1506.AuditObject[] | string;
      };
    };
    'audit.control_panel.journal.browse': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'demo.project': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: any };
      post: { response: any };
    };
    'demo.project.preview': {
      pathObj: {
        identity: string;
        lang: string;
      };
      pathArr: [identity: string, lang: string];
    };
    'demo.select': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'demo.redirect': {
      pathObj: { project: string };
      pathArr: [project: string];
    };
    'qgis.style_qml': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get:
        | { query: { original?: ns544.OriginalEnum } }
        | { query: { original?: ns544.OriginalEnum } };
    };
    'eeko.import_form': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'eeko.import': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      post: { response: any };
    };
    'gallery.preview': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { query: { size?: string } };
    };
    'gallery.display': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'gpcrossreport.report.build': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: { body: ns1571.CrossReportParams };
    };
    'gpdobj.classifier.sections': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: ns579.GPDObjCSections };
    };
    'gpeeko.lists.buffer': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'gpeeko.buffer': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: { response: any };
    };
    'gpflstat.update': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: { response: any };
    };
    'gplprofile.profile.build': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: {
        body: ns1597.ProfileParams;
        response: ns1597.ProfileResponse;
      };
    };
    'gplprofile.profile.export': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: {
        body: ns1597.ExportProfileParams;
        response: ns1597.ProfileResponse;
      };
    };
    'gputil.raster_metadata_groups': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: ns1612.RasterMetadataGroupsSettings };
      put: {
        body: ns1612.RasterMetadataGroupsSettings;
        response: Record<string, never>;
      };
    };
    'terrain_provider.layer': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
      get: { response: any };
    };
    'terrain_provider.tile': {
      pathObj: {
        id: number /* int */;
        z: number /* int */;
        x: number /* int */;
        y: number /* int */;
      };
      pathArr: [
        id: number /* int */,
        z: number /* int */,
        x: number /* int */,
        y: number /* int */,
      ];
    };
    'terrain_provider.test': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    '__/static/asset/': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'model_3d.file_glb': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'model_3d.refs.types': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: any };
    };
    'model_3d.refs.source_types': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: any };
    };
    'scene_3d.display': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'tileset_3d.export': {
      pathObj: { id: number /* int */ };
      pathArr: [id: number /* int */];
    };
    'pyramid.control_panel.tracker': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'tracker.reports': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'tracker.reports.build': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'tracker.receive_packet': {
      pathObj: { unique_id: string };
      pathArr: [unique_id: string];
      post: { response: any };
    };
    'tracker.get_trackers': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: any };
    };
    'tracker.get_tracker_points': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: { response: any };
    };
    'tracker.get_short_tracks': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'tracker.get_full_tracks': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'tracker.get_tracker_last_points': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: { response: any };
    };
    'tracker.get_tracker_lines': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: { response: any };
    };
    'tracker.get_last_activity_tracker': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: any };
    };
    'tracker.get_stops': {
      pathObj: Record<string, never>;
      pathArr: [];
      post: { response: any };
    };
    'tracker.get_device_types': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: { response: any };
    };
    'tracker.export_to_gpx': {
      pathObj: Record<string, never>;
      pathArr: [];
    };
    'pyramid.csettings': {
      pathObj: Record<string, never>;
      pathArr: [];
      get: {
        query: {
          pyramid?: ns106.PyramidCSetting[];
          tracker?: ns650.TrackerCSetting[];
          resource?: ns355.ResourceCSetting[];
          webmap?: ns426.WebMapCSetting[];
        };
        response: ns106.CSettingsRead;
      };
      put: {
        body: ns106.CSettingsUpdate;
        response: Record<string, never>;
      };
    };
  };

  export default Routes;
}
