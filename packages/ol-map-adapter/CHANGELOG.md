# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.27.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)


### Features

* **utils:** create universal MapControlContainer ([2f07100](https://github.com/nextgis/nextgisweb_frontend/commit/2f07100b8a9b178533d5e3ee17b8759d8eb62866))





# [0.26.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)


### Features

* add WmsLayerAdapter ([c57b66d](https://github.com/nextgis/nextgisweb_frontend/commit/c57b66d2278071a57182cb4dd554e370c63ffa06))





## [0.25.8](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/ol-map-adapter





## [0.25.7](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/ol-map-adapter





## [0.25.6](https://github.com/nextgis/nextgisweb_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)


### Bug Fixes

* **ol:** no vector layer label for undefined property ([8087662](https://github.com/nextgis/nextgisweb_frontend/commit/80876629688c664edc6a5c7c1f5452a0b38e0cf7))
* **webmap:** not use ordering for layer id ([cd09734](https://github.com/nextgis/nextgisweb_frontend/commit/cd0973490a2c6ca0673bd01059056dd5fd68d866))


### Features

* remove default MarkerLayerAdapter ([7398c1b](https://github.com/nextgis/nextgisweb_frontend/commit/7398c1bb61d43194ce4c7da635d386ad785ac57a))
* **ol:** implement labelField options for OL geojson adapter ([cd0fbf1](https://github.com/nextgis/nextgisweb_frontend/commit/cd0fbf145a89a07bb934ec77a21c130e0eb7eba8))
* **ol:** implemented getBounds method for OlMapAdapter ([42e9a18](https://github.com/nextgis/nextgisweb_frontend/commit/42e9a1835d76e211055fc66fab7ba709f4e923f9))
* **ol:** labeling for circle layer paint ([1b0c87c](https://github.com/nextgis/nextgisweb_frontend/commit/1b0c87c10afe49195464d346634ec1cf88bd49b8))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgisweb_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))


### BREAKING CHANGES

* MARKER layer adapter has been removed. Use ddLayer('GEOJSON', {data}) instead of ddLayer('MARKER', {lngLat})





## [0.25.5](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)

**Note:** Version bump only for package @nextgis/ol-map-adapter





## [0.25.4](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)

**Note:** Version bump only for package @nextgis/ol-map-adapter





## [0.25.3](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)

**Note:** Version bump only for package @nextgis/ol-map-adapter





## [0.25.2](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package @nextgis/ol-map-adapter





## [0.25.1](https://github.com/nextgis/nextgisweb_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)


### Features

* remove default MarkerLayerAdapter ([7398c1b](https://github.com/nextgis/nextgisweb_frontend/commit/7398c1bb61d43194ce4c7da635d386ad785ac57a))


### BREAKING CHANGES

* MARKER layer adapter has been removed. Use ddLayer('GEOJSON', {data}) instead of ddLayer('MARKER', {lngLat})





# [0.25.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)


### Bug Fixes

* **ol:** no vector layer label for undefined property ([8087662](https://github.com/nextgis/nextgisweb_frontend/commit/80876629688c664edc6a5c7c1f5452a0b38e0cf7))
* **webmap:** not use ordering for layer id ([cd09734](https://github.com/nextgis/nextgisweb_frontend/commit/cd0973490a2c6ca0673bd01059056dd5fd68d866))


### Features

* **ol:** implement labelField options for OL geojson adapter ([cd0fbf1](https://github.com/nextgis/nextgisweb_frontend/commit/cd0fbf145a89a07bb934ec77a21c130e0eb7eba8))
* **ol:** implemented getBounds method for OlMapAdapter ([42e9a18](https://github.com/nextgis/nextgisweb_frontend/commit/42e9a1835d76e211055fc66fab7ba709f4e923f9))
* **ol:** labeling for circle layer paint ([1b0c87c](https://github.com/nextgis/nextgisweb_frontend/commit/1b0c87c10afe49195464d346634ec1cf88bd49b8))
