# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.18.10](https://github.com/nextgis/nextgis_frontend/compare/v1.18.9...v1.18.10) (2023-10-12)

**Note:** Version bump only for package @nextgis/frontend_test





# [1.18.0](https://github.com/nextgis/nextgis_frontend/compare/v1.17.0...v1.18.0) (2023-10-02)


### Features

* **expression:** add expression package alpha ([5f2bd7a](https://github.com/nextgis/nextgis_frontend/commit/5f2bd7ad9a7321358cbfd74ee19a88fc0647da31))
* **expression:** add interpolation and string expressions ([4f9491a](https://github.com/nextgis/nextgis_frontend/commit/4f9491a4b2afe5a677d86c17008972cae402f623))





# [1.17.0](https://github.com/nextgis/nextgis_frontend/compare/v0.5.0...v1.17.0) (2023-09-25)


### Bug Fixes

* **ngw-connector:** clean cache on resource delete ([179c372](https://github.com/nextgis/nextgis_frontend/commit/179c372b8c2358d57e1ad93a1afa2c6496d2619e))
* **ngw-connector:** fixes to apiRequest cancel work ([40fee1a](https://github.com/nextgis/nextgis_frontend/commit/40fee1a96a389a0d617bd35b6140db4f4a097eb6)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
* **ngw-kit:** fix like and ilike filter requests ([3654c2b](https://github.com/nextgis/nextgis_frontend/commit/3654c2baa9bb90ab2ccfda75ce24fd4a5713d0c7))
* **ngw-kit:** make async onFirstShowAdapter hide and show methods ([95362a8](https://github.com/nextgis/nextgis_frontend/commit/95362a89085ecda4a6225cd58bc9347ff970fd81))
* **ngw-kit:** remove duplicates from a query with filter by ANY condition ([d3b1ab9](https://github.com/nextgis/nextgis_frontend/commit/d3b1ab9dbc8e7e3862a45ba3b9bdae0b0b9d715c))
* **ngw-uploader:** correct imports and sandbox url ([2695c29](https://github.com/nextgis/nextgis_frontend/commit/2695c291ddce650a761195f97ce7bcbd58822688))
* **ngw-сщттусещк:** resource search query parent_id param ([f7dd32a](https://github.com/nextgis/nextgis_frontend/commit/f7dd32aa600eb7a608a81dd9adf6cd88defc3615))
* remove require imports ([c227e90](https://github.com/nextgis/nextgis_frontend/commit/c227e9003e209ea88ed86bab2903fa88492083f4))
* **webmap:** webmap constructor options ([81b53ee](https://github.com/nextgis/nextgis_frontend/commit/81b53ee68e1d0f3b945038c718e999d0f5cfe15c))


### Code Refactoring

* change WebMap and NgwMap constructor options ([dcd03e2](https://github.com/nextgis/nextgis_frontend/commit/dcd03e29f349ea632f791ac10c2dfa5d3f379b80))


### Features

* **area:** add new Area package ([2062f17](https://github.com/nextgis/nextgis_frontend/commit/2062f179fd8cbb5f75a6c8f78e440444f424ada8))
* **leaflet-map-adapter:** add position to vector adapter layers definition ([3a20a8c](https://github.com/nextgis/nextgis_frontend/commit/3a20a8c2bedbd953e7e29446e1acf28a5ce68a4d))
* **nge-kit:** add uploadFeatureAttachment util ([f0c2d5e](https://github.com/nextgis/nextgis_frontend/commit/f0c2d5eebc3a73277b25fd4af21501f8744ef8a3)), closes [#CU-m356](https://github.com/nextgis/nextgis_frontend/issues/CU-m356)
* **ngw-kit:** add identify item for speedup ngw selection ([3bd8626](https://github.com/nextgis/nextgis_frontend/commit/3bd86264d1ae7712eb39f377b02c60daf5f070dd))
* **ngw-kit:** ngwwebmap item toggle on zoom layer range ([4c64a8c](https://github.com/nextgis/nextgis_frontend/commit/4c64a8c15deb3f73a3f948610d06b3877f9577ab))


### BREAKING CHANGES

* `new WebMap({ mapAdapter: new MapAdapter(), ...appOptions, mapOptions: MapOptions })` > `new WebMap(mapOptions)`
* `new NgwMap(new MapAdapter(), ngwMapOptions)` > `new NgwMap(ngwMapOptions)`
* `WebMapOptions.create` is now `true` by default





## 1.16.8 (2023-05-14)


### Bug Fixes

* **ngw-connector:** clean cache on resource delete ([7fc716c](https://github.com/nextgis/nextgisweb_frontend/commit/7fc716cba13ea964cef8e23d19ab7577b1b6b86a))
* **ngw-connector:** fixes to apiRequest cancel work ([e4451d8](https://github.com/nextgis/nextgisweb_frontend/commit/e4451d8a7ad349ba17692a3f906677f1a29bf691)), closes [#6](https://github.com/nextgis/nextgisweb_frontend/issues/6)
* **ngw-kit:** fix like and ilike filter requests ([2ddb8ff](https://github.com/nextgis/nextgisweb_frontend/commit/2ddb8ffc15c78578d4145c16daaec9244468385e))
* **ngw-kit:** make async onFirstShowAdapter hide and show methods ([502b261](https://github.com/nextgis/nextgisweb_frontend/commit/502b261b478872aed0bed0657b961481c22ce109))
* **ngw-kit:** remove duplicates from a query with filter by ANY condition ([f689a21](https://github.com/nextgis/nextgisweb_frontend/commit/f689a2197c0e18efa27513d440485fa785c28f76))
* **ngw-uploader:** correct imports and sandbox url ([4d78e25](https://github.com/nextgis/nextgisweb_frontend/commit/4d78e25f758d4f4274c5914bd319e7e788e68d23))
* **ngw-сщттусещк:** resource search query parent_id param ([a1079d4](https://github.com/nextgis/nextgisweb_frontend/commit/a1079d42219e4997840eb59cd7e413ccf785590b))
* remove require imports ([2674a8c](https://github.com/nextgis/nextgisweb_frontend/commit/2674a8ce29ef4116b939283ee1f4ec02b26b8025))
* **webmap:** webmap constructor options ([e096e72](https://github.com/nextgis/nextgisweb_frontend/commit/e096e723d76b8db753ecdd0248b601f24fcb5026))


### Code Refactoring

* change WebMap and NgwMap constructor options ([3b05f95](https://github.com/nextgis/nextgisweb_frontend/commit/3b05f959d6285c62aa08332c9342f24b82a3e732))


### Features

* **area:** add new Area package ([c723d1a](https://github.com/nextgis/nextgisweb_frontend/commit/c723d1a144d9218ae1c586ac633afaa01bcc3c94))
* **leaflet-map-adapter:** add position to vector adapter layers definition ([053ccf0](https://github.com/nextgis/nextgisweb_frontend/commit/053ccf05ed8d9d76592c8ca648365e176c609277))
* **nge-kit:** add uploadFeatureAttachment util ([da40397](https://github.com/nextgis/nextgisweb_frontend/commit/da40397b7cc3943c9570dc13eb3ca7420f97a6ee)), closes [#CU-m356](https://github.com/nextgis/nextgisweb_frontend/issues/CU-m356)
* **ngw-kit:** add identify item for speedup ngw selection ([4f751d0](https://github.com/nextgis/nextgisweb_frontend/commit/4f751d0af8b1b7973d0979fef5beaf4c5b8e17b4))
* **ngw-kit:** ngwwebmap item toggle on zoom layer range ([52abb1d](https://github.com/nextgis/nextgisweb_frontend/commit/52abb1d2fee3b2c306b9269e8287d98362ef5128))


### BREAKING CHANGES

* `new WebMap({ mapAdapter: new MapAdapter(), ...appOptions, mapOptions: MapOptions })` > `new WebMap(mapOptions)`
* `new NgwMap(new MapAdapter(), ngwMapOptions)` > `new NgwMap(ngwMapOptions)`
* `WebMapOptions.create` is now `true` by default





## [1.16.6](https://github.com/nextgis/nextgisweb_frontend/compare/v1.16.5...v1.16.6) (2023-02-09)

**Note:** Version bump only for package @nextgis/frontend_test

## [1.16.5](https://github.com/nextgis/nextgisweb_frontend/compare/v1.16.4...v1.16.5) (2023-02-09)

**Note:** Version bump only for package @nextgis/frontend_test

## [1.16.2](https://github.com/nextgis/nextgisweb_frontend/compare/v1.16.1...v1.16.2) (2022-09-15)

**Note:** Version bump only for package @nextgis/frontend_test

## [1.16.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.16.0...v1.16.1) (2022-09-03)

**Note:** Version bump only for package @nextgis/frontend_test

## [1.12.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.12.0...v1.12.1) (2022-04-21)

**Note:** Version bump only for package @nextgis/frontend_test

# [1.12.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.11.10...v1.12.0) (2022-03-05)

### Bug Fixes

- **ngw-kit:** remove duplicates from a query with filter by ANY condition ([95ecce5](https://github.com/nextgis/nextgisweb_frontend/commit/95ecce5135a9bd534287ea1925a959fdf4edbd20))

# [1.11.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.10.0...v1.11.0) (2021-12-19)

**Note:** Version bump only for package @nextgis/frontend_test

# [1.10.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.9.7...v1.10.0) (2021-11-30)

**Note:** Version bump only for package @nextgis/frontend_test

## [1.9.4](https://github.com/nextgis/nextgisweb_frontend/compare/v1.9.3...v1.9.4) (2021-11-16)

**Note:** Version bump only for package @nextgis/frontend_test

## [1.9.3](https://github.com/nextgis/nextgisweb_frontend/compare/v1.9.2...v1.9.3) (2021-11-05)

### Bug Fixes

- **ngw-сщттусещк:** resource search query parent_id param ([06d44d7](https://github.com/nextgis/nextgisweb_frontend/commit/06d44d776cd222f75b01f59d929a25c494234f9a))
- **ngw-connector:** clean cache on resource delete ([0816107](https://github.com/nextgis/nextgisweb_frontend/commit/0816107542757838811a7ed9b9e814e51912254c))
- **ngw-kit:** fix like and ilike filter requests ([911f7e3](https://github.com/nextgis/nextgisweb_frontend/commit/911f7e35159b4dbe171177aa3ab014b1d505fbce))

## [1.9.2](https://github.com/nextgis/nextgisweb_frontend/compare/v1.9.1...v1.9.2) (2021-10-26)

**Note:** Version bump only for package @nextgis/frontend_test

## [1.8.4](https://github.com/nextgis/nextgisweb_frontend/compare/v1.8.3...v1.8.4) (2021-10-21)

### Features

- **ngw-kit:** ngwwebmap item toggle on zoom layer range ([f7c4e42](https://github.com/nextgis/nextgisweb_frontend/commit/f7c4e42fe323f9e4941dbc37893b3beb2ccd7751))

## [1.8.3](https://github.com/nextgis/nextgisweb_frontend/compare/v1.8.2...v1.8.3) (2021-10-12)

### Bug Fixes

- **ngw-kit:** make async onFirstShowAdapter hide and show methods ([e5d43b6](https://github.com/nextgis/nextgisweb_frontend/commit/e5d43b6156cd961619908a9100e204c36d42bcb0))

# [1.7.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.6.0...v1.7.0) (2021-09-16)

### Features

- **leaflet-map-adapter:** add position to vector adapter layers definition ([61cb7a5](https://github.com/nextgis/nextgisweb_frontend/commit/61cb7a591ed3ececcabed710abf1e0aec6708c1b))

## [1.5.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.5.0...v1.5.1) (2021-09-06)

**Note:** Version bump only for package @nextgis/frontend_test

# [1.4.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.3.0...v1.4.0) (2021-08-17)

**Note:** Version bump only for package @nextgis/frontend_test

# [1.3.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.2.8...v1.3.0) (2021-08-06)

**Note:** Version bump only for package @nextgis/frontend_test

## [1.2.3](https://github.com/nextgis/nextgisweb_frontend/compare/v1.2.2...v1.2.3) (2021-07-21)

**Note:** Version bump only for package @nextgis/frontend_test

# [1.2.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.1.2...v1.2.0) (2021-07-08)

**Note:** Version bump only for package @nextgis/frontend_test

# [1.1.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.1...v1.1.0) (2021-06-25)

**Note:** Version bump only for package @nextgis/frontend_test

# [1.0.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.9...v1.0.0) (2021-06-07)

### Bug Fixes

- **ngw-uploader:** correct imports and sandbox url ([d27891d](https://github.com/nextgis/nextgis_frontend/commit/d27891db05360167842efbbfcc43ee7a15d3008f))

### Features

- **nge-kit:** add uploadFeatureAttachment util ([14fa802](https://github.com/nextgis/nextgis_frontend/commit/14fa802d237976f8b2c75584cfb0659ed31bd2b8)), closes [#CU-m356](https://github.com/nextgis/nextgis_frontend/issues/CU-m356)

# [1.0.0-beta.9](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2021-05-03)

### Features

- **ngw-kit:** add identify item for speedup ngw selection ([b051f9f](https://github.com/nextgis/nextgisweb_frontend/commit/b051f9f6f596f3a54645e5ccbc628907ed83fca1))

# [1.0.0-beta.6](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-04-04)

### Features

- **area:** add new Area package ([6658344](https://github.com/nextgis/nextgisweb_frontend/commit/665834493f2d25f2163b57bf41f9b25cc3c2e086))

# [1.0.0-beta.5](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-02-13)

**Note:** Version bump only for package @nextgis/frontend_test

# [1.0.0-beta.2](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-11-28)

### Bug Fixes

- **ngw-connector:** fixes to apiRequest cancel work ([0ac44ee](https://github.com/nextgis/nextgisweb_frontend/commit/0ac44eee447019593ae80529cc3b063171f8f88c)), closes [#6](https://github.com/nextgis/nextgisweb_frontend/issues/6)

# [1.0.0-beta.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2020-11-16)

**Note:** Version bump only for package @nextgis/frontend_test

# [1.0.0-alpha.9](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-10-15)

### Bug Fixes

- **webmap:** webmap constructor options ([8c92b6c](https://github.com/nextgis/nextgisweb_frontend/commit/8c92b6c17e4b0f69630abb5ad0ffa78234d50a6f))

### Code Refactoring

- change WebMap and NgwMap constructor options ([de7eaf9](https://github.com/nextgis/nextgisweb_frontend/commit/de7eaf900ece63cf91596b726ad19918f3b926b7))

### BREAKING CHANGES

- `new WebMap({ mapAdapter: new MapAdapter(), ...appOptions, mapOptions: MapOptions })` > `new WebMap(mapOptions)`
- `new NgwMap(new MapAdapter(), ngwMapOptions)` > `new NgwMap(ngwMapOptions)`
- `WebMapOptions.create` is now `true` by default

# [1.0.0-alpha.8](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-06)

**Note:** Version bump only for package @nextgis/frontend_test

# [1.0.0-alpha.7](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-09-22)

**Note:** Version bump only for package @nextgis/frontend_test

# [1.0.0-alpha.6](https://gitlab.com/nextgis_private/aeronetservice/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)

**Note:** Version bump only for package @nextgis/frontend_test

# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)

**Note:** Version bump only for package @nextgis/frontend_test

# [1.0.0-alpha.3](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)

### Bug Fixes

- remove require imports ([be789b8](https://github.com/nextgis/nextgisweb_frontend/commit/be789b89f39741efe146da97eeb19460a7cca527))

# [1.0.0-alpha.2](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)

**Note:** Version bump only for package @nextgis/frontend_test

# [1.0.0-alpha.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)

**Note:** Version bump only for package @nextgis/frontend_test

# [1.0.0-alpha.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)

**Note:** Version bump only for package nextgis_frontend_test
