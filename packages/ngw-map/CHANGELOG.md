# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.18.2](https://github.com/nextgis/nextgis_frontend/compare/v1.18.1...v1.18.2) (2023-10-04)

**Note:** Version bump only for package @nextgis/ngw-map





## [1.18.1](https://github.com/nextgis/nextgis_frontend/compare/v1.18.0...v1.18.1) (2023-10-03)

**Note:** Version bump only for package @nextgis/ngw-map





# [1.18.0](https://github.com/nextgis/nextgis_frontend/compare/v1.17.0...v1.18.0) (2023-10-02)

**Note:** Version bump only for package @nextgis/ngw-map





# [1.17.0](https://github.com/nextgis/nextgis_frontend/compare/v0.5.0...v1.17.0) (2023-09-25)


### Bug Fixes

* **build:** control-container extract css ([ff15f22](https://github.com/nextgis/nextgis_frontend/commit/ff15f221bd46de3d0e32aaa2735f7224d49b24fc))
* **leaflet-map-adapter:** geojson selection ([933507a](https://github.com/nextgis/nextgis_frontend/commit/933507a7fe61825c4742617073cd2c21deabe69d))
* **ngw-connector:** clean cache on resource delete ([179c372](https://github.com/nextgis/nextgis_frontend/commit/179c372b8c2358d57e1ad93a1afa2c6496d2619e))
* **ngw-kit:** createGeojsonAdapter propertiesFilter ([c053f3c](https://github.com/nextgis/nextgis_frontend/commit/c053f3c2c57bcf6919c2082c5c624c47ed1c4413))
* **ngw-kit:** fix addNgwLayer resource options ([c51d446](https://github.com/nextgis/nextgis_frontend/commit/c51d4461db59d7f235e4356976172bf72f991465))
* **ngw-kit:** inject item into the createRasterAdapter class factory ([5e0ecf8](https://github.com/nextgis/nextgis_frontend/commit/5e0ecf814237f912e08cc3be07f2484fb5b2118b))
* **ngw-map:** constructor options ([314072f](https://github.com/nextgis/nextgis_frontend/commit/314072f82d65606c7cde8cf1790e1db3bd8af150))
* **ngw-map:** constructor options for control ([7801315](https://github.com/nextgis/nextgis_frontend/commit/780131541a0b08113f2d838ed3aa8070bc0b10e6))
* **ngw-map:** correct ngw:select event data for raster layer ([1b3bfb0](https://github.com/nextgis/nextgis_frontend/commit/1b3bfb0a24b446bd518452555b1b1284e0340f02))
* **ngw-map:** identify order ([05152e5](https://github.com/nextgis/nextgis_frontend/commit/05152e5b1513a44576873c14350444a3a7b43a58))
* **ngw-map:** not block when error on add qms layer ([3b3a8c7](https://github.com/nextgis/nextgis_frontend/commit/3b3a8c76100808f2f70c51cb2fe8f17711de9031))
* **ngw-map:** return default map bounds ([77b497a](https://github.com/nextgis/nextgis_frontend/commit/77b497aca6f17b9e81e6deeffb8f29f1914e2e83))
* **ngw-сщттусещк:** resource search query parent_id param ([f7dd32a](https://github.com/nextgis/nextgis_frontend/commit/f7dd32aa600eb7a608a81dd9adf6cd88defc3615))
* **ol-map-adapter:** geojson adapter style function type detection ([29452d1](https://github.com/nextgis/nextgis_frontend/commit/29452d1389794bc188bcc5da9d32082065e6cb43))
* remove require imports ([c227e90](https://github.com/nextgis/nextgis_frontend/commit/c227e9003e209ea88ed86bab2903fa88492083f4))
* replace emitter.of by emitter.removeListener ([e31a4e0](https://github.com/nextgis/nextgis_frontend/commit/e31a4e09c0e414314e98c84caca9322e4e4f39a9))
* **webmap:** constructor options; move controls options from ngw to webmap ([10ad07e](https://github.com/nextgis/nextgis_frontend/commit/10ad07ed1342dd3a1301e4c48255e16d65751c0d))
* **webmap:** editing for new layer visibility standard ([2dcd9e0](https://github.com/nextgis/nextgis_frontend/commit/2dcd9e0e98b3db8414aad2f6bc15b36acf9401f7))
* **webmap:** webmap constructor options ([81b53ee](https://github.com/nextgis/nextgis_frontend/commit/81b53ee68e1d0f3b945038c718e999d0f5cfe15c))


### Build System

* qms-kit to rollup ([9fdc1f8](https://github.com/nextgis/nextgis_frontend/commit/9fdc1f8155aea86e7ddc1d2b2d078c21391ca803))
* wepmap to rollup ([8b27550](https://github.com/nextgis/nextgis_frontend/commit/8b27550fc396a032d637996d43679362baa2d0c4))


### chore

* build; eslint ([f9a736e](https://github.com/nextgis/nextgis_frontend/commit/f9a736ef43d07f295a9c63015ce745416584bd25))


### Code Refactoring

* change WebMap and NgwMap constructor options ([dcd03e2](https://github.com/nextgis/nextgis_frontend/commit/dcd03e29f349ea632f791ac10c2dfa5d3f379b80))
* **ngw-kit:** naming ([53a80b7](https://github.com/nextgis/nextgis_frontend/commit/53a80b742c0462f744fc0884d1499a09b51f2b18))
* rename layerAdapter baseLayer option to baselayer ([e5428f1](https://github.com/nextgis/nextgis_frontend/commit/e5428f1f5bc6148ffb3c933a6ac96a4b373b6a02))
* **webmap:** change default paint ([8baa408](https://github.com/nextgis/nextgis_frontend/commit/8baa4081314a4024d32b01396dab0b9e0ec4684e))


### Features

* add get default controls function ([7301599](https://github.com/nextgis/nextgis_frontend/commit/7301599f515684544944dad7c17031cde38433af))
* add library cancelable-promise ([7a0d99f](https://github.com/nextgis/nextgis_frontend/commit/7a0d99f7ae874c058068141e8a8634032004195f))
* add setViewDelay options to control map update ([7a06377](https://github.com/nextgis/nextgis_frontend/commit/7a06377c556975b51f828d8c823195aa727dfe88))
* **leaflet-map-adapter:** add position to vector adapter layers definition ([3a20a8c](https://github.com/nextgis/nextgis_frontend/commit/3a20a8c2bedbd953e7e29446e1acf28a5ce68a4d))
* **leaflet-map-adapter:** change geojson layer opacity ([b0a02c7](https://github.com/nextgis/nextgis_frontend/commit/b0a02c7725999d54cb23081d7181df88d12ebca7))
* **mapbox-map-adapter:** MVT match paint ([441d857](https://github.com/nextgis/nextgis_frontend/commit/441d8575d135cbb3ff2ca3bc48a87a90460d3ce5))
* **mapboxgl-map-adapter:** implement labelOnHover option ([0093860](https://github.com/nextgis/nextgis_frontend/commit/0093860be24edb80e2c25c77aabecf3c1dbf7688))
* move getIdentifyRadius from ngw-map to utils package ([5976907](https://github.com/nextgis/nextgis_frontend/commit/5976907003adf0514004c4ae8c72dbeaf02d7e9a))
* **ngw-connector:** add check for 403 ngw error ([22627ea](https://github.com/nextgis/nextgis_frontend/commit/22627ea0f8e2c3f169bf3d83956f1aa525179488))
* **ngw-kit:** add feature to getIdentifyItems ([e512ee7](https://github.com/nextgis/nextgis_frontend/commit/e512ee7dae4b09f5e44932e5cb1be07a50f1931b))
* **ngw-kit:** add identify item for speedup ngw selection ([3bd8626](https://github.com/nextgis/nextgis_frontend/commit/3bd86264d1ae7712eb39f377b02c60daf5f070dd))
* **ngw-kit:** add NgwKit.utils.getCompanyLogo method ([348beb6](https://github.com/nextgis/nextgis_frontend/commit/348beb6419166726edb2854acfb303411e28d0c9))
* **ngw-kit:** add toGeojson in ngw layer item response ([9ca7349](https://github.com/nextgis/nextgis_frontend/commit/9ca734951c7e6fdfe2a231b97d3aa19fc660289a))
* **ngw-kit:** add webmap item method to cotrol item children order ([f40f729](https://github.com/nextgis/nextgis_frontend/commit/f40f7299d89cafb441716c45dd4649991ccc59a2))
* **ngw-kit:** disable default map maxBounds whole world ([af1334d](https://github.com/nextgis/nextgis_frontend/commit/af1334d44b8bd3ebb4a66f0ddf5d27e99a6ce6bb))
* **ngw-kit:** new addNgwLayer resource option for keyname or resourceId ([c7826dd](https://github.com/nextgis/nextgis_frontend/commit/c7826dd658eb18656f9802a12d5c3c4d5e19f000))
* **ngw-kit:** use abort signal in fetch requests ([57a9d0d](https://github.com/nextgis/nextgis_frontend/commit/57a9d0d35df1c490507e1499262749735ec599ba))
* **ngw-map:** add ngw layer from resource item object ([c4118d3](https://github.com/nextgis/nextgis_frontend/commit/c4118d3835818f3ae4d356c5220a1c72a905f619))
* **ngw-map:** add promise groups handler ([9cbe6b7](https://github.com/nextgis/nextgis_frontend/commit/9cbe6b76d08b88a24c1bd4ad0041f7be6d2b2ad9))
* **ngw-map:** default bounds; add mapOption for show osm baselayer ([3b8368d](https://github.com/nextgis/nextgis_frontend/commit/3b8368de62fbd773875273cba21dac07983e2fe5))
* **qms-kit:** update createAdapter options interface ([dd48f8d](https://github.com/nextgis/nextgis_frontend/commit/dd48f8d382a36f2f8c384e9af919b7c777a43e61))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([4e2d149](https://github.com/nextgis/nextgis_frontend/commit/4e2d1495810480af84fee0644061157df1b6f0b5))
* **vue:** VueNgwControl from string  kind option ([31e560b](https://github.com/nextgis/nextgis_frontend/commit/31e560ba8808a4875a1b9307036b51ae43e3685f))
* **webmap:** add MapAdapter map options ([3742ebe](https://github.com/nextgis/nextgis_frontend/commit/3742ebef1832b160575880e0d67b117162f4591f))
* **webmap:** add special MapAdapterOptions option to MapOptions ([d05e535](https://github.com/nextgis/nextgis_frontend/commit/d05e535f4cab70769e133f7ef22978a348c30f3a))
* **webmap:** getZoom return number or fail ([e452519](https://github.com/nextgis/nextgis_frontend/commit/e452519f067eb7a3a486de24e48e0f642cd57f3f))
* **webmap:** new addTileLayer shortcut WebMap method ([ce601eb](https://github.com/nextgis/nextgis_frontend/commit/ce601eb454fd6d1b06e82ed2617c042477f7f9b1))


### Performance Improvements

* **ngw-kit:** geojson adapter not blocked on data load ([4dbf64f](https://github.com/nextgis/nextgis_frontend/commit/4dbf64f95fadb680b4be6db39b08275d938f791c))
* **ngw-map:** identify only when listeners exist ([662172d](https://github.com/nextgis/nextgis_frontend/commit/662172d7be731771a70ca5b826b8f4e9c1af2929))


### types

* **ngw-connector:** rename ([032b555](https://github.com/nextgis/nextgis_frontend/commit/032b5550d0e6d0146dd36ac6091fb978bf1668ba))


### wip

* **util:** move CancelablePromise to util ([9d7a645](https://github.com/nextgis/nextgis_frontend/commit/9d7a6454b273edf228b8bf8be353ddb8a8bc250e))


### BREAKING CHANGES

* **ngw-kit:** remove default `maxBounds` option fron ngw-kit
* **webmap:** webMap.getZoom() do not return undefined more; number or fail
* **ngw-connector:** FeatureLayerFields type is now FeatureProperties
* **webmap:** changed the default paint: the fill is semi-transparent, add stroke
* `new WebMap({ mapAdapter: new MapAdapter(), ...appOptions, mapOptions: MapOptions })` > `new WebMap(mapOptions)`
* `new NgwMap(new MapAdapter(), ngwMapOptions)` > `new NgwMap(ngwMapOptions)`
* `WebMapOptions.create` is now `true` by default
* **ngw-kit:** replace `import { WebMapLayerAdapter } from @nextgis/ngw-kit` to `import { NgwWebmapLayerAdapter } from @nextgis/ngw-kit` and `import { WebMapLayerItem} from @nextgis/ngw-kit` to `import { NgwWebmapLayerItem } from @nextgis/ngw-kit`
* No more default export from `qms-kit`. You should replace `import QmsKit from "@nextgis/qms-kit"` to `import { QmsKit } from "@nextgis/qms-kit"` everywhere
* No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
* LayerAdapter option baseLayer was renamed to baselayer;
* webMap.getBaseLayers() method now return LayerAdapter, not string array of ids
* **ngw-kit:** rename NgwKit.utils.getIdentifyGeoJsonParams > NgwKit.utils.getIdentifyItems
* code formatting rules changed to prettier 2.0 compatibility
* **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'





## [1.16.9](https://github.com/nextgis/nextgis_frontend/compare/v1.16.8...v1.16.9) (2023-07-04)

**Note:** Version bump only for package @nextgis/ngw-map





## 1.16.8 (2023-05-14)


### Bug Fixes

* **build:** control-container extract css ([a02d24b](https://github.com/nextgis/nextgis_frontend/commit/a02d24bf2dbe246420803d5d1be9348e4b647c6d))
* **leaflet-map-adapter:** geojson selection ([d260db5](https://github.com/nextgis/nextgis_frontend/commit/d260db579912644fdb641a72e930df3575df566b))
* **ngw-connector:** clean cache on resource delete ([7fc716c](https://github.com/nextgis/nextgis_frontend/commit/7fc716cba13ea964cef8e23d19ab7577b1b6b86a))
* **ngw-kit:** createGeojsonAdapter propertiesFilter ([06c109f](https://github.com/nextgis/nextgis_frontend/commit/06c109fd4ddae20db91b15fbb7c5e7d2909aaf76))
* **ngw-kit:** fix addNgwLayer resource options ([e2e37d4](https://github.com/nextgis/nextgis_frontend/commit/e2e37d4f48718afbdc0619eb43e46c49b636359a))
* **ngw-kit:** inject item into the createRasterAdapter class factory ([ea08e3e](https://github.com/nextgis/nextgis_frontend/commit/ea08e3e01ce7f92b3b9b7c66164d61fe334e9e72))
* **ngw-map:** constructor options ([e6f5d44](https://github.com/nextgis/nextgis_frontend/commit/e6f5d4448ec3ed2435e3c804205ff91b80697f4b))
* **ngw-map:** constructor options for control ([9e71281](https://github.com/nextgis/nextgis_frontend/commit/9e71281139d0532e574e7f2bcfef68e819f90834))
* **ngw-map:** correct ngw:select event data for raster layer ([eac1535](https://github.com/nextgis/nextgis_frontend/commit/eac1535944446a8a6d818e930dc532ad82311b39))
* **ngw-map:** identify order ([bbb6a1c](https://github.com/nextgis/nextgis_frontend/commit/bbb6a1c7295dfcaf1146d976aa8ca87a81da1cde))
* **ngw-map:** not block when error on add qms layer ([f8035e2](https://github.com/nextgis/nextgis_frontend/commit/f8035e2f2cc63a471cfa5b57a9c841e8beabadad))
* **ngw-map:** return default map bounds ([4080d4a](https://github.com/nextgis/nextgis_frontend/commit/4080d4a51bbb9e3c6860d6b257ada14d0e46cc2b))
* **ngw-сщттусещк:** resource search query parent_id param ([a1079d4](https://github.com/nextgis/nextgis_frontend/commit/a1079d42219e4997840eb59cd7e413ccf785590b))
* **ol-map-adapter:** geojson adapter style function type detection ([c71d83f](https://github.com/nextgis/nextgis_frontend/commit/c71d83f45822138428bdd4ebedbc67ecefaead9d))
* remove require imports ([2674a8c](https://github.com/nextgis/nextgis_frontend/commit/2674a8ce29ef4116b939283ee1f4ec02b26b8025))
* replace emitter.of by emitter.removeListener ([a92b281](https://github.com/nextgis/nextgis_frontend/commit/a92b2810df7fae74bb58f50d6791a21bb4a4ef0e))
* **webmap:** constructor options; move controls options from ngw to webmap ([5a3b582](https://github.com/nextgis/nextgis_frontend/commit/5a3b58209126a5b1e7a802ae8503129b11602512))
* **webmap:** editing for new layer visibility standard ([960cba5](https://github.com/nextgis/nextgis_frontend/commit/960cba596dc1e13de0da23b5bcd79f7581af5834))
* **webmap:** webmap constructor options ([e096e72](https://github.com/nextgis/nextgis_frontend/commit/e096e723d76b8db753ecdd0248b601f24fcb5026))


### Build System

* qms-kit to rollup ([6cf124f](https://github.com/nextgis/nextgis_frontend/commit/6cf124fde63bedac45ac679a44d920050bbb724b))
* wepmap to rollup ([c6f038a](https://github.com/nextgis/nextgis_frontend/commit/c6f038ad6bcd2a9581f852b35600b2560381c246))


### chore

* build; eslint ([ee1e03d](https://github.com/nextgis/nextgis_frontend/commit/ee1e03d85625b02a09c2ee1e4d66007fbf57d626))


### Code Refactoring

* change WebMap and NgwMap constructor options ([3b05f95](https://github.com/nextgis/nextgis_frontend/commit/3b05f959d6285c62aa08332c9342f24b82a3e732))
* **ngw-kit:** naming ([434411a](https://github.com/nextgis/nextgis_frontend/commit/434411a8b2f7e63d436632821d11d0e476d410b3))
* rename layerAdapter baseLayer option to baselayer ([e5c595d](https://github.com/nextgis/nextgis_frontend/commit/e5c595d6df24b1b22906ad1e06eb60bf0327e9c0))
* **webmap:** change default paint ([e0325e9](https://github.com/nextgis/nextgis_frontend/commit/e0325e9edf723b0f6e612cf67e2b6c4cff14c06d))


### Features

* add get default controls function ([f7e9c51](https://github.com/nextgis/nextgis_frontend/commit/f7e9c51f86dff8e7df12b8ec1117b78a44749d3e))
* add library cancelable-promise ([2cfb08f](https://github.com/nextgis/nextgis_frontend/commit/2cfb08f1143a773a43f1279690e0c9a7e2b2fec5))
* add setViewDelay options to control map update ([a83e5ab](https://github.com/nextgis/nextgis_frontend/commit/a83e5ab9ed6207e0a41fd31a3c56cd14a512c50d))
* **leaflet-map-adapter:** add position to vector adapter layers definition ([053ccf0](https://github.com/nextgis/nextgis_frontend/commit/053ccf05ed8d9d76592c8ca648365e176c609277))
* **leaflet-map-adapter:** change geojson layer opacity ([9862e2d](https://github.com/nextgis/nextgis_frontend/commit/9862e2de02efeef0bc55102ecdac942d0687f036))
* **mapbox-map-adapter:** MVT match paint ([4115554](https://github.com/nextgis/nextgis_frontend/commit/41155542218ef1e28fa57803f586cfa384df4784))
* **mapboxgl-map-adapter:** implement labelOnHover option ([2e575b3](https://github.com/nextgis/nextgis_frontend/commit/2e575b349f06adc6f6a6906b4ca592ec4b0362fc))
* move getIdentifyRadius from ngw-map to utils package ([159cbfc](https://github.com/nextgis/nextgis_frontend/commit/159cbfccb0ee32c774c2b32f5599d05146df9006))
* **ngw-connector:** add check for 403 ngw error ([a0069dd](https://github.com/nextgis/nextgis_frontend/commit/a0069dd733897a864a4450ac6dd576b0a32b14d3))
* **ngw-kit:** add feature to getIdentifyItems ([e08532a](https://github.com/nextgis/nextgis_frontend/commit/e08532ae020ef9ef2acfc2dfc552a4a92565d73c))
* **ngw-kit:** add identify item for speedup ngw selection ([4f751d0](https://github.com/nextgis/nextgis_frontend/commit/4f751d0af8b1b7973d0979fef5beaf4c5b8e17b4))
* **ngw-kit:** add NgwKit.utils.getCompanyLogo method ([301ff78](https://github.com/nextgis/nextgis_frontend/commit/301ff78d36b712e93fdfbd03f5c8f57dd93cbc14))
* **ngw-kit:** add toGeojson in ngw layer item response ([0af64ad](https://github.com/nextgis/nextgis_frontend/commit/0af64ad1f907996f357a2355a35597319ec4bb0a))
* **ngw-kit:** add webmap item method to cotrol item children order ([6387eba](https://github.com/nextgis/nextgis_frontend/commit/6387ebadabae7a1d2b68e2221b20eda81a7465e0))
* **ngw-kit:** disable default map maxBounds whole world ([f6a439d](https://github.com/nextgis/nextgis_frontend/commit/f6a439dde244c670994c5cb624160ffb06c3262e))
* **ngw-kit:** new addNgwLayer resource option for keyname or resourceId ([3881c42](https://github.com/nextgis/nextgis_frontend/commit/3881c427dc2ae770634605944d1207d1ec6b2b38))
* **ngw-kit:** use abort signal in fetch requests ([fe2e5cc](https://github.com/nextgis/nextgis_frontend/commit/fe2e5cc1a291e7e1ea1821a8380f4f4db68ea270))
* **ngw-map:** add ngw layer from resource item object ([e9c13f5](https://github.com/nextgis/nextgis_frontend/commit/e9c13f5ca0c1fb00106d0aa3f944cff1c92931e1))
* **ngw-map:** add promise groups handler ([2fb6ab1](https://github.com/nextgis/nextgis_frontend/commit/2fb6ab152037e04fb037313140536e3e4ac8a938))
* **ngw-map:** default bounds; add mapOption for show osm baselayer ([b376198](https://github.com/nextgis/nextgis_frontend/commit/b376198b1b9038899a6ec46ed97e443d9f591365))
* **qms-kit:** update createAdapter options interface ([e349073](https://github.com/nextgis/nextgis_frontend/commit/e3490730a55e69d8df396da70ec5afbfa5393657))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([bcea6c3](https://github.com/nextgis/nextgis_frontend/commit/bcea6c35e61f6ba2aab0b25eb30da9f5f719c92e))
* **vue:** VueNgwControl from string  kind option ([9a1a51b](https://github.com/nextgis/nextgis_frontend/commit/9a1a51b4ecad8f74f2bb2f54b67c34b94c4237ad))
* **webmap:** add MapAdapter map options ([15e3c50](https://github.com/nextgis/nextgis_frontend/commit/15e3c50eb61c8457e9695e527274beb6cf751a6a))
* **webmap:** add special MapAdapterOptions option to MapOptions ([9785d13](https://github.com/nextgis/nextgis_frontend/commit/9785d13697b091de07109f12b2f08e7e255516a5))
* **webmap:** getZoom return number or fail ([08df46d](https://github.com/nextgis/nextgis_frontend/commit/08df46dd1028743e6c9596e079db19b60c209eb4))
* **webmap:** new addTileLayer shortcut WebMap method ([a209dfc](https://github.com/nextgis/nextgis_frontend/commit/a209dfc8b09bde6b99ebea4604a5238f40a1f911))


### Performance Improvements

* **ngw-kit:** geojson adapter not blocked on data load ([1fe9df6](https://github.com/nextgis/nextgis_frontend/commit/1fe9df685aec00c5569e3af20194c873362b3999))
* **ngw-map:** identify only when listeners exist ([e97ad73](https://github.com/nextgis/nextgis_frontend/commit/e97ad730e3afa01fa36a4dc06c6acd5f66159d02))


### types

* **ngw-connector:** rename ([85bf430](https://github.com/nextgis/nextgis_frontend/commit/85bf430fa9fc25f427a9861e35f267d243c26ed8))


### wip

* **util:** move CancelablePromise to util ([a687a8f](https://github.com/nextgis/nextgis_frontend/commit/a687a8fe0b8389adeb2a6d6f97db330c2f60ad48))


### BREAKING CHANGES

* **ngw-kit:** remove default `maxBounds` option fron ngw-kit
* **webmap:** webMap.getZoom() do not return undefined more; number or fail
* **ngw-connector:** FeatureLayerFields type is now FeatureProperties
* **webmap:** changed the default paint: the fill is semi-transparent, add stroke
* `new WebMap({ mapAdapter: new MapAdapter(), ...appOptions, mapOptions: MapOptions })` > `new WebMap(mapOptions)`
* `new NgwMap(new MapAdapter(), ngwMapOptions)` > `new NgwMap(ngwMapOptions)`
* `WebMapOptions.create` is now `true` by default
* **ngw-kit:** replace `import { WebMapLayerAdapter } from @nextgis/ngw-kit` to `import { NgwWebmapLayerAdapter } from @nextgis/ngw-kit` and `import { WebMapLayerItem} from @nextgis/ngw-kit` to `import { NgwWebmapLayerItem } from @nextgis/ngw-kit`
* No more default export from `qms-kit`. You should replace `import QmsKit from "@nextgis/qms-kit"` to `import { QmsKit } from "@nextgis/qms-kit"` everywhere
* No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
* LayerAdapter option baseLayer was renamed to baselayer;
* webMap.getBaseLayers() method now return LayerAdapter, not string array of ids
* **ngw-kit:** rename NgwKit.utils.getIdentifyGeoJsonParams > NgwKit.utils.getIdentifyItems
* code formatting rules changed to prettier 2.0 compatibility
* **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'





## [1.16.7](https://github.com/nextgis/nextgis_frontend/compare/v1.16.6...v1.16.7) (2023-04-21)


### Features

* **qms-kit:** update createAdapter options interface ([f1e83e7](https://github.com/nextgis/nextgis_frontend/commit/f1e83e7f2cba2af1942c80c100344d130f9d0067))





## [1.16.6](https://github.com/nextgis/nextgis_frontend/compare/v1.16.5...v1.16.6) (2023-02-09)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.16.5](https://github.com/nextgis/nextgis_frontend/compare/v1.16.4...v1.16.5) (2023-02-09)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.16.4](https://github.com/nextgis/nextgis_frontend/compare/v1.16.3...v1.16.4) (2022-09-21)

### Bug Fixes

- **ngw-map:** correct ngw:select event data for raster layer ([8af8eeb](https://github.com/nextgis/nextgis_frontend/commit/8af8eeb0ef64002e786603623d8fa2868374fff5))

## [1.16.3](https://github.com/nextgis/nextgis_frontend/compare/v1.16.2...v1.16.3) (2022-09-16)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.16.2](https://github.com/nextgis/nextgis_frontend/compare/v1.16.1...v1.16.2) (2022-09-15)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.16.1](https://github.com/nextgis/nextgis_frontend/compare/v1.16.0...v1.16.1) (2022-09-03)

### Features

- move getIdentifyRadius from ngw-map to utils package ([40d1103](https://github.com/nextgis/nextgis_frontend/commit/40d1103fd658ed6ffc7f530d47e36f569ad33ba4))

# [1.16.0](https://github.com/nextgis/nextgis_frontend/compare/v1.15.1...v1.16.0) (2022-08-28)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.15.1](https://github.com/nextgis/nextgis_frontend/compare/v1.15.0...v1.15.1) (2022-08-02)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.15.0](https://github.com/nextgis/nextgis_frontend/compare/v1.14.0...v1.15.0) (2022-07-27)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.14.0](https://github.com/nextgis/nextgis_frontend/compare/v1.13.8...v1.14.0) (2022-07-05)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.13.8](https://github.com/nextgis/nextgis_frontend/compare/v1.13.7...v1.13.8) (2022-06-25)

### Features

- **mapbox-map-adapter:** MVT match paint ([068fe38](https://github.com/nextgis/nextgis_frontend/commit/068fe38b29d453a2710df7aa0c35d9ea697be62e))

## [1.13.7](https://github.com/nextgis/nextgis_frontend/compare/v1.13.6...v1.13.7) (2022-06-15)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.13.6](https://github.com/nextgis/nextgis_frontend/compare/v1.13.5...v1.13.6) (2022-06-05)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.13.5](https://github.com/nextgis/nextgis_frontend/compare/v1.13.4...v1.13.5) (2022-05-31)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.13.4](https://github.com/nextgis/nextgis_frontend/compare/v1.13.3...v1.13.4) (2022-05-31)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.13.3](https://github.com/nextgis/nextgis_frontend/compare/v1.13.2...v1.13.3) (2022-05-31)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.13.2](https://github.com/nextgis/nextgis_frontend/compare/v1.13.1...v1.13.2) (2022-05-30)

### Features

- **ngw-kit:** use abort signal in fetch requests ([c68a8f1](https://github.com/nextgis/nextgis_frontend/commit/c68a8f1223806ea1820428566d7b7fa6a7cb97a2))

## [1.13.1](https://github.com/nextgis/nextgis_frontend/compare/v1.13.0...v1.13.1) (2022-05-13)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.13.0](https://github.com/nextgis/nextgis_frontend/compare/v1.12.1...v1.13.0) (2022-05-13)

### Features

- **webmap:** add MapAdapter map options ([a6b48a4](https://github.com/nextgis/nextgis_frontend/commit/a6b48a499122e184ec01ad626c97f6f48b7e3984))

## [1.12.1](https://github.com/nextgis/nextgis_frontend/compare/v1.12.0...v1.12.1) (2022-04-21)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.12.0](https://github.com/nextgis/nextgis_frontend/compare/v1.11.10...v1.12.0) (2022-03-05)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.11.10](https://github.com/nextgis/nextgis_frontend/compare/v1.11.9...v1.11.10) (2022-01-20)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.11.9](https://github.com/nextgis/nextgis_frontend/compare/v1.11.8...v1.11.9) (2022-01-18)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.11.8](https://github.com/nextgis/nextgis_frontend/compare/v1.11.7...v1.11.8) (2022-01-18)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.11.7](https://github.com/nextgis/nextgis_frontend/compare/v1.11.6...v1.11.7) (2022-01-11)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.11.3](https://github.com/nextgis/nextgis_frontend/compare/v1.11.2...v1.11.3) (2022-01-03)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.11.2](https://github.com/nextgis/nextgis_frontend/compare/v1.11.1...v1.11.2) (2021-12-20)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.11.0](https://github.com/nextgis/nextgis_frontend/compare/v1.10.0...v1.11.0) (2021-12-19)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.10.0](https://github.com/nextgis/nextgis_frontend/compare/v1.9.7...v1.10.0) (2021-11-30)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.9.7](https://github.com/nextgis/nextgis_frontend/compare/v1.9.6...v1.9.7) (2021-11-19)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.9.6](https://github.com/nextgis/nextgis_frontend/compare/v1.9.5...v1.9.6) (2021-11-18)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.9.5](https://github.com/nextgis/nextgis_frontend/compare/v1.9.4...v1.9.5) (2021-11-18)

### Bug Fixes

- **ngw-map:** return default map bounds ([77b57fc](https://github.com/nextgis/nextgis_frontend/commit/77b57fcfbb49aa1d1d261c9d6bf67be85cddfe1f))

## [1.9.4](https://github.com/nextgis/nextgis_frontend/compare/v1.9.3...v1.9.4) (2021-11-16)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.9.3](https://github.com/nextgis/nextgis_frontend/compare/v1.9.2...v1.9.3) (2021-11-05)

### Bug Fixes

- **ngw-сщттусещк:** resource search query parent_id param ([06d44d7](https://github.com/nextgis/nextgis_frontend/commit/06d44d776cd222f75b01f59d929a25c494234f9a))
- **ngw-connector:** clean cache on resource delete ([0816107](https://github.com/nextgis/nextgis_frontend/commit/0816107542757838811a7ed9b9e814e51912254c))

### Features

- **ngw-kit:** disable default map maxBounds whole world ([9bd643f](https://github.com/nextgis/nextgis_frontend/commit/9bd643ff21a4a872236c63b105f764a859fe841c))

### BREAKING CHANGES

- **ngw-kit:** remove default `maxBounds` option fron ngw-kit

## [1.9.2](https://github.com/nextgis/nextgis_frontend/compare/v1.9.1...v1.9.2) (2021-10-26)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.9.1](https://github.com/nextgis/nextgis_frontend/compare/v1.9.0...v1.9.1) (2021-10-25)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.9.0](https://github.com/nextgis/nextgis_frontend/compare/v1.8.5...v1.9.0) (2021-10-23)

### Features

- **webmap:** getZoom return number or fail ([accc46a](https://github.com/nextgis/nextgis_frontend/commit/accc46a53d1a074b32d4ef5aa41ca2f9df07caaf))

### BREAKING CHANGES

- **webmap:** webMap.getZoom() do not return undefined more; number or fail

## [1.8.4](https://github.com/nextgis/nextgis_frontend/compare/v1.8.3...v1.8.4) (2021-10-21)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.8.3](https://github.com/nextgis/nextgis_frontend/compare/v1.8.2...v1.8.3) (2021-10-12)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.8.2](https://github.com/nextgis/nextgis_frontend/compare/v1.8.1...v1.8.2) (2021-10-05)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.8.1](https://github.com/nextgis/nextgis_frontend/compare/v1.8.0...v1.8.1) (2021-09-23)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.8.0](https://github.com/nextgis/nextgis_frontend/compare/v1.7.0...v1.8.0) (2021-09-22)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.7.0](https://github.com/nextgis/nextgis_frontend/compare/v1.6.0...v1.7.0) (2021-09-16)

### Features

- **leaflet-map-adapter:** add position to vector adapter layers definition ([61cb7a5](https://github.com/nextgis/nextgis_frontend/commit/61cb7a591ed3ececcabed710abf1e0aec6708c1b))

# [1.6.0](https://github.com/nextgis/nextgis_frontend/compare/v1.5.1...v1.6.0) (2021-09-09)

### Features

- **webmap:** new addTileLayer shortcut WebMap method ([421198a](https://github.com/nextgis/nextgis_frontend/commit/421198a0181b8c817e3ed7736d0734f143de3eeb))

## [1.5.1](https://github.com/nextgis/nextgis_frontend/compare/v1.5.0...v1.5.1) (2021-09-06)

### Bug Fixes

- **ol-map-adapter:** geojson adapter style function type detection ([b731e04](https://github.com/nextgis/nextgis_frontend/commit/b731e04977529a30515dbb86dad537f76ecc7fe3))

# [1.5.0](https://github.com/nextgis/nextgis_frontend/compare/v1.4.0...v1.5.0) (2021-08-19)

### Features

- **leaflet-map-adapter:** change geojson layer opacity ([3d75fb2](https://github.com/nextgis/nextgis_frontend/commit/3d75fb2f20d0759839dcaa7650c10740a1f35d22))

# [1.4.0](https://github.com/nextgis/nextgis_frontend/compare/v1.3.0...v1.4.0) (2021-08-17)

### Features

- **mapboxgl-map-adapter:** implement labelOnHover option ([b0f7507](https://github.com/nextgis/nextgis_frontend/commit/b0f75075fdbbc3d7a8cceb6ff329a1e629ac169e))

# [1.3.0](https://github.com/nextgis/nextgis_frontend/compare/v1.2.8...v1.3.0) (2021-08-06)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.2.8](https://github.com/nextgis/nextgis_frontend/compare/v1.2.7...v1.2.8) (2021-07-27)

### Bug Fixes

- **leaflet-map-adapter:** geojson selection ([1022e71](https://github.com/nextgis/nextgis_frontend/commit/1022e71d46f5513f0ff3a60f4be7d96a84ff4f15))

## [1.2.7](https://github.com/nextgis/nextgis_frontend/compare/v1.2.6...v1.2.7) (2021-07-26)

### Bug Fixes

- **ngw-kit:** createGeojsonAdapter propertiesFilter ([8beacb0](https://github.com/nextgis/nextgis_frontend/commit/8beacb0b0f2f8599c73be934fadcf2bae5ab5f85))

## [1.2.4](https://github.com/nextgis/nextgis_frontend/compare/v1.2.3...v1.2.4) (2021-07-22)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.2.3](https://github.com/nextgis/nextgis_frontend/compare/v1.2.2...v1.2.3) (2021-07-21)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.2.2](https://github.com/nextgis/nextgis_frontend/compare/v1.2.1...v1.2.2) (2021-07-16)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.2.1](https://github.com/nextgis/nextgis_frontend/compare/v1.2.0...v1.2.1) (2021-07-12)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.2.0](https://github.com/nextgis/nextgis_frontend/compare/v1.1.2...v1.2.0) (2021-07-08)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.1.2](https://github.com/nextgis/nextgis_frontend/compare/v1.1.1...v1.1.2) (2021-06-28)

**Note:** Version bump only for package @nextgis/ngw-map

## [1.1.1](https://github.com/nextgis/nextgis_frontend/compare/v1.1.0...v1.1.1) (2021-06-25)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.1.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.1...v1.1.0) (2021-06-25)

### types

- **ngw-connector:** rename ([0e7f0b9](https://github.com/nextgis/nextgis_frontend/commit/0e7f0b979a774ea27ad45a0f7d7576ff11ad8d56))

### BREAKING CHANGES

- **ngw-connector:** FeatureLayerFields type is now FeatureProperties

## [1.0.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0...v1.0.1) (2021-06-08)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.0.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.9...v1.0.0) (2021-06-07)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.0.0-beta.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2021-05-03)

### Features

- **ngw-kit:** add identify item for speedup ngw selection ([b051f9f](https://github.com/nextgis/nextgis_frontend/commit/b051f9f6f596f3a54645e5ccbc628907ed83fca1))

# [1.0.0-beta.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2021-05-02)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.0.0-beta.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-04-23)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.0.0-beta.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-04-04)

### Bug Fixes

- **ngw-kit:** inject item into the createRasterAdapter class factory ([567809b](https://github.com/nextgis/nextgis_frontend/commit/567809b366231f4b78453f52e544e6bc134cd486))

# [1.0.0-beta.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-02-13)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.0.0-beta.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-01-17)

### Features

- add setViewDelay options to control map update ([3c50948](https://github.com/nextgis/nextgis_frontend/commit/3c50948d8ce31d79879cf566f827cee78fc1af31))

# [1.0.0-beta.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-12-19)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.0.0-beta.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-11-28)

### Bug Fixes

- **ngw-map:** identify order ([1635f61](https://github.com/nextgis/nextgis_frontend/commit/1635f61e0c38fd913a850807cd1d084320016d3a))

### Features

- **ngw-kit:** add toGeojson in ngw layer item response ([a9f073a](https://github.com/nextgis/nextgis_frontend/commit/a9f073a50dac3ecf3472e7b90f4124b8e3a6b772))
- **ngw-map:** add promise groups handler ([864fc6d](https://github.com/nextgis/nextgis_frontend/commit/864fc6d3a905e72136df3795f1e86046d54e0fd4))

### Performance Improvements

- **ngw-map:** identify only when listeners exist ([f591343](https://github.com/nextgis/nextgis_frontend/commit/f5913431b110b001e1403ee59fc97c343ea576c6))

# [1.0.0-beta.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2020-11-16)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.0.0-alpha.11](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2020-11-02)

### Bug Fixes

- **ngw-map:** constructor options for control ([7d40e0c](https://github.com/nextgis/nextgis_frontend/commit/7d40e0c6d52f3d734cd5f28173f03e4a1a0943df))
- **webmap:** constructor options; move controls options from ngw to webmap ([611b8c0](https://github.com/nextgis/nextgis_frontend/commit/611b8c0af120c726ccf42eca0a608edbd54bb1c1))

# [1.0.0-alpha.10](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-10-20)

### Bug Fixes

- **ngw-map:** constructor options ([d78dd12](https://github.com/nextgis/nextgis_frontend/commit/d78dd1268c916479359a70299aa42dcfaac0e738))

### Code Refactoring

- **webmap:** change default paint ([1baea95](https://github.com/nextgis/nextgis_frontend/commit/1baea95158e2cd8b79ec2de6b95a377030951d0f))

### BREAKING CHANGES

- **webmap:** changed the default paint: the fill is semi-transparent, add stroke

# [1.0.0-alpha.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-10-15)

### Bug Fixes

- **webmap:** webmap constructor options ([8c92b6c](https://github.com/nextgis/nextgis_frontend/commit/8c92b6c17e4b0f69630abb5ad0ffa78234d50a6f))

### Code Refactoring

- change WebMap and NgwMap constructor options ([de7eaf9](https://github.com/nextgis/nextgis_frontend/commit/de7eaf900ece63cf91596b726ad19918f3b926b7))

### Features

- **ngw-map:** default bounds; add mapOption for show osm baselayer ([8df4e0e](https://github.com/nextgis/nextgis_frontend/commit/8df4e0ea53a41f3df7a782c973686c160c3552d6))

### BREAKING CHANGES

- `new WebMap({ mapAdapter: new MapAdapter(), ...appOptions, mapOptions: MapOptions })` > `new WebMap(mapOptions)`
- `new NgwMap(new MapAdapter(), ngwMapOptions)` > `new NgwMap(ngwMapOptions)`
- `WebMapOptions.create` is now `true` by default

# [1.0.0-alpha.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-06)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.0.0-alpha.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-09-22)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.0.0-alpha.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.0.0-alpha.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)

### Bug Fixes

- remove require imports ([be789b8](https://github.com/nextgis/nextgis_frontend/commit/be789b89f39741efe146da97eeb19460a7cca527))

# [1.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)

### Code Refactoring

- **ngw-kit:** naming ([f870925](https://github.com/nextgis/nextgis_frontend/commit/f8709259501b811f269a89445975969e00db2763))

### BREAKING CHANGES

- **ngw-kit:** replace `import { WebMapLayerAdapter } from @nextgis/ngw-kit` to `import { NgwWebmapLayerAdapter } from @nextgis/ngw-kit` and `import { WebMapLayerItem} from @nextgis/ngw-kit` to `import { NgwWebmapLayerItem } from @nextgis/ngw-kit`

# [1.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)

**Note:** Version bump only for package @nextgis/ngw-map

# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)

### Bug Fixes

- replace emitter.of by emitter.removeListener ([5a92e2b](https://github.com/nextgis/nextgis_frontend/commit/5a92e2b91e741346be39be87d5b9f50b9621c092))
- **ngw-kit:** fix addNgwLayer resource options ([c689db1](https://github.com/nextgis/nextgis_frontend/commit/c689db13cb8fb2d043ef395ae56ab501cf77a350))
- **webmap:** editing for new layer visibility standard ([32413d0](https://github.com/nextgis/nextgis_frontend/commit/32413d085d30073056b8da97c8735ca13016c616))

### Build System

- qms-kit to rollup ([3831a57](https://github.com/nextgis/nextgis_frontend/commit/3831a57e661a85386ef14b69cc6ef682cf961394))
- wepmap to rollup ([bc66507](https://github.com/nextgis/nextgis_frontend/commit/bc665072f7eefacae748c2cf81f6bdef75d9f8aa))

### Code Refactoring

- rename layerAdapter baseLayer option to baselayer ([368d657](https://github.com/nextgis/nextgis_frontend/commit/368d6576278505ddddde2a1ab160a0849e087c70))

### Features

- **ngw-connector:** add check for 403 ngw error ([e344663](https://github.com/nextgis/nextgis_frontend/commit/e344663a974867e510b460fb00eea1775d801ee4))
- **ngw-kit:** add webmap item method to cotrol item children order ([4c4e95a](https://github.com/nextgis/nextgis_frontend/commit/4c4e95a146c4aeb3d5b5e7a1868ab17e5ff68c1c))
- **webmap:** add special MapAdapterOptions option to MapOptions ([e3dd2ec](https://github.com/nextgis/nextgis_frontend/commit/e3dd2eceb5b63bf7c19791deacd72b2e047a74f8))

### BREAKING CHANGES

- No more default export from `qms-kit`. You should replace `import QmsKit from "@nextgis/qms-kit"` to `import { QmsKit } from "@nextgis/qms-kit"` everywhere
- No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
- LayerAdapter option baseLayer was renamed to baselayer;
- webMap.getBaseLayers() method now return LayerAdapter, not string array of ids

# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)

### Features

- **ngw-kit:** add NgwKit.utils.getCompanyLogo method ([3c6fa09](https://github.com/nextgis/nextgis_frontend/commit/3c6fa09321c0e979543b50b93c32da8725920d28))

# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)

### Features

- **ngw-kit:** add feature to getIdentifyItems ([9641c8e](https://github.com/nextgis/nextgis_frontend/commit/9641c8e8b0e67ece7186ba8a6803d109e6503afd))
- **ngw-map:** add ngw layer from resource item object ([18fb9e1](https://github.com/nextgis/nextgis_frontend/commit/18fb9e105fe733b8e1e5736cfb3afeb8e5b9e84c))
- **vue:** VueNgwControl from string kind option ([1050be8](https://github.com/nextgis/nextgis_frontend/commit/1050be8d7488713e10869e1060e76a8da313d21f))

### BREAKING CHANGES

- **ngw-kit:** rename NgwKit.utils.getIdentifyGeoJsonParams > NgwKit.utils.getIdentifyItems

## [0.30.2](https://github.com/nextgis/nextgis_frontend/compare/v0.30.1...v0.30.2) (2020-04-30)

**Note:** Version bump only for package @nextgis/ngw-map

## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)

**Note:** Version bump only for package @nextgis/ngw-map

# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)

**Note:** Version bump only for package @nextgis/ngw-map

## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)

**Note:** Version bump only for package @nextgis/ngw-map

## [0.29.10](https://github.com/nextgis/nextgis_frontend/compare/v0.29.9...v0.29.10) (2020-04-17)

**Note:** Version bump only for package @nextgis/ngw-map

## [0.29.6](https://github.com/nextgis/nextgis_frontend/compare/v0.29.5...v0.29.6) (2020-04-16)

**Note:** Version bump only for package @nextgis/ngw-map

## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)

**Note:** Version bump only for package @nextgis/ngw-map

## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)

**Note:** Version bump only for package @nextgis/ngw-map

## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

**Note:** Version bump only for package @nextgis/ngw-map

## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

**Note:** Version bump only for package @nextgis/ngw-map

## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)

### Bug Fixes

- **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))

# [0.29.0](https://github.com/nextgis/nextgis_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)

### chore

- build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))

### BREAKING CHANGES

- code formatting rules changed to prettier 2.0 compatibility

## [0.28.3](https://github.com/nextgis/nextgis_frontend/compare/v0.28.2...v0.28.3) (2020-03-19)

**Note:** Version bump only for package @nextgis/ngw-map

## [0.28.1](https://github.com/nextgis/nextgis_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package @nextgis/ngw-map

# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)

**Note:** Version bump only for package @nextgis/ngw-map

## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)

### Features

- add library cancelable-promise ([5227983](https://github.com/nextgis/nextgis_frontend/commit/5227983e03b0a5aa5807002f63914fa2d23154b0))

# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)

### Bug Fixes

- **ngw-map:** not block when error on add qms layer ([d06ac88](https://github.com/nextgis/nextgis_frontend/commit/d06ac88cc6088e16c38c47ef247905e84e0a5283))

### Performance Improvements

- **ngw-kit:** geojson adapter not blocked on data load ([1ceaf76](https://github.com/nextgis/nextgis_frontend/commit/1ceaf7688b9911727de5fa1b6fde9ae1f6b3da9e))

# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)

**Note:** Version bump only for package @nextgis/ngw-map

## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/ngw-map

## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/ngw-map

## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)

### Features

- **ngw-kit:** new addNgwLayer resource option for keyname or resourceId ([f1eefd2](https://github.com/nextgis/nextgis_frontend/commit/f1eefd2703dc16126ef4b0a933a86b9a34d594a7))
- **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgis_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))

### wip

- **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgis_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))

### BREAKING CHANGES

- **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'

## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)

### Features

- **ngw-kit:** new addNgwLayer resource option for keyname or resourceId ([f1eefd2](https://github.com/nextgis/nextgis_frontend/commit/f1eefd2703dc16126ef4b0a933a86b9a34d594a7))

## [0.25.4](https://github.com/nextgis/nextgis_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)

### wip

- **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgis_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))

### BREAKING CHANGES

- **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'

## [0.25.3](https://github.com/nextgis/nextgis_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)

**Note:** Version bump only for package @nextgis/ngw-map

## [0.25.2](https://github.com/nextgis/nextgis_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package @nextgis/ngw-map

## [0.25.1](https://github.com/nextgis/nextgis_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)

**Note:** Version bump only for package @nextgis/ngw-map

# [0.25.0](https://github.com/nextgis/nextgis_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)

**Note:** Version bump only for package @nextgis/ngw-map
