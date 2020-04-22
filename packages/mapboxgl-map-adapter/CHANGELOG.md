# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.29.11](https://github.com/nextgis/nextgisweb_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)


### Features

* **cancelable-promise:** throw CancelError instead of onCancel callback ([7b7ef11](https://github.com/nextgis/nextgisweb_frontend/commit/7b7ef112db2ead4fc02bac14eb61534d570b8a65))


### Performance Improvements

* **mapbox:** vector layer click event prevent by order ([e7901da](https://github.com/nextgis/nextgisweb_frontend/commit/e7901da34935e347de05aaf0798eb1e5dfda11ff))


### BREAKING CHANGES

* **cancelable-promise:** Removed onCancel argument from CancelablePromise. Now you should handle catch CancelError





## [0.29.5](https://github.com/nextgis/nextgisweb_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)

**Note:** Version bump only for package @nextgis/mapboxgl-map-adapter





## [0.29.4](https://github.com/nextgis/nextgisweb_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)

**Note:** Version bump only for package @nextgis/mapboxgl-map-adapter





## [0.29.3](https://github.com/nextgis/nextgisweb_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

**Note:** Version bump only for package @nextgis/mapboxgl-map-adapter





## [0.29.2](https://github.com/nextgis/nextgisweb_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

**Note:** Version bump only for package @nextgis/mapboxgl-map-adapter





## [0.29.1](https://github.com/nextgis/nextgisweb_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)


### Bug Fixes

* **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgisweb_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))





# [0.29.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)


### chore

* build; eslint ([97e3b07](https://github.com/nextgis/nextgisweb_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))


### BREAKING CHANGES

* code formatting rules changed to prettier 2.0 compatibility





## [0.28.3](https://github.com/nextgis/nextgisweb_frontend/compare/v0.28.2...v0.28.3) (2020-03-19)


### Features

* add library `@nextgis/paint` ([99391ec](https://github.com/nextgis/nextgisweb_frontend/commit/99391ec1ac9fd80508816417d9eb2ae0fd734340))





## [0.28.2](https://github.com/nextgis/nextgisweb_frontend/compare/v0.28.1...v0.28.2) (2020-03-12)

**Note:** Version bump only for package @nextgis/mapboxgl-map-adapter





## [0.28.1](https://github.com/nextgis/nextgisweb_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package @nextgis/mapboxgl-map-adapter





# [0.28.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)


### Features

* add library `@nextgis/properties-filter` ([0902366](https://github.com/nextgis/nextgisweb_frontend/commit/09023669c963ddb4e0a319400397e5f320620573))
* **webmap:** paint from properties filter ([6645e46](https://github.com/nextgis/nextgisweb_frontend/commit/6645e467f1be79c0a2ed02fed65a62b5850daf70))


### BREAKING CHANGES

* `propertiesFilter` removed from `@nextgis/utils`





## [0.27.1](https://github.com/nextgis/nextgisweb_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)


### Bug Fixes

* **mapbxo:** resolve geojson selection-filter conflict ([f0abd87](https://github.com/nextgis/nextgisweb_frontend/commit/f0abd87005176192efeac8c40bdc1a4398909eb6))


### Features

* **control:** add universal zoom control ([1ffc089](https://github.com/nextgis/nextgisweb_frontend/commit/1ffc089942f1709f82cec8398d301503819be718))





# [0.27.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)


### Features

* **ngw-kit:** add bbox strategy for large vector layer ([da6533b](https://github.com/nextgis/nextgisweb_frontend/commit/da6533b76eaf5184114ac233fa275d2398cfdf5b))





# [0.26.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)


### Features

* add WmsLayerAdapter ([c57b66d](https://github.com/nextgis/nextgisweb_frontend/commit/c57b66d2278071a57182cb4dd554e370c63ffa06))





## [0.25.8](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/mapboxgl-map-adapter





## [0.25.7](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/mapboxgl-map-adapter





## [0.25.6](https://github.com/nextgis/nextgisweb_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)


### Bug Fixes

* **demo:** remove layer id from ngw properties filter example ([4c3c625](https://github.com/nextgis/nextgisweb_frontend/commit/4c3c6253a47a4e1e55d3b19c5a75787d96705e69))
* **mapbox:** disable mapbox image layer ([421a69f](https://github.com/nextgis/nextgisweb_frontend/commit/421a69f2e11313e8835c4d87e5091e4ef9f393d1))
* **mapbox:** geojson adapter select ([3563359](https://github.com/nextgis/nextgisweb_frontend/commit/35633593586642f8d52d0fe326ebbf8b117652b3))
* **mapbox:** geojson getFeatures method return whole source data ([d47f893](https://github.com/nextgis/nextgisweb_frontend/commit/d47f8932d63c8a6d056d50aad351026464128595))
* **mapbox:** geojson layer selection with nativeFilter option ([ffea714](https://github.com/nextgis/nextgisweb_frontend/commit/ffea714bc57ece601a400ca7aa5f506aebf5f4e2))
* **mapbox:** propertyFilter for selected vector data ([6eaba47](https://github.com/nextgis/nextgisweb_frontend/commit/6eaba476e582af7f33e0b98d74457482a1fa0cf0))
* **mapbox:** set transformRequest option only then map is loaded ([9a2da0b](https://github.com/nextgis/nextgisweb_frontend/commit/9a2da0b3c11ed1f8b44d655590687fc66f51c36e))
* **mapbox:** transformRequests hotfix ([99ba257](https://github.com/nextgis/nextgisweb_frontend/commit/99ba2570ae1e519e4f7ea941514c342e7039b3da))


### Features

* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgisweb_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))
* **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgisweb_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))


### Performance Improvements

* **mapbox:** selection with PropertiesFilter ([e6e52e1](https://github.com/nextgis/nextgisweb_frontend/commit/e6e52e151f1662bb889cf89b349d566c100a2bdc))
* **mapbox:** upgrade layer ordering ([58a0db0](https://github.com/nextgis/nextgisweb_frontend/commit/58a0db08c0fa123ede4ef0d9fc7d9e1e9b3a6526))





## [0.25.5](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)


### Bug Fixes

* **demo:** remove layer id from ngw properties filter example ([4c3c625](https://github.com/nextgis/nextgisweb_frontend/commit/4c3c6253a47a4e1e55d3b19c5a75787d96705e69))
* **mapbox:** geojson getFeatures method return whole source data ([d47f893](https://github.com/nextgis/nextgisweb_frontend/commit/d47f8932d63c8a6d056d50aad351026464128595))


### Performance Improvements

* **mapbox:** upgrade layer ordering ([58a0db0](https://github.com/nextgis/nextgisweb_frontend/commit/58a0db08c0fa123ede4ef0d9fc7d9e1e9b3a6526))





## [0.25.4](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)

**Note:** Version bump only for package @nextgis/mapboxgl-map-adapter





## [0.25.3](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)

**Note:** Version bump only for package @nextgis/mapboxgl-map-adapter





## [0.25.2](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package @nextgis/mapboxgl-map-adapter





## [0.25.1](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)


### Bug Fixes

* **mapbox:** disable mapbox image layer ([421a69f](https://github.com/nextgis/nextgisweb_frontend/commit/421a69f2e11313e8835c4d87e5091e4ef9f393d1))





# [0.25.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)


### Bug Fixes

* **mapbox:** geojson adapter select ([3563359](https://github.com/nextgis/nextgisweb_frontend/commit/35633593586642f8d52d0fe326ebbf8b117652b3))
* **mapbox:** geojson layer selection with nativeFilter option ([ffea714](https://github.com/nextgis/nextgisweb_frontend/commit/ffea714bc57ece601a400ca7aa5f506aebf5f4e2))
* **mapbox:** propertyFilter for selected vector data ([6eaba47](https://github.com/nextgis/nextgisweb_frontend/commit/6eaba476e582af7f33e0b98d74457482a1fa0cf0))
* **mapbox:** set transformRequest option only then map is loaded ([9a2da0b](https://github.com/nextgis/nextgisweb_frontend/commit/9a2da0b3c11ed1f8b44d655590687fc66f51c36e))
* **mapbox:** transformRequests hotfix ([99ba257](https://github.com/nextgis/nextgisweb_frontend/commit/99ba2570ae1e519e4f7ea941514c342e7039b3da))


### Features

* **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgisweb_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))


### Performance Improvements

* **mapbox:** selection with PropertiesFilter ([e6e52e1](https://github.com/nextgis/nextgisweb_frontend/commit/e6e52e151f1662bb889cf89b349d566c100a2bdc))





## [0.24.2](https://github.com/nextgis/nextgisweb_frontend/compare/v0.24.1...v0.24.2) (2020-01-14)


### Bug Fixes

* **mapbox:** transformRequests hotfix ([99ba257](https://github.com/nextgis/nextgisweb_frontend/commit/99ba2570ae1e519e4f7ea941514c342e7039b3da))
