# NgwConnector

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/ngw-connector) ![version](https://img.shields.io/npm/v/@nextgis/ngw-connector)

A lightweight HTTP client optimized for use with [NextGIS Web](http://docs.nextgis.com/docs_ngweb_dev/doc/developer/toc.html) API.

Make sure CORS is registered in the [NextGIS Web settings](https://docs.nextgis.com/docs_ngcom/source/CORS.html) to be able to send requests.

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag, `NgwConnector` will be registered as a global variable.

```html
<script src="../lib/ngw-connector.global.js"></script>

<script>
  var ngwConnector = new NgwConnector({
    baseUrl: 'https://demo.nextgis.com',
  });
</script>
```

#### CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/ngw-connector"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/ngw-connector"></script>
```

We recommend linking to a specific version number `/ngw-connector@[version]`

### In Node.js

```bash
npm install @nextgis/ngw-connector
```

## Usage

```javascript
import NgwConnector from '@nextgis/ngw-connector';

const ngwConnector = new NgwConnector({
  baseUrl: 'https://demo.nextgis.com',
  // auth: {login, password}
});

ngwConnector.get('resource.item', null, { id: 485 }).then((data) => {
  console.log(data);
});

ngwConnector.post('resource.collection', { data: [RESOURCE JSON] });
ngwConnector.patch(
  'feature_layer.feature.collection',
  { data: [ITEMS JSON] },
  {
    id,
    srs: 4326,
    geom_format: 'geojson',
  }
);
ngwConnector.put('feature_layer.feature.item', { data: [ITEM JSON] }, { id, fid })
ngwConnector.delete('feature_layer.feature.item', null, { id, fid })

// Shortcuts methods to find resources
ngwConnector.getResource(2011); // by id
ngwConnector.getResource('keyname'); // by keyname

ngwConnector.getResources({ cls: 'vector_layer', parent__id: 0 }); // find resources by partial resource params
ngwConnector.getResource({ display_name: 'My layer', parent__id: 0 }); // get first
```

Check out the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_ngw_connector.html)

## NGW API

[NextGIS Web API Doc](http://docs.nextgis.com/docs_ngweb_dev/doc/developer/toc.html)

```javascript
ngwConnector.get(request_name, request_options, arguments);
```

[request_options](https://code-api.nextgis.com/interfaces/ngw_connector.RequestOptions.html)

<details>
  <summary>API request names</summary>

| request name                      | url                                                   | arguments        |
| --------------------------------- | ----------------------------------------------------- | ---------------- |
| auth.current_user                 | /api/component/auth/current_user                      |                  |
| auth.group.collection             | /api/component/auth/group/                            |                  |
| auth.group.create                 | /auth/group/create                                    |                  |
| auth.group.delete                 | /auth/group/{0}/delete                                | id               |
| auth.group.edit                   | /auth/group/{0}/edit                                  | id               |
| auth.group.item                   | /api/component/auth/group/{0}                         | id               |
| auth.login_cookies                | /api/component/auth/login                             |                  |
| auth.logout_cookies               | /api/component/auth/logout                            |                  |
| auth.profile                      | /api/component/auth/profile                           |                  |
| auth.register                     | /api/component/auth/register                          |                  |
| auth.user.collection              | /api/component/auth/user/                             |                  |
| auth.user.create                  | /auth/user/create                                     |                  |
| auth.user.delete                  | /auth/user/{0}/delete                                 | id               |
| auth.user.edit                    | /auth/user/{0}/edit                                   | id               |
| auth.user.item                    | /api/component/auth/user/{0}                          | id               |
| collector.resource.read           | /collector/resource/{0}/read                          | id               |
| collector.resource.users          | /collector/resource/{0}/users                         | id               |
| collector.settings                | /api/component/collector/settings                     |                  |
| collector.settings.users          | /collector/user                                       |                  |
| collector.user                    | /collector/user/{0}                                   | user_id          |
| feature_attachment.collection     | /api/resource/{0}/feature/{1}/attachment/             | id,fid           |
| feature_attachment.download       | /api/resource/{0}/feature/{1}/attachment/{2}/download | id,fid,aid       |
| feature_attachment.image          | /api/resource/{0}/feature/{1}/attachment/{2}/image    | id,fid,aid       |
| feature_attachment.item           | /api/resource/{0}/feature/{1}/attachment/{2}          | id,fid,aid       |
| feature_layer.feature.browse      | /resource/{0}/feature/                                | id               |
| feature_layer.feature.collection  | /api/resource/{0}/feature/                            | id               |
| feature_layer.feature.count       | /api/resource/{0}/feature_count                       | id               |
| feature_layer.feature.item        | /api/resource/{0}/feature/{1}                         | id,fid           |
| feature_layer.feature.item_extent | /api/resource/{0}/feature/{1}/extent                  | id,fid           |
| feature_layer.feature.show        | /resource/{0}/feature/{1}                             | id,feature_id    |
| feature_layer.feature.update      | /resource/{0}/feature/{1}/update                      | id,feature_id    |
| feature_layer.field               | /resource/{0}/field/                                  | id               |
| feature_layer.geojson             | /api/resource/{0}/geojson                             | id               |
| feature_layer.identify            | /api/feature_layer/identify                           |                  |
| feature_layer.mvt                 | /api/component/feature_layer/mvt                      |                  |
| feature_layer.store               | /api/resource/{0}/store/                              | id               |
| feature_layer.store.item          | /resource/{0}/store/{1}                               | id,feature_id    |
| file_upload.collection            | /api/component/file_upload/                           |                  |
| file_upload.item                  | /api/component/file_upload/{0}                        | id               |
| file_upload.upload                | /api/component/file_upload/upload                     |                  |
| formbuilder.formbuilder_form_ngfp | /api/resource/{0}/ngfp                                | id               |
| layer.extent                      | /api/resource/{0}/extent                              | id               |
| postgis.connection.inspect        | /api/resource/{0}/inspect/                            | id               |
| postgis.connection.inspect.table  | /api/resource/{0}/inspect/{1}/                        | id,table_name    |
| pyramid.company_logo              | /api/component/pyramid/company_logo                   |                  |
| pyramid.control_panel             | /control-panel                                        |                  |
| pyramid.control_panel.sysinfo     | /control-panel/sysinfo                                |                  |
| pyramid.cors                      | /api/component/pyramid/cors                           |                  |
| pyramid.custom_css                | /api/component/pyramid/custom_css                     |                  |
| pyramid.estimate_storage          | /api/component/pyramid/estimate_storage               |                  |
| pyramid.healthcheck               | /api/component/pyramid/healthcheck                    |                  |
| pyramid.home_path                 | /api/component/pyramid/home_path                      |                  |
| pyramid.kind_of_data              | /api/component/pyramid/kind_of_data                   |                  |
| pyramid.locdata                   | /api/component/pyramid/locdata/{0}/{1}                | component,locale |
| pyramid.logo                      | /api/component/pyramid/logo                           |                  |
| pyramid.pkg_version               | /api/component/pyramid/pkg_version                    |                  |
| pyramid.route                     | /api/component/pyramid/route                          |                  |
| pyramid.settings                  | /api/component/pyramid/settings                       |                  |
| pyramid.statistics                | /api/component/pyramid/statistics                     |                  |
| pyramid.storage                   | /api/component/pyramid/storage                        |                  |
| pyramid.system_name               | /api/component/pyramid/system_name                    |                  |
| qgis.style_qml                    | /api/resource/{0}/qml                                 | id               |
| render.image                      | /api/component/render/image                           |                  |
| render.legend                     | /api/resource/{0}/legend                              | id               |
| render.tile                       | /api/component/render/tile                            |                  |
| render.tile_cache.seed_status     | /api/resource/{0}/tile_cache/seed_status              | id               |
| resource.collection               | /api/resource/                                        |                  |
| resource.create                   | /resource/{0}/create                                  | id               |
| resource.delete                   | /resource/{0}/delete                                  | id               |
| resource.export                   | /api/resource/{0}/export                              | id               |
| resource.file_download            | /api/resource/{0}/file/{1}                            | id,name          |
| resource.item                     | /api/resource/{0}                                     | id               |
| resource.json                     | /resource/{0}/json                                    | id               |
| resource.permission               | /api/resource/{0}/permission                          | id               |
| resource.permission.explain       | /api/resource/{0}/permission/explain                  | id               |
| resource.preview                  | /api/resource/{0}/preview.png                         | id               |
| resource.quota                    | /api/resource/quota                                   |                  |
| resource.resource_export          | /api/component/resource/resource_export               |                  |
| resource.schema                   | /resource/schema                                      |                  |
| resource.search                   | /api/resource/search/                                 |                  |
| resource.show                     | /resource/{0}                                         | id               |
| resource.tree                     | /resource/{0}/tree                                    | id               |
| resource.update                   | /resource/{0}/update                                  | id               |
| resource.volume                   | /api/resource/{0}/volume                              | id               |
| resource.widget                   | /resource/widget                                      |                  |
| spatial_ref_sys.collection        | /api/component/spatial_ref_sys/                       |                  |
| spatial_ref_sys.convert           | /api/component/spatial_ref_sys/convert                |                  |
| spatial_ref_sys.geom_area         | /api/component/spatial_ref_sys/{0}/geom_area          | id               |
| spatial_ref_sys.geom_length       | /api/component/spatial_ref_sys/{0}/geom_length        | id               |
| spatial_ref_sys.geom_transform    | /api/component/spatial_ref_sys/{0}/geom_transform     | id               |
| spatial_ref_sys.get               | /api/component/spatial_ref_sys/{0}                    | id               |
| srs.create                        | /srs/create                                           |                  |
| srs.delete                        | /srs/{0}/delete                                       | id               |
| srs.edit                          | /srs/{0}/edit                                         | id               |
| tmsclient.connection.layers       | /api/component/tmsclient/{0}/layers/                  | id               |
| tracker.export_to_gpx             | /tracker/gpx                                          |                  |
| tracker.get.stops                 | /tracker/stops                                        |                  |
| tracker.get_amd_static_url        | /tracker/amd/static/url/                              |                  |
| tracker.get_device_types          | /tracker/device_types                                 |                  |
| tracker.get_full_tracks           | /tracker/tracks/full                                  |                  |
| tracker.get_last_activity_tracker | /tracker/activity/last                                |                  |
| tracker.get_short_tracks          | /tracker/tracks/short                                 |                  |
| tracker.get_tracker_last_points   | /tracker/last/points                                  |                  |
| tracker.get_tracker_lines         | /tracker/lines                                        |                  |
| tracker.get_tracker_points        | /tracker/points                                       |                  |
| tracker.get_trackers              | /tracker/trackers/tree                                |                  |
| tracker.receive_packet            | /tracker/{0}/receive                                  | unique_id        |
| tracker.reports                   | /tracker/reports/                                     |                  |
| tracker.reports.build             | /tracker/report/build/                                |                  |
| tracker.settings                  | /api/component/tracker/settings                       |                  |
| vector_layer.dataset              | /api/component/vector_layer/dataset                   |                  |
| webmap.annotation.collection      | /api/resource/{0}/annotation/                         | id               |
| webmap.annotation.item            | /api/resource/{0}/annotation/{1}                      | id,annotation_id |
| webmap.display                    | /resource/{0}/display                                 | id               |
| webmap.display.tiny               | /resource/{0}/display/tiny                            | id               |
| webmap.settings                   | /api/component/webmap/settings                        |                  |
| wfsserver.wfs                     | /api/resource/{0}/wfs                                 | id               |
| wmsserver.wms                     | /api/resource/{0}/wms                                 | id               |

</details>

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-connector`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
