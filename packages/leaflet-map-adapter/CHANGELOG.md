# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.16.8 (2023-05-14)


### Bug Fixes

* **build:** control-container extract css ([a02d24b](https://github.com/nextgis/nextgis_frontend/commit/a02d24bf2dbe246420803d5d1be9348e4b647c6d))
* **leafelet-map-adapter:** safe make remote options ([c84e1ae](https://github.com/nextgis/nextgis_frontend/commit/c84e1ae4414a4d2e2d23e04bd4e6eeab2da6dcb2))
* **leafelt-map-adapter:** selected layer click event param ([aab6ed5](https://github.com/nextgis/nextgis_frontend/commit/aab6ed56037fc132f5b421206ac78ad626a7b3e9))
* **leaflet-map-adapter:** add getBounds validation ([cbbfcde](https://github.com/nextgis/nextgis_frontend/commit/cbbfcde5f61ba8c56cf5a53a71a90da31126b5d2))
* **leaflet-map-adapter:** fix BaseAdapter pane zIndex set ([bd26273](https://github.com/nextgis/nextgis_frontend/commit/bd262733470962e77612e152bbaf9f5d95d3f2ab))
* **leaflet-map-adapter:** geojson selection ([d260db5](https://github.com/nextgis/nextgis_frontend/commit/d260db579912644fdb641a72e930df3575df566b))
* **leaflet-map-adapter:** init center option ([32793bf](https://github.com/nextgis/nextgis_frontend/commit/32793bf237c404232cf4056ab9f6ec35eeb73d12))
* **leaflet-map-adapter:** maxBounds hotfix ([7e51591](https://github.com/nextgis/nextgis_frontend/commit/7e5159150552826907ec6119007b690d834d5a0e))
* **leaflet-map-adapter:** popup content height ([1ff49ca](https://github.com/nextgis/nextgis_frontend/commit/1ff49ca467183f14f75e607a9eb06a6b28980eec))
* **leaflet-map-adapter:** repain unSelectOnSecondClick ([1460de0](https://github.com/nextgis/nextgis_frontend/commit/1460de0c7e8fa671ff3a2c0e7dd47e4a6cd18954))
* **leaflet-map-adapter:** resolve geojson adapter layerdefinition problem ([a1918e6](https://github.com/nextgis/nextgis_frontend/commit/a1918e6fef02a061102b70b1e5bd8b0db40c32b6))
* **leaflet-map-adapter:** return zero from getZoom ([4dfbcfb](https://github.com/nextgis/nextgis_frontend/commit/4dfbcfb3fe8fe0e359d1fd27385729b6b64c475c))
* **leaflet:** RemoteTileLayer mixin removeTile method ([b285a72](https://github.com/nextgis/nextgis_frontend/commit/b285a720981910f32eb82a99b95384ba1b351b4a))
* **leaflet:** remove forgotten console logs ([f02b571](https://github.com/nextgis/nextgis_frontend/commit/f02b57198108f86a8869ba4e46fd28224808d1f5))
* **ngw-connector:** fixes to apiRequest cancel work ([e4451d8](https://github.com/nextgis/nextgis_frontend/commit/e4451d8a7ad349ba17692a3f906677f1a29bf691)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
* **ngw-kit:** create async adapter from parent resource ([5ce6394](https://github.com/nextgis/nextgis_frontend/commit/5ce6394c4d9313c79f6d540df0b1683648a6af83))
* provide support for map preclick event ([c7b7f66](https://github.com/nextgis/nextgis_frontend/commit/c7b7f662f6e0507cf20fb8a43e4bb22547c9b18b)), closes [#8](https://github.com/nextgis/nextgis_frontend/issues/8)
* **webmap:** disable experimental left and right control positions ([7658504](https://github.com/nextgis/nextgis_frontend/commit/765850439199c5bd6bc961245ba8558111513132))
* **webmap:** set zero zoom ([fe61b84](https://github.com/nextgis/nextgis_frontend/commit/fe61b846f95534a657a23d8fa883ac1ac4a13d94))
* **webmap:** webmap constructor options ([e096e72](https://github.com/nextgis/nextgis_frontend/commit/e096e723d76b8db753ecdd0248b601f24fcb5026))


### chore

* build; eslint ([ee1e03d](https://github.com/nextgis/nextgis_frontend/commit/ee1e03d85625b02a09c2ee1e4d66007fbf57d626))


### Code Refactoring

* rename layerAdapter baseLayer option to baselayer ([e5c595d](https://github.com/nextgis/nextgis_frontend/commit/e5c595d6df24b1b22906ad1e06eb60bf0327e9c0))
* **webmap:** change default paint ([e0325e9](https://github.com/nextgis/nextgis_frontend/commit/e0325e9edf723b0f6e612cf67e2b6c4cff14c06d))


### Features

* add BBOX+ strategy; extends options for setView ([309b697](https://github.com/nextgis/nextgis_frontend/commit/309b697e141adf6eedeb85c87b6fa89b9b629c13))
* add getExtent method for all mapAdapters GeoJsonLayerAdapter ([7e8010f](https://github.com/nextgis/nextgis_frontend/commit/7e8010f7d5579f2b7909a31a2073479de1faa6a5))
* add library `@nextgis/paint` ([0f72300](https://github.com/nextgis/nextgis_frontend/commit/0f723006c722cc0e183a3c2dcfe7b2366e63cd96))
* add nativeOptions for alladdLayer adapter methods ([c98568f](https://github.com/nextgis/nextgis_frontend/commit/c98568f1f122fc67fdfc911500aa2c509149e293))
* add setViewDelay options to control map update ([a83e5ab](https://github.com/nextgis/nextgis_frontend/commit/a83e5ab9ed6207e0a41fd31a3c56cd14a512c50d))
* add WmsLayerAdapter ([aec0ce1](https://github.com/nextgis/nextgis_frontend/commit/aec0ce15ddb5292b6334833bcab8812400815d0b))
* **cancelable-promise:** шьзкщму PromisesControl ([e68b127](https://github.com/nextgis/nextgis_frontend/commit/e68b127779e7da634225cec6354198c67ecae874))
* **cesium:** add maximumScreenSpaceError option for tilset3d adapter ([bfb0a65](https://github.com/nextgis/nextgis_frontend/commit/bfb0a65171d44a3d32c012170ef56480f3d3566b))
* **control:** add universal zoom control ([d1371be](https://github.com/nextgis/nextgis_frontend/commit/d1371be1f88085dcfc864de31a7d4d89f2690216))
* handle vector layer mouse over and out events ([1f537c2](https://github.com/nextgis/nextgis_frontend/commit/1f537c277b433db365b319d4bbdfb26aa44528fd))
* improve geojson adapter multiselect ([2c9c01c](https://github.com/nextgis/nextgis_frontend/commit/2c9c01c42757c87c4d588e97802f8d2626c5b078))
* improve popup, add new options, ol support ([e3ea91b](https://github.com/nextgis/nextgis_frontend/commit/e3ea91b91d03a4cef471c5c92a09a7fa0640b90a))
* **leaflet-map-adapter:** add position to vector adapter layers definition ([053ccf0](https://github.com/nextgis/nextgis_frontend/commit/053ccf05ed8d9d76592c8ca648365e176c609277))
* **leaflet-map-adapter:** change geojson layer opacity ([9862e2d](https://github.com/nextgis/nextgis_frontend/commit/9862e2de02efeef0bc55102ecdac942d0687f036))
* **leaflet-map-adapter:** label redraw on map position change ([b8c926e](https://github.com/nextgis/nextgis_frontend/commit/b8c926eb0109aa4e155097c23d436de891a4fc11))
* **leaflet-map-adapter:** setMinZoom on maxExtent ([5e16191](https://github.com/nextgis/nextgis_frontend/commit/5e16191f7b81a29b41b2c6873cb33ccd0e84afea))
* **mapbox-map-adapter:** GeoJson layer label workaround ([6c73629](https://github.com/nextgis/nextgis_frontend/commit/6c736293bf498591d27fc050848503802e9da94e))
* **mapboxgl-map-adapter:** add popup for selected feature ([bf7ee99](https://github.com/nextgis/nextgis_frontend/commit/bf7ee994ba4307c2a85bc28c985198f000c463de))
* **ngw-kit:** add toGeojson in ngw layer item response ([0af64ad](https://github.com/nextgis/nextgis_frontend/commit/0af64ad1f907996f357a2355a35597319ec4bb0a))
* **ngw-kit:** default WebmapLayerAdapter basemap ([12aba63](https://github.com/nextgis/nextgis_frontend/commit/12aba63a37fc75cbaed2ed0be478cc5172149190))
* **ngw-map:** default bounds; add mapOption for show osm baselayer ([b376198](https://github.com/nextgis/nextgis_frontend/commit/b376198b1b9038899a6ec46ed97e443d9f591365))
* **ngw-orm:** vector layer payload for update ([6aa85ca](https://github.com/nextgis/nextgis_frontend/commit/6aa85ca022a0eed425c976857bd7a37b89f64c52))
* **react:** add react map toggle control component ([41421e5](https://github.com/nextgis/nextgis_frontend/commit/41421e5d22e14432bc27d0110cf2150297520ce3))
* remove default MarkerLayerAdapter ([7596ec9](https://github.com/nextgis/nextgis_frontend/commit/7596ec9f86b20ce399248adc233c0a2e041da63c))
* **url-runtime-params:** remove trailing sharp from hash ([3c0d8c7](https://github.com/nextgis/nextgis_frontend/commit/3c0d8c75c781b66a4752ca9c49bde7acfc231ba8))
* **util:** add keyInObj typescript helper ([a978aac](https://github.com/nextgis/nextgis_frontend/commit/a978aacd3e28a5e0cc8ff5136e442d3324d67b33))
* **utils:** add `arrayCompareStrict` function ([b647b10](https://github.com/nextgis/nextgis_frontend/commit/b647b10f6363462261ff13df9fcefc5cb377fdac))
* **utils:** add flatten and unflatten functions ([9584ccb](https://github.com/nextgis/nextgis_frontend/commit/9584ccbeaa2b384ac0699c0f47be3cd97ae75d6c))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([bcea6c3](https://github.com/nextgis/nextgis_frontend/commit/bcea6c35e61f6ba2aab0b25eb30da9f5f719c92e))
* **webmap:** add map mouse move events ([c50638c](https://github.com/nextgis/nextgis_frontend/commit/c50638ccefad63e9b21416e922ea0d4c33fc1adf))
* **webmap:** add MapAdapter map options ([15e3c50](https://github.com/nextgis/nextgis_frontend/commit/15e3c50eb61c8457e9695e527274beb6cf751a6a))
* **webmap:** add setLayerPaint method ([3cadfbf](https://github.com/nextgis/nextgis_frontend/commit/3cadfbfac802c19ad0e981e944be69a07f548414))
* **webmap:** getZoom return number or fail ([08df46d](https://github.com/nextgis/nextgis_frontend/commit/08df46dd1028743e6c9596e079db19b60c209eb4))
* **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([928d351](https://github.com/nextgis/nextgis_frontend/commit/928d351fea9a321c178ecbb4e03a70bd9a64fc90))
* **webmap:** paint from expressions ([fb492d1](https://github.com/nextgis/nextgis_frontend/commit/fb492d1bab2cbd8b64944cccd52565b24efd06aa))
* **webmap:** paint from properties filter ([64ba0f7](https://github.com/nextgis/nextgis_frontend/commit/64ba0f7d957c2a902691e7245276b8f78356586c))
* **webmap:** remove control from promise ([314b5c1](https://github.com/nextgis/nextgis_frontend/commit/314b5c10168c82c3531072779ea5f3785015d6cb))


### Performance Improvements

* **leaflet:** abort image overlay request on view change ([4587532](https://github.com/nextgis/nextgis_frontend/commit/45875328ba48453ce5fcbe730cfa4fbd12633d2c))
* **leaflet:** abort xhr tile loading on setView ([9505841](https://github.com/nextgis/nextgis_frontend/commit/9505841c1b7a458b3148c457753ec4946bcd89e1))
* **leaflet:** setViewDelay for tile layer ([3712825](https://github.com/nextgis/nextgis_frontend/commit/371282587521961c043fff404dd9b5e474e6c2e5))


### wip

* rename VectorLayerAdapterType ([726ab7d](https://github.com/nextgis/nextgis_frontend/commit/726ab7dd7cd112750165a9e15c5672086cd8261a))


### BREAKING CHANGES

* **webmap:** webMap.getZoom() do not return undefined more; number or fail
* **webmap:** changed the default paint: the fill is semi-transparent, add stroke
* LayerAdapter option baseLayer was renamed to baselayer;
* webMap.getBaseLayers() method now return LayerAdapter, not string array of ids
* rename VectorLayerAdapter types: circle > point; fill > polygon
* code formatting rules changed to prettier 2.0 compatibility
* **webmap:** New Paint specification may cause problems with types
* MARKER layer adapter has been removed. Use ddLayer('GEOJSON', {data}) instead of ddLayer('MARKER', {lngLat})





## [1.16.7](https://github.com/nextgis/nextgis_frontend/compare/v1.16.6...v1.16.7) (2023-04-21)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter





## [1.16.6](https://github.com/nextgis/nextgis_frontend/compare/v1.16.5...v1.16.6) (2023-02-09)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [1.16.5](https://github.com/nextgis/nextgis_frontend/compare/v1.16.4...v1.16.5) (2023-02-09)

### Bug Fixes

- **leaflet-map-adapter:** return zero from getZoom ([975ec78](https://github.com/nextgis/nextgis_frontend/commit/975ec784366e34a8779fd6aa72c5ebfe4f2ca6c7))

## [1.16.2](https://github.com/nextgis/nextgis_frontend/compare/v1.16.1...v1.16.2) (2022-09-15)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [1.16.1](https://github.com/nextgis/nextgis_frontend/compare/v1.16.0...v1.16.1) (2022-09-03)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.16.0](https://github.com/nextgis/nextgis_frontend/compare/v1.15.1...v1.16.0) (2022-08-28)

### Features

- improve geojson adapter multiselect ([30a3223](https://github.com/nextgis/nextgis_frontend/commit/30a32237411b60d03246bdc8efe292295ffcef44))

## [1.15.1](https://github.com/nextgis/nextgis_frontend/compare/v1.15.0...v1.15.1) (2022-08-02)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.15.0](https://github.com/nextgis/nextgis_frontend/compare/v1.14.0...v1.15.0) (2022-07-27)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.14.0](https://github.com/nextgis/nextgis_frontend/compare/v1.13.8...v1.14.0) (2022-07-05)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [1.13.8](https://github.com/nextgis/nextgis_frontend/compare/v1.13.7...v1.13.8) (2022-06-25)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [1.13.6](https://github.com/nextgis/nextgis_frontend/compare/v1.13.5...v1.13.6) (2022-06-05)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [1.13.3](https://github.com/nextgis/nextgis_frontend/compare/v1.13.2...v1.13.3) (2022-05-31)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [1.13.2](https://github.com/nextgis/nextgis_frontend/compare/v1.13.1...v1.13.2) (2022-05-30)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.13.0](https://github.com/nextgis/nextgis_frontend/compare/v1.12.1...v1.13.0) (2022-05-13)

### Features

- **webmap:** add MapAdapter map options ([a6b48a4](https://github.com/nextgis/nextgis_frontend/commit/a6b48a499122e184ec01ad626c97f6f48b7e3984))

## [1.12.1](https://github.com/nextgis/nextgis_frontend/compare/v1.12.0...v1.12.1) (2022-04-21)

### Features

- **webmap:** add map mouse move events ([2a2eba3](https://github.com/nextgis/nextgis_frontend/commit/2a2eba3c2a582093386189106d3bb456c5eb85c0))

# [1.12.0](https://github.com/nextgis/nextgis_frontend/compare/v1.11.10...v1.12.0) (2022-03-05)

### Features

- **react:** add react map toggle control component ([95a9639](https://github.com/nextgis/nextgis_frontend/commit/95a9639fb39d0a6dcf9db9d647d22f1bcbd0acfa))

## [1.11.10](https://github.com/nextgis/nextgis_frontend/compare/v1.11.9...v1.11.10) (2022-01-20)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [1.11.7](https://github.com/nextgis/nextgis_frontend/compare/v1.11.6...v1.11.7) (2022-01-11)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.11.0](https://github.com/nextgis/nextgis_frontend/compare/v1.10.0...v1.11.0) (2021-12-19)

### Features

- **leaflet-map-adapter:** setMinZoom on maxExtent ([56cf3b6](https://github.com/nextgis/nextgis_frontend/commit/56cf3b6eed50f9b6d8c78a21e733eb015bd67712))

# [1.10.0](https://github.com/nextgis/nextgis_frontend/compare/v1.9.7...v1.10.0) (2021-11-30)

### Features

- **webmap:** add setLayerPaint method ([b1ddac5](https://github.com/nextgis/nextgis_frontend/commit/b1ddac5140670aba4f40f0861d6792065653c508))

## [1.9.4](https://github.com/nextgis/nextgis_frontend/compare/v1.9.3...v1.9.4) (2021-11-16)

### Bug Fixes

- **leafelt-map-adapter:** selected layer click event param ([751427a](https://github.com/nextgis/nextgis_frontend/commit/751427ac854a940b4d7caccb4ad602fab89133ac))

## [1.9.2](https://github.com/nextgis/nextgis_frontend/compare/v1.9.1...v1.9.2) (2021-10-26)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [1.9.1](https://github.com/nextgis/nextgis_frontend/compare/v1.9.0...v1.9.1) (2021-10-25)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.9.0](https://github.com/nextgis/nextgis_frontend/compare/v1.8.5...v1.9.0) (2021-10-23)

### Features

- add BBOX+ strategy; extends options for setView ([88e9d09](https://github.com/nextgis/nextgis_frontend/commit/88e9d092bcc3615b99bad13d175f62be3ff73725))
- **webmap:** getZoom return number or fail ([accc46a](https://github.com/nextgis/nextgis_frontend/commit/accc46a53d1a074b32d4ef5aa41ca2f9df07caaf))

### BREAKING CHANGES

- **webmap:** webMap.getZoom() do not return undefined more; number or fail

## [1.8.4](https://github.com/nextgis/nextgis_frontend/compare/v1.8.3...v1.8.4) (2021-10-21)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [1.8.3](https://github.com/nextgis/nextgis_frontend/compare/v1.8.2...v1.8.3) (2021-10-12)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [1.8.2](https://github.com/nextgis/nextgis_frontend/compare/v1.8.1...v1.8.2) (2021-10-05)

### Bug Fixes

- **leaflet-map-adapter:** add getBounds validation ([e9657a2](https://github.com/nextgis/nextgis_frontend/commit/e9657a2cbb5a9b4db017c8ed4bdcccb2fad54676))
- **leaflet-map-adapter:** popup content height ([4072c3c](https://github.com/nextgis/nextgis_frontend/commit/4072c3c12becf1dd2d537844a5046e670e6718be))

## [1.8.1](https://github.com/nextgis/nextgis_frontend/compare/v1.8.0...v1.8.1) (2021-09-23)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.8.0](https://github.com/nextgis/nextgis_frontend/compare/v1.7.0...v1.8.0) (2021-09-22)

### Features

- add nativeOptions for alladdLayer adapter methods ([c99d06e](https://github.com/nextgis/nextgis_frontend/commit/c99d06e35c5884b5969b281c98bd3742d6f427ef))

# [1.7.0](https://github.com/nextgis/nextgis_frontend/compare/v1.6.0...v1.7.0) (2021-09-16)

### Features

- **leaflet-map-adapter:** add position to vector adapter layers definition ([61cb7a5](https://github.com/nextgis/nextgis_frontend/commit/61cb7a591ed3ececcabed710abf1e0aec6708c1b))

# [1.6.0](https://github.com/nextgis/nextgis_frontend/compare/v1.5.1...v1.6.0) (2021-09-09)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [1.5.1](https://github.com/nextgis/nextgis_frontend/compare/v1.5.0...v1.5.1) (2021-09-06)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.5.0](https://github.com/nextgis/nextgis_frontend/compare/v1.4.0...v1.5.0) (2021-08-19)

### Features

- **leaflet-map-adapter:** change geojson layer opacity ([3d75fb2](https://github.com/nextgis/nextgis_frontend/commit/3d75fb2f20d0759839dcaa7650c10740a1f35d22))

# [1.4.0](https://github.com/nextgis/nextgis_frontend/compare/v1.3.0...v1.4.0) (2021-08-17)

### Bug Fixes

- **leaflet-map-adapter:** repain unSelectOnSecondClick ([c2c0cab](https://github.com/nextgis/nextgis_frontend/commit/c2c0cab0302dc80fc776b9f27c778f18de148c77))

# [1.3.0](https://github.com/nextgis/nextgis_frontend/compare/v1.2.8...v1.3.0) (2021-08-06)

### Bug Fixes

- **webmap:** disable experimental left and right control positions ([c8c6fb7](https://github.com/nextgis/nextgis_frontend/commit/c8c6fb73c33985b19ecfc908f7d25d6a2f23d778))

### Features

- improve popup, add new options, ol support ([75e73fa](https://github.com/nextgis/nextgis_frontend/commit/75e73faac7f393d0c62f9966786da78c7f54c039))

## [1.2.8](https://github.com/nextgis/nextgis_frontend/compare/v1.2.7...v1.2.8) (2021-07-27)

### Bug Fixes

- **leaflet-map-adapter:** geojson selection ([1022e71](https://github.com/nextgis/nextgis_frontend/commit/1022e71d46f5513f0ff3a60f4be7d96a84ff4f15))

## [1.2.7](https://github.com/nextgis/nextgis_frontend/compare/v1.2.6...v1.2.7) (2021-07-26)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [1.2.6](https://github.com/nextgis/nextgis_frontend/compare/v1.2.5...v1.2.6) (2021-07-23)

### Bug Fixes

- **leaflet-map-adapter:** resolve geojson adapter layerdefinition problem ([071fd5a](https://github.com/nextgis/nextgis_frontend/commit/071fd5ae4f0e6b41d1644ba050cd201e806f7445))

## [1.2.4](https://github.com/nextgis/nextgis_frontend/compare/v1.2.3...v1.2.4) (2021-07-22)

### Features

- **leaflet-map-adapter:** label redraw on map position change ([241efc1](https://github.com/nextgis/nextgis_frontend/commit/241efc142ef29eef898e5b4adadff3e8208a3091))
- **mapbox-map-adapter:** GeoJson layer label workaround ([b7fa371](https://github.com/nextgis/nextgis_frontend/commit/b7fa371e5a22943e726962e92244d9d164da685e))

## [1.2.3](https://github.com/nextgis/nextgis_frontend/compare/v1.2.2...v1.2.3) (2021-07-21)

### Features

- **mapboxgl-map-adapter:** add popup for selected feature ([ef87167](https://github.com/nextgis/nextgis_frontend/commit/ef87167a8df611a0e7b55c04b8090af14c053adc))

## [1.2.2](https://github.com/nextgis/nextgis_frontend/compare/v1.2.1...v1.2.2) (2021-07-16)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [1.2.1](https://github.com/nextgis/nextgis_frontend/compare/v1.2.0...v1.2.1) (2021-07-12)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.2.0](https://github.com/nextgis/nextgis_frontend/compare/v1.1.2...v1.2.0) (2021-07-08)

### Features

- handle vector layer mouse over and out events ([2e94152](https://github.com/nextgis/nextgis_frontend/commit/2e94152fac64b8e022dab7940614487763ce57af))

## [1.1.2](https://github.com/nextgis/nextgis_frontend/compare/v1.1.1...v1.1.2) (2021-06-28)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.1.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.1...v1.1.0) (2021-06-25)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [1.0.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0...v1.0.1) (2021-06-08)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.0.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.9...v1.0.0) (2021-06-07)

### Features

- **url-runtime-params:** remove trailing sharp from hash ([514adec](https://github.com/nextgis/nextgis_frontend/commit/514adec69c697beacb6d2aee88c0dfd50f540006))

# [1.0.0-beta.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2021-05-03)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.0.0-beta.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2021-05-02)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.0.0-beta.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-04-23)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.0.0-beta.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-04-04)

### Bug Fixes

- **leafelet-map-adapter:** safe make remote options ([70dc9d6](https://github.com/nextgis/nextgis_frontend/commit/70dc9d66faf75d9344d2532dba16112081f13861))

# [1.0.0-beta.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-02-13)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.0.0-beta.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-01-17)

### Bug Fixes

- **leaflet:** remove forgotten console logs ([4954cde](https://github.com/nextgis/nextgis_frontend/commit/4954cdebbb5c4859126c9ac5d1599b7d8ec04f78))

### Features

- add setViewDelay options to control map update ([3c50948](https://github.com/nextgis/nextgis_frontend/commit/3c50948d8ce31d79879cf566f827cee78fc1af31))

### Performance Improvements

- **leaflet:** abort image overlay request on view change ([d8613f0](https://github.com/nextgis/nextgis_frontend/commit/d8613f0be10e730d1ec9bb4ee0f2fa27c1687009))
- **leaflet:** abort xhr tile loading on setView ([f7e9ed0](https://github.com/nextgis/nextgis_frontend/commit/f7e9ed044ed39fbc95c73ad381560e692dda6046))
- **leaflet:** setViewDelay for tile layer ([229ef92](https://github.com/nextgis/nextgis_frontend/commit/229ef9211a9aac27b5d7ca86f04118e291579d8b))

# [1.0.0-beta.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-12-19)

### Bug Fixes

- provide support for map preclick event ([9400b31](https://github.com/nextgis/nextgis_frontend/commit/9400b31c116d15f6ae9e68b7b2c0369fa1f906b9)), closes [#8](https://github.com/nextgis/nextgis_frontend/issues/8)
- **webmap:** set zero zoom ([059e6ea](https://github.com/nextgis/nextgis_frontend/commit/059e6ea243a0ba0b6cce58905dde58485bc5d372))

# [1.0.0-beta.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-11-28)

### Bug Fixes

- **ngw-connector:** fixes to apiRequest cancel work ([0ac44ee](https://github.com/nextgis/nextgis_frontend/commit/0ac44eee447019593ae80529cc3b063171f8f88c)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)

### Features

- **ngw-kit:** add toGeojson in ngw layer item response ([a9f073a](https://github.com/nextgis/nextgis_frontend/commit/a9f073a50dac3ecf3472e7b90f4124b8e3a6b772))

# [1.0.0-beta.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2020-11-16)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.0.0-alpha.11](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2020-11-02)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.0.0-alpha.10](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-10-20)

### Code Refactoring

- **webmap:** change default paint ([1baea95](https://github.com/nextgis/nextgis_frontend/commit/1baea95158e2cd8b79ec2de6b95a377030951d0f))

### BREAKING CHANGES

- **webmap:** changed the default paint: the fill is semi-transparent, add stroke

# [1.0.0-alpha.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-10-15)

### Bug Fixes

- **leaflet-map-adapter:** maxBounds hotfix ([18452bc](https://github.com/nextgis/nextgis_frontend/commit/18452bc519c15ac2e47927e6145503f5e516d3f4))
- **webmap:** webmap constructor options ([8c92b6c](https://github.com/nextgis/nextgis_frontend/commit/8c92b6c17e4b0f69630abb5ad0ffa78234d50a6f))

### Features

- add getExtent method for all mapAdapters GeoJsonLayerAdapter ([9254c3b](https://github.com/nextgis/nextgis_frontend/commit/9254c3bf4b1200c69126d770525a8b6b20a9f5c2))
- **ngw-map:** default bounds; add mapOption for show osm baselayer ([8df4e0e](https://github.com/nextgis/nextgis_frontend/commit/8df4e0ea53a41f3df7a782c973686c160c3552d6))
- **utils:** add flatten and unflatten functions ([6562c34](https://github.com/nextgis/nextgis_frontend/commit/6562c34162b7d49e91fe1a6661457a620b737aa7))

# [1.0.0-alpha.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-06)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.0.0-alpha.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-09-22)

### Features

- **util:** add keyInObj typescript helper ([fabb5e0](https://github.com/nextgis/nextgis_frontend/commit/fabb5e017d6b3b228d6cdb98a3fffe0ce8e57929))

# [1.0.0-alpha.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)

### Features

- **cancelable-promise:** improve PromisesControl ([ca5fabb](https://github.com/nextgis/nextgis_frontend/commit/ca5fabb60e998f19713704011db58588487aebe7))
- **utils:** add `arrayCompareStrict` function ([9d65949](https://github.com/nextgis/nextgis_frontend/commit/9d659496fbcf4dd0e2f467d3e18ad7253fcb7041))
- **webmap:** remove control from promise ([fbeae95](https://github.com/nextgis/nextgis_frontend/commit/fbeae956a3dc7ad01fd90ac3807f484d3ab79424))

# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.0.0-alpha.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)

### Bug Fixes

- **leaflet-map-adapter:** init center option ([f0cff9e](https://github.com/nextgis/nextgis_frontend/commit/f0cff9ee40e26043b25c85bf556b78a2a0b5366f))

# [1.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)

### Bug Fixes

- **leaflet-map-adapter:** fix BaseAdapter pane zIndex set ([f73bb6a](https://github.com/nextgis/nextgis_frontend/commit/f73bb6ae9b9e3e99c5a1ca7cc859570ce0ce8911))

# [1.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)

### Features

- **ngw-kit:** default WebmapLayerAdapter basemap ([4756ef8](https://github.com/nextgis/nextgis_frontend/commit/4756ef82084f30eda51fe98e1483e815a7775132))

# [1.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)

### Code Refactoring

- rename layerAdapter baseLayer option to baselayer ([368d657](https://github.com/nextgis/nextgis_frontend/commit/368d6576278505ddddde2a1ab160a0849e087c70))

### Features

- **cesium:** add maximumScreenSpaceError option for tilset3d adapter ([c82c524](https://github.com/nextgis/nextgis_frontend/commit/c82c52452765b2e764f6c3d42bc3522bd36a4258))
- **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([430d51e](https://github.com/nextgis/nextgis_frontend/commit/430d51e7211c050ebeffd68b0c839d9a38170054))

### BREAKING CHANGES

- LayerAdapter option baseLayer was renamed to baselayer;
- webMap.getBaseLayers() method now return LayerAdapter, not string array of ids

# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)

### wip

- rename VectorLayerAdapterType ([89a2c83](https://github.com/nextgis/nextgis_frontend/commit/89a2c83135e839f3eec373f93e5df777a7b81325))

### BREAKING CHANGES

- rename VectorLayerAdapter types: circle > point; fill > polygon

# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)

### Bug Fixes

- **ngw-kit:** create async adapter from parent resource ([808572b](https://github.com/nextgis/nextgis_frontend/commit/808572b5aff6b04783cd7e9edd078e2ea5404dd2))

## [0.30.2](https://github.com/nextgis/nextgis_frontend/compare/v0.30.1...v0.30.2) (2020-04-30)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)

### Bug Fixes

- **leaflet:** RemoteTileLayer mixin removeTile method ([af72b2b](https://github.com/nextgis/nextgis_frontend/commit/af72b2b420cb951f52b6ce56701f3e3bbbdb475d))

## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)

### Bug Fixes

- **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))

# [0.29.0](https://github.com/nextgis/nextgis_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)

### chore

- build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))

### BREAKING CHANGES

- code formatting rules changed to prettier 2.0 compatibility

## [0.28.3](https://github.com/nextgis/nextgis_frontend/compare/v0.28.2...v0.28.3) (2020-03-19)

### Features

- add library `@nextgis/paint` ([99391ec](https://github.com/nextgis/nextgis_frontend/commit/99391ec1ac9fd80508816417d9eb2ae0fd734340))

## [0.28.1](https://github.com/nextgis/nextgis_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)

### Features

- **webmap:** paint from expressions ([126a191](https://github.com/nextgis/nextgis_frontend/commit/126a191a540e12ac7ff74471a110c1fd04340516))
- **webmap:** paint from properties filter ([6645e46](https://github.com/nextgis/nextgis_frontend/commit/6645e467f1be79c0a2ed02fed65a62b5850daf70))

### BREAKING CHANGES

- **webmap:** New Paint specification may cause problems with types

## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)

### Features

- **control:** add universal zoom control ([1ffc089](https://github.com/nextgis/nextgis_frontend/commit/1ffc089942f1709f82cec8398d301503819be718))

# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)

### Features

- add WmsLayerAdapter ([c57b66d](https://github.com/nextgis/nextgis_frontend/commit/c57b66d2278071a57182cb4dd554e370c63ffa06))

## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)

### Features

- remove default MarkerLayerAdapter ([7398c1b](https://github.com/nextgis/nextgis_frontend/commit/7398c1bb61d43194ce4c7da635d386ad785ac57a))
- **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgis_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))

### BREAKING CHANGES

- MARKER layer adapter has been removed. Use ddLayer('GEOJSON', {data}) instead of ddLayer('MARKER', {lngLat})

## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [0.25.4](https://github.com/nextgis/nextgis_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [0.25.3](https://github.com/nextgis/nextgis_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [0.25.2](https://github.com/nextgis/nextgis_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter

## [0.25.1](https://github.com/nextgis/nextgis_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)

### Features

- remove default MarkerLayerAdapter ([7398c1b](https://github.com/nextgis/nextgis_frontend/commit/7398c1bb61d43194ce4c7da635d386ad785ac57a))

### BREAKING CHANGES

- MARKER layer adapter has been removed. Use ddLayer('GEOJSON', {data}) instead of ddLayer('MARKER', {lngLat})

# [0.25.0](https://github.com/nextgis/nextgis_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)

**Note:** Version bump only for package @nextgis/leaflet-map-adapter
