# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.16.8 (2023-05-14)


### Bug Fixes

* **build:** control-container extract css ([a02d24b](https://github.com/nextgis/nextgis_frontend/commit/a02d24bf2dbe246420803d5d1be9348e4b647c6d))
* **cesium:** add check for telset3d adapter addLayer ([3642e69](https://github.com/nextgis/nextgis_frontend/commit/3642e69575a4287823cd72bee569b0c9a6089eda))
* **cesium:** Tileset#DAdapter set terrain height ([4245446](https://github.com/nextgis/nextgis_frontend/commit/42454467846f2f5b0aaab5c2a74178acc7ae1e37))
* **ngw-connector:** clean cache on resource delete ([7fc716c](https://github.com/nextgis/nextgis_frontend/commit/7fc716cba13ea964cef8e23d19ab7577b1b6b86a))
* **ngw-connector:** disable request params list convert to object ([64b10e8](https://github.com/nextgis/nextgis_frontend/commit/64b10e844281a38585f3c9a870c751a44600c195))
* **ngw-connector:** do not create new instance on same url and auth ([444b745](https://github.com/nextgis/nextgis_frontend/commit/444b745f021669e7ff056c5c7dd3c4f43c1c46dd))
* **ngw-connector:** do not throw error on node data load6 use promise reject ([3222e01](https://github.com/nextgis/nextgis_frontend/commit/3222e01be3d51db0961fe927d35a7da2d998e0cf))
* **ngw-connector:** fixes to apiRequest cancel work ([e4451d8](https://github.com/nextgis/nextgis_frontend/commit/e4451d8a7ad349ba17692a3f906677f1a29bf691)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
* **ngw-connector:** get resource children resourceId zero check ([d680b01](https://github.com/nextgis/nextgis_frontend/commit/d680b019d49765fe323bf31c5a6c08aa86da3d0b))
* **ngw-connector:** getResource cache when keyname ([1c6ff6e](https://github.com/nextgis/nextgis_frontend/commit/1c6ff6ed4866e04d07165372792d7d0005597995))
* **ngw-connector:** getResourceByKeyname cache ([78262a7](https://github.com/nextgis/nextgis_frontend/commit/78262a7e3abd230f1ac35d53c49a67d5a869a679))
* **ngw-connector:** improve compatibility with Node ([7fdec8d](https://github.com/nextgis/nextgis_frontend/commit/7fdec8d92e4604a5cc89e74855df8a999a8cb64f))
* **ngw-connector:** improve for node ([def5cea](https://github.com/nextgis/nextgis_frontend/commit/def5cea9c75de32bdd8e1ab0826e832159dbe3c4))
* **ngw-connector:** improve node/browser separation ([4ff2ef8](https://github.com/nextgis/nextgis_frontend/commit/4ff2ef8de6bc59bc2806744a443e01c859d5e8ec))
* **ngw-connector:** make login on connect ([7850a14](https://github.com/nextgis/nextgis_frontend/commit/7850a1417b3d80348b014b0dd0972584ffb91c78))
* **ngw-connector:** node request write data for no POST mode ([abf9f63](https://github.com/nextgis/nextgis_frontend/commit/abf9f63f66b4ad6c3753fe0659bf1c33b63d5f90))
* **ngw-connector:** remove caching for update put request ([8ff88ae](https://github.com/nextgis/nextgis_frontend/commit/8ff88aee98a7d3307b99867ff7f3f3827ef9b88e))
* **ngw-connector:** remove requestControl ([b1ccdfa](https://github.com/nextgis/nextgis_frontend/commit/b1ccdfacefff0ff89be4c8b32b37978c321d815a))
* **ngw-connector:** retunr undefined on empty apiRequest ([cb05fb0](https://github.com/nextgis/nextgis_frontend/commit/cb05fb099e3e051764a3039952bb9beb75d03aa0))
* **ngw-connector:** update error response status code list ([19da260](https://github.com/nextgis/nextgis_frontend/commit/19da26068982e5a9ade2c1db1604f1e58e09e31e))
* **ngw-connector:** use `this` in fabric method ([3904583](https://github.com/nextgis/nextgis_frontend/commit/3904583a33a6aa4904d9621ed6b03312007d02b4))
* **ngw-connect:** properly abort request on cancel ([a2193b7](https://github.com/nextgis/nextgis_frontend/commit/a2193b78c4d24b663b8850946b05712bce1046c4))
* **ngw-connect:** remove unnecessary console log ([4c3148e](https://github.com/nextgis/nextgis_frontend/commit/4c3148e3fc5385970f9572907de01baf8f2766b6))
* **ngw-kit:** createGeojsonAdapter propertiesFilter ([06c109f](https://github.com/nextgis/nextgis_frontend/commit/06c109fd4ddae20db91b15fbb7c5e7d2909aaf76))
* **ngw-kit:** fix like and ilike filter requests ([2ddb8ff](https://github.com/nextgis/nextgis_frontend/commit/2ddb8ffc15c78578d4145c16daaec9244468385e))
* **ngw-kit:** not identify for not supported layer ([c7f710f](https://github.com/nextgis/nextgis_frontend/commit/c7f710f0402e9b0bf035de9dee833d9289c3e13c))
* **ngw-uploader:** correct imports and sandbox url ([4d78e25](https://github.com/nextgis/nextgis_frontend/commit/4d78e25f758d4f4274c5914bd319e7e788e68d23))
* **ngw-сщттусещк:** resource search query parent_id param ([a1079d4](https://github.com/nextgis/nextgis_frontend/commit/a1079d42219e4997840eb59cd7e413ccf785590b))
* remove require imports ([2674a8c](https://github.com/nextgis/nextgis_frontend/commit/2674a8ce29ef4116b939283ee1f4ec02b26b8025))
* replace emitter.of by emitter.removeListener ([a92b281](https://github.com/nextgis/nextgis_frontend/commit/a92b2810df7fae74bb58f50d6791a21bb4a4ef0e))
* **utils:** fix objectDeepEqual function ([a70d626](https://github.com/nextgis/nextgis_frontend/commit/a70d62647d06b83a3497fb3f1dddc405903ac101))


### Build System

* wepmap to rollup ([c6f038a](https://github.com/nextgis/nextgis_frontend/commit/c6f038ad6bcd2a9581f852b35600b2560381c246))


### chore

* build; eslint ([ee1e03d](https://github.com/nextgis/nextgis_frontend/commit/ee1e03d85625b02a09c2ee1e4d66007fbf57d626))


### Code Refactoring

* **utils:** update geom utils ([43c11b0](https://github.com/nextgis/nextgis_frontend/commit/43c11b0f3c45b22ab66789bd00594d34078316f3))


### Features

* add getExtent method for all mapAdapters GeoJsonLayerAdapter ([7e8010f](https://github.com/nextgis/nextgis_frontend/commit/7e8010f7d5579f2b7909a31a2073479de1faa6a5))
* add library cancelable-promise ([2cfb08f](https://github.com/nextgis/nextgis_frontend/commit/2cfb08f1143a773a43f1279690e0c9a7e2b2fec5))
* add WmsLayerAdapter ([aec0ce1](https://github.com/nextgis/nextgis_frontend/commit/aec0ce15ddb5292b6334833bcab8812400815d0b))
* **cache:** add array to match options deep compare ([6b8a096](https://github.com/nextgis/nextgis_frontend/commit/6b8a09676c40b6a3c1d86819043af4ec9aa34ce9))
* **cache:** add namespaces support ([f65b6ec](https://github.com/nextgis/nextgis_frontend/commit/f65b6ec88885af749b7095dbb7b8dc97f9d6c34d))
* **cache:** new package to cache key value with async ability ([48fce9b](https://github.com/nextgis/nextgis_frontend/commit/48fce9b6450556b7684731f873039ed6a22b907b))
* **cancelable-promise:** throw CancelError instead of onCancel callback ([087180a](https://github.com/nextgis/nextgis_frontend/commit/087180adc9bcea72d1fd02ebdaaef3fd751b0a52))
* **cesium:** add maximumScreenSpaceError option for tilset3d adapter ([bfb0a65](https://github.com/nextgis/nextgis_frontend/commit/bfb0a65171d44a3d32c012170ef56480f3d3566b))
* **cesium:** add Tileset3dAdapter ([872d485](https://github.com/nextgis/nextgis_frontend/commit/872d4854e76ec30a1dc3e2e397218d86465dcd7d))
* **demo:** add new example for simple resource table ([94d650c](https://github.com/nextgis/nextgis_frontend/commit/94d650ceb51096c8f632f3633052a9263b73dde8))
* handle vector layer mouse over and out events ([1f537c2](https://github.com/nextgis/nextgis_frontend/commit/1f537c277b433db365b319d4bbdfb26aa44528fd))
* **leaflet-map-adapter:** change geojson layer opacity ([9862e2d](https://github.com/nextgis/nextgis_frontend/commit/9862e2de02efeef0bc55102ecdac942d0687f036))
* **leaflet-map-adapter:** setMinZoom on maxExtent ([5e16191](https://github.com/nextgis/nextgis_frontend/commit/5e16191f7b81a29b41b2c6873cb33ccd0e84afea))
* **nge-kit:** add uploadFeatureAttachment util ([da40397](https://github.com/nextgis/nextgis_frontend/commit/da40397b7cc3943c9570dc13eb3ca7420f97a6ee)), closes [#CU-m356](https://github.com/nextgis/nextgis_frontend/issues/CU-m356)
* **ngw-connector:** add abort signal to request options ([213b213](https://github.com/nextgis/nextgis_frontend/commit/213b2136612faba8b2960a466eb5c72f73ff2fd3))
* **ngw-connector:** add check for 403 ngw error ([a0069dd](https://github.com/nextgis/nextgis_frontend/commit/a0069dd733897a864a4450ac6dd576b0a32b14d3))
* **ngw-connector:** add getResourceIdOrError method ([b4a42e6](https://github.com/nextgis/nextgis_frontend/commit/b4a42e68291bfa0571efc510e7a79e15257e291a))
* **ngw-connector:** add recursive option to getChildrenOf ([b62782c](https://github.com/nextgis/nextgis_frontend/commit/b62782c4b33b05fc434ff2c13781a2c20becf1ca))
* **ngw-connector:** add request transform method ([4069dea](https://github.com/nextgis/nextgis_frontend/commit/4069dea336f9e5cf549d5955738500319802f064))
* **ngw-connector:** add static create method ([d141a1b](https://github.com/nextgis/nextgis_frontend/commit/d141a1bf5f5aa8693ae10c061459694cf960e07e))
* **ngw-connector:** disable transfer-encoding for node requests ([937dc9d](https://github.com/nextgis/nextgis_frontend/commit/937dc9dc7525c26330b0fad988aafe3a0ab58aa9))
* **ngw-connector:** disable transfer-encoding for node requests II ([1ee0692](https://github.com/nextgis/nextgis_frontend/commit/1ee0692096d9964e2905980f49f289f27031232a))
* **ngw-connector:** get already created connector by url only ([5487ee7](https://github.com/nextgis/nextgis_frontend/commit/5487ee70442bd133e061431271a334ecd13a4885))
* **ngw-connector:** handle network error ([dd555ec](https://github.com/nextgis/nextgis_frontend/commit/dd555ec05c94540394cf313762307296a90a8c69))
* **ngw-connector:** make library polymorphic for both node and browser ([7fa0519](https://github.com/nextgis/nextgis_frontend/commit/7fa05191f37c4772f0f3efcd276d5c27e86dad6a))
* **ngw-connector:** more improvement for Node ([a671057](https://github.com/nextgis/nextgis_frontend/commit/a671057776891f07dbbbffa95b8787acf0e1fd71))
* **ngw-connector:** new abort methods ([481988d](https://github.com/nextgis/nextgis_frontend/commit/481988d520a7ff882419a7677c1de5364f5af6d7))
* **ngw-connector:** new getResourceBy method ([fc355b2](https://github.com/nextgis/nextgis_frontend/commit/fc355b217641f0449adac0c415707091563df9a1))
* **ngw-connector:** remove login logic from getUserInfo ([f0ca312](https://github.com/nextgis/nextgis_frontend/commit/f0ca31257a223ed32628cc83a2411e04b252164f))
* **ngw-kit:** add bbox strategy for large vector layer ([9641d20](https://github.com/nextgis/nextgis_frontend/commit/9641d20ed48975b59d37befad9614b27bd5594e7))
* **ngw-kit:** add feature request srs param ([4b88e3a](https://github.com/nextgis/nextgis_frontend/commit/4b88e3a9614a15167efbe5f12a2649df4cfd7b93))
* **ngw-kit:** add identify item for speedup ngw selection ([4f751d0](https://github.com/nextgis/nextgis_frontend/commit/4f751d0af8b1b7973d0979fef5beaf4c5b8e17b4))
* **ngw-kit:** add NgwKit.utils.getCompanyLogo method ([301ff78](https://github.com/nextgis/nextgis_frontend/commit/301ff78d36b712e93fdfbd03f5c8f57dd93cbc14))
* **ngw-kit:** add tmsclient_layer adapter class support ([2c40bb3](https://github.com/nextgis/nextgis_frontend/commit/2c40bb36a0106599b2c36a5f9cd51aa247dd5345))
* **ngw-kit:** add toGeojson in ngw layer item response ([0af64ad](https://github.com/nextgis/nextgis_frontend/commit/0af64ad1f907996f357a2355a35597319ec4bb0a))
* **ngw-kit:** features request cache option ([96d5bff](https://github.com/nextgis/nextgis_frontend/commit/96d5bff0852d5f63056484ec9692adb22de7f2ca))
* **ngw-kit:** make create basemap layer adapter universal ([b17781d](https://github.com/nextgis/nextgis_frontend/commit/b17781df8afabd9e5353a07c94a3769390ea8591))
* **ngw-kit:** ngw error handling ([1380bb6](https://github.com/nextgis/nextgis_frontend/commit/1380bb6119f5c72eaf28e4f55c1def266e7c1571))
* **ngw-kit:** prepare datetime fields to ngw ([eb814c1](https://github.com/nextgis/nextgis_frontend/commit/eb814c16b242a8a0fe0d26e4159db76cf1bd96d2))
* **ngw-kit:** update loaded date before property filter ([cbae69e](https://github.com/nextgis/nextgis_frontend/commit/cbae69e4fdd5863582ae015328ce323103f04d03))
* **ngw-kit:** use abort signal in fetch requests ([fe2e5cc](https://github.com/nextgis/nextgis_frontend/commit/fe2e5cc1a291e7e1ea1821a8380f4f4db68ea270))
* **ngw-orm:** remove 3rd part libs to convers geom to wkt, use new ngw api ([dd18c38](https://github.com/nextgis/nextgis_frontend/commit/dd18c380283e12be0e70565577a076ea8d461ecd))
* **ngw-uplader:** save meta on upload ([376a2e5](https://github.com/nextgis/nextgis_frontend/commit/376a2e57195726e50669f08b9b98b11c9e5650ce))
* **ngw-uploader:** make ability to upload vector resources ([14aa7af](https://github.com/nextgis/nextgis_frontend/commit/14aa7af81314bca5f4e83574c8fb9b83372497bf))
* **ngw-uploader:** use tus for file upload ([5728627](https://github.com/nextgis/nextgis_frontend/commit/572862718029689a62a613893baedea3b57eb4c4))
* **ngw:** add support for `qgis_raster_style` ([e0f98c4](https://github.com/nextgis/nextgis_frontend/commit/e0f98c407ffec70fb3c93eda1f647356cdd523cb))
* **ngw:** conditions and nesting for filtering ngw feature layer ([90708d8](https://github.com/nextgis/nextgis_frontend/commit/90708d8deaaa5ce995caf6cc7f7b307592272114))
* **qms-kit:** update createAdapter options interface ([e349073](https://github.com/nextgis/nextgis_frontend/commit/e3490730a55e69d8df396da70ec5afbfa5393657))
* **utils:** add flatten and unflatten functions ([9584ccb](https://github.com/nextgis/nextgis_frontend/commit/9584ccbeaa2b384ac0699c0f47be3cd97ae75d6c))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([bcea6c3](https://github.com/nextgis/nextgis_frontend/commit/bcea6c35e61f6ba2aab0b25eb30da9f5f719c92e))
* **vuetify:** allow VTree scopes for NgwLayersList ([0639026](https://github.com/nextgis/nextgis_frontend/commit/063902636fa1425a1dba6bce89a40b040d042387))
* **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([928d351](https://github.com/nextgis/nextgis_frontend/commit/928d351fea9a321c178ecbb4e03a70bd9a64fc90))


### Performance Improvements

* **ngw-commector:** decrease get resource queries count ([6af4f4f](https://github.com/nextgis/nextgis_frontend/commit/6af4f4f4c51261c2205d59084f7c0d1e89a4d1bd))
* **ngw-connector:** getResourceByKeyname one request ([f9b6554](https://github.com/nextgis/nextgis_frontend/commit/f9b6554f3b7ceb1d5efcfeab09fe8ec47bebe1e3))
* **ngw-kit:** default limit to load large vector layer data ([bcdba09](https://github.com/nextgis/nextgis_frontend/commit/bcdba0973fad5204bf3b067afa9cfdb692d48a99))
* **ngw-kit:** geojson adapter not blocked on data load ([1fe9df6](https://github.com/nextgis/nextgis_frontend/commit/1fe9df685aec00c5569e3af20194c873362b3999))


### types

* **ngw-connector:** rename ([85bf430](https://github.com/nextgis/nextgis_frontend/commit/85bf430fa9fc25f427a9861e35f267d243c26ed8))
* rename interface ([d16b4c3](https://github.com/nextgis/nextgis_frontend/commit/d16b4c30c63938bf76e412ae3c968ffc8424b478))


### wip

* **util:** move CancelablePromise to util ([a687a8f](https://github.com/nextgis/nextgis_frontend/commit/a687a8fe0b8389adeb2a6d6f97db330c2f60ad48))


### BREAKING CHANGES

* **ngw-connector:** The getUserInfo mehod does not emit any more login events. Only login method does this
* **ngw-uploader:** `createInput` and `dialog` methods have been moved from the `@nextgis/ngw-uploader` to the new `@nextgis/ngw-uploader-input`
* **ngw-connector:** FeatureLayerFields type is now FeatureProperties
* change GetNgwLayerItemsOptions to GetNgwItemsOptions
* **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead
* No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
* **cancelable-promise:** Removed onCancel argument from CancelablePromise. Now you should handle catch CancelError
* code formatting rules changed to prettier 2.0 compatibility
* **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'





## [1.16.7](https://github.com/nextgis/nextgis_frontend/compare/v1.16.6...v1.16.7) (2023-04-21)


### Features

* **qms-kit:** update createAdapter options interface ([f1e83e7](https://github.com/nextgis/nextgis_frontend/commit/f1e83e7f2cba2af1942c80c100344d130f9d0067))





## [1.16.6](https://github.com/nextgis/nextgis_frontend/compare/v1.16.5...v1.16.6) (2023-02-09)

**Note:** Version bump only for package @nextgis/ngw-connector

## [1.16.5](https://github.com/nextgis/nextgis_frontend/compare/v1.16.4...v1.16.5) (2023-02-09)

**Note:** Version bump only for package @nextgis/ngw-connector

## [1.16.2](https://github.com/nextgis/nextgis_frontend/compare/v1.16.1...v1.16.2) (2022-09-15)

### Bug Fixes

- **ngw-connector:** make login on connect ([a1c414d](https://github.com/nextgis/nextgis_frontend/commit/a1c414d3fd49cf407e95dd777145c751d42bb6e6))

### Features

- **ngw-connector:** remove login logic from getUserInfo ([2ee3f29](https://github.com/nextgis/nextgis_frontend/commit/2ee3f29a6a694b73fe5e24ab46147aea974761ab))

### BREAKING CHANGES

- **ngw-connector:** The getUserInfo mehod does not emit any more login events. Only login method does this

## [1.16.1](https://github.com/nextgis/nextgis_frontend/compare/v1.16.0...v1.16.1) (2022-09-03)

**Note:** Version bump only for package @nextgis/ngw-connector

# [1.16.0](https://github.com/nextgis/nextgis_frontend/compare/v1.15.1...v1.16.0) (2022-08-28)

**Note:** Version bump only for package @nextgis/ngw-connector

## [1.15.1](https://github.com/nextgis/nextgis_frontend/compare/v1.15.0...v1.15.1) (2022-08-02)

### Features

- **ngw-connector:** add request transform method ([13ec477](https://github.com/nextgis/nextgis_frontend/commit/13ec4773aac88b6dc5880727241f3b04ef31fac0))

# [1.15.0](https://github.com/nextgis/nextgis_frontend/compare/v1.14.0...v1.15.0) (2022-07-27)

**Note:** Version bump only for package @nextgis/ngw-connector

# [1.14.0](https://github.com/nextgis/nextgis_frontend/compare/v1.13.8...v1.14.0) (2022-07-05)

**Note:** Version bump only for package @nextgis/ngw-connector

## [1.13.5](https://github.com/nextgis/nextgis_frontend/compare/v1.13.4...v1.13.5) (2022-05-31)

**Note:** Version bump only for package @nextgis/ngw-connector

## [1.13.4](https://github.com/nextgis/nextgis_frontend/compare/v1.13.3...v1.13.4) (2022-05-31)

### Features

- **ngw-connector:** new abort methods ([fb42878](https://github.com/nextgis/nextgis_frontend/commit/fb42878b207c6cb53a3636456de44375678966a9))

## [1.13.3](https://github.com/nextgis/nextgis_frontend/compare/v1.13.2...v1.13.3) (2022-05-31)

**Note:** Version bump only for package @nextgis/ngw-connector

## [1.13.2](https://github.com/nextgis/nextgis_frontend/compare/v1.13.1...v1.13.2) (2022-05-30)

### Features

- **ngw-connector:** disable transfer-encoding for node requests ([c3ab8e9](https://github.com/nextgis/nextgis_frontend/commit/c3ab8e9c296fbc0f809637ed591af97d865a327b))
- **ngw-connector:** disable transfer-encoding for node requests II ([a68c416](https://github.com/nextgis/nextgis_frontend/commit/a68c41665a3df49c2d371783f57c1fb53193c816))
- **ngw-kit:** use abort signal in fetch requests ([c68a8f1](https://github.com/nextgis/nextgis_frontend/commit/c68a8f1223806ea1820428566d7b7fa6a7cb97a2))

## [1.12.1](https://github.com/nextgis/nextgis_frontend/compare/v1.12.0...v1.12.1) (2022-04-21)

### Bug Fixes

- **ngw-connector:** getResource cache when keyname ([b893433](https://github.com/nextgis/nextgis_frontend/commit/b893433ac58ee4564162ffd241098fa9cccb79d5))

### Features

- **ngw-connector:** add abort signal to request options ([34af90e](https://github.com/nextgis/nextgis_frontend/commit/34af90e1af1dca1e03304e21dde4dac81dd06149))
- **ngw-connector:** add recursive option to getChildrenOf ([18b9832](https://github.com/nextgis/nextgis_frontend/commit/18b9832edde4d9e0ed36b1371cc73d318e120453))

# [1.12.0](https://github.com/nextgis/nextgis_frontend/compare/v1.11.10...v1.12.0) (2022-03-05)

**Note:** Version bump only for package @nextgis/ngw-connector

## [1.11.10](https://github.com/nextgis/nextgis_frontend/compare/v1.11.9...v1.11.10) (2022-01-20)

**Note:** Version bump only for package @nextgis/ngw-connector

## [1.11.8](https://github.com/nextgis/nextgis_frontend/compare/v1.11.7...v1.11.8) (2022-01-18)

### Features

- **ngw-uplader:** save meta on upload ([3f4ec99](https://github.com/nextgis/nextgis_frontend/commit/3f4ec99b8986833970516de3c14c35c4cfcc8986))

## [1.11.3](https://github.com/nextgis/nextgis_frontend/compare/v1.11.2...v1.11.3) (2022-01-03)

**Note:** Version bump only for package @nextgis/ngw-connector

## [1.11.2](https://github.com/nextgis/nextgis_frontend/compare/v1.11.1...v1.11.2) (2021-12-20)

### Features

- **ngw-uploader:** use tus for file upload ([2371477](https://github.com/nextgis/nextgis_frontend/commit/2371477115637dbd41b2d331f910212b00a33ee5))

# [1.11.0](https://github.com/nextgis/nextgis_frontend/compare/v1.10.0...v1.11.0) (2021-12-19)

### Features

- **leaflet-map-adapter:** setMinZoom on maxExtent ([56cf3b6](https://github.com/nextgis/nextgis_frontend/commit/56cf3b6eed50f9b6d8c78a21e733eb015bd67712))
- **ngw-uploader:** make ability to upload vector resources ([393f0c0](https://github.com/nextgis/nextgis_frontend/commit/393f0c0c92fed7da88f9009efd6faf44be912627))

### BREAKING CHANGES

- **ngw-uploader:** `createInput` and `dialog` methods have been moved from the `@nextgis/ngw-uploader` to the new `@nextgis/ngw-uploader-input`

## [1.9.4](https://github.com/nextgis/nextgis_frontend/compare/v1.9.3...v1.9.4) (2021-11-16)

### Features

- **cache:** add namespaces support ([5426fa6](https://github.com/nextgis/nextgis_frontend/commit/5426fa63e7cc89d79824a3d0ef38881511534bf9))

## [1.9.3](https://github.com/nextgis/nextgis_frontend/compare/v1.9.2...v1.9.3) (2021-11-05)

### Bug Fixes

- **ngw-сщттусещк:** resource search query parent_id param ([06d44d7](https://github.com/nextgis/nextgis_frontend/commit/06d44d776cd222f75b01f59d929a25c494234f9a))
- **ngw-connector:** clean cache on resource delete ([0816107](https://github.com/nextgis/nextgis_frontend/commit/0816107542757838811a7ed9b9e814e51912254c))
- **ngw-kit:** fix like and ilike filter requests ([911f7e3](https://github.com/nextgis/nextgis_frontend/commit/911f7e35159b4dbe171177aa3ab014b1d505fbce))

## [1.9.2](https://github.com/nextgis/nextgis_frontend/compare/v1.9.1...v1.9.2) (2021-10-26)

**Note:** Version bump only for package @nextgis/ngw-connector

## [1.8.4](https://github.com/nextgis/nextgis_frontend/compare/v1.8.3...v1.8.4) (2021-10-21)

**Note:** Version bump only for package @nextgis/ngw-connector

## [1.8.3](https://github.com/nextgis/nextgis_frontend/compare/v1.8.2...v1.8.3) (2021-10-12)

**Note:** Version bump only for package @nextgis/ngw-connector

## [1.8.2](https://github.com/nextgis/nextgis_frontend/compare/v1.8.1...v1.8.2) (2021-10-05)

**Note:** Version bump only for package @nextgis/ngw-connector

# [1.8.0](https://github.com/nextgis/nextgis_frontend/compare/v1.7.0...v1.8.0) (2021-09-22)

**Note:** Version bump only for package @nextgis/ngw-connector

# [1.7.0](https://github.com/nextgis/nextgis_frontend/compare/v1.6.0...v1.7.0) (2021-09-16)

**Note:** Version bump only for package @nextgis/ngw-connector

## [1.5.1](https://github.com/nextgis/nextgis_frontend/compare/v1.5.0...v1.5.1) (2021-09-06)

**Note:** Version bump only for package @nextgis/ngw-connector

# [1.5.0](https://github.com/nextgis/nextgis_frontend/compare/v1.4.0...v1.5.0) (2021-08-19)

### Features

- **leaflet-map-adapter:** change geojson layer opacity ([3d75fb2](https://github.com/nextgis/nextgis_frontend/commit/3d75fb2f20d0759839dcaa7650c10740a1f35d22))

# [1.4.0](https://github.com/nextgis/nextgis_frontend/compare/v1.3.0...v1.4.0) (2021-08-17)

**Note:** Version bump only for package @nextgis/ngw-connector

# [1.3.0](https://github.com/nextgis/nextgis_frontend/compare/v1.2.8...v1.3.0) (2021-08-06)

### Bug Fixes

- **ngw-connector:** remove caching for update put request ([0a7f621](https://github.com/nextgis/nextgis_frontend/commit/0a7f621538f6ed6ff3150d4c1589ae70a5a7dd14))

## [1.2.8](https://github.com/nextgis/nextgis_frontend/compare/v1.2.7...v1.2.8) (2021-07-27)

**Note:** Version bump only for package @nextgis/ngw-connector

## [1.2.7](https://github.com/nextgis/nextgis_frontend/compare/v1.2.6...v1.2.7) (2021-07-26)

### Bug Fixes

- **ngw-kit:** createGeojsonAdapter propertiesFilter ([8beacb0](https://github.com/nextgis/nextgis_frontend/commit/8beacb0b0f2f8599c73be934fadcf2bae5ab5f85))

### Features

- **ngw-kit:** update loaded date before property filter ([b40df4d](https://github.com/nextgis/nextgis_frontend/commit/b40df4d8742e970060e3eee60c6549d53567b938))

## [1.2.3](https://github.com/nextgis/nextgis_frontend/compare/v1.2.2...v1.2.3) (2021-07-21)

**Note:** Version bump only for package @nextgis/ngw-connector

## [1.2.2](https://github.com/nextgis/nextgis_frontend/compare/v1.2.1...v1.2.2) (2021-07-16)

### Bug Fixes

- **ngw-connector:** disable request params list convert to object ([f67aeae](https://github.com/nextgis/nextgis_frontend/commit/f67aeae8aa35d8c6adbc1f8229d1e3bdc09f9acc))

## [1.2.1](https://github.com/nextgis/nextgis_frontend/compare/v1.2.0...v1.2.1) (2021-07-12)

### Bug Fixes

- **utils:** fix objectDeepEqual function ([720eabe](https://github.com/nextgis/nextgis_frontend/commit/720eabe7645a66fc3addd118c724679af6264652))

# [1.2.0](https://github.com/nextgis/nextgis_frontend/compare/v1.1.2...v1.2.0) (2021-07-08)

### Bug Fixes

- **ngw-connector:** do not create new instance on same url and auth ([2ddb39f](https://github.com/nextgis/nextgis_frontend/commit/2ddb39fd8376420d5b1bbd0d617485cb9ff82f67))

### Features

- handle vector layer mouse over and out events ([2e94152](https://github.com/nextgis/nextgis_frontend/commit/2e94152fac64b8e022dab7940614487763ce57af))

## [1.1.2](https://github.com/nextgis/nextgis_frontend/compare/v1.1.1...v1.1.2) (2021-06-28)

**Note:** Version bump only for package @nextgis/ngw-connector

## [1.1.1](https://github.com/nextgis/nextgis_frontend/compare/v1.1.0...v1.1.1) (2021-06-25)

**Note:** Version bump only for package @nextgis/ngw-connector

# [1.1.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.1...v1.1.0) (2021-06-25)

### Features

- **cache:** add array to match options deep compare ([b3e6717](https://github.com/nextgis/nextgis_frontend/commit/b3e67174977f0985678580a2ef1096220a787ff5))
- **cache:** new package to cache key value with async ability ([4b429a9](https://github.com/nextgis/nextgis_frontend/commit/4b429a93f2ef7d5a362ae708375ee87c18e2c464))
- **ngw-connector:** get already created connector by url only ([0eb5e2f](https://github.com/nextgis/nextgis_frontend/commit/0eb5e2f58fd82485ee825cae3bab3f3ff598b8eb))
- **ngw-kit:** features request cache option ([1182bc7](https://github.com/nextgis/nextgis_frontend/commit/1182bc7b9d74f958f49804b7ceeb840869e3f232))

### types

- **ngw-connector:** rename ([0e7f0b9](https://github.com/nextgis/nextgis_frontend/commit/0e7f0b979a774ea27ad45a0f7d7576ff11ad8d56))

### BREAKING CHANGES

- **ngw-connector:** FeatureLayerFields type is now FeatureProperties

## [1.0.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0...v1.0.1) (2021-06-08)

### types

- rename interface ([b8e5f7c](https://github.com/nextgis/nextgis_frontend/commit/b8e5f7cd4a2bdb289a34fb7a11b3f560b5dd897c))

### BREAKING CHANGES

- change GetNgwLayerItemsOptions to GetNgwItemsOptions

# [1.0.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.9...v1.0.0) (2021-06-07)

### Bug Fixes

- **ngw-connect:** remove unnecessary console log ([ef6bd02](https://github.com/nextgis/nextgis_frontend/commit/ef6bd026e69132694fbc6b83fdab480712d0377e))
- **ngw-connector:** do not throw error on node data load6 use promise reject ([c33c178](https://github.com/nextgis/nextgis_frontend/commit/c33c178dadcf30cfe12e9f6bf07bbc6e59da4188))
- **ngw-uploader:** correct imports and sandbox url ([d27891d](https://github.com/nextgis/nextgis_frontend/commit/d27891db05360167842efbbfcc43ee7a15d3008f))

### Features

- **nge-kit:** add uploadFeatureAttachment util ([14fa802](https://github.com/nextgis/nextgis_frontend/commit/14fa802d237976f8b2c75584cfb0659ed31bd2b8)), closes [#CU-m356](https://github.com/nextgis/nextgis_frontend/issues/CU-m356)

# [1.0.0-beta.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2021-05-03)

### Features

- **ngw-kit:** add identify item for speedup ngw selection ([b051f9f](https://github.com/nextgis/nextgis_frontend/commit/b051f9f6f596f3a54645e5ccbc628907ed83fca1))

# [1.0.0-beta.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2021-05-02)

**Note:** Version bump only for package @nextgis/ngw-connector

# [1.0.0-beta.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-04-23)

### Bug Fixes

- **ngw-connector:** get resource children resourceId zero check ([73d50ec](https://github.com/nextgis/nextgis_frontend/commit/73d50ecd07d023ed53699ac7e4b151c6b879e1ab))
- **ngw-connector:** use `this` in fabric method ([f7d5763](https://github.com/nextgis/nextgis_frontend/commit/f7d5763379057623f645cbe099f4372c076def61))

# [1.0.0-beta.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-04-04)

### Bug Fixes

- **ngw-connector:** node request write data for no POST mode ([e31533f](https://github.com/nextgis/nextgis_frontend/commit/e31533fb888b91e655804abb51951b0a744fe618))

# [1.0.0-beta.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-02-13)

### Features

- **ngw-kit:** add feature request srs param ([3deb546](https://github.com/nextgis/nextgis_frontend/commit/3deb54649789736aacd2ebf6f3f71f388938debb))

### Performance Improvements

- **ngw-commector:** decrease get resource queries count ([598e6e8](https://github.com/nextgis/nextgis_frontend/commit/598e6e81c1e57b00d49dc7027ac9d3f017949814))

# [1.0.0-beta.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-01-17)

**Note:** Version bump only for package @nextgis/ngw-connector

# [1.0.0-beta.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-12-19)

**Note:** Version bump only for package @nextgis/ngw-connector

# [1.0.0-beta.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-11-28)

### Bug Fixes

- **ngw-connector:** fixes to apiRequest cancel work ([0ac44ee](https://github.com/nextgis/nextgis_frontend/commit/0ac44eee447019593ae80529cc3b063171f8f88c)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
- **ngw-kit:** not identify for not supported layer ([1fbd7dc](https://github.com/nextgis/nextgis_frontend/commit/1fbd7dc28c7d6bc6fa4b1ac20e894fbbd3b27a2c))

### Features

- **ngw-kit:** add toGeojson in ngw layer item response ([a9f073a](https://github.com/nextgis/nextgis_frontend/commit/a9f073a50dac3ecf3472e7b90f4124b8e3a6b772))

# [1.0.0-beta.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2020-11-16)

**Note:** Version bump only for package @nextgis/ngw-connector

# [1.0.0-alpha.11](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2020-11-02)

**Note:** Version bump only for package @nextgis/ngw-connector

# [1.0.0-alpha.10](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-10-20)

**Note:** Version bump only for package @nextgis/ngw-connector

# [1.0.0-alpha.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-10-15)

### Bug Fixes

- **ngw-connector:** retunr undefined on empty apiRequest ([32bca5d](https://github.com/nextgis/nextgis_frontend/commit/32bca5df691840740095b62465ff58c1a05c2586))

### Features

- add getExtent method for all mapAdapters GeoJsonLayerAdapter ([9254c3b](https://github.com/nextgis/nextgis_frontend/commit/9254c3bf4b1200c69126d770525a8b6b20a9f5c2))
- **ngw-connector:** add static create method ([00b58d7](https://github.com/nextgis/nextgis_frontend/commit/00b58d7e8be7d898142f44cd53414c45dbc4408e))
- **utils:** add flatten and unflatten functions ([6562c34](https://github.com/nextgis/nextgis_frontend/commit/6562c34162b7d49e91fe1a6661457a620b737aa7))

# [1.0.0-alpha.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-06)

**Note:** Version bump only for package @nextgis/ngw-connector

# [1.0.0-alpha.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-09-22)

### Bug Fixes

- **ngw-connector:** remove requestControl ([a5a0484](https://github.com/nextgis/nextgis_frontend/commit/a5a0484eb23393dd44da6b55e22f0b7f6525b6bd))

### Code Refactoring

- **utils:** update geom utils ([b7e1f7a](https://github.com/nextgis/nextgis_frontend/commit/b7e1f7aab478603f35c49470cfff71d09f58d922))

### Features

- **ngw-connector:** add getResourceIdOrError method ([80769c7](https://github.com/nextgis/nextgis_frontend/commit/80769c7d2e0a915222a20e3e08476c514f6a0826))

### BREAKING CHANGES

- **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead

# [1.0.0-alpha.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)

**Note:** Version bump only for package @nextgis/ngw-connector

# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)

### Bug Fixes

- **cesium:** add check for telset3d adapter addLayer ([8fbb0f3](https://github.com/nextgis/nextgis_frontend/commit/8fbb0f3741277da85aba68b8f46ab3d64c71a976))

# [1.0.0-alpha.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)

**Note:** Version bump only for package @nextgis/ngw-connector

# [1.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)

### Bug Fixes

- remove require imports ([be789b8](https://github.com/nextgis/nextgis_frontend/commit/be789b89f39741efe146da97eeb19460a7cca527))

# [1.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)

### Bug Fixes

- **ngw-connector:** update error response status code list ([c4d4285](https://github.com/nextgis/nextgis_frontend/commit/c4d4285f23490f9dcc3edac8c82b533f6c07ac01))

# [1.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)

### Bug Fixes

- **ngw-connector:** improve node/browser separation ([7dd5d8d](https://github.com/nextgis/nextgis_frontend/commit/7dd5d8de655cd54ce03ebd77792bf46566265e9c))

# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)

### Bug Fixes

- replace emitter.of by emitter.removeListener ([5a92e2b](https://github.com/nextgis/nextgis_frontend/commit/5a92e2b91e741346be39be87d5b9f50b9621c092))

### Build System

- wepmap to rollup ([bc66507](https://github.com/nextgis/nextgis_frontend/commit/bc665072f7eefacae748c2cf81f6bdef75d9f8aa))

### Features

- **cesium:** add maximumScreenSpaceError option for tilset3d adapter ([c82c524](https://github.com/nextgis/nextgis_frontend/commit/c82c52452765b2e764f6c3d42bc3522bd36a4258))
- **ngw-connector:** add check for 403 ngw error ([e344663](https://github.com/nextgis/nextgis_frontend/commit/e344663a974867e510b460fb00eea1775d801ee4))
- **ngw-connector:** handle network error ([7e4a687](https://github.com/nextgis/nextgis_frontend/commit/7e4a687934e9fd8a557a41102e70c8761f7d5d2d))
- **ngw-connector:** new getResourceBy method ([462f0db](https://github.com/nextgis/nextgis_frontend/commit/462f0dbed5c0b448f5be60a73e8d70e792a4f87a))
- **ngw-kit:** ngw error handling ([490d068](https://github.com/nextgis/nextgis_frontend/commit/490d068021b21fb7ddcd7475d2a669a969f81480))
- **ngw-orm:** remove 3rd part libs to convers geom to wkt, use new ngw api ([01c8e21](https://github.com/nextgis/nextgis_frontend/commit/01c8e21321b041024584cdcb8c41998adddb3246))
- **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([430d51e](https://github.com/nextgis/nextgis_frontend/commit/430d51e7211c050ebeffd68b0c839d9a38170054))

### BREAKING CHANGES

- No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere

# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)

### Bug Fixes

- **cesium:** Tileset#DAdapter set terrain height ([790760f](https://github.com/nextgis/nextgis_frontend/commit/790760f0b8b90b9c9d572640612cfc00dabfd5d5))

### Features

- **ngw-kit:** add NgwKit.utils.getCompanyLogo method ([3c6fa09](https://github.com/nextgis/nextgis_frontend/commit/3c6fa09321c0e979543b50b93c32da8725920d28))
- **ngw-kit:** add tmsclient_layer adapter class support ([87b5976](https://github.com/nextgis/nextgis_frontend/commit/87b59760a574ffc66b1aec1d2df3af301efe1326))

# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)

### Features

- **cesium:** add Tileset3dAdapter ([c5306f9](https://github.com/nextgis/nextgis_frontend/commit/c5306f9b8bb3e37f287cbd4e3d33a04d93478e2b))
- **ngw-kit:** make create basemap layer adapter universal ([bbd8c9a](https://github.com/nextgis/nextgis_frontend/commit/bbd8c9a77d527921909ae9b1bf10b3580c5fa600))

## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)

### Performance Improvements

- **ngw-kit:** default limit to load large vector layer data ([1e88276](https://github.com/nextgis/nextgis_frontend/commit/1e8827674db30d654b6ce6c0018171b4b15db12b))

# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)

### Bug Fixes

- **ngw-connect:** properly abort request on cancel ([9ea9859](https://github.com/nextgis/nextgis_frontend/commit/9ea98591679584d7e23ef47a8bca5c4558527db4))

## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)

### Features

- **cancelable-promise:** throw CancelError instead of onCancel callback ([7b7ef11](https://github.com/nextgis/nextgis_frontend/commit/7b7ef112db2ead4fc02bac14eb61534d570b8a65))

### BREAKING CHANGES

- **cancelable-promise:** Removed onCancel argument from CancelablePromise. Now you should handle catch CancelError

## [0.29.6](https://github.com/nextgis/nextgis_frontend/compare/v0.29.5...v0.29.6) (2020-04-16)

### Bug Fixes

- **ngw-connector:** improve for node ([cc5ead7](https://github.com/nextgis/nextgis_frontend/commit/cc5ead7d298a6dd557988a9f4ed9bba361a013d9))

## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)

### Bug Fixes

- **ngw-connector:** getResourceByKeyname cache ([20fae26](https://github.com/nextgis/nextgis_frontend/commit/20fae266d240d51af7fe9e9a9af4f84d286f8cc2))

### Performance Improvements

- **ngw-connector:** getResourceByKeyname one request ([23e0706](https://github.com/nextgis/nextgis_frontend/commit/23e0706d22502ec14a4383abe87b9bae2e4e8d26))

## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)

**Note:** Version bump only for package @nextgis/ngw-connector

## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

### Features

- **ngw-connector:** more improvement for Node ([c3af356](https://github.com/nextgis/nextgis_frontend/commit/c3af356f00e7095f50c463e12692b12bea605e6f))

## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

### Bug Fixes

- **ngw-connector:** improve compatibility with Node ([7b653f5](https://github.com/nextgis/nextgis_frontend/commit/7b653f559f7ecb681d0059ac42a9aecb543fbb90))

## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)

### Bug Fixes

- **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))

# [0.29.0](https://github.com/nextgis/nextgis_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)

### chore

- build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))

### BREAKING CHANGES

- code formatting rules changed to prettier 2.0 compatibility

# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)

**Note:** Version bump only for package @nextgis/ngw-connector

## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)

### Features

- add library cancelable-promise ([5227983](https://github.com/nextgis/nextgis_frontend/commit/5227983e03b0a5aa5807002f63914fa2d23154b0))

# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)

### Features

- **ngw-kit:** add bbox strategy for large vector layer ([da6533b](https://github.com/nextgis/nextgis_frontend/commit/da6533b76eaf5184114ac233fa275d2398cfdf5b))
- **vuetify:** allow VTree scopes for NgwLayersList ([8718f9b](https://github.com/nextgis/nextgis_frontend/commit/8718f9b6e114714523b3476a97b23934c31f2bb4))

### Performance Improvements

- **ngw-kit:** geojson adapter not blocked on data load ([1ceaf76](https://github.com/nextgis/nextgis_frontend/commit/1ceaf7688b9911727de5fa1b6fde9ae1f6b3da9e))

# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)

### Features

- add WmsLayerAdapter ([c57b66d](https://github.com/nextgis/nextgis_frontend/commit/c57b66d2278071a57182cb4dd554e370c63ffa06))

## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/ngw-connector

## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/ngw-connector

## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)

### Features

- **demo:** add new example for simple resource table ([43fdf4f](https://github.com/nextgis/nextgis_frontend/commit/43fdf4f69898680872fedece44c812ca407d1d8b))
- **ngw:** add support for `qgis_raster_style` ([959e901](https://github.com/nextgis/nextgis_frontend/commit/959e9014364947acbbbe768157d8cb5ab6d0c3ba))
- **ngw:** conditions and nesting for filtering ngw feature layer ([bc7cc34](https://github.com/nextgis/nextgis_frontend/commit/bc7cc344d83d1769476e28cb87d595a9d25d0ebd))
- **ngw-connector:** make library polymorphic for both node and browser ([b3bd42e](https://github.com/nextgis/nextgis_frontend/commit/b3bd42e1ebc3880edfecb6713d0d17166e9beed0))
- **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgis_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))

### wip

- **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgis_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))

### BREAKING CHANGES

- **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'

## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)

### Features

- **ngw-connector:** make library polymorphic for both node and browser ([b3bd42e](https://github.com/nextgis/nextgis_frontend/commit/b3bd42e1ebc3880edfecb6713d0d17166e9beed0))

## [0.25.4](https://github.com/nextgis/nextgis_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)

### wip

- **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgis_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))

### BREAKING CHANGES

- **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'

## [0.25.3](https://github.com/nextgis/nextgis_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)

### Features

- **ngw:** conditions and nesting for filtering ngw feature layer ([bc7cc34](https://github.com/nextgis/nextgis_frontend/commit/bc7cc344d83d1769476e28cb87d595a9d25d0ebd))

## [0.25.1](https://github.com/nextgis/nextgis_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)

### Features

- **demo:** add new example for simple resource table ([43fdf4f](https://github.com/nextgis/nextgis_frontend/commit/43fdf4f69898680872fedece44c812ca407d1d8b))

# [0.25.0](https://github.com/nextgis/nextgis_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)

### Features

- **ngw:** add support for `qgis_raster_style` ([959e901](https://github.com/nextgis/nextgis_frontend/commit/959e9014364947acbbbe768157d8cb5ab6d0c3ba))
