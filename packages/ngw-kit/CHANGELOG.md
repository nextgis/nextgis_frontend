# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.29.1](https://github.com/nextgis/nextgisweb_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)


### Bug Fixes

* **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgisweb_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))





# [0.29.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)


### chore

* build; eslint ([97e3b07](https://github.com/nextgis/nextgisweb_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))


### BREAKING CHANGES

* code formatting rules changed to prettier 2.0 compatibility





## [0.28.3](https://github.com/nextgis/nextgisweb_frontend/compare/v0.28.2...v0.28.3) (2020-03-19)


### Bug Fixes

* **examples:** rapair examples ([e739de7](https://github.com/nextgis/nextgisweb_frontend/commit/e739de7c52c09ba17ddcf007c2604cc1e2a0e0ba))
* **ngw:** get geojson request options ([015cffc](https://github.com/nextgis/nextgisweb_frontend/commit/015cffc415b272f0dace009e192ef7986c699138))
* **ngw-kit:** order_by param ([dd161fc](https://github.com/nextgis/nextgisweb_frontend/commit/dd161fc8d3536fe733f2c21427f897ae4d44f60f))


### Features

* **ngw:** option to create popup content from item ([3c4a809](https://github.com/nextgis/nextgisweb_frontend/commit/3c4a809dc7cd9045e3ed1622b1eea0036e5205a1))





## [0.28.1](https://github.com/nextgis/nextgisweb_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package @nextgis/ngw-kit





# [0.28.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)


### Features

* add library `@nextgis/properties-filter` ([0902366](https://github.com/nextgis/nextgisweb_frontend/commit/09023669c963ddb4e0a319400397e5f320620573))


### BREAKING CHANGES

* `propertiesFilter` removed from `@nextgis/utils`





## [0.27.1](https://github.com/nextgis/nextgisweb_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)


### Features

* add library cancelable-promise ([5227983](https://github.com/nextgis/nextgisweb_frontend/commit/5227983e03b0a5aa5807002f63914fa2d23154b0))
* new @nextgis/dom library ([82a645d](https://github.com/nextgis/nextgisweb_frontend/commit/82a645d213d0b9ef1bb3c443dc28a94866c2884b))
* **cesium:** add mapAdapter listeners and getBounds method ([3033475](https://github.com/nextgis/nextgisweb_frontend/commit/3033475bc1cc519efe08f18e9e741750d35a0f25))





# [0.27.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)


### Features

* **ngw-kit:** add bbox strategy for large vector layer ([da6533b](https://github.com/nextgis/nextgisweb_frontend/commit/da6533b76eaf5184114ac233fa275d2398cfdf5b))


### Performance Improvements

* **ngw-kit:** geojson adapter not blocked on data load ([1ceaf76](https://github.com/nextgis/nextgisweb_frontend/commit/1ceaf7688b9911727de5fa1b6fde9ae1f6b3da9e))





# [0.26.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)


### Features

* add WmsLayerAdapter ([c57b66d](https://github.com/nextgis/nextgisweb_frontend/commit/c57b66d2278071a57182cb4dd554e370c63ffa06))





## [0.25.8](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/ngw-kit





## [0.25.7](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/ngw-kit





## [0.25.6](https://github.com/nextgis/nextgisweb_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)


### Bug Fixes

* **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgisweb_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))


### Features

* **ngw:** add support for `qgis_raster_style` ([959e901](https://github.com/nextgis/nextgisweb_frontend/commit/959e9014364947acbbbe768157d8cb5ab6d0c3ba))
* **ngw:** conditions and nesting for filtering ngw feature layer ([bc7cc34](https://github.com/nextgis/nextgisweb_frontend/commit/bc7cc344d83d1769476e28cb87d595a9d25d0ebd))
* **ngw-kit:** new addNgwLayer resource option for keyname or resourceId ([f1eefd2](https://github.com/nextgis/nextgisweb_frontend/commit/f1eefd2703dc16126ef4b0a933a86b9a34d594a7))
* **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgisweb_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgisweb_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))
* **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgisweb_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))


### wip

* **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgisweb_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))


### BREAKING CHANGES

* **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'





## [0.25.5](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)


### Features

* **ngw-kit:** new addNgwLayer resource option for keyname or resourceId ([f1eefd2](https://github.com/nextgis/nextgisweb_frontend/commit/f1eefd2703dc16126ef4b0a933a86b9a34d594a7))





## [0.25.4](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)


### wip

* **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgisweb_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))


### BREAKING CHANGES

* **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'





## [0.25.3](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)


### Features

* **ngw:** conditions and nesting for filtering ngw feature layer ([bc7cc34](https://github.com/nextgis/nextgisweb_frontend/commit/bc7cc344d83d1769476e28cb87d595a9d25d0ebd))
* **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgisweb_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))





## [0.25.2](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package @nextgis/ngw-kit





## [0.25.1](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)

**Note:** Version bump only for package @nextgis/ngw-kit





# [0.25.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)


### Bug Fixes

* **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgisweb_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))


### Features

* **ngw:** add support for `qgis_raster_style` ([959e901](https://github.com/nextgis/nextgisweb_frontend/commit/959e9014364947acbbbe768157d8cb5ab6d0c3ba))
* **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgisweb_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))
