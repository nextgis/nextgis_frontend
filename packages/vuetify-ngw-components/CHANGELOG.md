# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)


### Bug Fixes

* replace emitter.of by emitter.removeListener ([5a92e2b](https://github.com/nextgis/nextgis_frontend/commit/5a92e2b91e741346be39be87d5b9f50b9621c092))
* **vuetify:** pass $attrs from parent ([778f909](https://github.com/nextgis/nextgis_frontend/commit/778f9093dba1b15115806996b7c0984d5bfc84b0))
* **vuetify:** update items on init ([03f78ed](https://github.com/nextgis/nextgis_frontend/commit/03f78ed98e74fc2eb005085f1fce30b3a957ece5))


### Build System

* wepmap to rollup ([bc66507](https://github.com/nextgis/nextgis_frontend/commit/bc665072f7eefacae748c2cf81f6bdef75d9f8aa))


### Code Refactoring

* rename layerAdapter baseLayer option to baselayer ([368d657](https://github.com/nextgis/nextgis_frontend/commit/368d6576278505ddddde2a1ab160a0849e087c70))


### Performance Improvements

* **vuetify:** replace components gwMap param with webMapId ([59a42d3](https://github.com/nextgis/nextgis_frontend/commit/59a42d35029c4d713469a1ea2f339c3bb5f3747a))


### BREAKING CHANGES

* No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
* LayerAdapter option baseLayer was renamed to baselayer;
* webMap.getBaseLayers() method now return LayerAdapter, not string array of ids





# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)


### Bug Fixes

* **vuetify:** correction for set empty BasemapSelect text ([8ab35e4](https://github.com/nextgis/nextgis_frontend/commit/8ab35e426f9333391c746849c0d2316e2cb62ec3))
* **vuetify:** NgwLayersList root item hide ([abba8cb](https://github.com/nextgis/nextgis_frontend/commit/abba8cbd8a46697ba37a768bd2576086591c344c))





# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)


### Bug Fixes

* **ngw-kit:** create async adapter from parent resource ([808572b](https://github.com/nextgis/nextgis_frontend/commit/808572b5aff6b04783cd7e9edd078e2ea5404dd2))
* **ol:** css control fixes ([98f6d13](https://github.com/nextgis/nextgis_frontend/commit/98f6d13dc9af59a39b1b0a13cea24be3a2505759))
* **vuetify:** NgwLayersList visibility for webmap root item ([4f940a8](https://github.com/nextgis/nextgis_frontend/commit/4f940a854a5054070acbf9d0416f059c9f19ae7d))


### Features

* **ngw-kit:** add addLayerOptionsPriority for createGeoJsonAdapter ([f6c563e](https://github.com/nextgis/nextgis_frontend/commit/f6c563e1bc1238206bb4ba3d8081971d078ef54d))
* **ngw-kit:** add baselayers from webmap; vuetify BaseLayerSelect ([74c0749](https://github.com/nextgis/nextgis_frontend/commit/74c074929c7da864a9097fc8176825894555e0a3))
* **ngw-kit:** make create basemap layer adapter universal ([bbd8c9a](https://github.com/nextgis/nextgis_frontend/commit/bbd8c9a77d527921909ae9b1bf10b3580c5fa600))





## [0.30.2](https://github.com/nextgis/nextgis_frontend/compare/v0.30.1...v0.30.2) (2020-04-30)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)


### Bug Fixes

* **vue:** selection for items with properties and tree ([e2f72df](https://github.com/nextgis/nextgis_frontend/commit/e2f72df0c1800e7595c7e3e8342f15841f897eea))
* **webmap:** get layers method only string keys ([e0182c9](https://github.com/nextgis/nextgis_frontend/commit/e0182c95c81f5b76605f569bcbf2826937909889))


### Features

* **ngw-kit:** extensibility increased ([77bdaf7](https://github.com/nextgis/nextgis_frontend/commit/77bdaf7df43124811a8847cad348fe6bdae6d1ed))


### Performance Improvements

* **ngw-kit:** default limit to load large vector layer data ([1e88276](https://github.com/nextgis/nextgis_frontend/commit/1e8827674db30d654b6ce6c0018171b4b15db12b))





# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.29.10](https://github.com/nextgis/nextgis_frontend/compare/v0.29.9...v0.29.10) (2020-04-17)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.29.6](https://github.com/nextgis/nextgis_frontend/compare/v0.29.5...v0.29.6) (2020-04-16)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)


### Bug Fixes

* **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))





# [0.29.0](https://github.com/nextgis/nextgis_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)


### chore

* build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))


### BREAKING CHANGES

* code formatting rules changed to prettier 2.0 compatibility





## [0.28.3](https://github.com/nextgis/nextgis_frontend/compare/v0.28.2...v0.28.3) (2020-03-19)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.28.1](https://github.com/nextgis/nextgis_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)


### Features

* **vuetify:** allow VTree scopes for NgwLayersList ([8718f9b](https://github.com/nextgis/nextgis_frontend/commit/8718f9b6e114714523b3476a97b23934c31f2bb4))





# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)


### Bug Fixes

* **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgis_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))
* **util:** arrayCompare typecasting ([3cca72c](https://github.com/nextgis/nextgis_frontend/commit/3cca72cdcae150829a58754a2efbe51cd6c4517f))
* **vue:** NgwLayersList webmap visibility ([919bc4e](https://github.com/nextgis/nextgis_frontend/commit/919bc4e5dd971f0f9ed501bab4266eaab8da5037))
* **vue:** saveselection of webmap in NgwLayersList ([6270793](https://github.com/nextgis/nextgis_frontend/commit/6270793f23d4c01f9a928a868301c36d53502bc2))


### Features

* **util:** add arrayCompare util ([9442c01](https://github.com/nextgis/nextgis_frontend/commit/9442c01e17dc894e97580cf32b882567066a9004))
* **vue:** NgwLayersList watch ngwMap change ([b2bfd34](https://github.com/nextgis/nextgis_frontend/commit/b2bfd349c86e934194424ebedf05ee9d24a6a51f))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgis_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))





## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.25.4](https://github.com/nextgis/nextgis_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.25.3](https://github.com/nextgis/nextgis_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.25.2](https://github.com/nextgis/nextgis_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [0.25.1](https://github.com/nextgis/nextgis_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





# [0.25.0](https://github.com/nextgis/nextgis_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)


### Bug Fixes

* **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgis_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))
* **util:** arrayCompare typecasting ([3cca72c](https://github.com/nextgis/nextgis_frontend/commit/3cca72cdcae150829a58754a2efbe51cd6c4517f))
* **vue:** NgwLayersList webmap visibility ([919bc4e](https://github.com/nextgis/nextgis_frontend/commit/919bc4e5dd971f0f9ed501bab4266eaab8da5037))
* **vue:** saveselection of webmap in NgwLayersList ([6270793](https://github.com/nextgis/nextgis_frontend/commit/6270793f23d4c01f9a928a868301c36d53502bc2))


### Features

* **util:** add arrayCompare util ([9442c01](https://github.com/nextgis/nextgis_frontend/commit/9442c01e17dc894e97580cf32b882567066a9004))
* **vue:** NgwLayersList watch ngwMap change ([b2bfd34](https://github.com/nextgis/nextgis_frontend/commit/b2bfd349c86e934194424ebedf05ee9d24a6a51f))
