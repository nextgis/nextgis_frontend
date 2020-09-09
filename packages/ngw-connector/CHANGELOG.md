# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-alpha.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)

**Note:** Version bump only for package @nextgis/ngw-connector





# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)


### Bug Fixes

* **cesium:** add check for telset3d adapter addLayer ([8fbb0f3](https://github.com/nextgis/nextgis_frontend/commit/8fbb0f3741277da85aba68b8f46ab3d64c71a976))





# [1.0.0-alpha.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)

**Note:** Version bump only for package @nextgis/ngw-connector





# [1.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)


### Bug Fixes

* remove require imports ([be789b8](https://github.com/nextgis/nextgis_frontend/commit/be789b89f39741efe146da97eeb19460a7cca527))





# [1.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)


### Bug Fixes

* **ngw-connector:** update error response status code list ([c4d4285](https://github.com/nextgis/nextgis_frontend/commit/c4d4285f23490f9dcc3edac8c82b533f6c07ac01))





# [1.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)


### Bug Fixes

* **ngw-connector:** improve node/browser separation ([7dd5d8d](https://github.com/nextgis/nextgis_frontend/commit/7dd5d8de655cd54ce03ebd77792bf46566265e9c))





# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)


### Bug Fixes

* replace emitter.of by emitter.removeListener ([5a92e2b](https://github.com/nextgis/nextgis_frontend/commit/5a92e2b91e741346be39be87d5b9f50b9621c092))


### Build System

* wepmap to rollup ([bc66507](https://github.com/nextgis/nextgis_frontend/commit/bc665072f7eefacae748c2cf81f6bdef75d9f8aa))


### Features

* **cesium:** add maximumScreenSpaceError option for tilset3d adapter ([c82c524](https://github.com/nextgis/nextgis_frontend/commit/c82c52452765b2e764f6c3d42bc3522bd36a4258))
* **ngw-connector:** add check for 403 ngw error ([e344663](https://github.com/nextgis/nextgis_frontend/commit/e344663a974867e510b460fb00eea1775d801ee4))
* **ngw-connector:** handle network error ([7e4a687](https://github.com/nextgis/nextgis_frontend/commit/7e4a687934e9fd8a557a41102e70c8761f7d5d2d))
* **ngw-connector:** new getResourceBy method ([462f0db](https://github.com/nextgis/nextgis_frontend/commit/462f0dbed5c0b448f5be60a73e8d70e792a4f87a))
* **ngw-kit:** ngw error handling ([490d068](https://github.com/nextgis/nextgis_frontend/commit/490d068021b21fb7ddcd7475d2a669a969f81480))
* **ngw-orm:** remove 3rd part libs to convers geom to wkt, use new ngw api ([01c8e21](https://github.com/nextgis/nextgis_frontend/commit/01c8e21321b041024584cdcb8c41998adddb3246))
* **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([430d51e](https://github.com/nextgis/nextgis_frontend/commit/430d51e7211c050ebeffd68b0c839d9a38170054))


### BREAKING CHANGES

* No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere





# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)


### Bug Fixes

* **cesium:** Tileset#DAdapter set terrain height ([790760f](https://github.com/nextgis/nextgis_frontend/commit/790760f0b8b90b9c9d572640612cfc00dabfd5d5))


### Features

* **ngw-kit:** add NgwKit.utils.getCompanyLogo method ([3c6fa09](https://github.com/nextgis/nextgis_frontend/commit/3c6fa09321c0e979543b50b93c32da8725920d28))
* **ngw-kit:** add tmsclient_layer adapter class support ([87b5976](https://github.com/nextgis/nextgis_frontend/commit/87b59760a574ffc66b1aec1d2df3af301efe1326))





# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)


### Features

* **cesium:** add Tileset3dAdapter ([c5306f9](https://github.com/nextgis/nextgis_frontend/commit/c5306f9b8bb3e37f287cbd4e3d33a04d93478e2b))
* **ngw-kit:** make create basemap layer adapter universal ([bbd8c9a](https://github.com/nextgis/nextgis_frontend/commit/bbd8c9a77d527921909ae9b1bf10b3580c5fa600))





## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)


### Performance Improvements

* **ngw-kit:** default limit to load large vector layer data ([1e88276](https://github.com/nextgis/nextgis_frontend/commit/1e8827674db30d654b6ce6c0018171b4b15db12b))





# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)


### Bug Fixes

* **ngw-connect:** properly abort request on cancel ([9ea9859](https://github.com/nextgis/nextgis_frontend/commit/9ea98591679584d7e23ef47a8bca5c4558527db4))





## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)


### Features

* **cancelable-promise:** throw CancelError instead of onCancel callback ([7b7ef11](https://github.com/nextgis/nextgis_frontend/commit/7b7ef112db2ead4fc02bac14eb61534d570b8a65))


### BREAKING CHANGES

* **cancelable-promise:** Removed onCancel argument from CancelablePromise. Now you should handle catch CancelError





## [0.29.6](https://github.com/nextgis/nextgis_frontend/compare/v0.29.5...v0.29.6) (2020-04-16)


### Bug Fixes

* **ngw-connector:** improve for node ([cc5ead7](https://github.com/nextgis/nextgis_frontend/commit/cc5ead7d298a6dd557988a9f4ed9bba361a013d9))





## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)


### Bug Fixes

* **ngw-connector:** getResourceByKeyname cache ([20fae26](https://github.com/nextgis/nextgis_frontend/commit/20fae266d240d51af7fe9e9a9af4f84d286f8cc2))


### Performance Improvements

* **ngw-connector:** getResourceByKeyname one request ([23e0706](https://github.com/nextgis/nextgis_frontend/commit/23e0706d22502ec14a4383abe87b9bae2e4e8d26))





## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)

**Note:** Version bump only for package @nextgis/ngw-connector





## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)


### Features

* **ngw-connector:** more improvement for Node ([c3af356](https://github.com/nextgis/nextgis_frontend/commit/c3af356f00e7095f50c463e12692b12bea605e6f))





## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)


### Bug Fixes

* **ngw-connector:** improve compatibility with Node ([7b653f5](https://github.com/nextgis/nextgis_frontend/commit/7b653f559f7ecb681d0059ac42a9aecb543fbb90))





## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)


### Bug Fixes

* **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))





# [0.29.0](https://github.com/nextgis/nextgis_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)


### chore

* build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))


### BREAKING CHANGES

* code formatting rules changed to prettier 2.0 compatibility





# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)

**Note:** Version bump only for package @nextgis/ngw-connector





## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)


### Features

* add library cancelable-promise ([5227983](https://github.com/nextgis/nextgis_frontend/commit/5227983e03b0a5aa5807002f63914fa2d23154b0))





# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)


### Features

* **ngw-kit:** add bbox strategy for large vector layer ([da6533b](https://github.com/nextgis/nextgis_frontend/commit/da6533b76eaf5184114ac233fa275d2398cfdf5b))
* **vuetify:** allow VTree scopes for NgwLayersList ([8718f9b](https://github.com/nextgis/nextgis_frontend/commit/8718f9b6e114714523b3476a97b23934c31f2bb4))


### Performance Improvements

* **ngw-kit:** geojson adapter not blocked on data load ([1ceaf76](https://github.com/nextgis/nextgis_frontend/commit/1ceaf7688b9911727de5fa1b6fde9ae1f6b3da9e))





# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)


### Features

* add WmsLayerAdapter ([c57b66d](https://github.com/nextgis/nextgis_frontend/commit/c57b66d2278071a57182cb4dd554e370c63ffa06))





## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/ngw-connector





## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/ngw-connector





## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)


### Features

* **demo:** add new example for simple resource table ([43fdf4f](https://github.com/nextgis/nextgis_frontend/commit/43fdf4f69898680872fedece44c812ca407d1d8b))
* **ngw:** add support for `qgis_raster_style` ([959e901](https://github.com/nextgis/nextgis_frontend/commit/959e9014364947acbbbe768157d8cb5ab6d0c3ba))
* **ngw:** conditions and nesting for filtering ngw feature layer ([bc7cc34](https://github.com/nextgis/nextgis_frontend/commit/bc7cc344d83d1769476e28cb87d595a9d25d0ebd))
* **ngw-connector:** make library polymorphic for both node and browser ([b3bd42e](https://github.com/nextgis/nextgis_frontend/commit/b3bd42e1ebc3880edfecb6713d0d17166e9beed0))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgis_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))


### wip

* **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgis_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))


### BREAKING CHANGES

* **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'





## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)


### Features

* **ngw-connector:** make library polymorphic for both node and browser ([b3bd42e](https://github.com/nextgis/nextgis_frontend/commit/b3bd42e1ebc3880edfecb6713d0d17166e9beed0))





## [0.25.4](https://github.com/nextgis/nextgis_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)


### wip

* **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgis_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))


### BREAKING CHANGES

* **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'





## [0.25.3](https://github.com/nextgis/nextgis_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)


### Features

* **ngw:** conditions and nesting for filtering ngw feature layer ([bc7cc34](https://github.com/nextgis/nextgis_frontend/commit/bc7cc344d83d1769476e28cb87d595a9d25d0ebd))





## [0.25.1](https://github.com/nextgis/nextgis_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)


### Features

* **demo:** add new example for simple resource table ([43fdf4f](https://github.com/nextgis/nextgis_frontend/commit/43fdf4f69898680872fedece44c812ca407d1d8b))





# [0.25.0](https://github.com/nextgis/nextgis_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)


### Features

* **ngw:** add support for `qgis_raster_style` ([959e901](https://github.com/nextgis/nextgis_frontend/commit/959e9014364947acbbbe768157d8cb5ab6d0c3ba))
