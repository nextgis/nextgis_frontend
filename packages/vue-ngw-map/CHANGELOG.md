# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.18.4](https://github.com/nextgis/nextgis_frontend/compare/v1.18.3...v1.18.4) (2023-10-07)

**Note:** Version bump only for package @nextgis/vue-ngw-map





## [1.18.3](https://github.com/nextgis/nextgis_frontend/compare/v1.18.2...v1.18.3) (2023-10-06)

**Note:** Version bump only for package @nextgis/vue-ngw-map





## [1.18.2](https://github.com/nextgis/nextgis_frontend/compare/v1.18.1...v1.18.2) (2023-10-04)

**Note:** Version bump only for package @nextgis/vue-ngw-map





## [1.18.1](https://github.com/nextgis/nextgis_frontend/compare/v1.18.0...v1.18.1) (2023-10-03)

**Note:** Version bump only for package @nextgis/vue-ngw-map





# [1.18.0](https://github.com/nextgis/nextgis_frontend/compare/v1.17.0...v1.18.0) (2023-10-02)

**Note:** Version bump only for package @nextgis/vue-ngw-map





# [1.17.0](https://github.com/nextgis/nextgis_frontend/compare/v0.5.0...v1.17.0) (2023-09-25)


### Bug Fixes

* **build:** control-container extract css ([ff15f22](https://github.com/nextgis/nextgis_frontend/commit/ff15f221bd46de3d0e32aaa2735f7224d49b24fc))
* **cesium-map-adapter:** set layer adapters request headers ([1430387](https://github.com/nextgis/nextgis_frontend/commit/1430387627af0b6a593ff1b64c9f86979344de5c))
* **leaflet-map-adapter:** maxBounds hotfix ([fc8069e](https://github.com/nextgis/nextgis_frontend/commit/fc8069ebc01d7beaaa308f96a53326c1abe933ca))
* **ngw-connector:** fixes to apiRequest cancel work ([40fee1a](https://github.com/nextgis/nextgis_frontend/commit/40fee1a96a389a0d617bd35b6140db4f4a097eb6)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
* **ngw-connector:** update error response status code list ([7e7fcf2](https://github.com/nextgis/nextgis_frontend/commit/7e7fcf229cd7b62d308ac179421ab4c28cad2159))
* **vue:** fix vue observable leaks ([7931934](https://github.com/nextgis/nextgis_frontend/commit/79319343e100d75903fa354956b923b5782c903a))
* **vue:** layer and control components ([ad53eee](https://github.com/nextgis/nextgis_frontend/commit/ad53eeeaf7fd45eb4b8c19535c185219c225b8d2))
* **vue:** prop definition ([58efbeb](https://github.com/nextgis/nextgis_frontend/commit/58efbebad542bbddec4d614adcd7caa9e00fdcf8))
* **vue:** set types for VueNgwMap adapter components ([d481f51](https://github.com/nextgis/nextgis_frontend/commit/d481f515e9e16d3c375d1c42fa9cee721042bbfe))
* **webmap:** hide the rest when base layer showing ([152b7ac](https://github.com/nextgis/nextgis_frontend/commit/152b7ac0e8addac9b73ced4afc3d6ac0e0b09d35))
* **webmap:** webmap constructor options ([81b53ee](https://github.com/nextgis/nextgis_frontend/commit/81b53ee68e1d0f3b945038c718e999d0f5cfe15c))


### Build System

* wepmap to rollup ([8b27550](https://github.com/nextgis/nextgis_frontend/commit/8b27550fc396a032d637996d43679362baa2d0c4))


### chore

* build; eslint ([f9a736e](https://github.com/nextgis/nextgis_frontend/commit/f9a736ef43d07f295a9c63015ce745416584bd25))
* **vue-ngw-map:** update dependencies ([7100009](https://github.com/nextgis/nextgis_frontend/commit/71000090d5745b8ef28409f3001edb5c6d359081))


### Code Refactoring

* **utils:** update geom utils ([caebd68](https://github.com/nextgis/nextgis_frontend/commit/caebd68833967eeb23f78c35bdaa3c83bdf7442d))


### Features

* add setViewDelay options to control map update ([7a06377](https://github.com/nextgis/nextgis_frontend/commit/7a06377c556975b51f828d8c823195aa727dfe88))
* **cesium:** implement getCenter ([4d88345](https://github.com/nextgis/nextgis_frontend/commit/4d883458b88ec1736deef624730bc13d4ec423a1))
* handle vector layer mouse over and out events ([82700e2](https://github.com/nextgis/nextgis_frontend/commit/82700e2e9fddd85a4282126a6c8b917a6f29d9ca))
* **leaflet-map-adapter:** add position to vector adapter layers definition ([3a20a8c](https://github.com/nextgis/nextgis_frontend/commit/3a20a8c2bedbd953e7e29446e1acf28a5ce68a4d))
* **ngw-map:** default bounds; add mapOption for show osm baselayer ([3b8368d](https://github.com/nextgis/nextgis_frontend/commit/3b8368de62fbd773875273cba21dac07983e2fe5))
* **ol-map-adapter:** add map native adapterOptions parameter ([0a40227](https://github.com/nextgis/nextgis_frontend/commit/0a40227725979737ff28f89949ffa3d92703f93d))
* **paint:** add experimental paint 3d style ([b970433](https://github.com/nextgis/nextgis_frontend/commit/b97043374696683efdf174949a68eef3759e06e2))
* **utils:** add `full` method ([f29aa3e](https://github.com/nextgis/nextgis_frontend/commit/f29aa3e9ccf324d9044489bd311c12c765148fe9))
* **utils:** add flatten and unflatten functions ([b4c3aa3](https://github.com/nextgis/nextgis_frontend/commit/b4c3aa3d32bdfd74847f397d5d54e5eadd8398b8))
* **vue-ngw-map:** map props priority ([cdf2fc6](https://github.com/nextgis/nextgis_frontend/commit/cdf2fc6bbc14c6b8f5505c10ca67d650122183ac))
* **vue:** add GeojsonLayer ([f9cb1fd](https://github.com/nextgis/nextgis_frontend/commit/f9cb1fd2e5b4ba11faf4e22ee76f0e9576de5dac))
* **vue:** add GeojsonLayer paint param ([acae03f](https://github.com/nextgis/nextgis_frontend/commit/acae03fe016fb164579adf4abf51013974dc1795))
* **vue:** add load emit in VueNgwControl ([cb71699](https://github.com/nextgis/nextgis_frontend/commit/cb71699640034f17e159c3e8dab5cec7d4bf5b3f))
* **vue:** add VueNgwLayer component ([b5f3cd3](https://github.com/nextgis/nextgis_frontend/commit/b5f3cd39671aad080568efdcfc319a11df33d6f3))
* **vue:** GeojsonLayer selected model and onClick ([d29c601](https://github.com/nextgis/nextgis_frontend/commit/d29c60173cc77b380d52817c2463302ff0dd3b28))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([4e2d149](https://github.com/nextgis/nextgis_frontend/commit/4e2d1495810480af84fee0644061157df1b6f0b5))
* **vue:** VueNgwControl from string  kind option ([31e560b](https://github.com/nextgis/nextgis_frontend/commit/31e560ba8808a4875a1b9307036b51ae43e3685f))
* **vue:** VueNgwMap add onLoad event ([84fea5b](https://github.com/nextgis/nextgis_frontend/commit/84fea5bac521d89afa6706584900ec03bb516361))
* **vue:** VueNgwMap bounds param watch ([2f716b3](https://github.com/nextgis/nextgis_frontend/commit/2f716b3617f1de7e25366c02af75ba76b64268c1))
* **webmap:** add async control in correct order ([be78ff3](https://github.com/nextgis/nextgis_frontend/commit/be78ff353393ac478213f1d1cb34f199fe8c9fbe))


### BREAKING CHANGES

* **vue-ngw-map:** Vue is now required as peer dependency
* **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead
* No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
* code formatting rules changed to prettier 2.0 compatibility





## [1.16.9](https://github.com/nextgis/nextgis_frontend/compare/v1.16.8...v1.16.9) (2023-07-04)

**Note:** Version bump only for package @nextgis/vue-ngw-map





## 1.16.8 (2023-05-14)


### Bug Fixes

* **build:** control-container extract css ([a02d24b](https://github.com/nextgis/nextgis_frontend/commit/a02d24bf2dbe246420803d5d1be9348e4b647c6d))
* **cesium-map-adapter:** set layer adapters request headers ([38074ba](https://github.com/nextgis/nextgis_frontend/commit/38074ba672e67a635f6c1ea7e30f7de5489a0af3))
* **leaflet-map-adapter:** maxBounds hotfix ([7e51591](https://github.com/nextgis/nextgis_frontend/commit/7e5159150552826907ec6119007b690d834d5a0e))
* **ngw-connector:** fixes to apiRequest cancel work ([e4451d8](https://github.com/nextgis/nextgis_frontend/commit/e4451d8a7ad349ba17692a3f906677f1a29bf691)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
* **ngw-connector:** update error response status code list ([19da260](https://github.com/nextgis/nextgis_frontend/commit/19da26068982e5a9ade2c1db1604f1e58e09e31e))
* **vue:** fix vue observable leaks ([53fcb88](https://github.com/nextgis/nextgis_frontend/commit/53fcb886ada33e8deddd40d7899cab76e48d47f6))
* **vue:** layer and control components ([a2da2df](https://github.com/nextgis/nextgis_frontend/commit/a2da2df66099cbd2ba3aaa2687d6a818c9fa245b))
* **vue:** prop definition ([303dada](https://github.com/nextgis/nextgis_frontend/commit/303dada8e3478a5273e72abf90d6e357ee4ab57b))
* **vue:** set types for VueNgwMap adapter components ([51361df](https://github.com/nextgis/nextgis_frontend/commit/51361dfd913174ec025f954aadbef9ad42302b31))
* **webmap:** hide the rest when base layer showing ([4cd3950](https://github.com/nextgis/nextgis_frontend/commit/4cd3950c95fd5987819a206295ba6518023c7ff2))
* **webmap:** webmap constructor options ([e096e72](https://github.com/nextgis/nextgis_frontend/commit/e096e723d76b8db753ecdd0248b601f24fcb5026))


### Build System

* wepmap to rollup ([c6f038a](https://github.com/nextgis/nextgis_frontend/commit/c6f038ad6bcd2a9581f852b35600b2560381c246))


### chore

* build; eslint ([ee1e03d](https://github.com/nextgis/nextgis_frontend/commit/ee1e03d85625b02a09c2ee1e4d66007fbf57d626))
* **vue-ngw-map:** update dependencies ([13fc35d](https://github.com/nextgis/nextgis_frontend/commit/13fc35dbd959c49d62fb8fad46534eb4da1a6684))


### Code Refactoring

* **utils:** update geom utils ([43c11b0](https://github.com/nextgis/nextgis_frontend/commit/43c11b0f3c45b22ab66789bd00594d34078316f3))


### Features

* add setViewDelay options to control map update ([a83e5ab](https://github.com/nextgis/nextgis_frontend/commit/a83e5ab9ed6207e0a41fd31a3c56cd14a512c50d))
* **cesium:** implement getCenter ([6eb5db5](https://github.com/nextgis/nextgis_frontend/commit/6eb5db52ac974a5cfcb7407ced56982b2a22dd6b))
* handle vector layer mouse over and out events ([1f537c2](https://github.com/nextgis/nextgis_frontend/commit/1f537c277b433db365b319d4bbdfb26aa44528fd))
* **leaflet-map-adapter:** add position to vector adapter layers definition ([053ccf0](https://github.com/nextgis/nextgis_frontend/commit/053ccf05ed8d9d76592c8ca648365e176c609277))
* **ngw-map:** default bounds; add mapOption for show osm baselayer ([b376198](https://github.com/nextgis/nextgis_frontend/commit/b376198b1b9038899a6ec46ed97e443d9f591365))
* **ol-map-adapter:** add map native adapterOptions parameter ([5128ce4](https://github.com/nextgis/nextgis_frontend/commit/5128ce4497c6d81987b7506f6500a097fe5f9095))
* **paint:** add experimental paint 3d style ([25fce10](https://github.com/nextgis/nextgis_frontend/commit/25fce10064a2b38f8e50f92402b585956ce5b425))
* **utils:** add `full` method ([39d1dee](https://github.com/nextgis/nextgis_frontend/commit/39d1dee32c1e5f21c079d8e8e393aa31c0794225))
* **utils:** add flatten and unflatten functions ([9584ccb](https://github.com/nextgis/nextgis_frontend/commit/9584ccbeaa2b384ac0699c0f47be3cd97ae75d6c))
* **vue-ngw-map:** map props priority ([8c42fb3](https://github.com/nextgis/nextgis_frontend/commit/8c42fb3e2f83a55b70ecdff1337f2b0c776b3d93))
* **vue:** add GeojsonLayer ([de1875b](https://github.com/nextgis/nextgis_frontend/commit/de1875b9f5a962d432ea00ab2e2a0a35ba6f37a9))
* **vue:** add GeojsonLayer paint param ([a2f26a8](https://github.com/nextgis/nextgis_frontend/commit/a2f26a8dbccae5daa3b5071e67ccc60b240c98c3))
* **vue:** add load emit in VueNgwControl ([6ec5fa5](https://github.com/nextgis/nextgis_frontend/commit/6ec5fa587164a9de4fd8de897614286bf46f7fe7))
* **vue:** add VueNgwLayer component ([f5bf617](https://github.com/nextgis/nextgis_frontend/commit/f5bf6177ffb02be346584d49b3b08126a88d82b3))
* **vue:** GeojsonLayer selected model and onClick ([ca76ab8](https://github.com/nextgis/nextgis_frontend/commit/ca76ab877a9e48014813e36d515ae1efd7a4bc40))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([bcea6c3](https://github.com/nextgis/nextgis_frontend/commit/bcea6c35e61f6ba2aab0b25eb30da9f5f719c92e))
* **vue:** VueNgwControl from string  kind option ([9a1a51b](https://github.com/nextgis/nextgis_frontend/commit/9a1a51b4ecad8f74f2bb2f54b67c34b94c4237ad))
* **vue:** VueNgwMap add onLoad event ([8dfb1b8](https://github.com/nextgis/nextgis_frontend/commit/8dfb1b87603af23281f73803d5fad19b6df0ef6a))
* **vue:** VueNgwMap bounds param watch ([d685f49](https://github.com/nextgis/nextgis_frontend/commit/d685f49d30f909b67defb2c02a19ca25b8819f2e))
* **webmap:** add async control in correct order ([e79572c](https://github.com/nextgis/nextgis_frontend/commit/e79572ca8dbe3d41eefb64e9203fa16d0c9aec9e))


### BREAKING CHANGES

* **vue-ngw-map:** Vue is now required as peer dependency
* **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead
* No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
* code formatting rules changed to prettier 2.0 compatibility





## [1.16.7](https://github.com/nextgis/nextgis_frontend/compare/v1.16.6...v1.16.7) (2023-04-21)

**Note:** Version bump only for package @nextgis/vue-ngw-map





## [1.16.6](https://github.com/nextgis/nextgis_frontend/compare/v1.16.5...v1.16.6) (2023-02-09)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.16.5](https://github.com/nextgis/nextgis_frontend/compare/v1.16.4...v1.16.5) (2023-02-09)

### Features

- **vue-ngw-map:** map props priority ([4b5df0b](https://github.com/nextgis/nextgis_frontend/commit/4b5df0bb95df736be6438ea8bbbf13ad7f3d2222))

## [1.16.4](https://github.com/nextgis/nextgis_frontend/compare/v1.16.3...v1.16.4) (2022-09-21)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.16.3](https://github.com/nextgis/nextgis_frontend/compare/v1.16.2...v1.16.3) (2022-09-16)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.16.2](https://github.com/nextgis/nextgis_frontend/compare/v1.16.1...v1.16.2) (2022-09-15)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.16.1](https://github.com/nextgis/nextgis_frontend/compare/v1.16.0...v1.16.1) (2022-09-03)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.16.0](https://github.com/nextgis/nextgis_frontend/compare/v1.15.1...v1.16.0) (2022-08-28)

### Features

- **paint:** add experimental paint 3d style ([74ddd65](https://github.com/nextgis/nextgis_frontend/commit/74ddd65d72fdd5539868d27da58a949ea26cd365))

## [1.15.1](https://github.com/nextgis/nextgis_frontend/compare/v1.15.0...v1.15.1) (2022-08-02)

### chore

- **vue-ngw-map:** update dependencies ([1f2b688](https://github.com/nextgis/nextgis_frontend/commit/1f2b68836c1e3e367bdb1a8c2ff3652e704aae99))

### BREAKING CHANGES

- **vue-ngw-map:** Vue is now required as peer dependency

# [1.15.0](https://github.com/nextgis/nextgis_frontend/compare/v1.14.0...v1.15.0) (2022-07-27)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.14.0](https://github.com/nextgis/nextgis_frontend/compare/v1.13.8...v1.14.0) (2022-07-05)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.13.8](https://github.com/nextgis/nextgis_frontend/compare/v1.13.7...v1.13.8) (2022-06-25)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.13.7](https://github.com/nextgis/nextgis_frontend/compare/v1.13.6...v1.13.7) (2022-06-15)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.13.6](https://github.com/nextgis/nextgis_frontend/compare/v1.13.5...v1.13.6) (2022-06-05)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.13.5](https://github.com/nextgis/nextgis_frontend/compare/v1.13.4...v1.13.5) (2022-05-31)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.13.4](https://github.com/nextgis/nextgis_frontend/compare/v1.13.3...v1.13.4) (2022-05-31)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.13.3](https://github.com/nextgis/nextgis_frontend/compare/v1.13.2...v1.13.3) (2022-05-31)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.13.2](https://github.com/nextgis/nextgis_frontend/compare/v1.13.1...v1.13.2) (2022-05-30)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.13.1](https://github.com/nextgis/nextgis_frontend/compare/v1.13.0...v1.13.1) (2022-05-13)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.13.0](https://github.com/nextgis/nextgis_frontend/compare/v1.12.1...v1.13.0) (2022-05-13)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.12.1](https://github.com/nextgis/nextgis_frontend/compare/v1.12.0...v1.12.1) (2022-04-21)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.12.0](https://github.com/nextgis/nextgis_frontend/compare/v1.11.10...v1.12.0) (2022-03-05)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.11.10](https://github.com/nextgis/nextgis_frontend/compare/v1.11.9...v1.11.10) (2022-01-20)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.11.9](https://github.com/nextgis/nextgis_frontend/compare/v1.11.8...v1.11.9) (2022-01-18)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.11.8](https://github.com/nextgis/nextgis_frontend/compare/v1.11.7...v1.11.8) (2022-01-18)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.11.7](https://github.com/nextgis/nextgis_frontend/compare/v1.11.6...v1.11.7) (2022-01-11)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.11.3](https://github.com/nextgis/nextgis_frontend/compare/v1.11.2...v1.11.3) (2022-01-03)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.11.2](https://github.com/nextgis/nextgis_frontend/compare/v1.11.1...v1.11.2) (2021-12-20)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.11.0](https://github.com/nextgis/nextgis_frontend/compare/v1.10.0...v1.11.0) (2021-12-19)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.10.0](https://github.com/nextgis/nextgis_frontend/compare/v1.9.7...v1.10.0) (2021-11-30)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.9.7](https://github.com/nextgis/nextgis_frontend/compare/v1.9.6...v1.9.7) (2021-11-19)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.9.6](https://github.com/nextgis/nextgis_frontend/compare/v1.9.5...v1.9.6) (2021-11-18)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.9.5](https://github.com/nextgis/nextgis_frontend/compare/v1.9.4...v1.9.5) (2021-11-18)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.9.4](https://github.com/nextgis/nextgis_frontend/compare/v1.9.3...v1.9.4) (2021-11-16)

### Features

- **ol-map-adapter:** add map native adapterOptions parameter ([3368e27](https://github.com/nextgis/nextgis_frontend/commit/3368e2750ab1701aa914c1c288c89f5364ea029e))

## [1.9.3](https://github.com/nextgis/nextgis_frontend/compare/v1.9.2...v1.9.3) (2021-11-05)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.9.2](https://github.com/nextgis/nextgis_frontend/compare/v1.9.1...v1.9.2) (2021-10-26)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.9.1](https://github.com/nextgis/nextgis_frontend/compare/v1.9.0...v1.9.1) (2021-10-25)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.9.0](https://github.com/nextgis/nextgis_frontend/compare/v1.8.5...v1.9.0) (2021-10-23)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.8.4](https://github.com/nextgis/nextgis_frontend/compare/v1.8.3...v1.8.4) (2021-10-21)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.8.3](https://github.com/nextgis/nextgis_frontend/compare/v1.8.2...v1.8.3) (2021-10-12)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.8.2](https://github.com/nextgis/nextgis_frontend/compare/v1.8.1...v1.8.2) (2021-10-05)

### Features

- **vue:** add load emit in VueNgwControl ([ff00a1a](https://github.com/nextgis/nextgis_frontend/commit/ff00a1a154317e9ca6d923e7ef8346ae75bd56ff))

## [1.8.1](https://github.com/nextgis/nextgis_frontend/compare/v1.8.0...v1.8.1) (2021-09-23)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.8.0](https://github.com/nextgis/nextgis_frontend/compare/v1.7.0...v1.8.0) (2021-09-22)

### Bug Fixes

- **webmap:** hide the rest when base layer showing ([1641f1b](https://github.com/nextgis/nextgis_frontend/commit/1641f1b2742aae7452e368b1b8312510037f7fa2))

# [1.7.0](https://github.com/nextgis/nextgis_frontend/compare/v1.6.0...v1.7.0) (2021-09-16)

### Features

- **leaflet-map-adapter:** add position to vector adapter layers definition ([61cb7a5](https://github.com/nextgis/nextgis_frontend/commit/61cb7a591ed3ececcabed710abf1e0aec6708c1b))

# [1.6.0](https://github.com/nextgis/nextgis_frontend/compare/v1.5.1...v1.6.0) (2021-09-09)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.5.1](https://github.com/nextgis/nextgis_frontend/compare/v1.5.0...v1.5.1) (2021-09-06)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.5.0](https://github.com/nextgis/nextgis_frontend/compare/v1.4.0...v1.5.0) (2021-08-19)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.4.0](https://github.com/nextgis/nextgis_frontend/compare/v1.3.0...v1.4.0) (2021-08-17)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.3.0](https://github.com/nextgis/nextgis_frontend/compare/v1.2.8...v1.3.0) (2021-08-06)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.2.8](https://github.com/nextgis/nextgis_frontend/compare/v1.2.7...v1.2.8) (2021-07-27)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.2.7](https://github.com/nextgis/nextgis_frontend/compare/v1.2.6...v1.2.7) (2021-07-26)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.2.6](https://github.com/nextgis/nextgis_frontend/compare/v1.2.5...v1.2.6) (2021-07-23)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.2.4](https://github.com/nextgis/nextgis_frontend/compare/v1.2.3...v1.2.4) (2021-07-22)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.2.3](https://github.com/nextgis/nextgis_frontend/compare/v1.2.2...v1.2.3) (2021-07-21)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.2.2](https://github.com/nextgis/nextgis_frontend/compare/v1.2.1...v1.2.2) (2021-07-16)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.2.1](https://github.com/nextgis/nextgis_frontend/compare/v1.2.0...v1.2.1) (2021-07-12)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.2.0](https://github.com/nextgis/nextgis_frontend/compare/v1.1.2...v1.2.0) (2021-07-08)

### Features

- handle vector layer mouse over and out events ([2e94152](https://github.com/nextgis/nextgis_frontend/commit/2e94152fac64b8e022dab7940614487763ce57af))

## [1.1.2](https://github.com/nextgis/nextgis_frontend/compare/v1.1.1...v1.1.2) (2021-06-28)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.1.1](https://github.com/nextgis/nextgis_frontend/compare/v1.1.0...v1.1.1) (2021-06-25)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.1.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.1...v1.1.0) (2021-06-25)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [1.0.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0...v1.0.1) (2021-06-08)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.0.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.9...v1.0.0) (2021-06-07)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.0.0-beta.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2021-05-03)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.0.0-beta.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2021-05-02)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.0.0-beta.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-04-23)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.0.0-beta.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-04-04)

### Bug Fixes

- **vue:** fix vue observable leaks ([612ea1f](https://github.com/nextgis/nextgis_frontend/commit/612ea1fc72898e1061d4bb3b2a107e59230afd20))
- **vue:** prop definition ([5ccbd4c](https://github.com/nextgis/nextgis_frontend/commit/5ccbd4c605231dabe4bbf233ab597f070f7be413))
- **vue:** set types for VueNgwMap adapter components ([d1e0782](https://github.com/nextgis/nextgis_frontend/commit/d1e078208701e0fe81c552e18af88a7f8cab5c06))

# [1.0.0-beta.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-02-13)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.0.0-beta.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-01-17)

### Features

- add setViewDelay options to control map update ([3c50948](https://github.com/nextgis/nextgis_frontend/commit/3c50948d8ce31d79879cf566f827cee78fc1af31))

# [1.0.0-beta.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-12-19)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.0.0-beta.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-11-28)

### Bug Fixes

- **ngw-connector:** fixes to apiRequest cancel work ([0ac44ee](https://github.com/nextgis/nextgis_frontend/commit/0ac44eee447019593ae80529cc3b063171f8f88c)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)

# [1.0.0-beta.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2020-11-16)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.0.0-alpha.11](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2020-11-02)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.0.0-alpha.10](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-10-20)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.0.0-alpha.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-10-15)

### Bug Fixes

- **cesium-map-adapter:** set layer adapters request headers ([eb2b570](https://github.com/nextgis/nextgis_frontend/commit/eb2b5702062b44b7885d3582fe953986fd4b02d9))
- **leaflet-map-adapter:** maxBounds hotfix ([18452bc](https://github.com/nextgis/nextgis_frontend/commit/18452bc519c15ac2e47927e6145503f5e516d3f4))
- **webmap:** webmap constructor options ([8c92b6c](https://github.com/nextgis/nextgis_frontend/commit/8c92b6c17e4b0f69630abb5ad0ffa78234d50a6f))

### Features

- **ngw-map:** default bounds; add mapOption for show osm baselayer ([8df4e0e](https://github.com/nextgis/nextgis_frontend/commit/8df4e0ea53a41f3df7a782c973686c160c3552d6))
- **utils:** add flatten and unflatten functions ([6562c34](https://github.com/nextgis/nextgis_frontend/commit/6562c34162b7d49e91fe1a6661457a620b737aa7))
- **vue:** add GeojsonLayer paint param ([5b19276](https://github.com/nextgis/nextgis_frontend/commit/5b19276c688affa99afabc3d185307e1c95af34d))
- **vue:** VueNgwMap bounds param watch ([ed6cd1e](https://github.com/nextgis/nextgis_frontend/commit/ed6cd1e1a5919a61d7074e890e66114cbf6b77ba))

# [1.0.0-alpha.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-06)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.0.0-alpha.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-09-22)

### Code Refactoring

- **utils:** update geom utils ([b7e1f7a](https://github.com/nextgis/nextgis_frontend/commit/b7e1f7aab478603f35c49470cfff71d09f58d922))

### BREAKING CHANGES

- **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead

# [1.0.0-alpha.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)

### Bug Fixes

- **vue:** layer and control components ([6cceee9](https://github.com/nextgis/nextgis_frontend/commit/6cceee96465ce962e97ee439efce6f4ebd07e821))

### Features

- **utils:** add `full` method ([00eb185](https://github.com/nextgis/nextgis_frontend/commit/00eb185fe1859a8bb30b2e9f8d8d10c08c88eb7f))
- **vue:** add GeojsonLayer ([eb5fded](https://github.com/nextgis/nextgis_frontend/commit/eb5fded1b60e3616c51c46e723df0395dcb92d5e))
- **vue:** add VueNgwLayer component ([004b62d](https://github.com/nextgis/nextgis_frontend/commit/004b62dde59f8bdadde0367544eb8f6fddf78514))
- **vue:** GeojsonLayer selected model and onClick ([b3b2ce0](https://github.com/nextgis/nextgis_frontend/commit/b3b2ce0d7023bd738a2496f01d8cd9642dff2a0a))

# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.0.0-alpha.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)

### Bug Fixes

- **ngw-connector:** update error response status code list ([c4d4285](https://github.com/nextgis/nextgis_frontend/commit/c4d4285f23490f9dcc3edac8c82b533f6c07ac01))

# [1.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)

### Build System

- wepmap to rollup ([bc66507](https://github.com/nextgis/nextgis_frontend/commit/bc665072f7eefacae748c2cf81f6bdef75d9f8aa))

### BREAKING CHANGES

- No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere

# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)

### Features

- **cesium:** implement getCenter ([ea83d8e](https://github.com/nextgis/nextgis_frontend/commit/ea83d8ebd8972123ba0991388e4e53fce91b077e))

# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)

### Features

- **vue:** VueNgwControl from string kind option ([1050be8](https://github.com/nextgis/nextgis_frontend/commit/1050be8d7488713e10869e1060e76a8da313d21f))
- **webmap:** add async control in correct order ([c2eaab3](https://github.com/nextgis/nextgis_frontend/commit/c2eaab3a0d720a6b6d32fc0d6b2c76bc37e93a8f))

## [0.30.2](https://github.com/nextgis/nextgis_frontend/compare/v0.30.1...v0.30.2) (2020-04-30)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.29.10](https://github.com/nextgis/nextgis_frontend/compare/v0.29.9...v0.29.10) (2020-04-17)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.29.6](https://github.com/nextgis/nextgis_frontend/compare/v0.29.5...v0.29.6) (2020-04-16)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)

### Features

- **vue:** VueNgwMap add onLoad event ([d2a1ecf](https://github.com/nextgis/nextgis_frontend/commit/d2a1ecf296fd001b4307179b70749811ee5e00e1))

## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)

### Bug Fixes

- **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))

# [0.29.0](https://github.com/nextgis/nextgis_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)

### chore

- build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))

### BREAKING CHANGES

- code formatting rules changed to prettier 2.0 compatibility

## [0.28.3](https://github.com/nextgis/nextgis_frontend/compare/v0.28.2...v0.28.3) (2020-03-19)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.28.1](https://github.com/nextgis/nextgis_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)

### Features

- **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgis_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))

## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.25.4](https://github.com/nextgis/nextgis_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.25.3](https://github.com/nextgis/nextgis_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.25.2](https://github.com/nextgis/nextgis_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package @nextgis/vue-ngw-map

## [0.25.1](https://github.com/nextgis/nextgis_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)

**Note:** Version bump only for package @nextgis/vue-ngw-map

# [0.25.0](https://github.com/nextgis/nextgis_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)

**Note:** Version bump only for package @nextgis/vue-ngw-map
