# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)


### Bug Fixes

* **cesium:** add check for telset3d adapter addLayer ([8fbb0f3](https://github.com/nextgis/nextgis_frontend/commit/8fbb0f3741277da85aba68b8f46ab3d64c71a976))
* **ngw-kit:** webmap iten async addLayer method ([ca90340](https://github.com/nextgis/nextgis_frontend/commit/ca90340b927704d5c0101041fe1caa54d62ce164))


### Features

* **ngw-orm:** update VectorLayer.toTypescript ([81619b2](https://github.com/nextgis/nextgis_frontend/commit/81619b29d60cb7ad7da7a404e2ca48b7624a0635))





# [1.0.0-alpha.4](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)


### Bug Fixes

* **leaflet-map-adapter:** init center option ([f0cff9e](https://github.com/nextgis/nextgisweb_frontend/commit/f0cff9ee40e26043b25c85bf556b78a2a0b5366f))


### Features

* **util:** add coord format transformer ([9709333](https://github.com/nextgis/nextgisweb_frontend/commit/97093339c11b104106dc1f9aff3a3b691b02966c))
* **utils:** add DebounceDecorator ([196284c](https://github.com/nextgis/nextgisweb_frontend/commit/196284cc25033d12a3108aa87706c92c3b4317d4))
* **utils:** move some utils from ngw-kit and webmap to geom ([fbd3d91](https://github.com/nextgis/nextgisweb_frontend/commit/fbd3d913485c537e92068b5284691bb47f123b43))





# [1.0.0-alpha.3](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)


### Bug Fixes

* remove require imports ([be789b8](https://github.com/nextgis/nextgisweb_frontend/commit/be789b89f39741efe146da97eeb19460a7cca527))
* **leaflet-map-adapter:** fix BaseAdapter pane zIndex set ([f73bb6a](https://github.com/nextgis/nextgisweb_frontend/commit/f73bb6ae9b9e3e99c5a1ca7cc859570ce0ce8911))


### Features

* **webmap:** new method getCoordFromMapClick ([439d8c9](https://github.com/nextgis/nextgisweb_frontend/commit/439d8c90fe11193faafc90c9bd33fec2b335bf78))





# [1.0.0-alpha.2](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)


### Bug Fixes

* **ngw-connector:** update error response status code list ([c4d4285](https://github.com/nextgis/nextgisweb_frontend/commit/c4d4285f23490f9dcc3edac8c82b533f6c07ac01))
* improve node/browser splitting ([913a8a1](https://github.com/nextgis/nextgisweb_frontend/commit/913a8a1794890a2e46c4ec72706edf940102943c))


### Code Refactoring

* **ngw-kit:** naming ([f870925](https://github.com/nextgis/nextgisweb_frontend/commit/f8709259501b811f269a89445975969e00db2763))


### Features

* **ngw-kit:** default WebmapLayerAdapter basemap ([4756ef8](https://github.com/nextgis/nextgisweb_frontend/commit/4756ef82084f30eda51fe98e1483e815a7775132))


### BREAKING CHANGES

* **ngw-kit:** replace `import { WebMapLayerAdapter } from @nextgis/ngw-kit` to `import { NgwWebmapLayerAdapter } from @nextgis/ngw-kit` and `import { WebMapLayerItem} from @nextgis/ngw-kit` to `import { NgwWebmapLayerItem } from @nextgis/ngw-kit`





# [1.0.0-alpha.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)


### Bug Fixes

* **build:** fix item index.js error ([7a9d27f](https://github.com/nextgis/nextgisweb_frontend/commit/7a9d27f12ebd1f9e7fd974c32905faa36b858d5e))
* **ngw-connector:** improve node/browser separation ([7dd5d8d](https://github.com/nextgis/nextgisweb_frontend/commit/7dd5d8de655cd54ce03ebd77792bf46566265e9c))
* **ngw-kit:** remove unresolved variable ([e74c4c7](https://github.com/nextgis/nextgisweb_frontend/commit/e74c4c7e6ed9c39d4e9837d1830002f3d659d254))
* **ngw-kit:** wms adapter layers options from adapterOptions ([4476a55](https://github.com/nextgis/nextgisweb_frontend/commit/4476a55953a60c3bbc6b58178f90eac998897482))





# [1.0.0-alpha.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)


### Bug Fixes

* replace emitter.of by emitter.removeListener ([5a92e2b](https://github.com/nextgis/nextgisweb_frontend/commit/5a92e2b91e741346be39be87d5b9f50b9621c092))
* **cesium:** fix Tilset3D setHeight ([fb95256](https://github.com/nextgis/nextgisweb_frontend/commit/fb952565adb2734ec4a40df2c955ad51cec90c54))
* **control-container:** style url ([326f837](https://github.com/nextgis/nextgisweb_frontend/commit/326f83755e1adfe2e5ff673f50087b54297f0197))
* **mapbox:** right selected event order call ([22c4511](https://github.com/nextgis/nextgisweb_frontend/commit/22c45118ae57c9a2952725a09e26cb423965be03))
* **ngw-kit:** editing for a new layer visibility standard ([d2db4ed](https://github.com/nextgis/nextgisweb_frontend/commit/d2db4ed94648d0854321b4c3192b6cf2ab866652))
* **ngw-kit:** fix addNgwLayer resource options ([c689db1](https://github.com/nextgis/nextgisweb_frontend/commit/c689db13cb8fb2d043ef395ae56ab501cf77a350))
* **properties-filter:** add field type check for like\ilike filter ([55f5c23](https://github.com/nextgis/nextgisweb_frontend/commit/55f5c23c252f6ee1f8cd34207bdaeb43610e68fb))
* **vuetify:** pass $attrs from parent ([778f909](https://github.com/nextgis/nextgisweb_frontend/commit/778f9093dba1b15115806996b7c0984d5bfc84b0))
* **vuetify:** update items on init ([03f78ed](https://github.com/nextgis/nextgisweb_frontend/commit/03f78ed98e74fc2eb005085f1fce30b3a957ece5))
* **webmap:** editing for new layer visibility standard ([32413d0](https://github.com/nextgis/nextgisweb_frontend/commit/32413d085d30073056b8da97c8735ca13016c616))


### Build System

* qms-kit to rollup ([3831a57](https://github.com/nextgis/nextgisweb_frontend/commit/3831a57e661a85386ef14b69cc6ef682cf961394))
* wepmap to rollup ([bc66507](https://github.com/nextgis/nextgisweb_frontend/commit/bc665072f7eefacae748c2cf81f6bdef75d9f8aa))


### Code Refactoring

* rename layerAdapter baseLayer option to baselayer ([368d657](https://github.com/nextgis/nextgisweb_frontend/commit/368d6576278505ddddde2a1ab160a0849e087c70))


### Features

* **cesium:** add maximumScreenSpaceError option for tilset3d adapter ([c82c524](https://github.com/nextgis/nextgisweb_frontend/commit/c82c52452765b2e764f6c3d42bc3522bd36a4258))
* **cesium:** set custom logo ([bd05fd3](https://github.com/nextgis/nextgisweb_frontend/commit/bd05fd3f6e34e9cd7e38bbfe5bd1941583ef8fe8))
* **ngw-connector:** add check for 403 ngw error ([e344663](https://github.com/nextgis/nextgisweb_frontend/commit/e344663a974867e510b460fb00eea1775d801ee4))
* **ngw-connector:** handle network error ([7e4a687](https://github.com/nextgis/nextgisweb_frontend/commit/7e4a687934e9fd8a557a41102e70c8761f7d5d2d))
* **ngw-connector:** new getResourceBy method ([462f0db](https://github.com/nextgis/nextgisweb_frontend/commit/462f0dbed5c0b448f5be60a73e8d70e792a4f87a))
* **ngw-kit:** add webmap item method to cotrol item children order ([4c4e95a](https://github.com/nextgis/nextgisweb_frontend/commit/4c4e95a146c4aeb3d5b5e7a1868ab17e5ff68c1c))
* **ngw-kit:** ngw error handling ([490d068](https://github.com/nextgis/nextgisweb_frontend/commit/490d068021b21fb7ddcd7475d2a669a969f81480))
* **ngw-orm:** remove 3rd part libs to convers geom to wkt, use new ngw api ([01c8e21](https://github.com/nextgis/nextgisweb_frontend/commit/01c8e21321b041024584cdcb8c41998adddb3246))
* **utils:** add new tools ([25e6339](https://github.com/nextgis/nextgisweb_frontend/commit/25e6339b5d079f231f3d1fd3ac91e9d32402e0d5))
* **webmap:** add special MapAdapterOptions option to MapOptions ([e3dd2ec](https://github.com/nextgis/nextgisweb_frontend/commit/e3dd2eceb5b63bf7c19791deacd72b2e047a74f8))
* **webmap:** change default behaviour of addLayer visibility option, its now true ([0e91555](https://github.com/nextgis/nextgisweb_frontend/commit/0e91555cea9666dd3ce8c2df7364f0e588dc8c24))
* **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([430d51e](https://github.com/nextgis/nextgisweb_frontend/commit/430d51e7211c050ebeffd68b0c839d9a38170054))
* **webmap:** new static method WebMap.get(id) to get webmap instance ([658f537](https://github.com/nextgis/nextgisweb_frontend/commit/658f5372bde27b4d8502856649b2b11e9e4bade7))


### Performance Improvements

* **vuetify:** replace components gwMap param with webMapId ([59a42d3](https://github.com/nextgis/nextgisweb_frontend/commit/59a42d35029c4d713469a1ea2f339c3bb5f3747a))


### BREAKING CHANGES

* No more default export from `qms-kit`. You should replace `import QmsKit from "@nextgis/qms-kit"` to `import { QmsKit } from "@nextgis/qms-kit"` everywhere
* No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
* **webmap:** the added layer `visibility` is now `true`
* LayerAdapter option baseLayer was renamed to baselayer;
* webMap.getBaseLayers() method now return LayerAdapter, not string array of ids





# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)


### Bug Fixes

* **cesium:** fitBounds for not Scene3D modes ([8fa4155](https://github.com/nextgis/nextgis_frontend/commit/8fa41559f506a7a41372e0f0e497e215fc0f85f5))
* **cesium:** geojson terrain sample ([308d3d3](https://github.com/nextgis/nextgis_frontend/commit/308d3d352110f9496dded2464c78c663bab7a03b))
* **cesium:** Tileset3DAdapter set terrain height ([790760f](https://github.com/nextgis/nextgis_frontend/commit/790760f0b8b90b9c9d572640612cfc00dabfd5d5))
* **examples:** check paint opacity is number ([1105262](https://github.com/nextgis/nextgis_frontend/commit/1105262687d8b7e85873fe58933ced82d9cb77af))
* **examples:** set type for ngw_resource highlight layer ([13ddcdd](https://github.com/nextgis/nextgis_frontend/commit/13ddcdd3ad346cad9ae99a6f924bcd62299336c5))
* **mapbox:** geojson getSelected method ([e0d859c](https://github.com/nextgis/nextgis_frontend/commit/e0d859cd186876f0b382e1338d1793151d18dd6a))
* **ngw-kit:** check company_logo in settings ([decf777](https://github.com/nextgis/nextgis_frontend/commit/decf777de5f30f27b15265808fa85c8529021cc1))
* **ngw-kit:** set correct options when add WebmapLayerItem ([0c5cd08](https://github.com/nextgis/nextgis_frontend/commit/0c5cd08b62b46fabe88bc51c91f0616d1d8c4a25))
* **ngw-kit:** WebmapLayerItem ordering ([d4a0403](https://github.com/nextgis/nextgis_frontend/commit/d4a04038bc76257595d2eea618629a969ca9ca00))
* **vuetify:** correction for set empty BasemapSelect text ([8ab35e4](https://github.com/nextgis/nextgis_frontend/commit/8ab35e426f9333391c746849c0d2316e2cb62ec3))
* **vuetify:** NgwLayersList root item hide ([abba8cb](https://github.com/nextgis/nextgis_frontend/commit/abba8cbd8a46697ba37a768bd2576086591c344c))


### Features

* **cesium:** implement getCenter ([ea83d8e](https://github.com/nextgis/nextgis_frontend/commit/ea83d8ebd8972123ba0991388e4e53fce91b077e))
* **cesium:** skipLevelOfDetail by default ([7429870](https://github.com/nextgis/nextgis_frontend/commit/7429870fb31231fc26298240d665c4ac840f618a))
* **cesium:** tilset 3d adapter height options ([02973bf](https://github.com/nextgis/nextgis_frontend/commit/02973bfcacb6bde3b7d4e23fdd190d0e81536f57))
* **cesium:** update layer and map adapter ([c9d6a1d](https://github.com/nextgis/nextgis_frontend/commit/c9d6a1db8874586adb5ae1901153e71313aa776b))
* **ngw-kit:** add ngw basemap suppor for url ([958303e](https://github.com/nextgis/nextgis_frontend/commit/958303eed8753d18a8c8d60b72a338c1656388f6))
* **ngw-kit:** add NgwKit.utils.getCompanyLogo method ([3c6fa09](https://github.com/nextgis/nextgis_frontend/commit/3c6fa09321c0e979543b50b93c32da8725920d28))
* **ngw-kit:** add `tmsclient_layer` adapter class support ([87b5976](https://github.com/nextgis/nextgis_frontend/commit/87b59760a574ffc66b1aec1d2df3af301efe1326))
* **qms-kit:** use `y_origin_top` option ([fa02dfd](https://github.com/nextgis/nextgis_frontend/commit/fa02dfd2af3927478fd9f50de7d8173b2dc4f05b))
* **webmap:** vector layer select event ([edd18ba](https://github.com/nextgis/nextgis_frontend/commit/edd18baa3d2b0e5886812e09795de4f041be23ab))
* **webmap:** zoomIn and zoomOut MapAdapter optional methods ([70b807f](https://github.com/nextgis/nextgis_frontend/commit/70b807fd1d157b5505a3d815f24a02fbb1fff6a6))


### Performance Improvements

* **webmap:** addControl conner queue ([5c21367](https://github.com/nextgis/nextgis_frontend/commit/5c21367fc1a0142d56e443948d7d01f49549d5b1))



### BREAKING CHANGES

* Vector layer adapter types were renamed: `circle` > `point`; `fill` > `polygon`.

    The `type` parameter still optional, but it is better to specify explicitly.
Especially when the layer is initiated empty.

```javascript
// before
webMap.addLayer('GEOJSON', { data: geojson, type: 'fill'});
// after
webMap.addLayer('GEOJSON', { data: geojson, type: 'polygon'});
```

* Updated libraries for linting. Added new rule for  worning when no set return type in TypeScript functions.





# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)


### Bug Fixes

* **cesium:** GeoJsonAdapter pin color from empty string ([13ef825](https://github.com/nextgis/nextgis_frontend/commit/13ef8258afad19709cf00a055bb772f425542d1a))
* **cesium:** scene requestRender on layers visibility change ([e513a57](https://github.com/nextgis/nextgis_frontend/commit/e513a573af14660750337e951da84387fab433c2))
* **mapbox:** beforeRemove check for map exist ([e6c59cc](https://github.com/nextgis/nextgis_frontend/commit/e6c59cc2b51110c679dfa7dd6e9348926ec473f7))
* **ngw-kit:** create async adapter from parent resource ([808572b](https://github.com/nextgis/nextgis_frontend/commit/808572b5aff6b04783cd7e9edd078e2ea5404dd2))
* **ngw-kit:** resolve createGeoJsonAdapter options override II ([c65f1ee](https://github.com/nextgis/nextgis_frontend/commit/c65f1eeb2dd0974980c70455d142dba427081521))
* **ngw-kit:** webmapLayerItem options ([154d3b2](https://github.com/nextgis/nextgis_frontend/commit/154d3b201df153e9d17653fc4acd1fe8a2af9ebf))
* **nngw-kit:** resolve create geojson adapter options override ([fba851e](https://github.com/nextgis/nextgis_frontend/commit/fba851effec4402565c8c3b31ce1eaba2b0b590f))
* **ol:** css control fixes ([98f6d13](https://github.com/nextgis/nextgis_frontend/commit/98f6d13dc9af59a39b1b0a13cea24be3a2505759))
* **vuetify:** NgwLayersList visibility for webmap root item ([4f940a8](https://github.com/nextgis/nextgis_frontend/commit/4f940a854a5054070acbf9d0416f059c9f19ae7d))
* **webmap:** add check for fitBounds extent ([c78ab3e](https://github.com/nextgis/nextgis_frontend/commit/c78ab3e900f3e069401fb23b5b7646aa5cbc8e7f))
* **webmap:** addLayer adapter options set ([2d24a53](https://github.com/nextgis/nextgis_frontend/commit/2d24a5387634bbccb79875186cc7a9cf090291f2))
* **webmap:** remove addLayer dublicate id ([81a4458](https://github.com/nextgis/nextgis_frontend/commit/81a4458b9b420382d112be181d829e08f783c82b))


### Features

* **cesium:** add Tileset3dAdapter ([c5306f9](https://github.com/nextgis/nextgis_frontend/commit/c5306f9b8bb3e37f287cbd4e3d33a04d93478e2b))
* **cesium:** change layers height on terrain change ([609ac9d](https://github.com/nextgis/nextgis_frontend/commit/609ac9ddae60eb3ac9085c9f29fa93f3aa5b13b4))
* **cesium:** extrude3d paint option ([c4ce679](https://github.com/nextgis/nextgis_frontend/commit/c4ce679cd15bbc87e362048dc007a85ce42516fd))
* **cesium:** fitBounds up tp terrain ([e890d9b](https://github.com/nextgis/nextgis_frontend/commit/e890d9b5ce449dc69c8b531c33b9ce6cb58b10b4))
* **cesium:** get extent of tileset3D ([017a69a](https://github.com/nextgis/nextgis_frontend/commit/017a69afa63cec3f2b1773fb643557a2a88fa363))
* **cesium:** set scene view from new adapter option ([c35e16d](https://github.com/nextgis/nextgis_frontend/commit/c35e16ded6036fccb2edb852bebd68f41fc899eb))
* **ngw-kit:** add addLayerOptionsPriority for createGeoJsonAdapter ([f6c563e](https://github.com/nextgis/nextgis_frontend/commit/f6c563e1bc1238206bb4ba3d8081971d078ef54d))
* **ngw-kit:** add baselayers from webmap; vuetify BaseLayerSelect ([74c0749](https://github.com/nextgis/nextgis_frontend/commit/74c074929c7da864a9097fc8176825894555e0a3))
* **ngw-kit:** add feature to getIdentifyItems ([9641c8e](https://github.com/nextgis/nextgis_frontend/commit/9641c8e8b0e67ece7186ba8a6803d109e6503afd))
* **ngw-kit:** make create basemap layer adapter universal ([bbd8c9a](https://github.com/nextgis/nextgis_frontend/commit/bbd8c9a77d527921909ae9b1bf10b3580c5fa600))
* **ngw-map:** add ngw layer from resource item object ([18fb9e1](https://github.com/nextgis/nextgis_frontend/commit/18fb9e105fe733b8e1e5736cfb3afeb8e5b9e84c))
* **vue:** VueNgwControl from string  kind option ([1050be8](https://github.com/nextgis/nextgis_frontend/commit/1050be8d7488713e10869e1060e76a8da313d21f))
* **webmap:** add async control in correct order ([c2eaab3](https://github.com/nextgis/nextgis_frontend/commit/c2eaab3a0d720a6b6d32fc0d6b2c76bc37e93a8f))
* **webmap:** layer adapter waitFullLoad and crossOrigin new options ([08c6b82](https://github.com/nextgis/nextgis_frontend/commit/08c6b827f6a3e5728d8b17a9c305f32cd2b28039))


### BREAKING CHANGES

* **ngw-kit:** rename NgwKit.utils.getIdentifyGeoJsonParams > NgwKit.utils.getIdentifyItems





## [0.30.2](https://github.com/nextgis/nextgis_frontend/compare/v0.30.1...v0.30.2) (2020-04-30)


### Bug Fixes

* **ngw-kit:** return raster_layer resource support ([76a435f](https://github.com/nextgis/nextgis_frontend/commit/76a435fb43d82ea8be616347010a8bd1214f106b))





## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)


### Bug Fixes

* **cesium:** cesium geojson layer style ([5f6e439](https://github.com/nextgis/nextgis_frontend/commit/5f6e43937bb9397237c43abccce5889a710716fb))
* **vue:** selection for items with properties and tree ([e2f72df](https://github.com/nextgis/nextgis_frontend/commit/e2f72df0c1800e7595c7e3e8342f15841f897eea))
* **webmap:** get layers method only string keys ([e0182c9](https://github.com/nextgis/nextgis_frontend/commit/e0182c95c81f5b76605f569bcbf2826937909889))


### Features

* **cesium:** add scale and rotate for 3d model adapter ([c6c67c1](https://github.com/nextgis/nextgis_frontend/commit/c6c67c16356a08a434f9f5482d8fa6bc0b693091))
* **ngw-kit:** extensibility increased ([77bdaf7](https://github.com/nextgis/nextgis_frontend/commit/77bdaf7df43124811a8847cad348fe6bdae6d1ed))
* **ngw-kit:** new approach to extend adapters for any resource classes ([4521db5](https://github.com/nextgis/nextgis_frontend/commit/4521db5238a380e52916f3fd8ba3f4aa3e95889a))
* **webmap:** update layer adapter options ([b0262ef](https://github.com/nextgis/nextgis_frontend/commit/b0262eff0db1ee56192bb410e8e1128cdc8b167b))


### Performance Improvements

* **ngw-kit:** abort BBOX request on map movestart ([af72df0](https://github.com/nextgis/nextgis_frontend/commit/af72df00a095ad07c0a5b495af41d8cd1dda1b90))
* **ngw-kit:** default limit to load large vector layer data ([1e88276](https://github.com/nextgis/nextgis_frontend/commit/1e8827674db30d654b6ce6c0018171b4b15db12b))





# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)


### Bug Fixes

* **ngw-connect:** properly abort request on cancel ([9ea9859](https://github.com/nextgis/nextgis_frontend/commit/9ea98591679584d7e23ef47a8bca5c4558527db4))





## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)


### Features

* **cancelable-promise:** throw CancelError instead of onCancel callback ([7b7ef11](https://github.com/nextgis/nextgis_frontend/commit/7b7ef112db2ead4fc02bac14eb61534d570b8a65))


### Performance Improvements

* **mapbox:** vector layer click event prevent by order ([e7901da](https://github.com/nextgis/nextgis_frontend/commit/e7901da34935e347de05aaf0798eb1e5dfda11ff))


### BREAKING CHANGES

* **cancelable-promise:** Removed onCancel argument from CancelablePromise. Now you should handle catch CancelError





## [0.29.10](https://github.com/nextgis/nextgis_frontend/compare/v0.29.9...v0.29.10) (2020-04-17)


### Bug Fixes

* **ngw-kit:** no load date for geojson layer if data ([4faf698](https://github.com/nextgis/nextgis_frontend/commit/4faf6988e39509af2cb8e03725741d4e0b00ad55))
* **ngw-ol:** container style ([995b409](https://github.com/nextgis/nextgis_frontend/commit/995b409e5b70bb6a750afb39dd42745d562b4b88))
* **ol:** geojson label null field ([1b93b27](https://github.com/nextgis/nextgis_frontend/commit/1b93b275566f4f2c32ba9c114fea3a0fdc3dc77b))





## [0.29.9](https://github.com/nextgis/nextgis_frontend/compare/v0.29.8...v0.29.9) (2020-04-16)


### Bug Fixes

* **ngw-orm:** vector resource geometry ([126dea7](https://github.com/nextgis/nextgis_frontend/commit/126dea73e73cf161ce6a6e88b08dde748d53ad09))





## [0.29.8](https://github.com/nextgis/nextgis_frontend/compare/v0.29.7...v0.29.8) (2020-04-16)


### Bug Fixes

* **ngw-orm:** remove console log ([345065b](https://github.com/nextgis/nextgis_frontend/commit/345065b02bbaf6f708c323ba8fea20192b99ae6c))
* **ngw-orm:** return sync resource ([d65548b](https://github.com/nextgis/nextgis_frontend/commit/d65548bcfded0a4fe8d5e7733b171fb8236af25f))





## [0.29.7](https://github.com/nextgis/nextgis_frontend/compare/v0.29.6...v0.29.7) (2020-04-16)

**Note:** Version bump only for package root





## [0.29.6](https://github.com/nextgis/nextgis_frontend/compare/v0.29.5...v0.29.6) (2020-04-16)


### Bug Fixes

* **ngw-connector:** improve for node ([cc5ead7](https://github.com/nextgis/nextgis_frontend/commit/cc5ead7d298a6dd557988a9f4ed9bba361a013d9))





## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)


### Bug Fixes

* **leaflet:** RemoteTileLayer mixin removeTile method ([af72b2b](https://github.com/nextgis/nextgis_frontend/commit/af72b2b420cb951f52b6ce56701f3e3bbbdb475d))
* **ngw:** create async adapter for webmap ([40aeb07](https://github.com/nextgis/nextgis_frontend/commit/40aeb07f4ddce2462ea82b30f8b91009535e8531))
* **ngw-connector:** getResourceByKeyname cache ([20fae26](https://github.com/nextgis/nextgis_frontend/commit/20fae266d240d51af7fe9e9a9af4f84d286f8cc2))


### Features

* eslint no-dupe off; object utils; propertiesFilter generic ([20200e7](https://github.com/nextgis/nextgis_frontend/commit/20200e79a3c7e8e45f51e6999864b9fde47d9b54))


### Performance Improvements

* **ngw-connector:** getResourceByKeyname one request ([23e0706](https://github.com/nextgis/nextgis_frontend/commit/23e0706d22502ec14a4383abe87b9bae2e4e8d26))





## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)


### Bug Fixes

* **cesium:** remove default imagery provider ([cb7d7d2](https://github.com/nextgis/nextgis_frontend/commit/cb7d7d290bf3ebc58eebbdb978150a7e7fff7ace))
* **ngw:** return support for vector layer adapter ([25f19ae](https://github.com/nextgis/nextgis_frontend/commit/25f19aef91ed361a7fc2fe96123fa4f5833df755))


### Features

* **utils:** update string util ([2bf9a92](https://github.com/nextgis/nextgis_frontend/commit/2bf9a9217ade47a19426d62a80969f9173900651))
* **vue:** VueNgwMap add onLoad event ([d2a1ecf](https://github.com/nextgis/nextgis_frontend/commit/d2a1ecf296fd001b4307179b70749811ee5e00e1))





## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)


### Features

* **ngw-connector:** more improvement for Node ([c3af356](https://github.com/nextgis/nextgis_frontend/commit/c3af356f00e7095f50c463e12692b12bea605e6f))





## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)


### Bug Fixes

* **ngw-connector:** improve compatibility with Node ([7b653f5](https://github.com/nextgis/nextgis_frontend/commit/7b653f559f7ecb681d0059ac42a9aecb543fbb90))





## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)


### Bug Fixes

* **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))
* **mapbox:** fix geojson adapter clean method ([a5138b6](https://github.com/nextgis/nextgis_frontend/commit/a5138b6fdd4047b3c0cc8422b3bdca33cea0e951))


### Features

* **ngw-connector:** add item_extent interface ([78f0cdd](https://github.com/nextgis/nextgis_frontend/commit/78f0cdd082ec2550bc9a442d05addaadd02f7aae))
* **ngw-connector:** new query option for response cache ([d249605](https://github.com/nextgis/nextgis_frontend/commit/d249605823a63a0b1f6b3f242b15c06fe70bd9a3))





# [0.29.0](https://github.com/nextgis/nextgis_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)


### Bug Fixes

* **properties-filte:** allow any chars for `like` and `ilike` search ([6b5b60d](https://github.com/nextgis/nextgis_frontend/commit/6b5b60d7985abb01093b649073c6e0a088f7fe0e))
* **properties-filter:** repair like and ilike operations ([ff208e0](https://github.com/nextgis/nextgis_frontend/commit/ff208e00f52fb592df32af95a6bd0cfdf04dfb65))


### chore

* build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))


### BREAKING CHANGES

* code formatting rules changed to prettier 2.0 compatibility





## [0.28.3](https://github.com/nextgis/nextgis_frontend/compare/v0.28.2...v0.28.3) (2020-03-19)


### Bug Fixes

* **examples:** repair examples ([e739de7](https://github.com/nextgis/nextgis_frontend/commit/e739de7c52c09ba17ddcf007c2604cc1e2a0e0ba))
* **ngw:** get geojson request options ([015cffc](https://github.com/nextgis/nextgis_frontend/commit/015cffc415b272f0dace009e192ef7986c699138))
* **ngw:** order_by param ([dd161fc](https://github.com/nextgis/nextgis_frontend/commit/dd161fc8d3536fe733f2c21427f897ae4d44f60f))


### Features

* **cesium:** pin paint implementation for geojson layer ([7fadb6d](https://github.com/nextgis/nextgis_frontend/commit/7fadb6d6f6a7ae8dfc0449ded1c1595ebba476ed))
* **ngw:** option to create popup content from item ([3c4a809](https://github.com/nextgis/nextgis_frontend/commit/3c4a809dc7cd9045e3ed1622b1eea0036e5205a1))
* **paint:** implement of `match`-decision expression ([cc92624](https://github.com/nextgis/nextgis_frontend/commit/cc92624c45819334b6b815dc84aed9978b784b3a))
* add library `@nextgis/paint` ([99391ec](https://github.com/nextgis/nextgis_frontend/commit/99391ec1ac9fd80508816417d9eb2ae0fd734340))





## [0.28.2](https://github.com/nextgis/nextgis_frontend/compare/v0.28.1...v0.28.2) (2020-03-12)

**Note:** Version bump only for package root





## [0.28.1](https://github.com/nextgis/nextgis_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package root





# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)


### Features

* **cesium:** geojson adapter paint ([657b411](https://github.com/nextgis/nextgis_frontend/commit/657b411f1efb9835ff9f9255c47424179e3b3caa))
* **webmap:** paint from expressions ([126a191](https://github.com/nextgis/nextgis_frontend/commit/126a191a540e12ac7ff74471a110c1fd04340516))
* add library `@nextgis/properties-filter` ([0902366](https://github.com/nextgis/nextgis_frontend/commit/09023669c963ddb4e0a319400397e5f320620573))
* **webmap:** paint from properties filter ([6645e46](https://github.com/nextgis/nextgis_frontend/commit/6645e467f1be79c0a2ed02fed65a62b5850daf70))


### BREAKING CHANGES

* **webmap:** New Paint specification may cause problems with types
* `propertiesFilter` removed from `@nextgis/utils`





## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)


### Bug Fixes

* **mapbox:** resolve geojson selection-filter conflict ([f0abd87](https://github.com/nextgis/nextgis_frontend/commit/f0abd87005176192efeac8c40bdc1a4398909eb6))


### Features

* add library `@nextgis/cancelable-promise` ([5227983](https://github.com/nextgis/nextgis_frontend/commit/5227983e03b0a5aa5807002f63914fa2d23154b0))
* add library `@nextgis/control-container` ([e68afeb](https://github.com/nextgis/nextgis_frontend/commit/e68afeb5efb1e40bf20df2effa805fe80c437478))
* add library `@nextgis/dom` ([82a645d](https://github.com/nextgis/nextgis_frontend/commit/82a645d213d0b9ef1bb3c443dc28a94866c2884b))
* **cesium:** add mapAdapter listeners and getBounds method ([3033475](https://github.com/nextgis/nextgis_frontend/commit/3033475bc1cc519efe08f18e9e741750d35a0f25))
* **control:** add universal zoom control ([1ffc089](https://github.com/nextgis/nextgis_frontend/commit/1ffc089942f1709f82cec8398d301503819be718))
* **demo:** add search for left sidebar ([d72132d](https://github.com/nextgis/nextgis_frontend/commit/d72132dc2385d8982e6a3ec91cd76c1005ed2836))





# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)


### Bug Fixes

* **ngw-map:** not block when error on add qms layer ([d06ac88](https://github.com/nextgis/nextgis_frontend/commit/d06ac88cc6088e16c38c47ef247905e84e0a5283))


### Features

* **ngw-kit:** add bbox strategy for large vector layer ([da6533b](https://github.com/nextgis/nextgis_frontend/commit/da6533b76eaf5184114ac233fa275d2398cfdf5b))
* **utils:** create universal MapControlContainer ([2f07100](https://github.com/nextgis/nextgis_frontend/commit/2f07100b8a9b178533d5e3ee17b8759d8eb62866))
* **vuetify:** allow VTree scopes for NgwLayersList ([8718f9b](https://github.com/nextgis/nextgis_frontend/commit/8718f9b6e114714523b3476a97b23934c31f2bb4))


### Performance Improvements

* **ngw-kit:** geojson adapter not blocked on data load ([1ceaf76](https://github.com/nextgis/nextgis_frontend/commit/1ceaf7688b9911727de5fa1b6fde9ae1f6b3da9e))





# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)


### Features

* add WmsLayerAdapter ([c57b66d](https://github.com/nextgis/nextgis_frontend/commit/c57b66d2278071a57182cb4dd554e370c63ffa06))





## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package root





## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.6...v0.25.7) (2020-02-24)

**Note:** Version bump only for package root




## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.5...v0.25.6) (2020-02-24)

**Note:** Version bump only for package root





## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)


### Bug Fixes

* rename Clipboard ([759f55a](https://github.com/nextgis/nextgis_frontend/commit/759f55ad35928f5212d8ed8bfaccdbebcb35246a))
* **demo:** remove layer id from ngw properties filter example ([4c3c625](https://github.com/nextgis/nextgis_frontend/commit/4c3c6253a47a4e1e55d3b19c5a75787d96705e69))
* **mapbox:** geojson getFeatures method return whole source data ([d47f893](https://github.com/nextgis/nextgis_frontend/commit/d47f8932d63c8a6d056d50aad351026464128595))
* **webmap:** ZoomState may be only integer ([c130469](https://github.com/nextgis/nextgis_frontend/commit/c13046908d63d549e3f221efc538c55d49a36450))


### Features

* **ngw-connector:** make library polymorphic for both node and browser ([b3bd42e](https://github.com/nextgis/nextgis_frontend/commit/b3bd42e1ebc3880edfecb6713d0d17166e9beed0))
* **ngw-kit:** new addNgwLayer resource option for keyname or resourceId ([f1eefd2](https://github.com/nextgis/nextgis_frontend/commit/f1eefd2703dc16126ef4b0a933a86b9a34d594a7))


### Performance Improvements

* **mapbox:** upgrade layer ordering ([58a0db0](https://github.com/nextgis/nextgis_frontend/commit/58a0db08c0fa123ede4ef0d9fc7d9e1e9b3a6526))





## [0.25.4](https://github.com/nextgis/nextgis_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)


### wip

* **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgis_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))


### BREAKING CHANGES

* **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'





## [0.25.3](https://github.com/nextgis/nextgis_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)


### Features

* **example:** new ngw_layer_properties_filter example ([066f13f](https://github.com/nextgis/nextgis_frontend/commit/066f13f4ef023f6629f1a7fc2639f8af123cce87))
* **ngw:** conditions and nesting for filtering ngw feature layer ([bc7cc34](https://github.com/nextgis/nextgis_frontend/commit/bc7cc344d83d1769476e28cb87d595a9d25d0ebd))
* **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgis_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))





## [0.25.2](https://github.com/nextgis/nextgis_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package root





## [0.25.1](https://github.com/nextgis/nextgis_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)


### Bug Fixes

* **mapbox:** disable mapbox image layer ([421a69f](https://github.com/nextgis/nextgis_frontend/commit/421a69f2e11313e8835c4d87e5091e4ef9f393d1))


### Features

* remove default MarkerLayerAdapter ([7398c1b](https://github.com/nextgis/nextgis_frontend/commit/7398c1bb61d43194ce4c7da635d386ad785ac57a))
* **demo:** add new example for simple resource table ([43fdf4f](https://github.com/nextgis/nextgis_frontend/commit/43fdf4f69898680872fedece44c812ca407d1d8b))


### BREAKING CHANGES

* `MARKER` layer adapter has been removed. Use `addLayer('GEOJSON', {data})` instead of `addLayer('MARKER', {lngLat})`





# [0.25.0](https://github.com/nextgis/nextgis_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)


### Bug Fixes

* **mapbox:** geojson adapter select ([3563359](https://github.com/nextgis/nextgis_frontend/commit/35633593586642f8d52d0fe326ebbf8b117652b3))
* **mapbox:** geojson layer selection with nativeFilter option ([ffea714](https://github.com/nextgis/nextgis_frontend/commit/ffea714bc57ece601a400ca7aa5f506aebf5f4e2))
* **mapbox:** propertyFilter for selected vector data ([6eaba47](https://github.com/nextgis/nextgis_frontend/commit/6eaba476e582af7f33e0b98d74457482a1fa0cf0))
* **mapbox:** set transformRequest option only then map is loaded ([9a2da0b](https://github.com/nextgis/nextgis_frontend/commit/9a2da0b3c11ed1f8b44d655590687fc66f51c36e))
* **mapbox:** transformRequests hotfix ([99ba257](https://github.com/nextgis/nextgis_frontend/commit/99ba2570ae1e519e4f7ea941514c342e7039b3da))
* **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgis_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))
* **ol:** no vector layer label for undefined property ([8087662](https://github.com/nextgis/nextgis_frontend/commit/80876629688c664edc6a5c7c1f5452a0b38e0cf7))
* **util:** arrayCompare typecasting ([3cca72c](https://github.com/nextgis/nextgis_frontend/commit/3cca72cdcae150829a58754a2efbe51cd6c4517f))
* **vue:** NgwLayersList webmap visibility ([919bc4e](https://github.com/nextgis/nextgis_frontend/commit/919bc4e5dd971f0f9ed501bab4266eaab8da5037))
* **vue:** saveselection of webmap in NgwLayersList ([6270793](https://github.com/nextgis/nextgis_frontend/commit/6270793f23d4c01f9a928a868301c36d53502bc2))
* **vue:** VueNgwLeaflet default icons for FF ([713d29e](https://github.com/nextgis/nextgis_frontend/commit/713d29e1054bdc21912b7b6b4a68456ca6845bdc))
* **webmap:** not use ordering for layer id ([cd09734](https://github.com/nextgis/nextgis_frontend/commit/cd0973490a2c6ca0673bd01059056dd5fd68d866))


### Features

* **ngw:** add support for `qgis_raster_style` ([959e901](https://github.com/nextgis/nextgis_frontend/commit/959e9014364947acbbbe768157d8cb5ab6d0c3ba))
* **ol:** implement labelField options for OL geojson adapter ([cd0fbf1](https://github.com/nextgis/nextgis_frontend/commit/cd0fbf145a89a07bb934ec77a21c130e0eb7eba8))
* **ol:** implemented getBounds method for OlMapAdapter ([42e9a18](https://github.com/nextgis/nextgis_frontend/commit/42e9a1835d76e211055fc66fab7ba709f4e923f9))
* **ol:** labeling for circle layer paint ([1b0c87c](https://github.com/nextgis/nextgis_frontend/commit/1b0c87c10afe49195464d346634ec1cf88bd49b8))
* **util:** add arrayCompare util ([9442c01](https://github.com/nextgis/nextgis_frontend/commit/9442c01e17dc894e97580cf32b882567066a9004))
* **util:** add debounce util ([fd45455](https://github.com/nextgis/nextgis_frontend/commit/fd45455b061b2bc6186f865d4d0a3aa13d57e01d))
* **util:** move properties filter to utils library ([4099706](https://github.com/nextgis/nextgis_frontend/commit/40997068f633faf75f15011721d9aaa5f11343dd))
* **vue:** NgwLayersList watch ngwMap change ([b2bfd34](https://github.com/nextgis/nextgis_frontend/commit/b2bfd349c86e934194424ebedf05ee9d24a6a51f))
* **webmap:** add `getBoundsPoly` webmap util ([22cb565](https://github.com/nextgis/nextgis_frontend/commit/22cb5654e6a2c2c8b84d32581faed0b293570cc2))
* **webmap:** nesting for propertiesFilter utility ([28cb9ed](https://github.com/nextgis/nextgis_frontend/commit/28cb9ed583ec96fec675f8f6c63ec18c1fe030de))
* **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgis_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))


### Performance Improvements

* **mapbox:** selection with PropertiesFilter ([e6e52e1](https://github.com/nextgis/nextgis_frontend/commit/e6e52e151f1662bb889cf89b349d566c100a2bdc))


### BREAKING CHANGES

* **util:** Use `import { propertiesFilter } from '@nextgis/utils';` instead of `Webmap.utils.propertiesFilter`





## [0.24.2](https://github.com/nextgis/nextgis_frontend/compare/v0.24.1...v0.24.2) (2020-01-14)


### Bug Fixes

* **mapbox:** transformRequests hotfix ([99ba257](https://github.com/nextgis/nextgis_frontend/commit/99ba2570ae1e519e4f7ea941514c342e7039b3da))





## [0.24.1](https://github.com/nextgis/nextgis_frontend/compare/v0.15.4...v0.24.1) (2020-01-14)


### Bug Fixes

* **mapbox:** set transformRequest option only then map is loaded ([9a2da0b](https://github.com/nextgis/nextgis_frontend/commit/9a2da0b3c11ed1f8b44d655590687fc66f51c36e))
* **ol:** no vector layer label for undefined property ([8087662](https://github.com/nextgis/nextgis_frontend/commit/80876629688c664edc6a5c7c1f5452a0b38e0cf7))


### Features

* **ol:** implement labelField options for OL geojson adapter ([cd0fbf1](https://github.com/nextgis/nextgis_frontend/commit/cd0fbf145a89a07bb934ec77a21c130e0eb7eba8))
* **ol:** implemented getBounds method for OlMapAdapter ([42e9a18](https://github.com/nextgis/nextgis_frontend/commit/42e9a1835d76e211055fc66fab7ba709f4e923f9))
* **ol:** labeling for circle layer paint ([1b0c87c](https://github.com/nextgis/nextgis_frontend/commit/1b0c87c10afe49195464d346634ec1cf88bd49b8))
* **webmap:** add `getBoundsPoly` webmap util ([22cb565](https://github.com/nextgis/nextgis_frontend/commit/22cb5654e6a2c2c8b84d32581faed0b293570cc2))




# [0.24.0](https://github.com/nextgis/nextgis_frontend/compare/v0.22.0...v0.24.0) (2020-01-11)


### BREAKING CHANGES

* Use import VueNgwMap from '@nextgis/vue-ngw-leaflet' instead of @nextgis/vue-ngw-map, vue-ngw-map is now has only abstract class for export (without any map framework). Also you can importVueNgwMap component from @nextgis/vue-ngw-mapbox and @nextgis/vue-ngw-ol.




# [0.23.0](https://github.com/nextgis/nextgis_frontend/compare/v0.22.0...v0.23.0) (2020-01-11)


### Documentation

* update changelog ([b8fe281](https://github.com/nextgis/nextgis_frontend/commit/b8fe281078b5db6593fe4a91214021ecbd5c5c2f))


### Features

* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgis_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))


### BREAKING CHANGES

* Сhanged approach to writing commit messages. Read [convention](https://github.com/nextgis/nextgis_frontend/blob/master/.github/commit-convention.md)
