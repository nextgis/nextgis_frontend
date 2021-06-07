# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.9...v1.0.0) (2021-06-07)


### Features

* **vuetify:** NgwLayersList remove layer ability ([320ce0e](https://github.com/nextgis/nextgis_frontend/commit/320ce0effd76c6562036c6558564cecc06e83231)), closes [#CU-jzby65](https://github.com/nextgis/nextgis_frontend/issues/CU-jzby65)
* **webmap:** webmap container get set functions ([f0a1491](https://github.com/nextgis/nextgis_frontend/commit/f0a1491a471ccfa2538c48c1b307d6d5fa3d713c))





# [1.0.0-beta.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2021-05-03)


### Features

* **ngw-kit:** add identify item for speedup ngw selection ([b051f9f](https://github.com/nextgis/nextgis_frontend/commit/b051f9f6f596f3a54645e5ccbc628907ed83fca1))





# [1.0.0-beta.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2021-05-02)

**Note:** Version bump only for package @nextgis/webmap





# [1.0.0-beta.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-04-23)

**Note:** Version bump only for package @nextgis/webmap





# [1.0.0-beta.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-04-04)


### Bug Fixes

* **ngw-kit:** insert headers into createOnFirstShowAdapter addLayer method ([d230fe2](https://github.com/nextgis/nextgis_frontend/commit/d230fe2f484f42ff1e0a99f9ff33d60526b55bdd))





# [1.0.0-beta.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-02-13)


### Features

* **cesium:** add tilset3d adapter paint options ([a9caba5](https://github.com/nextgis/nextgis_frontend/commit/a9caba56225609202ff350e232ada5af77bbfa6a))
* **webmap:** ratio in vectorlayer adapter interface ([cc3d835](https://github.com/nextgis/nextgis_frontend/commit/cc3d835879c5223e73e6db1026db1a419980182f))





# [1.0.0-beta.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-01-17)


### Features

* add setViewDelay options to control map update ([3c50948](https://github.com/nextgis/nextgis_frontend/commit/3c50948d8ce31d79879cf566f827cee78fc1af31))
* **webmap:** create webmap from TileJson ([9e84ea1](https://github.com/nextgis/nextgis_frontend/commit/9e84ea18653104030884f6fec76e7680436d71bd))
* **webmap:** get zoom from tilejson ([80ded2f](https://github.com/nextgis/nextgis_frontend/commit/80ded2f2a908b54c046dd4e4f01046edd88e398c))





# [1.0.0-beta.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-12-19)


### Bug Fixes

* **webmap:** set zero zoom ([059e6ea](https://github.com/nextgis/nextgis_frontend/commit/059e6ea243a0ba0b6cce58905dde58485bc5d372))


### Features

* **cesium-map-adapter:** add watchTerrainChange geojson option ([15f1d8e](https://github.com/nextgis/nextgis_frontend/commit/15f1d8ef5ba427b5dc27f6c9d9b470887947ab4d))
* add new library `progress` ([5a75e8c](https://github.com/nextgis/nextgis_frontend/commit/5a75e8c219e0c8c0aef2f9e4f0536709b93cd59c))





# [1.0.0-beta.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-11-28)


### Bug Fixes

* **ngw-connector:** fixes to apiRequest cancel work ([0ac44ee](https://github.com/nextgis/nextgis_frontend/commit/0ac44eee447019593ae80529cc3b063171f8f88c)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
* **utils:** applyMixin options on no replace ([4362c4c](https://github.com/nextgis/nextgis_frontend/commit/4362c4cb36dcd885803bb9dde36512ced21287cb))


### Features

* **ngw-kit:** add toGeojson in ngw layer item response ([a9f073a](https://github.com/nextgis/nextgis_frontend/commit/a9f073a50dac3ecf3472e7b90f4124b8e3a6b772))
* **ngw-map:** add promise groups handler ([864fc6d](https://github.com/nextgis/nextgis_frontend/commit/864fc6d3a905e72136df3795f1e86046d54e0fd4))
* **utils:** add debug log util ([6435c77](https://github.com/nextgis/nextgis_frontend/commit/6435c779050faa8b0e36945c69bbd22a55dba5ca))
* **utils:** deprecated helper utils ([9bab695](https://github.com/nextgis/nextgis_frontend/commit/9bab695eb840d49015c739c8f871305e57640aab))


### BREAKING CHANGES

* **utils:** removed latLng from MapClickEvent, use lngLat: numner[] instead





# [1.0.0-beta.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2020-11-16)

**Note:** Version bump only for package @nextgis/webmap





# [1.0.0-alpha.11](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2020-11-02)


### Bug Fixes

* **webmap:** constructor options; move controls options from ngw to webmap ([611b8c0](https://github.com/nextgis/nextgis_frontend/commit/611b8c0af120c726ccf42eca0a608edbd54bb1c1))





# [1.0.0-alpha.10](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-10-20)


### Code Refactoring

* **webmap:** change default paint ([1baea95](https://github.com/nextgis/nextgis_frontend/commit/1baea95158e2cd8b79ec2de6b95a377030951d0f))


### BREAKING CHANGES

* **webmap:** changed the default paint: the fill is semi-transparent, add stroke





# [1.0.0-alpha.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-10-15)


### Bug Fixes

* **webmap:** webmap constructor options ([8c92b6c](https://github.com/nextgis/nextgis_frontend/commit/8c92b6c17e4b0f69630abb5ad0ffa78234d50a6f))


### Code Refactoring

* change WebMap and NgwMap constructor options ([de7eaf9](https://github.com/nextgis/nextgis_frontend/commit/de7eaf900ece63cf91596b726ad19918f3b926b7))


### Features

* **ngw-map:** default bounds; add mapOption for show osm baselayer ([8df4e0e](https://github.com/nextgis/nextgis_frontend/commit/8df4e0ea53a41f3df7a782c973686c160c3552d6))
* **utils:** add flatten and unflatten functions ([6562c34](https://github.com/nextgis/nextgis_frontend/commit/6562c34162b7d49e91fe1a6661457a620b737aa7))
* **vue:** NgwLayersList propagation param ([636c46b](https://github.com/nextgis/nextgis_frontend/commit/636c46bf387be491819297e42346beea246de8f1))


### BREAKING CHANGES

* `new WebMap({ mapAdapter: new MapAdapter(), ...appOptions, mapOptions: MapOptions })` > `new WebMap(mapOptions)`
* `new NgwMap(new MapAdapter(), ngwMapOptions)` > `new NgwMap(ngwMapOptions)`
* `WebMapOptions.create` is now `true` by default





# [1.0.0-alpha.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-06)

**Note:** Version bump only for package @nextgis/webmap





# [1.0.0-alpha.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-09-22)


### Code Refactoring

* **utils:** update geom utils ([b7e1f7a](https://github.com/nextgis/nextgis_frontend/commit/b7e1f7aab478603f35c49470cfff71d09f58d922))


### Features

* **util:** add keyInObj typescript helper ([fabb5e0](https://github.com/nextgis/nextgis_frontend/commit/fabb5e017d6b3b228d6cdb98a3fffe0ce8e57929))


### BREAKING CHANGES

* **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead





# [1.0.0-alpha.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)


### Features

* **cancelable-promise:** improve PromisesControl ([ca5fabb](https://github.com/nextgis/nextgis_frontend/commit/ca5fabb60e998f19713704011db58588487aebe7))
* **utils:** add `arrayCompareStrict` function ([9d65949](https://github.com/nextgis/nextgis_frontend/commit/9d659496fbcf4dd0e2f467d3e18ad7253fcb7041))
* **webmap:** remove control from promise ([fbeae95](https://github.com/nextgis/nextgis_frontend/commit/fbeae956a3dc7ad01fd90ac3807f484d3ab79424))





# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)

**Note:** Version bump only for package @nextgis/webmap





# [1.0.0-alpha.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)


### Features

* **utils:** move some utils from ngw-kit and webmap to geom ([fbd3d91](https://github.com/nextgis/nextgis_frontend/commit/fbd3d913485c537e92068b5284691bb47f123b43))





# [1.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)


### Features

* **webmap:** new method getCoordFromMapClick ([439d8c9](https://github.com/nextgis/nextgis_frontend/commit/439d8c90fe11193faafc90c9bd33fec2b335bf78))





# [1.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)


### Features

* **ngw-kit:** default WebmapLayerAdapter basemap ([4756ef8](https://github.com/nextgis/nextgis_frontend/commit/4756ef82084f30eda51fe98e1483e815a7775132))





# [1.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)

**Note:** Version bump only for package @nextgis/webmap





# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)


### Bug Fixes

* replace emitter.of by emitter.removeListener ([5a92e2b](https://github.com/nextgis/nextgis_frontend/commit/5a92e2b91e741346be39be87d5b9f50b9621c092))
* **webmap:** editing for new layer visibility standard ([32413d0](https://github.com/nextgis/nextgis_frontend/commit/32413d085d30073056b8da97c8735ca13016c616))


### Build System

* wepmap to rollup ([bc66507](https://github.com/nextgis/nextgis_frontend/commit/bc665072f7eefacae748c2cf81f6bdef75d9f8aa))


### Code Refactoring

* rename layerAdapter baseLayer option to baselayer ([368d657](https://github.com/nextgis/nextgis_frontend/commit/368d6576278505ddddde2a1ab160a0849e087c70))


### Features

* **cesium:** add maximumScreenSpaceError option for tilset3d adapter ([c82c524](https://github.com/nextgis/nextgis_frontend/commit/c82c52452765b2e764f6c3d42bc3522bd36a4258))
* **webmap:** add special MapAdapterOptions option to MapOptions ([e3dd2ec](https://github.com/nextgis/nextgis_frontend/commit/e3dd2eceb5b63bf7c19791deacd72b2e047a74f8))
* **webmap:** change default behaviour of addLayer visibility option, its now true ([0e91555](https://github.com/nextgis/nextgis_frontend/commit/0e91555cea9666dd3ce8c2df7364f0e588dc8c24))
* **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([430d51e](https://github.com/nextgis/nextgis_frontend/commit/430d51e7211c050ebeffd68b0c839d9a38170054))
* **webmap:** new static method WebMap.get(id) to get webmap instance ([658f537](https://github.com/nextgis/nextgis_frontend/commit/658f5372bde27b4d8502856649b2b11e9e4bade7))


### BREAKING CHANGES

* No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
* **webmap:** the added layer `visibility` is now `true`
* LayerAdapter option baseLayer was renamed to baselayer;
* webMap.getBaseLayers() method now return LayerAdapter, not string array of ids





# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)


### Bug Fixes

* **cesium:** Tileset#DAdapter set terrain height ([790760f](https://github.com/nextgis/nextgis_frontend/commit/790760f0b8b90b9c9d572640612cfc00dabfd5d5))
* **mapbox:** geojson getSelected method ([e0d859c](https://github.com/nextgis/nextgis_frontend/commit/e0d859cd186876f0b382e1338d1793151d18dd6a))


### Features

* **cesium:** implement getCenter ([ea83d8e](https://github.com/nextgis/nextgis_frontend/commit/ea83d8ebd8972123ba0991388e4e53fce91b077e))
* **cesium:** tilset 3d adapter height options ([02973bf](https://github.com/nextgis/nextgis_frontend/commit/02973bfcacb6bde3b7d4e23fdd190d0e81536f57))
* **webmap:** vector layer select event ([edd18ba](https://github.com/nextgis/nextgis_frontend/commit/edd18baa3d2b0e5886812e09795de4f041be23ab))
* **webmap:** zoomIn and zoomOut MapAdapter optional methods ([70b807f](https://github.com/nextgis/nextgis_frontend/commit/70b807fd1d157b5505a3d815f24a02fbb1fff6a6))


### Performance Improvements

* **webmap:** addControl coner queue ([5c21367](https://github.com/nextgis/nextgis_frontend/commit/5c21367fc1a0142d56e443948d7d01f49549d5b1))


### wip

* rename VectorLayerAdapterType ([89a2c83](https://github.com/nextgis/nextgis_frontend/commit/89a2c83135e839f3eec373f93e5df777a7b81325))


### BREAKING CHANGES

* rename VectorLayerAdapter types: circle > point; fill > polygon





# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)


### Bug Fixes

* **webmap:** add check for fitBounds extent ([c78ab3e](https://github.com/nextgis/nextgis_frontend/commit/c78ab3e900f3e069401fb23b5b7646aa5cbc8e7f))
* **webmap:** addLayer adapter options set ([2d24a53](https://github.com/nextgis/nextgis_frontend/commit/2d24a5387634bbccb79875186cc7a9cf090291f2))
* **webmap:** remove addLayer dublicate id ([81a4458](https://github.com/nextgis/nextgis_frontend/commit/81a4458b9b420382d112be181d829e08f783c82b))


### Features

* **cesium:** add Tileset3dAdapter ([c5306f9](https://github.com/nextgis/nextgis_frontend/commit/c5306f9b8bb3e37f287cbd4e3d33a04d93478e2b))
* **cesium:** fitBounds up tp terrain ([e890d9b](https://github.com/nextgis/nextgis_frontend/commit/e890d9b5ce449dc69c8b531c33b9ce6cb58b10b4))
* **cesium:** set scene view from new adapter option ([c35e16d](https://github.com/nextgis/nextgis_frontend/commit/c35e16ded6036fccb2edb852bebd68f41fc899eb))
* **ngw-kit:** add baselayers from webmap; vuetify BaseLayerSelect ([74c0749](https://github.com/nextgis/nextgis_frontend/commit/74c074929c7da864a9097fc8176825894555e0a3))
* **webmap:** add async control in correct order ([c2eaab3](https://github.com/nextgis/nextgis_frontend/commit/c2eaab3a0d720a6b6d32fc0d6b2c76bc37e93a8f))
* **webmap:** layer adapter waitFullLoad and crossOrigin new options ([08c6b82](https://github.com/nextgis/nextgis_frontend/commit/08c6b827f6a3e5728d8b17a9c305f32cd2b28039))





## [0.30.2](https://github.com/nextgis/nextgis_frontend/compare/v0.30.1...v0.30.2) (2020-04-30)


### Bug Fixes

* **ngw-kit:** return raster_layer resource support ([76a435f](https://github.com/nextgis/nextgis_frontend/commit/76a435fb43d82ea8be616347010a8bd1214f106b))





## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)


### Bug Fixes

* **webmap:** get layers method only string keys ([e0182c9](https://github.com/nextgis/nextgis_frontend/commit/e0182c95c81f5b76605f569bcbf2826937909889))


### Features

* **webmap:** update layer adapter options ([b0262ef](https://github.com/nextgis/nextgis_frontend/commit/b0262eff0db1ee56192bb410e8e1128cdc8b167b))





# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)

**Note:** Version bump only for package @nextgis/webmap





## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)


### Performance Improvements

* **mapbox:** vector layer click event prevent by order ([e7901da](https://github.com/nextgis/nextgis_frontend/commit/e7901da34935e347de05aaf0798eb1e5dfda11ff))





## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)


### Bug Fixes

* **ngw-connector:** getResourceByKeyname cache ([20fae26](https://github.com/nextgis/nextgis_frontend/commit/20fae266d240d51af7fe9e9a9af4f84d286f8cc2))





## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)


### Features

* **utils:** update string util ([2bf9a92](https://github.com/nextgis/nextgis_frontend/commit/2bf9a9217ade47a19426d62a80969f9173900651))





## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

**Note:** Version bump only for package @nextgis/webmap





## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

**Note:** Version bump only for package @nextgis/webmap





## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)


### Bug Fixes

* **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))





# [0.29.0](https://github.com/nextgis/nextgis_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)


### chore

* build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))


### BREAKING CHANGES

* code formatting rules changed to prettier 2.0 compatibility





## [0.28.3](https://github.com/nextgis/nextgis_frontend/compare/v0.28.2...v0.28.3) (2020-03-19)


### Bug Fixes

* **examples:** rapair examples ([e739de7](https://github.com/nextgis/nextgis_frontend/commit/e739de7c52c09ba17ddcf007c2604cc1e2a0e0ba))


### Features

* **ngw:** option to create popup content from item ([3c4a809](https://github.com/nextgis/nextgis_frontend/commit/3c4a809dc7cd9045e3ed1622b1eea0036e5205a1))
* add library `@nextgis/paint` ([99391ec](https://github.com/nextgis/nextgis_frontend/commit/99391ec1ac9fd80508816417d9eb2ae0fd734340))





## [0.28.1](https://github.com/nextgis/nextgis_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package @nextgis/webmap





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


### Features

* **control:** add universal zoom control ([1ffc089](https://github.com/nextgis/nextgis_frontend/commit/1ffc089942f1709f82cec8398d301503819be718))
* add new library `ControlContainer` ([e68afeb](https://github.com/nextgis/nextgis_frontend/commit/e68afeb5efb1e40bf20df2effa805fe80c437478))





# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)


### Features

* **vuetify:** allow VTree scopes for NgwLayersList ([8718f9b](https://github.com/nextgis/nextgis_frontend/commit/8718f9b6e114714523b3476a97b23934c31f2bb4))


### Performance Improvements

* **ngw-kit:** geojson adapter not blocked on data load ([1ceaf76](https://github.com/nextgis/nextgis_frontend/commit/1ceaf7688b9911727de5fa1b6fde9ae1f6b3da9e))





# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)


### Features

* add WmsLayerAdapter ([c57b66d](https://github.com/nextgis/nextgis_frontend/commit/c57b66d2278071a57182cb4dd554e370c63ffa06))





## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/webmap





## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/webmap





## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)


### Bug Fixes

* **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgis_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))
* **webmap:** not use ordering for layer id ([cd09734](https://github.com/nextgis/nextgis_frontend/commit/cd0973490a2c6ca0673bd01059056dd5fd68d866))
* **webmap:** ZoomState may be only integer ([c130469](https://github.com/nextgis/nextgis_frontend/commit/c13046908d63d549e3f221efc538c55d49a36450))


### Features

* **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgis_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))
* remove default MarkerLayerAdapter ([7398c1b](https://github.com/nextgis/nextgis_frontend/commit/7398c1bb61d43194ce4c7da635d386ad785ac57a))
* **util:** move properties filter to utils library ([4099706](https://github.com/nextgis/nextgis_frontend/commit/40997068f633faf75f15011721d9aaa5f11343dd))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgis_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))
* **webmap:** add `getBoundsPoly` webmap util ([22cb565](https://github.com/nextgis/nextgis_frontend/commit/22cb5654e6a2c2c8b84d32581faed0b293570cc2))
* **webmap:** nesting for propertiesFilter utility ([28cb9ed](https://github.com/nextgis/nextgis_frontend/commit/28cb9ed583ec96fec675f8f6c63ec18c1fe030de))
* **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgis_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))


### Performance Improvements

* **mapbox:** upgrade layer ordering ([58a0db0](https://github.com/nextgis/nextgis_frontend/commit/58a0db08c0fa123ede4ef0d9fc7d9e1e9b3a6526))


### BREAKING CHANGES

* MARKER layer adapter has been removed. Use ddLayer('GEOJSON', {data}) instead of ddLayer('MARKER', {lngLat})
* **util:** Use xport { propertiesFilter } from '@nextgis/utils'; instead of Webmap.utils.propertiesFilter





## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)


### Bug Fixes

* **webmap:** ZoomState may be only integer ([c130469](https://github.com/nextgis/nextgis_frontend/commit/c13046908d63d549e3f221efc538c55d49a36450))


### Performance Improvements

* **mapbox:** upgrade layer ordering ([58a0db0](https://github.com/nextgis/nextgis_frontend/commit/58a0db08c0fa123ede4ef0d9fc7d9e1e9b3a6526))





## [0.25.4](https://github.com/nextgis/nextgis_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)

**Note:** Version bump only for package @nextgis/webmap





## [0.25.3](https://github.com/nextgis/nextgis_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)


### Features

* **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgis_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))





## [0.25.2](https://github.com/nextgis/nextgis_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package @nextgis/webmap





## [0.25.1](https://github.com/nextgis/nextgis_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)


### Features

* remove default MarkerLayerAdapter ([7398c1b](https://github.com/nextgis/nextgis_frontend/commit/7398c1bb61d43194ce4c7da635d386ad785ac57a))


### BREAKING CHANGES

* MARKER layer adapter has been removed. Use ddLayer('GEOJSON', {data}) instead of ddLayer('MARKER', {lngLat})





# [0.25.0](https://github.com/nextgis/nextgis_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)


### Bug Fixes

* **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgis_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))
* **webmap:** not use ordering for layer id ([cd09734](https://github.com/nextgis/nextgis_frontend/commit/cd0973490a2c6ca0673bd01059056dd5fd68d866))


### Features

* **util:** move properties filter to utils library ([4099706](https://github.com/nextgis/nextgis_frontend/commit/40997068f633faf75f15011721d9aaa5f11343dd))
* **webmap:** add `getBoundsPoly` webmap util ([22cb565](https://github.com/nextgis/nextgis_frontend/commit/22cb5654e6a2c2c8b84d32581faed0b293570cc2))
* **webmap:** nesting for propertiesFilter utility ([28cb9ed](https://github.com/nextgis/nextgis_frontend/commit/28cb9ed583ec96fec675f8f6c63ec18c1fe030de))
* **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgis_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))


### BREAKING CHANGES

* **util:** Use xport { propertiesFilter } from '@nextgis/utils'; instead of Webmap.utils.propertiesFilter
