# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.5.0](https://github.com/nextgis/nextgis_frontend/compare/v2.4.1...v2.5.0) (2024-07-09)

**Note:** Version bump only for package @nextgis/ngw-maplibre-gl





## [2.4.1](https://github.com/nextgis/nextgis_frontend/compare/v2.4.0...v2.4.1) (2024-06-27)

**Note:** Version bump only for package @nextgis/ngw-maplibre-gl





# [2.4.0](https://github.com/nextgis/nextgis_frontend/compare/v2.3.0...v2.4.0) (2024-06-10)

**Note:** Version bump only for package @nextgis/ngw-maplibre-gl





# [2.3.0](https://github.com/nextgis/nextgis_frontend/compare/v2.2.3...v2.3.0) (2024-06-07)

**Note:** Version bump only for package @nextgis/ngw-maplibre-gl





## [2.2.3](https://github.com/nextgis/nextgis_frontend/compare/v2.2.2...v2.2.3) (2024-05-06)

**Note:** Version bump only for package @nextgis/ngw-maplibre-gl





## [2.2.1](https://github.com/nextgis/nextgis_frontend/compare/v2.2.0...v2.2.1) (2024-04-24)

**Note:** Version bump only for package @nextgis/ngw-maplibre-gl





## [2.1.1](https://github.com/nextgis/nextgis_frontend/compare/v2.1.0...v2.1.1) (2024-04-07)

**Note:** Version bump only for package @nextgis/ngw-maplibre-gl





# [2.1.0](https://github.com/nextgis/nextgis_frontend/compare/v2.0.3...v2.1.0) (2024-04-03)

**Note:** Version bump only for package @nextgis/ngw-maplibre-gl





## [2.0.2](https://github.com/nextgis/nextgis_frontend/compare/v2.0.1...v2.0.2) (2024-03-20)


### chore

* handling of third-party map libraries dependencies ([3c38499](https://github.com/nextgis/nextgis_frontend/commit/3c384996ada1f818f52fc02a77d3b2e812d5681c))


### BREAKING CHANGES

* For integration with different mapping libraries, the relevant npm packages must now be installed manually:  use `ol` for @nextgis/ngw-ol; `leaflet` for @nextgis/ngw-leaflet and `maplibre-gl` for @nextgis/ngw-maplibre-gl





# [2.0.0](https://github.com/nextgis/nextgis_frontend/compare/v2.0.0-alpha.2...v2.0.0) (2024-03-19)

**Note:** Version bump only for package @nextgis/ngw-maplibre-gl





# [2.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v2.0.0-alpha.0...v2.0.0-alpha.2) (2024-03-15)

**Note:** Version bump only for package @nextgis/ngw-maplibre-gl





# [2.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v2.0.0-alpha.0...v2.0.0-alpha.1) (2024-03-13)

**Note:** Version bump only for package @nextgis/ngw-maplibre-gl





# [2.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v1.19.5...v2.0.0-alpha.0) (2024-03-04)


### Code Refactoring

* rename mapbox to maplibre in library names and imports ([b43f93d](https://github.com/nextgis/nextgis_frontend/commit/b43f93d600dedd932b5f6e8dec1489044337b438))


### BREAKING CHANGES

* @nextgis/mapboxgl-map-adapter -> @nextgis/maplibre-gl-map-adapter
* @nextgis/ngw-mapbox -> @nextgis/ngw-maplibre-gl
* @nextgis/react-ngw-mapbox -> @nextgis/react-ngw-maplibre-gl
* In various modules, imports of MapboxglMapAdapter and related types have been updated to their MaplibreGLMapAdapter equivalents.
