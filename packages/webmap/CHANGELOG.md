# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.28.1](https://github.com/nextgis/nextgisweb_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package @nextgis/webmap





# [0.28.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)


### Features

* **cesium:** geojson adapter paint ([657b411](https://github.com/nextgis/nextgisweb_frontend/commit/657b411f1efb9835ff9f9255c47424179e3b3caa))
* **webmap:** paint from expressions ([126a191](https://github.com/nextgis/nextgisweb_frontend/commit/126a191a540e12ac7ff74471a110c1fd04340516))
* add library `@nextgis/properties-filter` ([0902366](https://github.com/nextgis/nextgisweb_frontend/commit/09023669c963ddb4e0a319400397e5f320620573))
* **webmap:** paint from properties filter ([6645e46](https://github.com/nextgis/nextgisweb_frontend/commit/6645e467f1be79c0a2ed02fed65a62b5850daf70))


### BREAKING CHANGES

* **webmap:** New Paint specification may cause problems with types
* `propertiesFilter` removed from `@nextgis/utils`





## [0.27.1](https://github.com/nextgis/nextgisweb_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)


### Features

* **control:** add universal zoom control ([1ffc089](https://github.com/nextgis/nextgisweb_frontend/commit/1ffc089942f1709f82cec8398d301503819be718))
* add new library `ControlContainer` ([e68afeb](https://github.com/nextgis/nextgisweb_frontend/commit/e68afeb5efb1e40bf20df2effa805fe80c437478))





# [0.27.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)


### Features

* **vuetify:** allow VTree scopes for NgwLayersList ([8718f9b](https://github.com/nextgis/nextgisweb_frontend/commit/8718f9b6e114714523b3476a97b23934c31f2bb4))


### Performance Improvements

* **ngw-kit:** geojson adapter not blocked on data load ([1ceaf76](https://github.com/nextgis/nextgisweb_frontend/commit/1ceaf7688b9911727de5fa1b6fde9ae1f6b3da9e))





# [0.26.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)


### Features

* add WmsLayerAdapter ([c57b66d](https://github.com/nextgis/nextgisweb_frontend/commit/c57b66d2278071a57182cb4dd554e370c63ffa06))





## [0.25.8](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/webmap





## [0.25.7](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/webmap





## [0.25.6](https://github.com/nextgis/nextgisweb_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)


### Bug Fixes

* **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgisweb_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))
* **webmap:** not use ordering for layer id ([cd09734](https://github.com/nextgis/nextgisweb_frontend/commit/cd0973490a2c6ca0673bd01059056dd5fd68d866))
* **webmap:** ZoomState may be only integer ([c130469](https://github.com/nextgis/nextgisweb_frontend/commit/c13046908d63d549e3f221efc538c55d49a36450))


### Features

* **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgisweb_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))
* remove default MarkerLayerAdapter ([7398c1b](https://github.com/nextgis/nextgisweb_frontend/commit/7398c1bb61d43194ce4c7da635d386ad785ac57a))
* **util:** move properties filter to utils library ([4099706](https://github.com/nextgis/nextgisweb_frontend/commit/40997068f633faf75f15011721d9aaa5f11343dd))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgisweb_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))
* **webmap:** add `getBoundsPoly` webmap util ([22cb565](https://github.com/nextgis/nextgisweb_frontend/commit/22cb5654e6a2c2c8b84d32581faed0b293570cc2))
* **webmap:** nesting for propertiesFilter utility ([28cb9ed](https://github.com/nextgis/nextgisweb_frontend/commit/28cb9ed583ec96fec675f8f6c63ec18c1fe030de))
* **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgisweb_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))


### Performance Improvements

* **mapbox:** upgrade layer ordering ([58a0db0](https://github.com/nextgis/nextgisweb_frontend/commit/58a0db08c0fa123ede4ef0d9fc7d9e1e9b3a6526))


### BREAKING CHANGES

* MARKER layer adapter has been removed. Use ddLayer('GEOJSON', {data}) instead of ddLayer('MARKER', {lngLat})
* **util:** Use xport { propertiesFilter } from '@nextgis/utils'; instead of Webmap.utils.propertiesFilter





## [0.25.5](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)


### Bug Fixes

* **webmap:** ZoomState may be only integer ([c130469](https://github.com/nextgis/nextgisweb_frontend/commit/c13046908d63d549e3f221efc538c55d49a36450))


### Performance Improvements

* **mapbox:** upgrade layer ordering ([58a0db0](https://github.com/nextgis/nextgisweb_frontend/commit/58a0db08c0fa123ede4ef0d9fc7d9e1e9b3a6526))





## [0.25.4](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)

**Note:** Version bump only for package @nextgis/webmap





## [0.25.3](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)


### Features

* **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgisweb_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))





## [0.25.2](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package @nextgis/webmap





## [0.25.1](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)


### Features

* remove default MarkerLayerAdapter ([7398c1b](https://github.com/nextgis/nextgisweb_frontend/commit/7398c1bb61d43194ce4c7da635d386ad785ac57a))


### BREAKING CHANGES

* MARKER layer adapter has been removed. Use ddLayer('GEOJSON', {data}) instead of ddLayer('MARKER', {lngLat})





# [0.25.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)


### Bug Fixes

* **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgisweb_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))
* **webmap:** not use ordering for layer id ([cd09734](https://github.com/nextgis/nextgisweb_frontend/commit/cd0973490a2c6ca0673bd01059056dd5fd68d866))


### Features

* **util:** move properties filter to utils library ([4099706](https://github.com/nextgis/nextgisweb_frontend/commit/40997068f633faf75f15011721d9aaa5f11343dd))
* **webmap:** add `getBoundsPoly` webmap util ([22cb565](https://github.com/nextgis/nextgisweb_frontend/commit/22cb5654e6a2c2c8b84d32581faed0b293570cc2))
* **webmap:** nesting for propertiesFilter utility ([28cb9ed](https://github.com/nextgis/nextgisweb_frontend/commit/28cb9ed583ec96fec675f8f6c63ec18c1fe030de))
* **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgisweb_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))


### BREAKING CHANGES

* **util:** Use xport { propertiesFilter } from '@nextgis/utils'; instead of Webmap.utils.propertiesFilter
