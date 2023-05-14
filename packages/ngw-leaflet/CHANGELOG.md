# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.16.8 (2023-05-14)


### Bug Fixes

* **build:** control-container extract css ([a02d24b](https://github.com/nextgis/nextgis_frontend/commit/a02d24bf2dbe246420803d5d1be9348e4b647c6d))
* **demo:** import utils from cdn ([e4db110](https://github.com/nextgis/nextgis_frontend/commit/e4db110229976ada8abe6b35203f9a7b86411551))
* **demo:** remove layer id from ngw properties filter example ([a47dba9](https://github.com/nextgis/nextgis_frontend/commit/a47dba976b80822bd92ae20a9952b140f4fa18ec))
* **examples:** check paint opacity is number ([1fcc9a9](https://github.com/nextgis/nextgis_frontend/commit/1fcc9a9bd033d53d21dab0956335bde51b73e61c))
* **examples:** rapair examples ([42a770e](https://github.com/nextgis/nextgis_frontend/commit/42a770e124a30a2670a620fb24f74da12251cb1c))
* **examples:** set type for ngw_resource highlight layer ([ec0ab5e](https://github.com/nextgis/nextgis_frontend/commit/ec0ab5efe1dc04a7b898f2f7e3af54067bcff969))
* **leaflet-map-adapter:** resolve geojson adapter layerdefinition problem ([a1918e6](https://github.com/nextgis/nextgis_frontend/commit/a1918e6fef02a061102b70b1e5bd8b0db40c32b6))
* **ngw-connector:** fixes to apiRequest cancel work ([e4451d8](https://github.com/nextgis/nextgis_frontend/commit/e4451d8a7ad349ba17692a3f906677f1a29bf691)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
* **ngw-ol:** container style ([5d71e9e](https://github.com/nextgis/nextgis_frontend/commit/5d71e9ea1f63376e9c533d24eb45240a34c9e167))
* remove require imports ([2674a8c](https://github.com/nextgis/nextgis_frontend/commit/2674a8ce29ef4116b939283ee1f4ec02b26b8025))
* replace emitter.of by emitter.removeListener ([a92b281](https://github.com/nextgis/nextgis_frontend/commit/a92b2810df7fae74bb58f50d6791a21bb4a4ef0e))


### Build System

* wepmap to rollup ([c6f038a](https://github.com/nextgis/nextgis_frontend/commit/c6f038ad6bcd2a9581f852b35600b2560381c246))


### chore

* build; eslint ([ee1e03d](https://github.com/nextgis/nextgis_frontend/commit/ee1e03d85625b02a09c2ee1e4d66007fbf57d626))


### Code Refactoring

* change WebMap and NgwMap constructor options ([3b05f95](https://github.com/nextgis/nextgis_frontend/commit/3b05f959d6285c62aa08332c9342f24b82a3e732))
* rename layerAdapter baseLayer option to baselayer ([e5c595d](https://github.com/nextgis/nextgis_frontend/commit/e5c595d6df24b1b22906ad1e06eb60bf0327e9c0))


### Features

* add BBOX+ strategy; extends options for setView ([309b697](https://github.com/nextgis/nextgis_frontend/commit/309b697e141adf6eedeb85c87b6fa89b9b629c13))
* add nativeOptions for alladdLayer adapter methods ([c98568f](https://github.com/nextgis/nextgis_frontend/commit/c98568f1f122fc67fdfc911500aa2c509149e293))
* add WmsLayerAdapter ([aec0ce1](https://github.com/nextgis/nextgis_frontend/commit/aec0ce15ddb5292b6334833bcab8812400815d0b))
* **demo:** add new example for simple resource table ([94d650c](https://github.com/nextgis/nextgis_frontend/commit/94d650ceb51096c8f632f3633052a9263b73dde8))
* handle vector layer mouse over and out events ([1f537c2](https://github.com/nextgis/nextgis_frontend/commit/1f537c277b433db365b319d4bbdfb26aa44528fd))
* improve popup, add new options, ol support ([e3ea91b](https://github.com/nextgis/nextgis_frontend/commit/e3ea91b91d03a4cef471c5c92a09a7fa0640b90a))
* **mapboxgl-map-adapter:** add popup for selected feature ([bf7ee99](https://github.com/nextgis/nextgis_frontend/commit/bf7ee994ba4307c2a85bc28c985198f000c463de))
* **ngw-connector:** handle network error ([dd555ec](https://github.com/nextgis/nextgis_frontend/commit/dd555ec05c94540394cf313762307296a90a8c69))
* **ngw-kit:** add bbox strategy for large vector layer ([9641d20](https://github.com/nextgis/nextgis_frontend/commit/9641d20ed48975b59d37befad9614b27bd5594e7))
* **ngw-kit:** add identify item for speedup ngw selection ([4f751d0](https://github.com/nextgis/nextgis_frontend/commit/4f751d0af8b1b7973d0979fef5beaf4c5b8e17b4))
* **ngw-kit:** ngwwebmap item toggle on zoom layer range ([52abb1d](https://github.com/nextgis/nextgis_frontend/commit/52abb1d2fee3b2c306b9269e8287d98362ef5128))
* **ngw-kit:** NgwWebmapItem opacity ([c7846df](https://github.com/nextgis/nextgis_frontend/commit/c7846dff298d1d1e022cdb9258ba346f86505527))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([bcea6c3](https://github.com/nextgis/nextgis_frontend/commit/bcea6c35e61f6ba2aab0b25eb30da9f5f719c92e))
* **webmap:** add map mouse move events ([c50638c](https://github.com/nextgis/nextgis_frontend/commit/c50638ccefad63e9b21416e922ea0d4c33fc1adf))
* **webmap:** add setLayerPaint method ([3cadfbf](https://github.com/nextgis/nextgis_frontend/commit/3cadfbfac802c19ad0e981e944be69a07f548414))
* **webmap:** change default behaviour of addLayer visibility option, its now true ([d0f9f0e](https://github.com/nextgis/nextgis_frontend/commit/d0f9f0e76b7a4195b1b7b9e5413de7f81502bfbc))
* **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([928d351](https://github.com/nextgis/nextgis_frontend/commit/928d351fea9a321c178ecbb4e03a70bd9a64fc90))


### wip

* rename VectorLayerAdapterType ([726ab7d](https://github.com/nextgis/nextgis_frontend/commit/726ab7dd7cd112750165a9e15c5672086cd8261a))


### BREAKING CHANGES

* `new WebMap({ mapAdapter: new MapAdapter(), ...appOptions, mapOptions: MapOptions })` > `new WebMap(mapOptions)`
* `new NgwMap(new MapAdapter(), ngwMapOptions)` > `new NgwMap(ngwMapOptions)`
* `WebMapOptions.create` is now `true` by default
* No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
* **webmap:** the added layer `visibility` is now `true`
* LayerAdapter option baseLayer was renamed to baselayer;
* webMap.getBaseLayers() method now return LayerAdapter, not string array of ids
* rename VectorLayerAdapter types: circle > point; fill > polygon
* code formatting rules changed to prettier 2.0 compatibility





## [1.16.7](https://github.com/nextgis/nextgis_frontend/compare/v1.16.6...v1.16.7) (2023-04-21)

**Note:** Version bump only for package @nextgis/ngw-leaflet





## [1.16.6](https://github.com/nextgis/nextgis_frontend/compare/v1.16.5...v1.16.6) (2023-02-09)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.16.5](https://github.com/nextgis/nextgis_frontend/compare/v1.16.4...v1.16.5) (2023-02-09)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.16.4](https://github.com/nextgis/nextgis_frontend/compare/v1.16.3...v1.16.4) (2022-09-21)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.16.3](https://github.com/nextgis/nextgis_frontend/compare/v1.16.2...v1.16.3) (2022-09-16)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.16.2](https://github.com/nextgis/nextgis_frontend/compare/v1.16.1...v1.16.2) (2022-09-15)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.16.1](https://github.com/nextgis/nextgis_frontend/compare/v1.16.0...v1.16.1) (2022-09-03)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.16.0](https://github.com/nextgis/nextgis_frontend/compare/v1.15.1...v1.16.0) (2022-08-28)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.15.1](https://github.com/nextgis/nextgis_frontend/compare/v1.15.0...v1.15.1) (2022-08-02)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.15.0](https://github.com/nextgis/nextgis_frontend/compare/v1.14.0...v1.15.0) (2022-07-27)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.14.0](https://github.com/nextgis/nextgis_frontend/compare/v1.13.8...v1.14.0) (2022-07-05)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.13.8](https://github.com/nextgis/nextgis_frontend/compare/v1.13.7...v1.13.8) (2022-06-25)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.13.7](https://github.com/nextgis/nextgis_frontend/compare/v1.13.6...v1.13.7) (2022-06-15)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.13.6](https://github.com/nextgis/nextgis_frontend/compare/v1.13.5...v1.13.6) (2022-06-05)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.13.5](https://github.com/nextgis/nextgis_frontend/compare/v1.13.4...v1.13.5) (2022-05-31)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.13.4](https://github.com/nextgis/nextgis_frontend/compare/v1.13.3...v1.13.4) (2022-05-31)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.13.3](https://github.com/nextgis/nextgis_frontend/compare/v1.13.2...v1.13.3) (2022-05-31)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.13.2](https://github.com/nextgis/nextgis_frontend/compare/v1.13.1...v1.13.2) (2022-05-30)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.13.1](https://github.com/nextgis/nextgis_frontend/compare/v1.13.0...v1.13.1) (2022-05-13)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.13.0](https://github.com/nextgis/nextgis_frontend/compare/v1.12.1...v1.13.0) (2022-05-13)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.12.1](https://github.com/nextgis/nextgis_frontend/compare/v1.12.0...v1.12.1) (2022-04-21)

### Features

- **webmap:** add map mouse move events ([2a2eba3](https://github.com/nextgis/nextgis_frontend/commit/2a2eba3c2a582093386189106d3bb456c5eb85c0))

# [1.12.0](https://github.com/nextgis/nextgis_frontend/compare/v1.11.10...v1.12.0) (2022-03-05)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.11.10](https://github.com/nextgis/nextgis_frontend/compare/v1.11.9...v1.11.10) (2022-01-20)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.11.9](https://github.com/nextgis/nextgis_frontend/compare/v1.11.8...v1.11.9) (2022-01-18)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.11.8](https://github.com/nextgis/nextgis_frontend/compare/v1.11.7...v1.11.8) (2022-01-18)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.11.7](https://github.com/nextgis/nextgis_frontend/compare/v1.11.6...v1.11.7) (2022-01-11)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.11.3](https://github.com/nextgis/nextgis_frontend/compare/v1.11.2...v1.11.3) (2022-01-03)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.11.2](https://github.com/nextgis/nextgis_frontend/compare/v1.11.1...v1.11.2) (2021-12-20)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.11.0](https://github.com/nextgis/nextgis_frontend/compare/v1.10.0...v1.11.0) (2021-12-19)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.10.0](https://github.com/nextgis/nextgis_frontend/compare/v1.9.7...v1.10.0) (2021-11-30)

### Features

- **webmap:** add setLayerPaint method ([b1ddac5](https://github.com/nextgis/nextgis_frontend/commit/b1ddac5140670aba4f40f0861d6792065653c508))

## [1.9.7](https://github.com/nextgis/nextgis_frontend/compare/v1.9.6...v1.9.7) (2021-11-19)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.9.6](https://github.com/nextgis/nextgis_frontend/compare/v1.9.5...v1.9.6) (2021-11-18)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.9.5](https://github.com/nextgis/nextgis_frontend/compare/v1.9.4...v1.9.5) (2021-11-18)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.9.4](https://github.com/nextgis/nextgis_frontend/compare/v1.9.3...v1.9.4) (2021-11-16)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.9.3](https://github.com/nextgis/nextgis_frontend/compare/v1.9.2...v1.9.3) (2021-11-05)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.9.2](https://github.com/nextgis/nextgis_frontend/compare/v1.9.1...v1.9.2) (2021-10-26)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.9.1](https://github.com/nextgis/nextgis_frontend/compare/v1.9.0...v1.9.1) (2021-10-25)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.9.0](https://github.com/nextgis/nextgis_frontend/compare/v1.8.5...v1.9.0) (2021-10-23)

### Features

- add BBOX+ strategy; extends options for setView ([88e9d09](https://github.com/nextgis/nextgis_frontend/commit/88e9d092bcc3615b99bad13d175f62be3ff73725))

## [1.8.4](https://github.com/nextgis/nextgis_frontend/compare/v1.8.3...v1.8.4) (2021-10-21)

### Features

- **ngw-kit:** ngwwebmap item toggle on zoom layer range ([f7c4e42](https://github.com/nextgis/nextgis_frontend/commit/f7c4e42fe323f9e4941dbc37893b3beb2ccd7751))

## [1.8.3](https://github.com/nextgis/nextgis_frontend/compare/v1.8.2...v1.8.3) (2021-10-12)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.8.2](https://github.com/nextgis/nextgis_frontend/compare/v1.8.1...v1.8.2) (2021-10-05)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.8.1](https://github.com/nextgis/nextgis_frontend/compare/v1.8.0...v1.8.1) (2021-09-23)

### Features

- **ngw-kit:** NgwWebmapItem opacity ([98793f3](https://github.com/nextgis/nextgis_frontend/commit/98793f32191a113f1883fa5ddc96133aa7360c57))

# [1.8.0](https://github.com/nextgis/nextgis_frontend/compare/v1.7.0...v1.8.0) (2021-09-22)

### Features

- add nativeOptions for alladdLayer adapter methods ([c99d06e](https://github.com/nextgis/nextgis_frontend/commit/c99d06e35c5884b5969b281c98bd3742d6f427ef))

# [1.7.0](https://github.com/nextgis/nextgis_frontend/compare/v1.6.0...v1.7.0) (2021-09-16)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.6.0](https://github.com/nextgis/nextgis_frontend/compare/v1.5.1...v1.6.0) (2021-09-09)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.5.1](https://github.com/nextgis/nextgis_frontend/compare/v1.5.0...v1.5.1) (2021-09-06)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.5.0](https://github.com/nextgis/nextgis_frontend/compare/v1.4.0...v1.5.0) (2021-08-19)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.4.0](https://github.com/nextgis/nextgis_frontend/compare/v1.3.0...v1.4.0) (2021-08-17)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.3.0](https://github.com/nextgis/nextgis_frontend/compare/v1.2.8...v1.3.0) (2021-08-06)

### Features

- improve popup, add new options, ol support ([75e73fa](https://github.com/nextgis/nextgis_frontend/commit/75e73faac7f393d0c62f9966786da78c7f54c039))

## [1.2.8](https://github.com/nextgis/nextgis_frontend/compare/v1.2.7...v1.2.8) (2021-07-27)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.2.7](https://github.com/nextgis/nextgis_frontend/compare/v1.2.6...v1.2.7) (2021-07-26)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.2.6](https://github.com/nextgis/nextgis_frontend/compare/v1.2.5...v1.2.6) (2021-07-23)

### Bug Fixes

- **leaflet-map-adapter:** resolve geojson adapter layerdefinition problem ([071fd5a](https://github.com/nextgis/nextgis_frontend/commit/071fd5ae4f0e6b41d1644ba050cd201e806f7445))

## [1.2.5](https://github.com/nextgis/nextgis_frontend/compare/v1.2.4...v1.2.5) (2021-07-22)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.2.4](https://github.com/nextgis/nextgis_frontend/compare/v1.2.3...v1.2.4) (2021-07-22)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.2.3](https://github.com/nextgis/nextgis_frontend/compare/v1.2.2...v1.2.3) (2021-07-21)

### Features

- **mapboxgl-map-adapter:** add popup for selected feature ([ef87167](https://github.com/nextgis/nextgis_frontend/commit/ef87167a8df611a0e7b55c04b8090af14c053adc))

## [1.2.2](https://github.com/nextgis/nextgis_frontend/compare/v1.2.1...v1.2.2) (2021-07-16)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.2.1](https://github.com/nextgis/nextgis_frontend/compare/v1.2.0...v1.2.1) (2021-07-12)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.2.0](https://github.com/nextgis/nextgis_frontend/compare/v1.1.2...v1.2.0) (2021-07-08)

### Features

- handle vector layer mouse over and out events ([2e94152](https://github.com/nextgis/nextgis_frontend/commit/2e94152fac64b8e022dab7940614487763ce57af))

## [1.1.2](https://github.com/nextgis/nextgis_frontend/compare/v1.1.1...v1.1.2) (2021-06-28)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.1.1](https://github.com/nextgis/nextgis_frontend/compare/v1.1.0...v1.1.1) (2021-06-25)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.1.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.1...v1.1.0) (2021-06-25)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [1.0.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0...v1.0.1) (2021-06-08)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.9...v1.0.0) (2021-06-07)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0-beta.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2021-05-03)

### Features

- **ngw-kit:** add identify item for speedup ngw selection ([b051f9f](https://github.com/nextgis/nextgis_frontend/commit/b051f9f6f596f3a54645e5ccbc628907ed83fca1))

# [1.0.0-beta.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2021-05-02)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0-beta.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-04-23)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0-beta.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-04-04)

### Bug Fixes

- **demo:** import utils from cdn ([f064e84](https://github.com/nextgis/nextgis_frontend/commit/f064e84214cc4347722c34e966fb67fac184db7f))

# [1.0.0-beta.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-02-13)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0-beta.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-01-17)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0-beta.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-12-19)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0-beta.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-11-28)

### Bug Fixes

- **ngw-connector:** fixes to apiRequest cancel work ([0ac44ee](https://github.com/nextgis/nextgis_frontend/commit/0ac44eee447019593ae80529cc3b063171f8f88c)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)

# [1.0.0-beta.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2020-11-16)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0-alpha.11](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2020-11-02)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0-alpha.10](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-10-20)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0-alpha.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-10-15)

### Code Refactoring

- change WebMap and NgwMap constructor options ([de7eaf9](https://github.com/nextgis/nextgis_frontend/commit/de7eaf900ece63cf91596b726ad19918f3b926b7))

### BREAKING CHANGES

- `new WebMap({ mapAdapter: new MapAdapter(), ...appOptions, mapOptions: MapOptions })` > `new WebMap(mapOptions)`
- `new NgwMap(new MapAdapter(), ngwMapOptions)` > `new NgwMap(ngwMapOptions)`
- `WebMapOptions.create` is now `true` by default

# [1.0.0-alpha.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-06)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0-alpha.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-09-22)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0-alpha.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0-alpha.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)

### Bug Fixes

- remove require imports ([be789b8](https://github.com/nextgis/nextgis_frontend/commit/be789b89f39741efe146da97eeb19460a7cca527))

# [1.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)

### Bug Fixes

- replace emitter.of by emitter.removeListener ([5a92e2b](https://github.com/nextgis/nextgis_frontend/commit/5a92e2b91e741346be39be87d5b9f50b9621c092))

### Build System

- wepmap to rollup ([bc66507](https://github.com/nextgis/nextgis_frontend/commit/bc665072f7eefacae748c2cf81f6bdef75d9f8aa))

### Code Refactoring

- rename layerAdapter baseLayer option to baselayer ([368d657](https://github.com/nextgis/nextgis_frontend/commit/368d6576278505ddddde2a1ab160a0849e087c70))

### Features

- **ngw-connector:** handle network error ([7e4a687](https://github.com/nextgis/nextgis_frontend/commit/7e4a687934e9fd8a557a41102e70c8761f7d5d2d))
- **webmap:** change default behaviour of addLayer visibility option, its now true ([0e91555](https://github.com/nextgis/nextgis_frontend/commit/0e91555cea9666dd3ce8c2df7364f0e588dc8c24))
- **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([430d51e](https://github.com/nextgis/nextgis_frontend/commit/430d51e7211c050ebeffd68b0c839d9a38170054))

### BREAKING CHANGES

- No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
- **webmap:** the added layer `visibility` is now `true`
- LayerAdapter option baseLayer was renamed to baselayer;
- webMap.getBaseLayers() method now return LayerAdapter, not string array of ids

# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)

### Bug Fixes

- **examples:** check paint opacity is number ([1105262](https://github.com/nextgis/nextgis_frontend/commit/1105262687d8b7e85873fe58933ced82d9cb77af))
- **examples:** set type for ngw_resource highlight layer ([13ddcdd](https://github.com/nextgis/nextgis_frontend/commit/13ddcdd3ad346cad9ae99a6f924bcd62299336c5))

### wip

- rename VectorLayerAdapterType ([89a2c83](https://github.com/nextgis/nextgis_frontend/commit/89a2c83135e839f3eec373f93e5df777a7b81325))

### BREAKING CHANGES

- rename VectorLayerAdapter types: circle > point; fill > polygon

# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [0.30.2](https://github.com/nextgis/nextgis_frontend/compare/v0.30.1...v0.30.2) (2020-04-30)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [0.29.10](https://github.com/nextgis/nextgis_frontend/compare/v0.29.9...v0.29.10) (2020-04-17)

### Bug Fixes

- **ngw-ol:** container style ([995b409](https://github.com/nextgis/nextgis_frontend/commit/995b409e5b70bb6a750afb39dd42745d562b4b88))

## [0.29.6](https://github.com/nextgis/nextgis_frontend/compare/v0.29.5...v0.29.6) (2020-04-16)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)

### Bug Fixes

- **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))

# [0.29.0](https://github.com/nextgis/nextgis_frontend_apps/compare/v0.28.3...v0.29.0) (2020-03-22)

### chore

- build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend_apps/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))

### BREAKING CHANGES

- code formatting rules changed to prettier 2.0 compatibility

## [0.28.3](https://github.com/nextgis/nextgis_frontend_apps/compare/v0.28.2...v0.28.3) (2020-03-19)

### Bug Fixes

- **examples:** rapair examples ([e739de7](https://github.com/nextgis/nextgis_frontend/commit/e739de7c52c09ba17ddcf007c2604cc1e2a0e0ba))

## [0.28.2](https://github.com/nextgis/nextgis_frontend/compare/v0.28.1...v0.28.2) (2020-03-12)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [0.28.1](https://github.com/nextgis/nextgis_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)

**Note:** Version bump only for package @nextgis/ngw-leaflet

# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)

### Features

- **ngw-kit:** add bbox strategy for large vector layer ([da6533b](https://github.com/nextgis/nextgis_frontend/commit/da6533b76eaf5184114ac233fa275d2398cfdf5b))

# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)

### Features

- add WmsLayerAdapter ([c57b66d](https://github.com/nextgis/nextgis_frontend/commit/c57b66d2278071a57182cb4dd554e370c63ffa06))

## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)

### Bug Fixes

- **demo:** remove layer id from ngw properties filter example ([4c3c625](https://github.com/nextgis/nextgis_frontend/commit/4c3c6253a47a4e1e55d3b19c5a75787d96705e69))

### Features

- **demo:** add new example for simple resource table ([43fdf4f](https://github.com/nextgis/nextgis_frontend/commit/43fdf4f69898680872fedece44c812ca407d1d8b))
- **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgis_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))

## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)

### Bug Fixes

- **demo:** remove layer id from ngw properties filter example ([4c3c625](https://github.com/nextgis/nextgis_frontend/commit/4c3c6253a47a4e1e55d3b19c5a75787d96705e69))

## [0.25.4](https://github.com/nextgis/nextgis_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [0.25.3](https://github.com/nextgis/nextgis_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [0.25.2](https://github.com/nextgis/nextgis_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package @nextgis/ngw-leaflet

## [0.25.1](https://github.com/nextgis/nextgis_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)

### Features

- **demo:** add new example for simple resource table ([43fdf4f](https://github.com/nextgis/nextgis_frontend/commit/43fdf4f69898680872fedece44c812ca407d1d8b))

# [0.25.0](https://github.com/nextgis/nextgis_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)

**Note:** Version bump only for package @nextgis/ngw-leaflet
