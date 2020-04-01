# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.29.2](https://github.com/nextgis/nextgisweb_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

**Note:** Version bump only for package @nextgis/utils





## [0.29.1](https://github.com/nextgis/nextgisweb_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)


### Bug Fixes

* **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgisweb_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))





# [0.29.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)


### Bug Fixes

* **properties-filte:** allow any chars for `like` and `ilike` search ([6b5b60d](https://github.com/nextgis/nextgisweb_frontend/commit/6b5b60d7985abb01093b649073c6e0a088f7fe0e))


### chore

* build; eslint ([97e3b07](https://github.com/nextgis/nextgisweb_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))


### BREAKING CHANGES

* code formatting rules changed to prettier 2.0 compatibility





## [0.28.3](https://github.com/nextgis/nextgisweb_frontend/compare/v0.28.2...v0.28.3) (2020-03-19)

**Note:** Version bump only for package @nextgis/utils





# [0.28.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)


### Features

* add library `@nextgis/properties-filter` ([0902366](https://github.com/nextgis/nextgisweb_frontend/commit/09023669c963ddb4e0a319400397e5f320620573))


### BREAKING CHANGES

* `propertiesFilter` removed from `@nextgis/utils`





## [0.27.1](https://github.com/nextgis/nextgisweb_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)


### Features

* add library cancelable-promise ([5227983](https://github.com/nextgis/nextgisweb_frontend/commit/5227983e03b0a5aa5807002f63914fa2d23154b0))
* add new library `ControlContainer` ([e68afeb](https://github.com/nextgis/nextgisweb_frontend/commit/e68afeb5efb1e40bf20df2effa805fe80c437478))
* new @nextgis/dom library ([82a645d](https://github.com/nextgis/nextgisweb_frontend/commit/82a645d213d0b9ef1bb3c443dc28a94866c2884b))
* **control:** add universal zoom control ([1ffc089](https://github.com/nextgis/nextgisweb_frontend/commit/1ffc089942f1709f82cec8398d301503819be718))





# [0.27.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)


### Features

* **utils:** create universal MapControlContainer ([2f07100](https://github.com/nextgis/nextgisweb_frontend/commit/2f07100b8a9b178533d5e3ee17b8759d8eb62866))





# [0.26.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)

**Note:** Version bump only for package @nextgis/utils





## [0.25.8](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/utils





## [0.25.7](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/utils





## [0.25.6](https://github.com/nextgis/nextgisweb_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)


### Bug Fixes

* rename Clipboard ([759f55a](https://github.com/nextgis/nextgisweb_frontend/commit/759f55ad35928f5212d8ed8bfaccdbebcb35246a))
* **mapbox:** geojson getFeatures method return whole source data ([d47f893](https://github.com/nextgis/nextgisweb_frontend/commit/d47f8932d63c8a6d056d50aad351026464128595))
* **util:** arrayCompare typecasting ([3cca72c](https://github.com/nextgis/nextgisweb_frontend/commit/3cca72cdcae150829a58754a2efbe51cd6c4517f))


### Features

* **util:** add arrayCompare util ([9442c01](https://github.com/nextgis/nextgisweb_frontend/commit/9442c01e17dc894e97580cf32b882567066a9004))
* **util:** add debounce util ([fd45455](https://github.com/nextgis/nextgisweb_frontend/commit/fd45455b061b2bc6186f865d4d0a3aa13d57e01d))
* **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgisweb_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))
* **util:** move properties filter to utils library ([4099706](https://github.com/nextgis/nextgisweb_frontend/commit/40997068f633faf75f15011721d9aaa5f11343dd))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgisweb_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))


### wip

* **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgisweb_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))


### BREAKING CHANGES

* **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'
* **util:** Use xport { propertiesFilter } from '@nextgis/utils'; instead of Webmap.utils.propertiesFilter





## [0.25.5](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)


### Bug Fixes

* rename Clipboard ([759f55a](https://github.com/nextgis/nextgisweb_frontend/commit/759f55ad35928f5212d8ed8bfaccdbebcb35246a))
* **mapbox:** geojson getFeatures method return whole source data ([d47f893](https://github.com/nextgis/nextgisweb_frontend/commit/d47f8932d63c8a6d056d50aad351026464128595))





## [0.25.4](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)


### wip

* **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgisweb_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))


### BREAKING CHANGES

* **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'





## [0.25.3](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)


### Features

* **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgisweb_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))





# [0.25.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)


### Bug Fixes

* **util:** arrayCompare typecasting ([3cca72c](https://github.com/nextgis/nextgisweb_frontend/commit/3cca72cdcae150829a58754a2efbe51cd6c4517f))


### Features

* **util:** add arrayCompare util ([9442c01](https://github.com/nextgis/nextgisweb_frontend/commit/9442c01e17dc894e97580cf32b882567066a9004))
* **util:** add debounce util ([fd45455](https://github.com/nextgis/nextgisweb_frontend/commit/fd45455b061b2bc6186f865d4d0a3aa13d57e01d))
* **util:** move properties filter to utils library ([4099706](https://github.com/nextgis/nextgisweb_frontend/commit/40997068f633faf75f15011721d9aaa5f11343dd))


### BREAKING CHANGES

* **util:** Use `import { propertiesFilter } from '@nextgis/utils';` instead of `Webmap.utils.propertiesFilter`
