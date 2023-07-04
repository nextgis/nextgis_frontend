# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.16.9](https://github.com/nextgis/nextgis_frontend/compare/v1.16.8...v1.16.9) (2023-07-04)

**Note:** Version bump only for package @nextgis/ol-map-adapter





## 1.16.8 (2023-05-14)


### Bug Fixes

* **build:** control-container extract css ([a02d24b](https://github.com/nextgis/nextgis_frontend/commit/a02d24bf2dbe246420803d5d1be9348e4b647c6d))
* **ngw-connector:** fixes to apiRequest cancel work ([e4451d8](https://github.com/nextgis/nextgis_frontend/commit/e4451d8a7ad349ba17692a3f906677f1a29bf691)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
* **ngw-kit:** do not reassign getExtent for geojson layer ([feca330](https://github.com/nextgis/nextgis_frontend/commit/feca330c45fd6f96ba7d2a7bb2f6d34a47de0dba))
* **ngw-kit:** make async onFirstShowAdapter hide and show methods ([502b261](https://github.com/nextgis/nextgis_frontend/commit/502b261b478872aed0bed0657b961481c22ce109))
* **ngw-kit:** ngw webmap items layer order ([c5dad6b](https://github.com/nextgis/nextgis_frontend/commit/c5dad6b1db927b7ff30da21f752c4a1d1786b70e))
* **ngw-ol:** container style ([5d71e9e](https://github.com/nextgis/nextgis_frontend/commit/5d71e9ea1f63376e9c533d24eb45240a34c9e167))
* **ngw-ol:** layer min-max zoom options ([9985656](https://github.com/nextgis/nextgis_frontend/commit/998565639078e64cabf4fc3a54d16bea636a94b7))
* **ol-map-adapter:** do not return nothing from poinermove cb ([9733170](https://github.com/nextgis/nextgis_frontend/commit/973317011e0fa486e4af558dace029e7834c840b))
* **ol-map-adapter:** geojson adapter layer remove ([8ec9df3](https://github.com/nextgis/nextgis_frontend/commit/8ec9df39941c4f1ccfbabfbe0ead2ec9138642bb))
* **ol-map-adapter:** geojson adapter style function type detection ([c71d83f](https://github.com/nextgis/nextgis_frontend/commit/c71d83f45822138428bdd4ebedbc67ecefaead9d))
* **ol-map-adapter:** geojson labelField only for string ([c23465b](https://github.com/nextgis/nextgis_frontend/commit/c23465bec5cf1f992cbb1edaf1b561b380a9e73c))
* **ol-map-adapter:** label type for geojson adapter ([2d45597](https://github.com/nextgis/nextgis_frontend/commit/2d45597bab4788af54facdaa17893b3f343a7bc6))
* **ol-map-adapter:** repair unselect on second click ([7fc2252](https://github.com/nextgis/nextgis_frontend/commit/7fc22521e07a281397f9e891c71038d0a96b7ac6))
* **ol:** css control fixes ([facf608](https://github.com/nextgis/nextgis_frontend/commit/facf608fa99064da1a3b817497b0317890b77915))
* **ol:** geojson label null field ([da60ffb](https://github.com/nextgis/nextgis_frontend/commit/da60ffbd7773ba6d0582a627e36b4476fc2c9d03))
* **ol:** no vector layer label for undefined property ([fd873e3](https://github.com/nextgis/nextgis_frontend/commit/fd873e3bc7a6d778bdbe73519c099553f4deb75c))
* **ol:** remove tileAdapter pixelratio option ([ad54406](https://github.com/nextgis/nextgis_frontend/commit/ad54406efed015c163dbc2889b4a9c0b819b5d3a))
* provide support for map preclick event ([c7b7f66](https://github.com/nextgis/nextgis_frontend/commit/c7b7f662f6e0507cf20fb8a43e4bb22547c9b18b)), closes [#8](https://github.com/nextgis/nextgis_frontend/issues/8)
* remove require imports ([2674a8c](https://github.com/nextgis/nextgis_frontend/commit/2674a8ce29ef4116b939283ee1f4ec02b26b8025))
* **webmap:** disable experimental left and right control positions ([7658504](https://github.com/nextgis/nextgis_frontend/commit/765850439199c5bd6bc961245ba8558111513132))
* **webmap:** editing for new layer visibility standard ([960cba5](https://github.com/nextgis/nextgis_frontend/commit/960cba596dc1e13de0da23b5bcd79f7581af5834))
* **webmap:** not use ordering for layer id ([8c912df](https://github.com/nextgis/nextgis_frontend/commit/8c912df45f49107e3bbfd1dd686f92d25d84059b))


### chore

* build; eslint ([ee1e03d](https://github.com/nextgis/nextgis_frontend/commit/ee1e03d85625b02a09c2ee1e4d66007fbf57d626))
* **vue-ngw-map:** update dependencies ([13fc35d](https://github.com/nextgis/nextgis_frontend/commit/13fc35dbd959c49d62fb8fad46534eb4da1a6684))


### Code Refactoring

* rename layerAdapter baseLayer option to baselayer ([e5c595d](https://github.com/nextgis/nextgis_frontend/commit/e5c595d6df24b1b22906ad1e06eb60bf0327e9c0))


### Features

* add BBOX+ strategy; extends options for setView ([309b697](https://github.com/nextgis/nextgis_frontend/commit/309b697e141adf6eedeb85c87b6fa89b9b629c13))
* add getExtent method for all mapAdapters GeoJsonLayerAdapter ([7e8010f](https://github.com/nextgis/nextgis_frontend/commit/7e8010f7d5579f2b7909a31a2073479de1faa6a5))
* add library `@nextgis/paint` ([0f72300](https://github.com/nextgis/nextgis_frontend/commit/0f723006c722cc0e183a3c2dcfe7b2366e63cd96))
* add nativeOptions for alladdLayer adapter methods ([c98568f](https://github.com/nextgis/nextgis_frontend/commit/c98568f1f122fc67fdfc911500aa2c509149e293))
* add new library `ControlContainer` ([bf566e2](https://github.com/nextgis/nextgis_frontend/commit/bf566e218c53462f65a1e0574d812a6e1c667e06))
* add WmsLayerAdapter ([aec0ce1](https://github.com/nextgis/nextgis_frontend/commit/aec0ce15ddb5292b6334833bcab8812400815d0b))
* **control:** add universal zoom control ([d1371be](https://github.com/nextgis/nextgis_frontend/commit/d1371be1f88085dcfc864de31a7d4d89f2690216))
* handle vector layer mouse over and out events ([1f537c2](https://github.com/nextgis/nextgis_frontend/commit/1f537c277b433db365b319d4bbdfb26aa44528fd))
* improve geojson adapter multiselect ([2c9c01c](https://github.com/nextgis/nextgis_frontend/commit/2c9c01c42757c87c4d588e97802f8d2626c5b078))
* improve popup, add new options, ol support ([e3ea91b](https://github.com/nextgis/nextgis_frontend/commit/e3ea91b91d03a4cef471c5c92a09a7fa0640b90a))
* **leaflet-map-adapter:** add position to vector adapter layers definition ([053ccf0](https://github.com/nextgis/nextgis_frontend/commit/053ccf05ed8d9d76592c8ca648365e176c609277))
* **mapbox-gl-js:** improve popup ([dbec3c5](https://github.com/nextgis/nextgis_frontend/commit/dbec3c5f68275e72dc91bfa4a7f21164aa9bdc62))
* **mapboxgl-map-adapter:** add setLayerOpacity methods ([3f84f3e](https://github.com/nextgis/nextgis_frontend/commit/3f84f3e44f776fb685afa66f0d8f5fa0165f3806))
* new @nextgis/dom library ([572d4c2](https://github.com/nextgis/nextgis_frontend/commit/572d4c2c554eb4da30be01c25a2d14cd4125d847))
* **ngw-kit:** default WebmapLayerAdapter basemap ([12aba63](https://github.com/nextgis/nextgis_frontend/commit/12aba63a37fc75cbaed2ed0be478cc5172149190))
* **ngw-kit:** ngwwebmap item toggle on zoom layer range ([52abb1d](https://github.com/nextgis/nextgis_frontend/commit/52abb1d2fee3b2c306b9269e8287d98362ef5128))
* **ngw-kit:** update feature request params ([ebceeaf](https://github.com/nextgis/nextgis_frontend/commit/ebceeafc4ccb9f95b34ddbe7ce31436ccc0cae45))
* **ol-map-adapter:** add map native adapterOptions parameter ([5128ce4](https://github.com/nextgis/nextgis_frontend/commit/5128ce4497c6d81987b7506f6500a097fe5f9095))
* **ol-map-adapter:** add position to vector adapter layers defenition ([235928f](https://github.com/nextgis/nextgis_frontend/commit/235928fc7ee497e5eab94bd037f343715d9839b5))
* **ol-map-adapter:** add setLayerOpacity mapAdapter and each layer methods ([0d71962](https://github.com/nextgis/nextgis_frontend/commit/0d71962899409203f31ff7f4fcad9e0142f6efa0))
* **ol-map-adapter:** add srs options to draw vector layer ([7a29212](https://github.com/nextgis/nextgis_frontend/commit/7a29212eb5636194b5cc9df0602c1fb8cbb58593))
* **ol-map-adapter:** hide and show label dynamic ([1d0e842](https://github.com/nextgis/nextgis_frontend/commit/1d0e84264ffabe088e8ba4488106f63d81364193))
* **ol-map-adapter:** use add layer opacity option ([33dd334](https://github.com/nextgis/nextgis_frontend/commit/33dd334d76a563b147548d96fa56ed9d54a318a3))
* **ol-map-adapter:** use geojson layer label calback option ([e05e1ba](https://github.com/nextgis/nextgis_frontend/commit/e05e1bab2568dbd31908003b77691509e96f82e2))
* **ol:** implement labelField options for OL geojson adapter ([df754ca](https://github.com/nextgis/nextgis_frontend/commit/df754ca43857e0ab99d925d815ffd3a186e1a98d))
* **ol:** implemented getBounds method for OlMapAdapter ([b4f93f8](https://github.com/nextgis/nextgis_frontend/commit/b4f93f808d0e331a33050bd7b00fd3fb900d4337))
* **ol:** labeling for circle layer paint ([6cf4f54](https://github.com/nextgis/nextgis_frontend/commit/6cf4f54c9e6a3b96c33e6855fc4ab874ad3f15d1))
* remove default MarkerLayerAdapter ([7596ec9](https://github.com/nextgis/nextgis_frontend/commit/7596ec9f86b20ce399248adc233c0a2e041da63c))
* **utils:** create universal MapControlContainer ([ce5a984](https://github.com/nextgis/nextgis_frontend/commit/ce5a984fd97928e1c9dda2bac81578a62a328e64))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([bcea6c3](https://github.com/nextgis/nextgis_frontend/commit/bcea6c35e61f6ba2aab0b25eb30da9f5f719c92e))
* **webmap:** add getControlContainer method ([827049d](https://github.com/nextgis/nextgis_frontend/commit/827049d00b349f7e8c5bb1d19da94b793b794829))
* **webmap:** add labelVisibility layer adapter option ([7c8ed91](https://github.com/nextgis/nextgis_frontend/commit/7c8ed91192d86ed09fee46799f52aad65600f11c))
* **webmap:** add map mouse move events ([c50638c](https://github.com/nextgis/nextgis_frontend/commit/c50638ccefad63e9b21416e922ea0d4c33fc1adf))
* **webmap:** add MapAdapter map options ([15e3c50](https://github.com/nextgis/nextgis_frontend/commit/15e3c50eb61c8457e9695e527274beb6cf751a6a))
* **webmap:** add setLayerPaint method ([3cadfbf](https://github.com/nextgis/nextgis_frontend/commit/3cadfbfac802c19ad0e981e944be69a07f548414))
* **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([928d351](https://github.com/nextgis/nextgis_frontend/commit/928d351fea9a321c178ecbb4e03a70bd9a64fc90))
* **webmap:** layer adapter waitFullLoad and crossOrigin new options ([5e2b6d2](https://github.com/nextgis/nextgis_frontend/commit/5e2b6d2ae1db3b48775bca7f31a85338d451d61a))
* **webmap:** make propertiesFilter async ([2eca455](https://github.com/nextgis/nextgis_frontend/commit/2eca455688c06edd2433e1497c8818f5b4a765ef))
* **webmap:** paint from expressions ([fb492d1](https://github.com/nextgis/nextgis_frontend/commit/fb492d1bab2cbd8b64944cccd52565b24efd06aa))
* **webmap:** ratio in vectorlayer adapter interface ([a001a23](https://github.com/nextgis/nextgis_frontend/commit/a001a232e2b0e08d27116ca274725521a26d4565))


### Performance Improvements

* **ol-map-adapter:** style function for each feature ([7fc99ae](https://github.com/nextgis/nextgis_frontend/commit/7fc99ae96249d5d3f816abfac7b4221028459b18))


### wip

* rename VectorLayerAdapterType ([726ab7d](https://github.com/nextgis/nextgis_frontend/commit/726ab7dd7cd112750165a9e15c5672086cd8261a))


### BREAKING CHANGES

* **vue-ngw-map:** Vue is now required as peer dependency
* **ngw-kit:** `extensions` for any ngw feature request is now empty for default
* LayerAdapter option baseLayer was renamed to baselayer;
* webMap.getBaseLayers() method now return LayerAdapter, not string array of ids
* rename VectorLayerAdapter types: circle > point; fill > polygon
* code formatting rules changed to prettier 2.0 compatibility
* **webmap:** New Paint specification may cause problems with types
* MARKER layer adapter has been removed. Use ddLayer('GEOJSON', {data}) instead of ddLayer('MARKER', {lngLat})





## [1.16.7](https://github.com/nextgis/nextgis_frontend/compare/v1.16.6...v1.16.7) (2023-04-21)


### Features

* **ol-map-adapter:** hide and show label dynamic ([65f30c0](https://github.com/nextgis/nextgis_frontend/commit/65f30c05d0cc4e40ca0272f34b55b0481b97d448))
* **webmap:** add labelVisibility layer adapter option ([298a697](https://github.com/nextgis/nextgis_frontend/commit/298a697f65bc5e53f6cf0ea82e688e2f3311f01d))





## [1.16.6](https://github.com/nextgis/nextgis_frontend/compare/v1.16.5...v1.16.6) (2023-02-09)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.16.5](https://github.com/nextgis/nextgis_frontend/compare/v1.16.4...v1.16.5) (2023-02-09)

### Features

- **webmap:** make propertiesFilter async ([f21336b](https://github.com/nextgis/nextgis_frontend/commit/f21336b0e734c26d7dc171b49dd7788b33661402))

## [1.16.2](https://github.com/nextgis/nextgis_frontend/compare/v1.16.1...v1.16.2) (2022-09-15)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.16.1](https://github.com/nextgis/nextgis_frontend/compare/v1.16.0...v1.16.1) (2022-09-03)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.16.0](https://github.com/nextgis/nextgis_frontend/compare/v1.15.1...v1.16.0) (2022-08-28)

### Features

- improve geojson adapter multiselect ([30a3223](https://github.com/nextgis/nextgis_frontend/commit/30a32237411b60d03246bdc8efe292295ffcef44))

## [1.15.1](https://github.com/nextgis/nextgis_frontend/compare/v1.15.0...v1.15.1) (2022-08-02)

### chore

- **vue-ngw-map:** update dependencies ([1f2b688](https://github.com/nextgis/nextgis_frontend/commit/1f2b68836c1e3e367bdb1a8c2ff3652e704aae99))

### BREAKING CHANGES

- **vue-ngw-map:** Vue is now required as peer dependency

# [1.15.0](https://github.com/nextgis/nextgis_frontend/compare/v1.14.0...v1.15.0) (2022-07-27)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.14.0](https://github.com/nextgis/nextgis_frontend/compare/v1.13.8...v1.14.0) (2022-07-05)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.13.8](https://github.com/nextgis/nextgis_frontend/compare/v1.13.7...v1.13.8) (2022-06-25)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.13.6](https://github.com/nextgis/nextgis_frontend/compare/v1.13.5...v1.13.6) (2022-06-05)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.13.3](https://github.com/nextgis/nextgis_frontend/compare/v1.13.2...v1.13.3) (2022-05-31)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.13.2](https://github.com/nextgis/nextgis_frontend/compare/v1.13.1...v1.13.2) (2022-05-30)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.13.0](https://github.com/nextgis/nextgis_frontend/compare/v1.12.1...v1.13.0) (2022-05-13)

### Features

- **webmap:** add MapAdapter map options ([a6b48a4](https://github.com/nextgis/nextgis_frontend/commit/a6b48a499122e184ec01ad626c97f6f48b7e3984))

## [1.12.1](https://github.com/nextgis/nextgis_frontend/compare/v1.12.0...v1.12.1) (2022-04-21)

### Features

- **webmap:** add map mouse move events ([2a2eba3](https://github.com/nextgis/nextgis_frontend/commit/2a2eba3c2a582093386189106d3bb456c5eb85c0))

# [1.12.0](https://github.com/nextgis/nextgis_frontend/compare/v1.11.10...v1.12.0) (2022-03-05)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.11.10](https://github.com/nextgis/nextgis_frontend/compare/v1.11.9...v1.11.10) (2022-01-20)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.11.7](https://github.com/nextgis/nextgis_frontend/compare/v1.11.6...v1.11.7) (2022-01-11)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.11.0](https://github.com/nextgis/nextgis_frontend/compare/v1.10.0...v1.11.0) (2021-12-19)

### Bug Fixes

- **ol-map-adapter:** geojson labelField only for string ([afa2c93](https://github.com/nextgis/nextgis_frontend/commit/afa2c938e2d0efce99d6ea6d990d1a59e77e9168))
- **ol-map-adapter:** label type for geojson adapter ([f50ceb0](https://github.com/nextgis/nextgis_frontend/commit/f50ceb062ffaf13cc76bbea7dc00b99b45908020))

### Features

- **ol-map-adapter:** use geojson layer label calback option ([a849ec7](https://github.com/nextgis/nextgis_frontend/commit/a849ec7012d04709ebec00bc4a40a90691b7855c))

# [1.10.0](https://github.com/nextgis/nextgis_frontend/compare/v1.9.7...v1.10.0) (2021-11-30)

### Features

- **webmap:** add setLayerPaint method ([b1ddac5](https://github.com/nextgis/nextgis_frontend/commit/b1ddac5140670aba4f40f0861d6792065653c508))

## [1.9.4](https://github.com/nextgis/nextgis_frontend/compare/v1.9.3...v1.9.4) (2021-11-16)

### Features

- **ol-map-adapter:** add map native adapterOptions parameter ([3368e27](https://github.com/nextgis/nextgis_frontend/commit/3368e2750ab1701aa914c1c288c89f5364ea029e))

## [1.9.2](https://github.com/nextgis/nextgis_frontend/compare/v1.9.1...v1.9.2) (2021-10-26)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.9.1](https://github.com/nextgis/nextgis_frontend/compare/v1.9.0...v1.9.1) (2021-10-25)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.9.0](https://github.com/nextgis/nextgis_frontend/compare/v1.8.5...v1.9.0) (2021-10-23)

### Features

- add BBOX+ strategy; extends options for setView ([88e9d09](https://github.com/nextgis/nextgis_frontend/commit/88e9d092bcc3615b99bad13d175f62be3ff73725))

## [1.8.5](https://github.com/nextgis/nextgis_frontend/compare/v1.8.4...v1.8.5) (2021-10-21)

### Bug Fixes

- **ngw-ol:** layer min-max zoom options ([e59861b](https://github.com/nextgis/nextgis_frontend/commit/e59861b491cb3aea418872bf038c65fc4848a694))

## [1.8.4](https://github.com/nextgis/nextgis_frontend/compare/v1.8.3...v1.8.4) (2021-10-21)

### Features

- **ngw-kit:** ngwwebmap item toggle on zoom layer range ([f7c4e42](https://github.com/nextgis/nextgis_frontend/commit/f7c4e42fe323f9e4941dbc37893b3beb2ccd7751))

## [1.8.3](https://github.com/nextgis/nextgis_frontend/compare/v1.8.2...v1.8.3) (2021-10-12)

### Bug Fixes

- **ngw-kit:** make async onFirstShowAdapter hide and show methods ([e5d43b6](https://github.com/nextgis/nextgis_frontend/commit/e5d43b6156cd961619908a9100e204c36d42bcb0))

## [1.8.2](https://github.com/nextgis/nextgis_frontend/compare/v1.8.1...v1.8.2) (2021-10-05)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.8.1](https://github.com/nextgis/nextgis_frontend/compare/v1.8.0...v1.8.1) (2021-09-23)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.8.0](https://github.com/nextgis/nextgis_frontend/compare/v1.7.0...v1.8.0) (2021-09-22)

### Features

- add nativeOptions for alladdLayer adapter methods ([c99d06e](https://github.com/nextgis/nextgis_frontend/commit/c99d06e35c5884b5969b281c98bd3742d6f427ef))

# [1.7.0](https://github.com/nextgis/nextgis_frontend/compare/v1.6.0...v1.7.0) (2021-09-16)

### Features

- **leaflet-map-adapter:** add position to vector adapter layers definition ([61cb7a5](https://github.com/nextgis/nextgis_frontend/commit/61cb7a591ed3ececcabed710abf1e0aec6708c1b))
- **ol-map-adapter:** add position to vector adapter layers defenition ([bd6fd4d](https://github.com/nextgis/nextgis_frontend/commit/bd6fd4d0e65f8a2dd1794813dafb9cf04931019b))

# [1.6.0](https://github.com/nextgis/nextgis_frontend/compare/v1.5.1...v1.6.0) (2021-09-09)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.5.1](https://github.com/nextgis/nextgis_frontend/compare/v1.5.0...v1.5.1) (2021-09-06)

### Bug Fixes

- **ol-map-adapter:** do not return nothing from poinermove cb ([62b9aff](https://github.com/nextgis/nextgis_frontend/commit/62b9aff0a3b93fedb83d33fa770e77c407412a32))
- **ol-map-adapter:** geojson adapter style function type detection ([b731e04](https://github.com/nextgis/nextgis_frontend/commit/b731e04977529a30515dbb86dad537f76ecc7fe3))

# [1.5.0](https://github.com/nextgis/nextgis_frontend/compare/v1.4.0...v1.5.0) (2021-08-19)

### Features

- **mapboxgl-map-adapter:** add setLayerOpacity methods ([6d18193](https://github.com/nextgis/nextgis_frontend/commit/6d18193b617a42ad50640ec659aa755962954e1b))
- **ol-map-adapter:** add setLayerOpacity mapAdapter and each layer methods ([b291921](https://github.com/nextgis/nextgis_frontend/commit/b2919210d44be4f6cf5b00d8e7fa735b98961702))

# [1.4.0](https://github.com/nextgis/nextgis_frontend/compare/v1.3.0...v1.4.0) (2021-08-17)

### Bug Fixes

- **ol-map-adapter:** repair unselect on second click ([a85d87c](https://github.com/nextgis/nextgis_frontend/commit/a85d87cbf7ad8f19caa8212d532d51a3dd886bd6))

# [1.3.0](https://github.com/nextgis/nextgis_frontend/compare/v1.2.8...v1.3.0) (2021-08-06)

### Bug Fixes

- **webmap:** disable experimental left and right control positions ([c8c6fb7](https://github.com/nextgis/nextgis_frontend/commit/c8c6fb73c33985b19ecfc908f7d25d6a2f23d778))

### Features

- improve popup, add new options, ol support ([75e73fa](https://github.com/nextgis/nextgis_frontend/commit/75e73faac7f393d0c62f9966786da78c7f54c039))
- **mapbox-gl-js:** improve popup ([31694bc](https://github.com/nextgis/nextgis_frontend/commit/31694bc94aebb53eff3ff2422b148cd956f5166b))
- **ol-map-adapter:** add srs options to draw vector layer ([6a76486](https://github.com/nextgis/nextgis_frontend/commit/6a76486e75bd6a6fb5e00a45b0815f3a27aba03e))
- **webmap:** add getControlContainer method ([26a51bc](https://github.com/nextgis/nextgis_frontend/commit/26a51bc53c2f2a7219ed05a4ef4d6b3eaab03560))

## [1.2.8](https://github.com/nextgis/nextgis_frontend/compare/v1.2.7...v1.2.8) (2021-07-27)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.2.7](https://github.com/nextgis/nextgis_frontend/compare/v1.2.6...v1.2.7) (2021-07-26)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.2.4](https://github.com/nextgis/nextgis_frontend/compare/v1.2.3...v1.2.4) (2021-07-22)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.2.3](https://github.com/nextgis/nextgis_frontend/compare/v1.2.2...v1.2.3) (2021-07-21)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.2.2](https://github.com/nextgis/nextgis_frontend/compare/v1.2.1...v1.2.2) (2021-07-16)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.2.1](https://github.com/nextgis/nextgis_frontend/compare/v1.2.0...v1.2.1) (2021-07-12)

### Bug Fixes

- **ol-map-adapter:** geojson adapter layer remove ([3705f27](https://github.com/nextgis/nextgis_frontend/commit/3705f27c5d75aba9f385ceda27aa26ef94cb0533))

### Performance Improvements

- **ol-map-adapter:** style function for each feature ([fed8575](https://github.com/nextgis/nextgis_frontend/commit/fed8575d7beb6dd23b22cc2eff2e02b73f0c8f7b))

# [1.2.0](https://github.com/nextgis/nextgis_frontend/compare/v1.1.2...v1.2.0) (2021-07-08)

### Features

- handle vector layer mouse over and out events ([2e94152](https://github.com/nextgis/nextgis_frontend/commit/2e94152fac64b8e022dab7940614487763ce57af))

## [1.1.2](https://github.com/nextgis/nextgis_frontend/compare/v1.1.1...v1.1.2) (2021-06-28)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.1.1](https://github.com/nextgis/nextgis_frontend/compare/v1.1.0...v1.1.1) (2021-06-25)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.1.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.1...v1.1.0) (2021-06-25)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [1.0.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0...v1.0.1) (2021-06-08)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.0.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.9...v1.0.0) (2021-06-07)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.0.0-beta.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2021-05-03)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.0.0-beta.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2021-05-02)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.0.0-beta.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-04-23)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.0.0-beta.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-04-04)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.0.0-beta.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-02-13)

### Features

- **webmap:** ratio in vectorlayer adapter interface ([cc3d835](https://github.com/nextgis/nextgis_frontend/commit/cc3d835879c5223e73e6db1026db1a419980182f))

# [1.0.0-beta.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-01-17)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.0.0-beta.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-12-19)

### Bug Fixes

- provide support for map preclick event ([9400b31](https://github.com/nextgis/nextgis_frontend/commit/9400b31c116d15f6ae9e68b7b2c0369fa1f906b9)), closes [#8](https://github.com/nextgis/nextgis_frontend/issues/8)

# [1.0.0-beta.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-11-28)

### Bug Fixes

- **ngw-connector:** fixes to apiRequest cancel work ([0ac44ee](https://github.com/nextgis/nextgis_frontend/commit/0ac44eee447019593ae80529cc3b063171f8f88c)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)

### Features

- **ngw-kit:** update feature request params ([4b2ffe8](https://github.com/nextgis/nextgis_frontend/commit/4b2ffe8170216e168bdd8f977a0d72d87277c181))

### BREAKING CHANGES

- **ngw-kit:** `extensions` for any ngw feature request is now empty for default

# [1.0.0-beta.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2020-11-16)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.0.0-alpha.11](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2020-11-02)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.0.0-alpha.10](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-10-20)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.0.0-alpha.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-10-15)

### Features

- add getExtent method for all mapAdapters GeoJsonLayerAdapter ([9254c3b](https://github.com/nextgis/nextgis_frontend/commit/9254c3bf4b1200c69126d770525a8b6b20a9f5c2))
- **ol-map-adapter:** use add layer opacity option ([0e8aa48](https://github.com/nextgis/nextgis_frontend/commit/0e8aa48dd0a154c37e187cea54951f4d596ef88d))

# [1.0.0-alpha.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-06)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.0.0-alpha.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-09-22)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.0.0-alpha.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.0.0-alpha.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)

### Bug Fixes

- remove require imports ([be789b8](https://github.com/nextgis/nextgis_frontend/commit/be789b89f39741efe146da97eeb19460a7cca527))

# [1.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)

### Features

- **ngw-kit:** default WebmapLayerAdapter basemap ([4756ef8](https://github.com/nextgis/nextgis_frontend/commit/4756ef82084f30eda51fe98e1483e815a7775132))

# [1.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)

### Bug Fixes

- **webmap:** editing for new layer visibility standard ([32413d0](https://github.com/nextgis/nextgis_frontend/commit/32413d085d30073056b8da97c8735ca13016c616))

### Code Refactoring

- rename layerAdapter baseLayer option to baselayer ([368d657](https://github.com/nextgis/nextgis_frontend/commit/368d6576278505ddddde2a1ab160a0849e087c70))

### Features

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

- **ol:** css control fixes ([98f6d13](https://github.com/nextgis/nextgis_frontend/commit/98f6d13dc9af59a39b1b0a13cea24be3a2505759))

### Features

- **webmap:** layer adapter waitFullLoad and crossOrigin new options ([08c6b82](https://github.com/nextgis/nextgis_frontend/commit/08c6b827f6a3e5728d8b17a9c305f32cd2b28039))

## [0.30.2](https://github.com/nextgis/nextgis_frontend/compare/v0.30.1...v0.30.2) (2020-04-30)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [0.29.10](https://github.com/nextgis/nextgis_frontend/compare/v0.29.9...v0.29.10) (2020-04-17)

### Bug Fixes

- **ngw-ol:** container style ([995b409](https://github.com/nextgis/nextgis_frontend/commit/995b409e5b70bb6a750afb39dd42745d562b4b88))
- **ol:** geojson label null field ([1b93b27](https://github.com/nextgis/nextgis_frontend/commit/1b93b275566f4f2c32ba9c114fea3a0fdc3dc77b))

## [0.29.6](https://github.com/nextgis/nextgis_frontend/compare/v0.29.5...v0.29.6) (2020-04-16)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

**Note:** Version bump only for package @nextgis/ol-map-adapter

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

## [0.28.2](https://github.com/nextgis/nextgis_frontend/compare/v0.28.1...v0.28.2) (2020-03-12)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [0.28.1](https://github.com/nextgis/nextgis_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package @nextgis/ol-map-adapter

# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)

### Features

- **webmap:** paint from expressions ([126a191](https://github.com/nextgis/nextgis_frontend/commit/126a191a540e12ac7ff74471a110c1fd04340516))

### BREAKING CHANGES

- **webmap:** New Paint specification may cause problems with types

## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)

### Features

- new @nextgis/dom library ([82a645d](https://github.com/nextgis/nextgis_frontend/commit/82a645d213d0b9ef1bb3c443dc28a94866c2884b))
- **control:** add universal zoom control ([1ffc089](https://github.com/nextgis/nextgis_frontend/commit/1ffc089942f1709f82cec8398d301503819be718))
- add new library `ControlContainer` ([e68afeb](https://github.com/nextgis/nextgis_frontend/commit/e68afeb5efb1e40bf20df2effa805fe80c437478))

# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)

### Features

- **utils:** create universal MapControlContainer ([2f07100](https://github.com/nextgis/nextgis_frontend/commit/2f07100b8a9b178533d5e3ee17b8759d8eb62866))

# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)

### Features

- add WmsLayerAdapter ([c57b66d](https://github.com/nextgis/nextgis_frontend/commit/c57b66d2278071a57182cb4dd554e370c63ffa06))

## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)

### Bug Fixes

- **ol:** no vector layer label for undefined property ([8087662](https://github.com/nextgis/nextgis_frontend/commit/80876629688c664edc6a5c7c1f5452a0b38e0cf7))
- **webmap:** not use ordering for layer id ([cd09734](https://github.com/nextgis/nextgis_frontend/commit/cd0973490a2c6ca0673bd01059056dd5fd68d866))

### Features

- remove default MarkerLayerAdapter ([7398c1b](https://github.com/nextgis/nextgis_frontend/commit/7398c1bb61d43194ce4c7da635d386ad785ac57a))
- **ol:** implement labelField options for OL geojson adapter ([cd0fbf1](https://github.com/nextgis/nextgis_frontend/commit/cd0fbf145a89a07bb934ec77a21c130e0eb7eba8))
- **ol:** implemented getBounds method for OlMapAdapter ([42e9a18](https://github.com/nextgis/nextgis_frontend/commit/42e9a1835d76e211055fc66fab7ba709f4e923f9))
- **ol:** labeling for circle layer paint ([1b0c87c](https://github.com/nextgis/nextgis_frontend/commit/1b0c87c10afe49195464d346634ec1cf88bd49b8))
- **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgis_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))

### BREAKING CHANGES

- MARKER layer adapter has been removed. Use ddLayer('GEOJSON', {data}) instead of ddLayer('MARKER', {lngLat})

## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [0.25.4](https://github.com/nextgis/nextgis_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [0.25.3](https://github.com/nextgis/nextgis_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [0.25.2](https://github.com/nextgis/nextgis_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package @nextgis/ol-map-adapter

## [0.25.1](https://github.com/nextgis/nextgis_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)

### Features

- remove default MarkerLayerAdapter ([7398c1b](https://github.com/nextgis/nextgis_frontend/commit/7398c1bb61d43194ce4c7da635d386ad785ac57a))

### BREAKING CHANGES

- MARKER layer adapter has been removed. Use ddLayer('GEOJSON', {data}) instead of ddLayer('MARKER', {lngLat})

# [0.25.0](https://github.com/nextgis/nextgis_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)

### Bug Fixes

- **ol:** no vector layer label for undefined property ([8087662](https://github.com/nextgis/nextgis_frontend/commit/80876629688c664edc6a5c7c1f5452a0b38e0cf7))
- **webmap:** not use ordering for layer id ([cd09734](https://github.com/nextgis/nextgis_frontend/commit/cd0973490a2c6ca0673bd01059056dd5fd68d866))

### Features

- **ol:** implement labelField options for OL geojson adapter ([cd0fbf1](https://github.com/nextgis/nextgis_frontend/commit/cd0fbf145a89a07bb934ec77a21c130e0eb7eba8))
- **ol:** implemented getBounds method for OlMapAdapter ([42e9a18](https://github.com/nextgis/nextgis_frontend/commit/42e9a1835d76e211055fc66fab7ba709f4e923f9))
- **ol:** labeling for circle layer paint ([1b0c87c](https://github.com/nextgis/nextgis_frontend/commit/1b0c87c10afe49195464d346634ec1cf88bd49b8))
