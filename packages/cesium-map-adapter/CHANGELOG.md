# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)


### Bug Fixes

* remove require imports ([be789b8](https://github.com/nextgis/nextgis_frontend/commit/be789b89f39741efe146da97eeb19460a7cca527))





# [1.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)

**Note:** Version bump only for package @nextgis/cesium-map-adapter





# [1.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)

**Note:** Version bump only for package @nextgis/cesium-map-adapter





# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)


### Bug Fixes

* **cesium:** fix Tilset3D setHeight ([fb95256](https://github.com/nextgis/nextgis_frontend/commit/fb952565adb2734ec4a40df2c955ad51cec90c54))
* **vuetify:** update items on init ([03f78ed](https://github.com/nextgis/nextgis_frontend/commit/03f78ed98e74fc2eb005085f1fce30b3a957ece5))


### Code Refactoring

* rename layerAdapter baseLayer option to baselayer ([368d657](https://github.com/nextgis/nextgis_frontend/commit/368d6576278505ddddde2a1ab160a0849e087c70))


### Features

* **cesium:** add maximumScreenSpaceError option for tilset3d adapter ([c82c524](https://github.com/nextgis/nextgis_frontend/commit/c82c52452765b2e764f6c3d42bc3522bd36a4258))
* **cesium:** set custom logo ([bd05fd3](https://github.com/nextgis/nextgis_frontend/commit/bd05fd3f6e34e9cd7e38bbfe5bd1941583ef8fe8))
* **webmap:** add special MapAdapterOptions option to MapOptions ([e3dd2ec](https://github.com/nextgis/nextgis_frontend/commit/e3dd2eceb5b63bf7c19791deacd72b2e047a74f8))
* **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([430d51e](https://github.com/nextgis/nextgis_frontend/commit/430d51e7211c050ebeffd68b0c839d9a38170054))


### BREAKING CHANGES

* LayerAdapter option baseLayer was renamed to baselayer;
* webMap.getBaseLayers() method now return LayerAdapter, not string array of ids





# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)


### Bug Fixes

* **cesium:** fitBounds for not Scene3D modes ([8fa4155](https://github.com/nextgis/nextgis_frontend/commit/8fa41559f506a7a41372e0f0e497e215fc0f85f5))
* **cesium:** geojson terrainsample ([308d3d3](https://github.com/nextgis/nextgis_frontend/commit/308d3d352110f9496dded2464c78c663bab7a03b))
* **cesium:** Tileset#DAdapter set terrain height ([790760f](https://github.com/nextgis/nextgis_frontend/commit/790760f0b8b90b9c9d572640612cfc00dabfd5d5))
* **vuetify:** correction for set empty BasemapSelect text ([8ab35e4](https://github.com/nextgis/nextgis_frontend/commit/8ab35e426f9333391c746849c0d2316e2cb62ec3))
* **vuetify:** NgwLayersList root item hide ([abba8cb](https://github.com/nextgis/nextgis_frontend/commit/abba8cbd8a46697ba37a768bd2576086591c344c))


### Features

* **cesium:** implement getCenter ([ea83d8e](https://github.com/nextgis/nextgis_frontend/commit/ea83d8ebd8972123ba0991388e4e53fce91b077e))
* **cesium:** skipLevelOfDetail by default ([7429870](https://github.com/nextgis/nextgis_frontend/commit/7429870fb31231fc26298240d665c4ac840f618a))
* **cesium:** tilset 3d adapter height options ([02973bf](https://github.com/nextgis/nextgis_frontend/commit/02973bfcacb6bde3b7d4e23fdd190d0e81536f57))
* **cesium:** update layer and map adapter ([c9d6a1d](https://github.com/nextgis/nextgis_frontend/commit/c9d6a1db8874586adb5ae1901153e71313aa776b))
* **ngw-kit:** add NgwKit.utils.getCompanyLogo method ([3c6fa09](https://github.com/nextgis/nextgis_frontend/commit/3c6fa09321c0e979543b50b93c32da8725920d28))
* **webmap:** zoomIn and zoomOut MapAdapter optional methods ([70b807f](https://github.com/nextgis/nextgis_frontend/commit/70b807fd1d157b5505a3d815f24a02fbb1fff6a6))





# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)


### Bug Fixes

* **cesium:** GeoJsonAdapter pin color from empty string ([13ef825](https://github.com/nextgis/nextgis_frontend/commit/13ef8258afad19709cf00a055bb772f425542d1a))
* **cesium:** scene requestRender on layers visibility change ([e513a57](https://github.com/nextgis/nextgis_frontend/commit/e513a573af14660750337e951da84387fab433c2))
* **ngw-kit:** create async adapter from parent resource ([808572b](https://github.com/nextgis/nextgis_frontend/commit/808572b5aff6b04783cd7e9edd078e2ea5404dd2))
* **ngw-kit:** resolve createGeoJsonAdapter options override II ([c65f1ee](https://github.com/nextgis/nextgis_frontend/commit/c65f1eeb2dd0974980c70455d142dba427081521))


### Features

* **cesium:** add Tileset3dAdapter ([c5306f9](https://github.com/nextgis/nextgis_frontend/commit/c5306f9b8bb3e37f287cbd4e3d33a04d93478e2b))
* **cesium:** change layers height on terrain change ([609ac9d](https://github.com/nextgis/nextgis_frontend/commit/609ac9ddae60eb3ac9085c9f29fa93f3aa5b13b4))
* **cesium:** extrude3d paint option ([c4ce679](https://github.com/nextgis/nextgis_frontend/commit/c4ce679cd15bbc87e362048dc007a85ce42516fd))
* **cesium:** fitBounds up tp terrain ([e890d9b](https://github.com/nextgis/nextgis_frontend/commit/e890d9b5ce449dc69c8b531c33b9ce6cb58b10b4))
* **cesium:** get extent of tileset3D ([017a69a](https://github.com/nextgis/nextgis_frontend/commit/017a69afa63cec3f2b1773fb643557a2a88fa363))
* **cesium:** set scene view from new adapter option ([c35e16d](https://github.com/nextgis/nextgis_frontend/commit/c35e16ded6036fccb2edb852bebd68f41fc899eb))
* **ngw-kit:** add addLayerOptionsPriority for createGeoJsonAdapter ([f6c563e](https://github.com/nextgis/nextgis_frontend/commit/f6c563e1bc1238206bb4ba3d8081971d078ef54d))
* **ngw-kit:** make create basemap layer adapter universal ([bbd8c9a](https://github.com/nextgis/nextgis_frontend/commit/bbd8c9a77d527921909ae9b1bf10b3580c5fa600))





## [0.30.2](https://github.com/nextgis/nextgis_frontend/compare/v0.30.1...v0.30.2) (2020-04-30)

**Note:** Version bump only for package @nextgis/cesium-map-adapter





## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)


### Bug Fixes

* **cesium:** cesium geojson layer style ([5f6e439](https://github.com/nextgis/nextgis_frontend/commit/5f6e43937bb9397237c43abccce5889a710716fb))


### Features

* **cesium:** add scale and rotate for 3d model adapter ([c6c67c1](https://github.com/nextgis/nextgis_frontend/commit/c6c67c16356a08a434f9f5482d8fa6bc0b693091))
* **webmap:** update layer adapter options ([b0262ef](https://github.com/nextgis/nextgis_frontend/commit/b0262eff0db1ee56192bb410e8e1128cdc8b167b))





# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)

**Note:** Version bump only for package @nextgis/cesium-map-adapter





## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)

**Note:** Version bump only for package @nextgis/cesium-map-adapter





## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)

**Note:** Version bump only for package @nextgis/cesium-map-adapter





## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)


### Bug Fixes

* **cesium:** remove default imagery provider ([cb7d7d2](https://github.com/nextgis/nextgis_frontend/commit/cb7d7d290bf3ebc58eebbdb978150a7e7fff7ace))





## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

**Note:** Version bump only for package @nextgis/cesium-map-adapter





## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

**Note:** Version bump only for package @nextgis/cesium-map-adapter





## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)


### Bug Fixes

* **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))





# [0.29.0](https://github.com/nextgis/nextgis_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)


### chore

* build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))


### BREAKING CHANGES

* code formatting rules changed to prettier 2.0 compatibility





## [0.28.3](https://github.com/nextgis/nextgis_frontend/compare/v0.28.2...v0.28.3) (2020-03-19)


### Features

* **cesium:** pin paint implementation for geojson layer ([7fadb6d](https://github.com/nextgis/nextgis_frontend/commit/7fadb6d6f6a7ae8dfc0449ded1c1595ebba476ed))
* **ngw:** option to create popup content from item ([3c4a809](https://github.com/nextgis/nextgis_frontend/commit/3c4a809dc7cd9045e3ed1622b1eea0036e5205a1))
* add library `@nextgis/paint` ([99391ec](https://github.com/nextgis/nextgis_frontend/commit/99391ec1ac9fd80508816417d9eb2ae0fd734340))





## [0.28.2](https://github.com/nextgis/nextgis_frontend/compare/v0.28.1...v0.28.2) (2020-03-12)

**Note:** Version bump only for package @nextgis/cesium-map-adapter





## [0.28.1](https://github.com/nextgis/nextgis_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package @nextgis/cesium-map-adapter





# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)


### Features

* **cesium:** geojson adapter paint ([657b411](https://github.com/nextgis/nextgis_frontend/commit/657b411f1efb9835ff9f9255c47424179e3b3caa))





## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)


### Features

* new @nextgis/dom library ([82a645d](https://github.com/nextgis/nextgis_frontend/commit/82a645d213d0b9ef1bb3c443dc28a94866c2884b))
* **control:** add universal zoom control ([1ffc089](https://github.com/nextgis/nextgis_frontend/commit/1ffc089942f1709f82cec8398d301503819be718))
* add new library `ControlContainer` ([e68afeb](https://github.com/nextgis/nextgis_frontend/commit/e68afeb5efb1e40bf20df2effa805fe80c437478))
* **cesium:** add mapAdapter listeners and getBounds method ([3033475](https://github.com/nextgis/nextgis_frontend/commit/3033475bc1cc519efe08f18e9e741750d35a0f25))





# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)

**Note:** Version bump only for package @nextgis/cesium-map-adapter





# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)

**Note:** Version bump only for package @nextgis/cesium-map-adapter





## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/cesium-map-adapter





## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)


### Bug Fixes

* **qms-kit:** mix layerAdapter class property ([5bae578](https://github.com/nextgis/nextgis_frontend/commit/5bae5787174a03ebe9560152dd54576eea77448d))





## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)


### Bug Fixes

* **qms-kit:** mix layerAdapter class property ([5bae578](https://github.com/nextgis/nextgis_frontend/commit/5bae5787174a03ebe9560152dd54576eea77448d))





## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)

**Note:** Version bump only for package @nextgis/cesium-map-adapter
