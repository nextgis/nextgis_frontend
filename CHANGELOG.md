# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.24.1](https://github.com/nextgis/nextgisweb_frontend/compare/v0.15.4...v0.24.1) (2020-01-14)


### Bug Fixes

* **mapbox:** set transformRequest option only then map is loaded ([9a2da0b](https://github.com/nextgis/nextgisweb_frontend/commit/9a2da0b3c11ed1f8b44d655590687fc66f51c36e))
* **ol:** no vector layer label for undefined property ([8087662](https://github.com/nextgis/nextgisweb_frontend/commit/80876629688c664edc6a5c7c1f5452a0b38e0cf7))


### Features

* **ol:** implement labelField options for OL geojson adapter ([cd0fbf1](https://github.com/nextgis/nextgisweb_frontend/commit/cd0fbf145a89a07bb934ec77a21c130e0eb7eba8))
* **ol:** implemented getBounds method for OlMapAdapter ([42e9a18](https://github.com/nextgis/nextgisweb_frontend/commit/42e9a1835d76e211055fc66fab7ba709f4e923f9))
* **ol:** labeling for circle layer paint ([1b0c87c](https://github.com/nextgis/nextgisweb_frontend/commit/1b0c87c10afe49195464d346634ec1cf88bd49b8))
* **webmap:** add `getBoundsPoly` webmap util ([22cb565](https://github.com/nextgis/nextgisweb_frontend/commit/22cb5654e6a2c2c8b84d32581faed0b293570cc2))




# [0.24.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.22.0...v0.24.0) (2020-01-11)


### BREAKING CHANGES

* Use import VueNgwMap from '@nextgis/vue-ngw-leaflet' instead of @nextgis/vue-ngw-map, vue-ngw-map is now has only abstract class for export (without any map framework). Also you can importVueNgwMap component from @nextgis/vue-ngw-mapbox and @nextgis/vue-ngw-ol.




# [0.23.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.22.0...v0.23.0) (2020-01-11)


### Documentation

* update changelog ([b8fe281](https://github.com/nextgis/nextgisweb_frontend/commit/b8fe281078b5db6593fe4a91214021ecbd5c5c2f))


### Features

* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgisweb_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))


### BREAKING CHANGES

* Сhanged approach to writing commit messages. Read [convention](https://github.com/nextgis/nextgisweb_frontend/blob/master/.github/commit-convention.md)
