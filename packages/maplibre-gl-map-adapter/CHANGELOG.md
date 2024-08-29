# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0-alpha.4](https://github.com/nextgis/nextgis_frontend/compare/v3.0.0-alpha.3...v3.0.0-alpha.4) (2024-08-29)


### Features

* implement update layer with params ([d5354dd](https://github.com/nextgis/nextgis_frontend/commit/d5354dd6af335e8b1e23e2009c5d257b7713d424))





# [3.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v3.0.0-alpha.2...v3.0.0-alpha.3) (2024-07-30)

**Note:** Version bump only for package @nextgis/maplibre-gl-map-adapter





# [3.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v3.0.0-alpha.0...v3.0.0-alpha.1) (2024-07-09)


### Features

* add withCredentials option ([25eb6b1](https://github.com/nextgis/nextgis_frontend/commit/25eb6b1d7fba6b4eeb1be978f7d0c31d0024eb26))





# [3.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v2.4.1...v3.0.0-alpha.0) (2024-07-09)


### Bug Fixes

* **maplibre-gl-map-adapter:** fix geojson adapter select feature method ([e5b09d1](https://github.com/nextgis/nextgis_frontend/commit/e5b09d1c8e5fe606c7d6cecea731174d5d5852a6))


### Features

* **maplibre-gl-map-adapter:** implement feature select and unselect ([2c0cfd7](https://github.com/nextgis/nextgis_frontend/commit/2c0cfd78938ccafa67d8019ce0be7250ec3a14d6))





# [2.3.0](https://github.com/nextgis/nextgis_frontend/compare/v2.2.3...v2.3.0) (2024-06-07)

**Note:** Version bump only for package @nextgis/maplibre-gl-map-adapter





## [2.2.3](https://github.com/nextgis/nextgis_frontend/compare/v2.2.2...v2.2.3) (2024-05-06)


### Features

* **maplibre-gl-map-adapter:** implement layer dblclick event ([3918901](https://github.com/nextgis/nextgis_frontend/commit/39189011646aa10ea82b2aae834a5d92a8d6325d))





# [2.1.0](https://github.com/nextgis/nextgis_frontend/compare/v2.0.3...v2.1.0) (2024-04-03)


### Bug Fixes

* **maplibre-gl-map-adapter:** getZoom method for zero level ([944428d](https://github.com/nextgis/nextgis_frontend/commit/944428d2d74f37636ad48d50096163dfd1ef1b79))





## [2.0.2](https://github.com/nextgis/nextgis_frontend/compare/v2.0.1...v2.0.2) (2024-03-20)


### chore

* handling of third-party map libraries dependencies ([3c38499](https://github.com/nextgis/nextgis_frontend/commit/3c384996ada1f818f52fc02a77d3b2e812d5681c))


### BREAKING CHANGES

* For integration with different mapping libraries, the relevant npm packages must now be installed manually:  use `ol` for @nextgis/ngw-ol; `leaflet` for @nextgis/ngw-leaflet and `maplibre-gl` for @nextgis/ngw-maplibre-gl





# [2.0.0](https://github.com/nextgis/nextgis_frontend/compare/v2.0.0-alpha.2...v2.0.0) (2024-03-19)

**Note:** Version bump only for package @nextgis/maplibre-gl-map-adapter





# [2.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v2.0.0-alpha.0...v2.0.0-alpha.2) (2024-03-15)

**Note:** Version bump only for package @nextgis/maplibre-gl-map-adapter





# [2.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v2.0.0-alpha.0...v2.0.0-alpha.1) (2024-03-13)

**Note:** Version bump only for package @nextgis/maplibre-gl-map-adapter





# [2.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v1.19.5...v2.0.0-alpha.0) (2024-03-04)


### Code Refactoring

* rename mapbox to maplibre in library names and imports ([b43f93d](https://github.com/nextgis/nextgis_frontend/commit/b43f93d600dedd932b5f6e8dec1489044337b438))


### BREAKING CHANGES

* @nextgis/mapboxgl-map-adapter -> @nextgis/maplibre-gl-map-adapter
* @nextgis/ngw-mapbox -> @nextgis/ngw-maplibre-gl
* @nextgis/react-ngw-mapbox -> @nextgis/react-ngw-maplibre-gl
* In various modules, imports of MapboxglMapAdapter and related types have been updated to their MaplibreGLMapAdapter equivalents.
