# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.3.0](https://github.com/nextgis/nextgis_frontend/compare/v2.2.3...v2.3.0) (2024-06-07)

**Note:** Version bump only for package @nextgis/cancelable-promise





# [2.1.0](https://github.com/nextgis/nextgis_frontend/compare/v2.0.3...v2.1.0) (2024-04-03)

**Note:** Version bump only for package @nextgis/cancelable-promise





## [2.0.2](https://github.com/nextgis/nextgis_frontend/compare/v2.0.1...v2.0.2) (2024-03-20)

**Note:** Version bump only for package @nextgis/cancelable-promise





# [2.0.0](https://github.com/nextgis/nextgis_frontend/compare/v2.0.0-alpha.2...v2.0.0) (2024-03-19)

**Note:** Version bump only for package @nextgis/cancelable-promise





# [2.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v2.0.0-alpha.0...v2.0.0-alpha.2) (2024-03-15)

**Note:** Version bump only for package @nextgis/cancelable-promise





# [2.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v2.0.0-alpha.0...v2.0.0-alpha.1) (2024-03-13)

**Note:** Version bump only for package @nextgis/cancelable-promise





# [2.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v1.19.5...v2.0.0-alpha.0) (2024-03-04)

**Note:** Version bump only for package @nextgis/cancelable-promise





# [1.19.0](https://github.com/nextgis/nextgis_frontend/compare/v1.18.21...v1.19.0) (2023-11-24)

**Note:** Version bump only for package @nextgis/cancelable-promise





## [1.18.21](https://github.com/nextgis/nextgis_frontend/compare/v1.18.20...v1.18.21) (2023-11-18)

**Note:** Version bump only for package @nextgis/cancelable-promise





## [1.18.3](https://github.com/nextgis/nextgis_frontend/compare/v1.18.2...v1.18.3) (2023-10-06)


### Bug Fixes

* **cancelable-promise:** export CancelError ([caea5ff](https://github.com/nextgis/nextgis_frontend/commit/caea5ff53c4b48b161d9504aa560585d45c1836a))





# [1.17.0](https://github.com/nextgis/nextgis_frontend/compare/v0.5.0...v1.17.0) (2023-09-25)


### Bug Fixes

* **build:** control-container extract css ([ff15f22](https://github.com/nextgis/nextgis_frontend/commit/ff15f221bd46de3d0e32aaa2735f7224d49b24fc))
* **cancelable-promise:** do not cancel already complate promise ([b80bacb](https://github.com/nextgis/nextgis_frontend/commit/b80bacbd3b5fec57ad916bbe2be95b7a34f5e7ec))
* **cancelable-promise:** handle error for CancelablePromise.all ([56bf41e](https://github.com/nextgis/nextgis_frontend/commit/56bf41e472db1191466b4b1bee60fc079b1f22f8))
* **ngw-connector:** remove requestControl ([6c0f2c9](https://github.com/nextgis/nextgis_frontend/commit/6c0f2c9fb92f1fbfdb80328bae91c83214eddc18))
* **ngw-connect:** properly abort request on cancel ([6dc8cd4](https://github.com/nextgis/nextgis_frontend/commit/6dc8cd43baa55280e2c8b8f38b806101f21f674b))
* **webmap:** hide the rest when base layer showing ([152b7ac](https://github.com/nextgis/nextgis_frontend/commit/152b7ac0e8addac9b73ced4afc3d6ac0e0b09d35))


### chore

* build; eslint ([f9a736e](https://github.com/nextgis/nextgis_frontend/commit/f9a736ef43d07f295a9c63015ce745416584bd25))


### Features

* add library cancelable-promise ([7a0d99f](https://github.com/nextgis/nextgis_frontend/commit/7a0d99f7ae874c058068141e8a8634032004195f))
* **cancelable-promise:** add control GetOrCreateDecorator ([55fff86](https://github.com/nextgis/nextgis_frontend/commit/55fff86aa24460b6a2dabe65f76da592c47aa0b8))
* **cancelable-promise:** add timeout ([430bd04](https://github.com/nextgis/nextgis_frontend/commit/430bd044cb44b47723ca105779c1e78a436774a2))
* **cancelable-promise:** create abort control ([e5f8c8a](https://github.com/nextgis/nextgis_frontend/commit/e5f8c8a54ab71bc10f17335511abb97fe1c4ae1f))
* **cancelable-promise:** throw CancelError instead of onCancel callback ([0da1cc9](https://github.com/nextgis/nextgis_frontend/commit/0da1cc98645ec337bd9a869730991c7635e341af))
* **cancelable-promise:** шьзкщму PromisesControl ([8c1d3ce](https://github.com/nextgis/nextgis_frontend/commit/8c1d3cea59960d959044882f27f3adc68e63742d))
* **ngw-kit:** use abort signal in fetch requests ([57a9d0d](https://github.com/nextgis/nextgis_frontend/commit/57a9d0d35df1c490507e1499262749735ec599ba))


### BREAKING CHANGES

* **cancelable-promise:** Removed onCancel argument from CancelablePromise. Now you should handle catch CancelError
* code formatting rules changed to prettier 2.0 compatibility





## 1.16.8 (2023-05-14)


### Bug Fixes

* **build:** control-container extract css ([a02d24b](https://github.com/nextgis/nextgis_frontend/commit/a02d24bf2dbe246420803d5d1be9348e4b647c6d))
* **cancelable-promise:** do not cancel already complate promise ([f32db82](https://github.com/nextgis/nextgis_frontend/commit/f32db820a4a818c92187dbcb07889011d04078d8))
* **cancelable-promise:** handle error for CancelablePromise.all ([0929761](https://github.com/nextgis/nextgis_frontend/commit/0929761d8a70ed14fa54daadb664c1337b260edd))
* **ngw-connector:** remove requestControl ([b1ccdfa](https://github.com/nextgis/nextgis_frontend/commit/b1ccdfacefff0ff89be4c8b32b37978c321d815a))
* **ngw-connect:** properly abort request on cancel ([a2193b7](https://github.com/nextgis/nextgis_frontend/commit/a2193b78c4d24b663b8850946b05712bce1046c4))
* **webmap:** hide the rest when base layer showing ([4cd3950](https://github.com/nextgis/nextgis_frontend/commit/4cd3950c95fd5987819a206295ba6518023c7ff2))


### chore

* build; eslint ([ee1e03d](https://github.com/nextgis/nextgis_frontend/commit/ee1e03d85625b02a09c2ee1e4d66007fbf57d626))


### Features

* add library cancelable-promise ([2cfb08f](https://github.com/nextgis/nextgis_frontend/commit/2cfb08f1143a773a43f1279690e0c9a7e2b2fec5))
* **cancelable-promise:** add control GetOrCreateDecorator ([c99091b](https://github.com/nextgis/nextgis_frontend/commit/c99091bcbe193756787879094639172e1a7a0b98))
* **cancelable-promise:** add timeout ([5b48e4b](https://github.com/nextgis/nextgis_frontend/commit/5b48e4b7e53a64a0f29adb4940c0d0dce2e85c7c))
* **cancelable-promise:** create abort control ([c915206](https://github.com/nextgis/nextgis_frontend/commit/c915206ffad61c28e1020587a41f8844862f3074))
* **cancelable-promise:** throw CancelError instead of onCancel callback ([087180a](https://github.com/nextgis/nextgis_frontend/commit/087180adc9bcea72d1fd02ebdaaef3fd751b0a52))
* **cancelable-promise:** шьзкщму PromisesControl ([e68b127](https://github.com/nextgis/nextgis_frontend/commit/e68b127779e7da634225cec6354198c67ecae874))
* **ngw-kit:** use abort signal in fetch requests ([fe2e5cc](https://github.com/nextgis/nextgis_frontend/commit/fe2e5cc1a291e7e1ea1821a8380f4f4db68ea270))


### BREAKING CHANGES

* **cancelable-promise:** Removed onCancel argument from CancelablePromise. Now you should handle catch CancelError
* code formatting rules changed to prettier 2.0 compatibility





## [1.16.6](https://github.com/nextgis/nextgis_frontend/compare/v1.16.5...v1.16.6) (2023-02-09)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [1.16.5](https://github.com/nextgis/nextgis_frontend/compare/v1.16.4...v1.16.5) (2023-02-09)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [1.16.2](https://github.com/nextgis/nextgis_frontend/compare/v1.16.1...v1.16.2) (2022-09-15)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [1.16.1](https://github.com/nextgis/nextgis_frontend/compare/v1.16.0...v1.16.1) (2022-09-03)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [1.15.1](https://github.com/nextgis/nextgis_frontend/compare/v1.15.0...v1.15.1) (2022-08-02)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.15.0](https://github.com/nextgis/nextgis_frontend/compare/v1.14.0...v1.15.0) (2022-07-27)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [1.13.3](https://github.com/nextgis/nextgis_frontend/compare/v1.13.2...v1.13.3) (2022-05-31)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [1.13.2](https://github.com/nextgis/nextgis_frontend/compare/v1.13.1...v1.13.2) (2022-05-30)

### Features

- **ngw-kit:** use abort signal in fetch requests ([c68a8f1](https://github.com/nextgis/nextgis_frontend/commit/c68a8f1223806ea1820428566d7b7fa6a7cb97a2))

# [1.12.0](https://github.com/nextgis/nextgis_frontend/compare/v1.11.10...v1.12.0) (2022-03-05)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [1.11.10](https://github.com/nextgis/nextgis_frontend/compare/v1.11.9...v1.11.10) (2022-01-20)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.11.0](https://github.com/nextgis/nextgis_frontend/compare/v1.10.0...v1.11.0) (2021-12-19)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [1.8.4](https://github.com/nextgis/nextgis_frontend/compare/v1.8.3...v1.8.4) (2021-10-21)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [1.8.3](https://github.com/nextgis/nextgis_frontend/compare/v1.8.2...v1.8.3) (2021-10-12)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [1.8.2](https://github.com/nextgis/nextgis_frontend/compare/v1.8.1...v1.8.2) (2021-10-05)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.8.0](https://github.com/nextgis/nextgis_frontend/compare/v1.7.0...v1.8.0) (2021-09-22)

### Bug Fixes

- **webmap:** hide the rest when base layer showing ([1641f1b](https://github.com/nextgis/nextgis_frontend/commit/1641f1b2742aae7452e368b1b8312510037f7fa2))

# [1.7.0](https://github.com/nextgis/nextgis_frontend/compare/v1.6.0...v1.7.0) (2021-09-16)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [1.5.1](https://github.com/nextgis/nextgis_frontend/compare/v1.5.0...v1.5.1) (2021-09-06)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.4.0](https://github.com/nextgis/nextgis_frontend/compare/v1.3.0...v1.4.0) (2021-08-17)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [1.2.3](https://github.com/nextgis/nextgis_frontend/compare/v1.2.2...v1.2.3) (2021-07-21)

### Bug Fixes

- **cancelable-promise:** handle error for CancelablePromise.all ([0a47b11](https://github.com/nextgis/nextgis_frontend/commit/0a47b11f11fbb4b6bac1fcba22fa7a9573b4969f))

## [1.2.2](https://github.com/nextgis/nextgis_frontend/compare/v1.2.1...v1.2.2) (2021-07-16)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.2.0](https://github.com/nextgis/nextgis_frontend/compare/v1.1.2...v1.2.0) (2021-07-08)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [1.1.2](https://github.com/nextgis/nextgis_frontend/compare/v1.1.1...v1.1.2) (2021-06-28)

### Bug Fixes

- **cancelable-promise:** do not cancel already complate promise ([c01c871](https://github.com/nextgis/nextgis_frontend/commit/c01c8716f88ee00658ae1e2041af15fbf4631564))

# [1.1.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.1...v1.1.0) (2021-06-25)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [1.0.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0...v1.0.1) (2021-06-08)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.9...v1.0.0) (2021-06-07)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0-beta.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2021-05-02)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0-beta.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-04-23)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0-beta.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-04-04)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0-beta.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-02-13)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0-beta.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-01-17)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0-beta.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-12-19)

### Features

- **cancelable-promise:** add timeout ([3c207b5](https://github.com/nextgis/nextgis_frontend/commit/3c207b54d2910a67ae71c2fa09542d1b06b97ed9))

# [1.0.0-beta.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-11-28)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0-beta.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2020-11-16)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0-alpha.10](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-10-20)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0-alpha.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-10-15)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0-alpha.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-06)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0-alpha.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-09-22)

### Bug Fixes

- **ngw-connector:** remove requestControl ([a5a0484](https://github.com/nextgis/nextgis_frontend/commit/a5a0484eb23393dd44da6b55e22f0b7f6525b6bd))

### Features

- **cancelable-promise:** add control GetOrCreateDecorator ([77eec38](https://github.com/nextgis/nextgis_frontend/commit/77eec38578db300ec5b809daf348b69a2b05078e))

# [1.0.0-alpha.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)

### Features

- **cancelable-promise:** improve PromisesControl ([ca5fabb](https://github.com/nextgis/nextgis_frontend/commit/ca5fabb60e998f19713704011db58588487aebe7))
- **cancelable-promise:** create abort control ([9768157](https://github.com/nextgis/nextgis_frontend/commit/976815713d25b1da20a96b678668648caf2c0489))

# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0-alpha.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)

**Note:** Version bump only for package @nextgis/cancelable-promise

# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)

### Bug Fixes

- **ngw-connect:** properly abort request on cancel ([9ea9859](https://github.com/nextgis/nextgis_frontend/commit/9ea98591679584d7e23ef47a8bca5c4558527db4))

## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)

### Features

- **cancelable-promise:** throw CancelError instead of onCancel callback ([7b7ef11](https://github.com/nextgis/nextgis_frontend/commit/7b7ef112db2ead4fc02bac14eb61534d570b8a65))

### BREAKING CHANGES

- **cancelable-promise:** Removed onCancel argument from CancelablePromise. Now you should handle catch CancelError

## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)

### Bug Fixes

- **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))

# [0.29.0](https://github.com/nextgis/nextgis_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)

### chore

- build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))

### BREAKING CHANGES

- code formatting rules changed to prettier 2.0 compatibility

# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)

**Note:** Version bump only for package @nextgis/cancelable-promise

## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)

### Features

- add library cancelable-promise ([5227983](https://github.com/nextgis/nextgis_frontend/commit/5227983e03b0a5aa5807002f63914fa2d23154b0))
