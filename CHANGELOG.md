# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.16.6](https://github.com/nextgis/nextgisweb_frontend/compare/v1.16.5...v1.16.6) (2023-02-09)

### Bug Fixes

- **mapbox-map-adapter:** popup on hover ([d3544e3](https://github.com/nextgis/nextgisweb_frontend/commit/d3544e3cbf9d3a8754c58d596b8f9c240141d461))

## [1.16.5](https://github.com/nextgis/nextgisweb_frontend/compare/v1.16.4...v1.16.5) (2023-02-09)

### Bug Fixes

- **leaflet-map-adapter:** return zero from getZoom ([975ec78](https://github.com/nextgis/nextgisweb_frontend/commit/975ec784366e34a8779fd6aa72c5ebfe4f2ca6c7))
- **ngw-kit:** set image adapter default nd param ([431e7b8](https://github.com/nextgis/nextgisweb_frontend/commit/431e7b8cc4c695309783775bf72280b5b7fc9d4f))
- **webmap:** toggle layer visibility ([fb8ce6a](https://github.com/nextgis/nextgisweb_frontend/commit/fb8ce6ae6981dc4719fa430b0073a205a5314327))

### Features

- **icons:** make ability ro use custom svg ([06816be](https://github.com/nextgis/nextgisweb_frontend/commit/06816bec5a16af698eda98d26e5a7da19f92ef1c))
- **vue-ngw-map:** map props priority ([4b5df0b](https://github.com/nextgis/nextgisweb_frontend/commit/4b5df0bb95df736be6438ea8bbbf13ad7f3d2222))
- **webmap:** make propertiesFilter async ([f21336b](https://github.com/nextgis/nextgisweb_frontend/commit/f21336b0e734c26d7dc171b49dd7788b33661402))

## [1.16.4](https://github.com/nextgis/nextgisweb_frontend/compare/v1.16.3...v1.16.4) (2022-09-21)

### Bug Fixes

- **ngw-map:** correct ngw:select event data for raster layer ([8af8eeb](https://github.com/nextgis/nextgisweb_frontend/commit/8af8eeb0ef64002e786603623d8fa2868374fff5))

## [1.16.3](https://github.com/nextgis/nextgisweb_frontend/compare/v1.16.2...v1.16.3) (2022-09-16)

### Features

- **ngw-kit:** add postgis_layer cls adapter ([ce50b85](https://github.com/nextgis/nextgisweb_frontend/commit/ce50b85af31802e3abea59686786205a7cc261c4))

## [1.16.2](https://github.com/nextgis/nextgisweb_frontend/compare/v1.16.1...v1.16.2) (2022-09-15)

### Bug Fixes

- **ngw-connector:** make login on connect ([a1c414d](https://github.com/nextgis/nextgisweb_frontend/commit/a1c414d3fd49cf407e95dd777145c751d42bb6e6))

### Features

- **ngw-connector:** remove login logic from getUserInfo ([2ee3f29](https://github.com/nextgis/nextgisweb_frontend/commit/2ee3f29a6a694b73fe5e24ab46147aea974761ab))

### BREAKING CHANGES

- **ngw-connector:** The getUserInfo mehod does not emit any more login events. Only login method does this

## [1.16.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.16.0...v1.16.1) (2022-09-03)

### Bug Fixes

- **mapbox-map-adapter:** remove type prop frm native paint ([786e5a2](https://github.com/nextgis/nextgisweb_frontend/commit/786e5a2c280c55e7bfa6a1b257fc52cb2deaa3e1))
- **mapboxgl-map-adapter:** parse mapAdapterOptions ([8693a3c](https://github.com/nextgis/nextgisweb_frontend/commit/8693a3c00ce22da27cdb6f48b0ee977c33980e69))

### Features

- **mapboxgl-map-adapter:** set maxBounds init map option ([c90447a](https://github.com/nextgis/nextgisweb_frontend/commit/c90447aea7e7adbc13a827c9f5517040012970f8))
- move getIdentifyRadius from ngw-map to utils package ([40d1103](https://github.com/nextgis/nextgisweb_frontend/commit/40d1103fd658ed6ffc7f530d47e36f569ad33ba4))

# [1.16.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.15.1...v1.16.0) (2022-08-28)

### Features

- **cesium:** add heightOffset geojson option ([caa9626](https://github.com/nextgis/nextgisweb_frontend/commit/caa9626457d28265ca169e97e006a23f9d6e452e))
- improve geojson adapter multiselect ([30a3223](https://github.com/nextgis/nextgisweb_frontend/commit/30a32237411b60d03246bdc8efe292295ffcef44))
- **paint:** add experimental paint 3d style ([74ddd65](https://github.com/nextgis/nextgisweb_frontend/commit/74ddd65d72fdd5539868d27da58a949ea26cd365))

## [1.15.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.15.0...v1.15.1) (2022-08-02)

### chore

- **vue-ngw-map:** update dependencies ([1f2b688](https://github.com/nextgis/nextgisweb_frontend/commit/1f2b68836c1e3e367bdb1a8c2ff3652e704aae99))

### Features

- **ngw-connector:** add request transform method ([13ec477](https://github.com/nextgis/nextgisweb_frontend/commit/13ec4773aac88b6dc5880727241f3b04ef31fac0))

### BREAKING CHANGES

- **vue-ngw-map:** Vue is now required as peer dependency

# [1.15.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.14.0...v1.15.0) (2022-07-27)

### Features

- **mapbox-map-adapter:** set opacity with native paint ([c227ee3](https://github.com/nextgis/nextgisweb_frontend/commit/c227ee32cb6656cdc3f2c4086b373b49e28245ca))
- **mapbox-map-adapter:** use direct mapAdapteOptions style ([89cd703](https://github.com/nextgis/nextgisweb_frontend/commit/89cd70338f3a75748966017b5f1935f8c992bf56))

# [1.14.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.13.8...v1.14.0) (2022-07-05)

**Note:** Version bump only for package root

## [1.13.8](https://github.com/nextgis/nextgisweb_frontend/compare/v1.13.7...v1.13.8) (2022-06-25)

### Features

- **mapbox-map-adapter:** MVT match paint ([068fe38](https://github.com/nextgis/nextgisweb_frontend/commit/068fe38b29d453a2710df7aa0c35d9ea697be62e))

## [1.13.7](https://github.com/nextgis/nextgisweb_frontend/compare/v1.13.6...v1.13.7) (2022-06-15)

### Features

- **ngw-mapbox:** add MVT support for addNgwlayer ([21f695e](https://github.com/nextgis/nextgisweb_frontend/commit/21f695e0f9a150b66a8c492c5bf30d31b1e21afb))

## [1.13.6](https://github.com/nextgis/nextgisweb_frontend/compare/v1.13.5...v1.13.6) (2022-06-05)

### Features

- **mapobxgl-map-adapter:** improve map initializing ([abb4916](https://github.com/nextgis/nextgisweb_frontend/commit/abb49168b8706e6759368960f2e4d5543c1b78b3))

## [1.13.5](https://github.com/nextgis/nextgisweb_frontend/compare/v1.13.4...v1.13.5) (2022-05-31)

**Note:** Version bump only for package root

## [1.13.4](https://github.com/nextgis/nextgisweb_frontend/compare/v1.13.3...v1.13.4) (2022-05-31)

### Features

- **ngw-connector:** new abort methods ([fb42878](https://github.com/nextgis/nextgisweb_frontend/commit/fb42878b207c6cb53a3636456de44375678966a9))

## [1.13.3](https://github.com/nextgis/nextgisweb_frontend/compare/v1.13.2...v1.13.3) (2022-05-31)

**Note:** Version bump only for package root

## [1.13.2](https://github.com/nextgis/nextgisweb_frontend/compare/v1.13.1...v1.13.2) (2022-05-30)

### Features

- **nglog:** add eachLog option ([19e17c9](https://github.com/nextgis/nextgisweb_frontend/commit/19e17c929c8d896f04eae5f3ad7fd6cfe30fed7f))
- **ngw-connector:** disable transfer-encoding for node requests ([c3ab8e9](https://github.com/nextgis/nextgisweb_frontend/commit/c3ab8e9c296fbc0f809637ed591af97d865a327b))
- **ngw-connector:** disable transfer-encoding for node requests II ([a68c416](https://github.com/nextgis/nextgisweb_frontend/commit/a68c41665a3df49c2d371783f57c1fb53193c816))
- **ngw-kit:** use abort signal in fetch requests ([c68a8f1](https://github.com/nextgis/nextgisweb_frontend/commit/c68a8f1223806ea1820428566d7b7fa6a7cb97a2))

## [1.13.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.13.0...v1.13.1) (2022-05-13)

### Bug Fixes

- **ngw-kit:** remove forgotten log ([5b4eaec](https://github.com/nextgis/nextgisweb_frontend/commit/5b4eaecd8d63e9367e6d69013498133d09533bef))

# [1.13.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.12.1...v1.13.0) (2022-05-13)

### Features

- **webmap:** add MapAdapter map options ([a6b48a4](https://github.com/nextgis/nextgisweb_frontend/commit/a6b48a499122e184ec01ad626c97f6f48b7e3984))

## [1.12.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.12.0...v1.12.1) (2022-04-21)

### Bug Fixes

- **ngw-connector:** getResource cache when keyname ([b893433](https://github.com/nextgis/nextgisweb_frontend/commit/b893433ac58ee4564162ffd241098fa9cccb79d5))
- **ngw-kit:** getIdentifyItems multiple ([fb058d1](https://github.com/nextgis/nextgisweb_frontend/commit/fb058d1ec4bca530c4908edf2039eb370d07af44))

### Features

- **logging:** add logging package ([c4b72a6](https://github.com/nextgis/nextgisweb_frontend/commit/c4b72a6173b47281eb511cf72fda3fb17cec1b27))
- **logging:** add new options ([43e5593](https://github.com/nextgis/nextgisweb_frontend/commit/43e559325cd5c26a39a9df952eb3ee3bfe00bd0d))
- **nglog:** add session and duration fields ([0d76784](https://github.com/nextgis/nextgisweb_frontend/commit/0d76784280081c818d9858a6070073b18f1b90c2))
- **ngw-connector:** add abort signal to request options ([34af90e](https://github.com/nextgis/nextgisweb_frontend/commit/34af90e1af1dca1e03304e21dde4dac81dd06149))
- **ngw-connector:** add recursive option to getChildrenOf ([18b9832](https://github.com/nextgis/nextgisweb_frontend/commit/18b9832edde4d9e0ed36b1371cc73d318e120453))
- **ngw-kit:** disable api clien filter without any case ([8a41394](https://github.com/nextgis/nextgisweb_frontend/commit/8a413945ba6673027ab7f1d53f5e71e72c8fb6b3))
- **ngw-kit:** id fields as number for client filter ([b49e818](https://github.com/nextgis/nextgisweb_frontend/commit/b49e8189485bf1f6067b987e7532e83674b6d6d1))
- **webmap:** add map mouse move events ([2a2eba3](https://github.com/nextgis/nextgisweb_frontend/commit/2a2eba3c2a582093386189106d3bb456c5eb85c0))

# [1.12.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.11.10...v1.12.0) (2022-03-05)

### Bug Fixes

- **mapboxgl-map-adapter:** remove image source on layer remove ([416a181](https://github.com/nextgis/nextgisweb_frontend/commit/416a1815550391fecc108564a76a324d18421a33))
- **ngw-kit:** remove duplicates from a query with filter by ANY condition ([95ecce5](https://github.com/nextgis/nextgisweb_frontend/commit/95ecce5135a9bd534287ea1925a959fdf4edbd20))

### Features

- **mapbox-map-adapter:** upgrade maplibre to 2.x.x ([f322c96](https://github.com/nextgis/nextgisweb_frontend/commit/f322c964538c75655178c96524a514f1765c2f91))
- **ngw-kit:** add ability to render multilayers image adapter ([4aa5c6e](https://github.com/nextgis/nextgisweb_frontend/commit/4aa5c6e0aa56134600cfae7b43721f87b037060b))
- **ngw-kit:** add polygon intersection identify util ([7686231](https://github.com/nextgis/nextgisweb_frontend/commit/7686231f10fb0cd258946187a0e1dc80bb5306f8))
- **ngw-kit:** export getImageAdapterOptions method ([2cd5969](https://github.com/nextgis/nextgisweb_frontend/commit/2cd5969b83ad55b039a14df091bcb2a100c28777))
- **react-ngw-map:** add getContext hook to module export ([d6ff2e1](https://github.com/nextgis/nextgisweb_frontend/commit/d6ff2e1967068ed3707c3debd610e62af82ef4b9))
- **react:** add mapbox and ol packages ([1151da6](https://github.com/nextgis/nextgisweb_frontend/commit/1151da6ed36e772fbe94f028bbd2583c8fbf375c))
- **react:** add react map toggle control component ([95a9639](https://github.com/nextgis/nextgisweb_frontend/commit/95a9639fb39d0a6dcf9db9d647d22f1bcbd0acfa))
- **webmap:** add addLayer onAdded option ([212b7b0](https://github.com/nextgis/nextgisweb_frontend/commit/212b7b082e4ed6a4bec6dd96c7d63d595bbc6743))

## [1.11.10](https://github.com/nextgis/nextgisweb_frontend/compare/v1.11.9...v1.11.10) (2022-01-20)

### Features

- add react-ngw-leaflet library ([0ec1804](https://github.com/nextgis/nextgisweb_frontend/commit/0ec180452e2bda2f89d57e49d7a6630b89b205c1))
- **ngw-kit:** add fetchNgwLayerItems option to disable clietn filter ([f46e2c3](https://github.com/nextgis/nextgisweb_frontend/commit/f46e2c3298b3c30fb21b9174b4d502785ff526bf))

## [1.11.9](https://github.com/nextgis/nextgisweb_frontend/compare/v1.11.8...v1.11.9) (2022-01-18)

### Bug Fixes

- **ngw-kit:** fetchNgwLayerItems client filter ([61eaf9f](https://github.com/nextgis/nextgisweb_frontend/commit/61eaf9f1f9f4310d3e88eb338370dc9e6b5560f3))

## [1.11.8](https://github.com/nextgis/nextgisweb_frontend/compare/v1.11.7...v1.11.8) (2022-01-18)

### Features

- **ngw-kit:** add new selectNgwLayerDistinct util ([cf1ee23](https://github.com/nextgis/nextgisweb_frontend/commit/cf1ee23e3cc7ddb401e22035710ee0d272c51096))
- **ngw-uplader:** save meta on upload ([3f4ec99](https://github.com/nextgis/nextgisweb_frontend/commit/3f4ec99b8986833970516de3c14c35c4cfcc8986))

## [1.11.7](https://github.com/nextgis/nextgisweb_frontend/compare/v1.11.6...v1.11.7) (2022-01-11)

### Bug Fixes

- **mapbox-map-adapter:** point paint stroke color ([4b982de](https://github.com/nextgis/nextgisweb_frontend/commit/4b982de5876b2019f72ecadc1329b2ca286aae32))

## [1.11.6](https://github.com/nextgis/nextgisweb_frontend/compare/v1.11.5...v1.11.6) (2022-01-06)

### Bug Fixes

- **ngw-uploader:** unification of resource createion options ([a3a3773](https://github.com/nextgis/nextgisweb_frontend/commit/a3a3773f3d42fdcffeea1da0298b302a99082280))

## [1.11.5](https://github.com/nextgis/nextgisweb_frontend/compare/v1.11.4...v1.11.5) (2022-01-05)

**Note:** Version bump only for package root

## [1.11.4](https://github.com/nextgis/nextgisweb_frontend/compare/v1.11.3...v1.11.4) (2022-01-05)

### Bug Fixes

- **ngw-uploader:** fixUrlStr for tus uploader ([db32e16](https://github.com/nextgis/nextgisweb_frontend/commit/db32e16ee7b4d09fe8910da6733dc3a210e1c4ab))

### Features

- **ngw-uploader:** style resource options in upload rasetr and vector methods ([776a183](https://github.com/nextgis/nextgisweb_frontend/commit/776a183cf5a0028d855a04acf6fcff6598db7ec8))

## [1.11.3](https://github.com/nextgis/nextgisweb_frontend/compare/v1.11.2...v1.11.3) (2022-01-03)

### Bug Fixes

- **ngw-uploader:** fix createGroup helper method ([6ee71e1](https://github.com/nextgis/nextgisweb_frontend/commit/6ee71e15a0fb1b405a1a9c585b0ab6b81ecab473))

## [1.11.2](https://github.com/nextgis/nextgisweb_frontend/compare/v1.11.1...v1.11.2) (2021-12-20)

### Features

- **ngw-uploader:** use tus for file upload ([2371477](https://github.com/nextgis/nextgisweb_frontend/commit/2371477115637dbd41b2d331f910212b00a33ee5))

## [1.11.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.11.0...v1.11.1) (2021-12-19)

**Note:** Version bump only for package root

# [1.11.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.10.0...v1.11.0) (2021-12-19)

### Bug Fixes

- **ngw-kit:** NgwWebmapLayerAdapter constuctor options ([2122b7d](https://github.com/nextgis/nextgisweb_frontend/commit/2122b7d3017bd896fa9c6aac204914cf2e603f39))
- **ngw-kit:** NgwWebMapLayerAdapter exent constrained ([eedbaeb](https://github.com/nextgis/nextgisweb_frontend/commit/eedbaeb79c13d9774c30a3dc2837e33d04328807))
- **ol-map-adapter:** geojson labelField only for string ([afa2c93](https://github.com/nextgis/nextgisweb_frontend/commit/afa2c938e2d0efce99d6ea6d990d1a59e77e9168))
- **ol-map-adapter:** label type for geojson adapter ([f50ceb0](https://github.com/nextgis/nextgisweb_frontend/commit/f50ceb062ffaf13cc76bbea7dc00b99b45908020))

### Features

- **leaflet-map-adapter:** setMinZoom on maxExtent ([56cf3b6](https://github.com/nextgis/nextgisweb_frontend/commit/56cf3b6eed50f9b6d8c78a21e733eb015bd67712))
- **ngw-uploader:** make ability to upload vector resources ([393f0c0](https://github.com/nextgis/nextgisweb_frontend/commit/393f0c0c92fed7da88f9009efd6faf44be912627))
- **ol-map-adapter:** use geojson layer label calback option ([a849ec7](https://github.com/nextgis/nextgisweb_frontend/commit/a849ec7012d04709ebec00bc4a40a90691b7855c))

### BREAKING CHANGES

- **ngw-uploader:** `createInput` and `dialog` methods have been moved from the `@nextgis/ngw-uploader` to the new `@nextgis/ngw-uploader-input`

# [1.10.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.9.7...v1.10.0) (2021-11-30)

### Features

- **webmap:** add setLayerPaint method ([b1ddac5](https://github.com/nextgis/nextgisweb_frontend/commit/b1ddac5140670aba4f40f0861d6792065653c508))

## [1.9.7](https://github.com/nextgis/nextgisweb_frontend/compare/v1.9.6...v1.9.7) (2021-11-19)

### Features

- **ngw-kit:** add useBasemap NgwWebmaplayerAdapter option ([e4716b1](https://github.com/nextgis/nextgisweb_frontend/commit/e4716b102c5bd289574d12908e9bb2da49807161))

## [1.9.6](https://github.com/nextgis/nextgisweb_frontend/compare/v1.9.5...v1.9.6) (2021-11-18)

### Bug Fixes

- **ngw-kit:** NgwWebmapItem max min zoom calculate ([5f1360f](https://github.com/nextgis/nextgisweb_frontend/commit/5f1360f37460a08adae45122e88ea21db74585e8))

## [1.9.5](https://github.com/nextgis/nextgisweb_frontend/compare/v1.9.4...v1.9.5) (2021-11-18)

### Bug Fixes

- **ngw-map:** return default map bounds ([77b57fc](https://github.com/nextgis/nextgisweb_frontend/commit/77b57fcfbb49aa1d1d261c9d6bf67be85cddfe1f))

## [1.9.4](https://github.com/nextgis/nextgisweb_frontend/compare/v1.9.3...v1.9.4) (2021-11-16)

### Bug Fixes

- **leafelt-map-adapter:** selected layer click event param ([751427a](https://github.com/nextgis/nextgisweb_frontend/commit/751427ac854a940b4d7caccb4ad602fab89133ac))

### Features

- **cache:** add namespaces support ([5426fa6](https://github.com/nextgis/nextgisweb_frontend/commit/5426fa63e7cc89d79824a3d0ef38881511534bf9))
- **ol-map-adapter:** add map native adapterOptions parameter ([3368e27](https://github.com/nextgis/nextgisweb_frontend/commit/3368e2750ab1701aa914c1c288c89f5364ea029e))

## [1.9.3](https://github.com/nextgis/nextgisweb_frontend/compare/v1.9.2...v1.9.3) (2021-11-05)

### Bug Fixes

- **ngw-сщттусещк:** resource search query parent_id param ([06d44d7](https://github.com/nextgis/nextgisweb_frontend/commit/06d44d776cd222f75b01f59d929a25c494234f9a))
- **ngw-connector:** clean cache on resource delete ([0816107](https://github.com/nextgis/nextgisweb_frontend/commit/0816107542757838811a7ed9b9e814e51912254c))
- **ngw-kit:** fix like and ilike filter requests ([911f7e3](https://github.com/nextgis/nextgisweb_frontend/commit/911f7e35159b4dbe171177aa3ab014b1d505fbce))

### Features

- **ngw-kit:** disable default map maxBounds whole world ([9bd643f](https://github.com/nextgis/nextgisweb_frontend/commit/9bd643ff21a4a872236c63b105f764a859fe841c))

### BREAKING CHANGES

- **ngw-kit:** remove default `maxBounds` option fron ngw-kit

## [1.9.2](https://github.com/nextgis/nextgisweb_frontend/compare/v1.9.1...v1.9.2) (2021-10-26)

**Note:** Version bump only for package root

## [1.9.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.9.0...v1.9.1) (2021-10-25)

### Features

- **ngw-kit:** add bbox strategy layer preupdate event ([a3e2b93](https://github.com/nextgis/nextgisweb_frontend/commit/a3e2b93b729e361546b030b9d865dbcf66b58101))

# [1.9.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.8.5...v1.9.0) (2021-10-23)

### Bug Fixes

- **ngw-kit:** do not load BBOX out of min-max zoom range ([9346932](https://github.com/nextgis/nextgisweb_frontend/commit/93469329b210f9721f1739830cbb5095df9db9d8))

### Features

- add BBOX+ strategy; extends options for setView ([88e9d09](https://github.com/nextgis/nextgisweb_frontend/commit/88e9d092bcc3615b99bad13d175f62be3ff73725))
- **ngw-kit:** add BBOX+ strategy ([a954e20](https://github.com/nextgis/nextgisweb_frontend/commit/a954e20e93f74cc60f1abd4b3af77eef7a0a57bb))
- **webmap:** getZoom return number or fail ([accc46a](https://github.com/nextgis/nextgisweb_frontend/commit/accc46a53d1a074b32d4ef5aa41ca2f9df07caaf))

### BREAKING CHANGES

- **webmap:** webMap.getZoom() do not return undefined more; number or fail

## [1.8.5](https://github.com/nextgis/nextgisweb_frontend/compare/v1.8.4...v1.8.5) (2021-10-21)

### Bug Fixes

- **ngw-ol:** layer min-max zoom options ([e59861b](https://github.com/nextgis/nextgisweb_frontend/commit/e59861b491cb3aea418872bf038c65fc4848a694))

## [1.8.4](https://github.com/nextgis/nextgisweb_frontend/compare/v1.8.3...v1.8.4) (2021-10-21)

### Features

- **ngw-kit:** ngwwebmap item toggle on zoom layer range ([f7c4e42](https://github.com/nextgis/nextgisweb_frontend/commit/f7c4e42fe323f9e4941dbc37893b3beb2ccd7751))

## [1.8.3](https://github.com/nextgis/nextgisweb_frontend/compare/v1.8.2...v1.8.3) (2021-10-12)

### Bug Fixes

- **ngw-kit:** make async onFirstShowAdapter hide and show methods ([e5d43b6](https://github.com/nextgis/nextgisweb_frontend/commit/e5d43b6156cd961619908a9100e204c36d42bcb0))

## [1.8.2](https://github.com/nextgis/nextgisweb_frontend/compare/v1.8.1...v1.8.2) (2021-10-05)

### Bug Fixes

- **leaflet-map-adapter:** add getBounds validation ([e9657a2](https://github.com/nextgis/nextgisweb_frontend/commit/e9657a2cbb5a9b4db017c8ed4bdcccb2fad54676))
- **leaflet-map-adapter:** popup content height ([4072c3c](https://github.com/nextgis/nextgisweb_frontend/commit/4072c3c12becf1dd2d537844a5046e670e6718be))
- **webmap:** layer upadate is async ([764eb9c](https://github.com/nextgis/nextgisweb_frontend/commit/764eb9ce199d6062caf6152392ff4be26c940e91))

### Features

- **utils:** add options to flatten ([53a182c](https://github.com/nextgis/nextgisweb_frontend/commit/53a182c13f5f874f2521ac9c2a728f5fc7dff96a))
- **vue:** add load emit in VueNgwControl ([ff00a1a](https://github.com/nextgis/nextgisweb_frontend/commit/ff00a1a154317e9ca6d923e7ef8346ae75bd56ff))

## [1.8.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.8.0...v1.8.1) (2021-09-23)

### Features

- **ngw-kit:** NgwWebmapItem opacity ([98793f3](https://github.com/nextgis/nextgisweb_frontend/commit/98793f32191a113f1883fa5ddc96133aa7360c57))

# [1.8.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.7.0...v1.8.0) (2021-09-22)

### Bug Fixes

- **webmap:** hide the rest when base layer showing ([1641f1b](https://github.com/nextgis/nextgisweb_frontend/commit/1641f1b2742aae7452e368b1b8312510037f7fa2))

### Features

- add nativeOptions for alladdLayer adapter methods ([c99d06e](https://github.com/nextgis/nextgisweb_frontend/commit/c99d06e35c5884b5969b281c98bd3742d6f427ef))

# [1.7.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.6.0...v1.7.0) (2021-09-16)

### Features

- **leaflet-map-adapter:** add position to vector adapter layers definition ([61cb7a5](https://github.com/nextgis/nextgisweb_frontend/commit/61cb7a591ed3ececcabed710abf1e0aec6708c1b))
- **ol-map-adapter:** add position to vector adapter layers defenition ([bd6fd4d](https://github.com/nextgis/nextgisweb_frontend/commit/bd6fd4d0e65f8a2dd1794813dafb9cf04931019b))

# [1.6.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.5.1...v1.6.0) (2021-09-09)

### Features

- **webmap:** new addImageLayer shortcut WebMap method ([a0e452c](https://github.com/nextgis/nextgisweb_frontend/commit/a0e452ccc980440c3a2b563bf8efb73f961f2ff8))
- **webmap:** new addTileLayer shortcut WebMap method ([421198a](https://github.com/nextgis/nextgisweb_frontend/commit/421198a0181b8c817e3ed7736d0734f143de3eeb))

## [1.5.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.5.0...v1.5.1) (2021-09-06)

### Bug Fixes

- **ol-map-adapter:** do not return nothing from poinermove cb ([62b9aff](https://github.com/nextgis/nextgisweb_frontend/commit/62b9aff0a3b93fedb83d33fa770e77c407412a32))
- **ol-map-adapter:** geojson adapter style function type detection ([b731e04](https://github.com/nextgis/nextgisweb_frontend/commit/b731e04977529a30515dbb86dad537f76ecc7fe3))

### Features

- **cesium-map-adapter:** remove camera inertion ([45924fc](https://github.com/nextgis/nextgisweb_frontend/commit/45924fcb8622aabab777d643278fd543f672b918))
- **clipboard:** on static copy return operation status ([251d722](https://github.com/nextgis/nextgisweb_frontend/commit/251d722f29a3d0e2d672f258412bf9b7a901a59f))
- **vue:** add layer toggle listener for baselayerselect ([4b5fa94](https://github.com/nextgis/nextgisweb_frontend/commit/4b5fa94e6a718255c8721c4fcc1d4ebb08a7ca4b))
- **webmap:** change default maxZoom option to 20 ([11d2e99](https://github.com/nextgis/nextgisweb_frontend/commit/11d2e99fcc53976cfb00acc4b5d711cdf2e28fc3))

# [1.5.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.4.0...v1.5.0) (2021-08-19)

### Features

- **leaflet-map-adapter:** change geojson layer opacity ([3d75fb2](https://github.com/nextgis/nextgisweb_frontend/commit/3d75fb2f20d0759839dcaa7650c10740a1f35d22))
- **mapboxgl-map-adapter:** add setLayerOpacity methods ([6d18193](https://github.com/nextgis/nextgisweb_frontend/commit/6d18193b617a42ad50640ec659aa755962954e1b))
- **ol-map-adapter:** add setLayerOpacity mapAdapter and each layer methods ([b291921](https://github.com/nextgis/nextgisweb_frontend/commit/b2919210d44be4f6cf5b00d8e7fa735b98961702))

# [1.4.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.3.0...v1.4.0) (2021-08-17)

### Bug Fixes

- **cesium-map-adapter:** update geojson adapter ([a964c45](https://github.com/nextgis/nextgisweb_frontend/commit/a964c453b3eee87341e6f24f4df29843f41d9fb6))
- **item:** protect tree children arrays from modiffy ([8cdf728](https://github.com/nextgis/nextgisweb_frontend/commit/8cdf7281c0efbea522e2663846cfd396d65d6c5b))
- **leaflet-map-adapter:** repain unSelectOnSecondClick ([c2c0cab](https://github.com/nextgis/nextgisweb_frontend/commit/c2c0cab0302dc80fc776b9f27c778f18de148c77))
- **mapbox-gl-js:** fix for babel build ([099b024](https://github.com/nextgis/nextgisweb_frontend/commit/099b02413c142f192e5d69beb4a7f6462b17990e))
- **mapboxgl-map-adapter:** disable unselect on label hover out ([8b330ec](https://github.com/nextgis/nextgisweb_frontend/commit/8b330ec3cd63b3dea4c2b110d5530fe29b512bd6))
- **mapboxgl-map-adapter:** fix onSelect event ([c5c5369](https://github.com/nextgis/nextgisweb_frontend/commit/c5c5369767046ca1bac52b1ce21a598f28b8c9e5))
- **mapboxgl-map-adapter:** geojson addlayer protected methods ([cd97194](https://github.com/nextgis/nextgisweb_frontend/commit/cd971940fea380ee8b25e4f7684c207ad2382aed))
- **mapboxgl-map-adapter:** repair unselectOnSecondClick ([c484589](https://github.com/nextgis/nextgisweb_frontend/commit/c4845897458d9da73a37ecd57879d038103f3f57))
- **mapboxgl-map-adapter:** select features by propertiesfilter improve ([ba0cf64](https://github.com/nextgis/nextgisweb_frontend/commit/ba0cf64c46611051fa0258525b9342d1a7832b65))
- **ol-map-adapter:** repair unselect on second click ([a85d87c](https://github.com/nextgis/nextgisweb_frontend/commit/a85d87cbf7ad8f19caa8212d532d51a3dd886bd6))

### Features

- **dom:** add new options o loadScript function ([0b62145](https://github.com/nextgis/nextgisweb_frontend/commit/0b62145ae19923956a267b87e01fe4200dff222e))
- **mapboxgl-map-adapter:** implement labelOnHover option ([b0f7507](https://github.com/nextgis/nextgisweb_frontend/commit/b0f75075fdbbc3d7a8cceb6ff329a1e629ac169e))
- **mapboxgl-map-adapter:** label on hover improve ([6e946ff](https://github.com/nextgis/nextgisweb_frontend/commit/6e946ff16a04c7ee45fd06f565f6207619f8ea70))
- **webmap:** add WebMapLayers.unSelectLayers method ([2e479ce](https://github.com/nextgis/nextgisweb_frontend/commit/2e479ceb547c99f2e1c0cc30c08c435e61298b6d))

# [1.3.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.2.8...v1.3.0) (2021-08-06)

### Bug Fixes

- **ngw-connector:** remove caching for update put request ([0a7f621](https://github.com/nextgis/nextgisweb_frontend/commit/0a7f621538f6ed6ff3150d4c1589ae70a5a7dd14))
- **webmap:** disable experimental left and right control positions ([c8c6fb7](https://github.com/nextgis/nextgisweb_frontend/commit/c8c6fb73c33985b19ecfc908f7d25d6a2f23d778))

### Features

- improve popup, add new options, ol support ([75e73fa](https://github.com/nextgis/nextgisweb_frontend/commit/75e73faac7f393d0c62f9966786da78c7f54c039))
- **mapbox-gl-js:** improve popup ([31694bc](https://github.com/nextgis/nextgisweb_frontend/commit/31694bc94aebb53eff3ff2422b148cd956f5166b))
- **ol-map-adapter:** add srs options to draw vector layer ([6a76486](https://github.com/nextgis/nextgisweb_frontend/commit/6a76486e75bd6a6fb5e00a45b0815f3a27aba03e))
- **webmap:** add getControlContainer method ([26a51bc](https://github.com/nextgis/nextgisweb_frontend/commit/26a51bc53c2f2a7219ed05a4ef4d6b3eaab03560))

## [1.2.8](https://github.com/nextgis/nextgisweb_frontend/compare/v1.2.7...v1.2.8) (2021-07-27)

### Bug Fixes

- **leaflet-map-adapter:** geojson selection ([1022e71](https://github.com/nextgis/nextgisweb_frontend/commit/1022e71d46f5513f0ff3a60f4be7d96a84ff4f15))

## [1.2.7](https://github.com/nextgis/nextgisweb_frontend/compare/v1.2.6...v1.2.7) (2021-07-26)

### Bug Fixes

- **ngw-kit:** createGeojsonAdapter propertiesFilter ([8beacb0](https://github.com/nextgis/nextgisweb_frontend/commit/8beacb0b0f2f8599c73be934fadcf2bae5ab5f85))
- **ngw-kit:** duplication of the server filter by the client ([3561426](https://github.com/nextgis/nextgisweb_frontend/commit/3561426999cd58bceed008e974caeb9f0b8f5e2a))

### Features

- **ngw-kit:** duplication of the server filter by the client ([5fc0e92](https://github.com/nextgis/nextgisweb_frontend/commit/5fc0e92e625ecebae49a793f15e641a7a68716e7))
- **ngw-kit:** update loaded date before property filter ([b40df4d](https://github.com/nextgis/nextgisweb_frontend/commit/b40df4d8742e970060e3eee60c6549d53567b938))

## [1.2.6](https://github.com/nextgis/nextgisweb_frontend/compare/v1.2.5...v1.2.6) (2021-07-23)

### Bug Fixes

- **leaflet-map-adapter:** resolve geojson adapter layerdefinition problem ([071fd5a](https://github.com/nextgis/nextgisweb_frontend/commit/071fd5ae4f0e6b41d1644ba050cd201e806f7445))

## [1.2.5](https://github.com/nextgis/nextgisweb_frontend/compare/v1.2.4...v1.2.5) (2021-07-22)

### Bug Fixes

- **mapbox-map-adapter:** show label not only for filtered layer ([8caa4c3](https://github.com/nextgis/nextgisweb_frontend/commit/8caa4c399a2a2e8cf38c172c4208c80987da1c1c))

## [1.2.4](https://github.com/nextgis/nextgisweb_frontend/compare/v1.2.3...v1.2.4) (2021-07-22)

### Bug Fixes

- **mapboxgl-map-adapter:** clean popup on vectorlayer remove ([7851b73](https://github.com/nextgis/nextgisweb_frontend/commit/7851b7310b11f269d6632f5b72d8c5eeb99a7959))

### Features

- **leaflet-map-adapter:** label redraw on map position change ([241efc1](https://github.com/nextgis/nextgisweb_frontend/commit/241efc142ef29eef898e5b4adadff3e8208a3091))
- **mapbox-map-adapter:** GeoJson layer label workaround ([b7fa371](https://github.com/nextgis/nextgisweb_frontend/commit/b7fa371e5a22943e726962e92244d9d164da685e))

## [1.2.3](https://github.com/nextgis/nextgisweb_frontend/compare/v1.2.2...v1.2.3) (2021-07-21)

### Bug Fixes

- **cancelable-promise:** handle error for CancelablePromise.all ([0a47b11](https://github.com/nextgis/nextgisweb_frontend/commit/0a47b11f11fbb4b6bac1fcba22fa7a9573b4969f))
- **cesium:** empty default imagery provider ([f17c211](https://github.com/nextgis/nextgisweb_frontend/commit/f17c2113e24a2af46bd6283eb64eb10b5b987ac9))
- **vuetify:** improve BaselayerSelect ([89d8ef5](https://github.com/nextgis/nextgisweb_frontend/commit/89d8ef5c25b6858fae345e4061f471ba52bb2c7d))

### Features

- **mapboxgl-map-adapter:** add popup for selected feature ([ef87167](https://github.com/nextgis/nextgisweb_frontend/commit/ef87167a8df611a0e7b55c04b8090af14c053adc))
- **ngw-kit:** export createPopupContent util ([a7f00dc](https://github.com/nextgis/nextgisweb_frontend/commit/a7f00dcffbf21d5516fc27a3e704c85785fc07c0))

## [1.2.2](https://github.com/nextgis/nextgisweb_frontend/compare/v1.2.1...v1.2.2) (2021-07-16)

### Bug Fixes

- **mapbox-map-adapter:** change osm adapter url ([9af5679](https://github.com/nextgis/nextgisweb_frontend/commit/9af56796fa35ad4ef635d747aaf90cf9a29481a9))
- **ngw-connector:** disable request params list convert to object ([f67aeae](https://github.com/nextgis/nextgisweb_frontend/commit/f67aeae8aa35d8c6adbc1f8229d1e3bdc09f9acc))
- **webmap:** add check for layer exist on properties filter ([dbcd588](https://github.com/nextgis/nextgisweb_frontend/commit/dbcd588cd29d66f8927f1c748f8aeec74a13d9e4))

### Features

- **ngw-kit:** handle Infinity in fetchNgwItems query limit param ([8a634d7](https://github.com/nextgis/nextgisweb_frontend/commit/8a634d7d8fe0e1ef926802f7eec36f8b097170fd))

## [1.2.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.2.0...v1.2.1) (2021-07-12)

### Bug Fixes

- **ol-map-adapter:** geojson adapter layer remove ([3705f27](https://github.com/nextgis/nextgisweb_frontend/commit/3705f27c5d75aba9f385ceda27aa26ef94cb0533))
- **utils:** fix objectDeepEqual function ([720eabe](https://github.com/nextgis/nextgisweb_frontend/commit/720eabe7645a66fc3addd118c724679af6264652))

### Performance Improvements

- **ol-map-adapter:** style function for each feature ([fed8575](https://github.com/nextgis/nextgisweb_frontend/commit/fed8575d7beb6dd23b22cc2eff2e02b73f0c8f7b))

# [1.2.0](https://github.com/nextgis/nextgisweb_frontend/compare/v1.1.2...v1.2.0) (2021-07-08)

### Bug Fixes

- **ngw-connector:** do not create new instance on same url and auth ([2ddb39f](https://github.com/nextgis/nextgisweb_frontend/commit/2ddb39fd8376420d5b1bbd0d617485cb9ff82f67))

### Features

- handle vector layer mouse over and out events ([2e94152](https://github.com/nextgis/nextgisweb_frontend/commit/2e94152fac64b8e022dab7940614487763ce57af))
- **vue:** update cache on resource store patch ([3f0cac7](https://github.com/nextgis/nextgisweb_frontend/commit/3f0cac7923d59bdbe1589f00dbdc581564deb02f))

# [1.0.0-beta.10](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-beta.9...v1.0.0-beta.10) (2021-05-18)

## [1.1.2](https://github.com/nextgis/nextgis_frontend/compare/v1.1.1...v1.1.2) (2021-06-28)

### Bug Fixes

- **cancelable-promise:** do not cancel already complate promise ([c01c871](https://github.com/nextgis/nextgis_frontend/commit/c01c8716f88ee00658ae1e2041af15fbf4631564))
- **ngw-kit:** protect firstShowAdapter from multiple creation ([55061f8](https://github.com/nextgis/nextgis_frontend/commit/55061f8f1d2cb2102ca05ecf7430f40182c361f6))

### Features

- **cesium:** change default screenSpaceError value ([9a417d6](https://github.com/nextgis/nextgis_frontend/commit/9a417d6c3b64a01f6e6d94abfa08cbdd942b1038))

## [1.1.1](https://github.com/nextgis/nextgis_frontend/compare/v1.1.0...v1.1.1) (2021-06-25)

**Note:** Version bump only for package root

# [1.1.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.1...v1.1.0) (2021-06-25)

### Features

- **cache:** add array to match options deep compare ([b3e6717](https://github.com/nextgis/nextgis_frontend/commit/b3e67174977f0985678580a2ef1096220a787ff5))
- **cache:** new package to cache key value with async ability ([4b429a9](https://github.com/nextgis/nextgis_frontend/commit/4b429a93f2ef7d5a362ae708375ee87c18e2c464))
- **ngw-connector:** get already created connector by url only ([0eb5e2f](https://github.com/nextgis/nextgis_frontend/commit/0eb5e2f58fd82485ee825cae3bab3f3ff598b8eb))
- **ngw-kit:** features request cache option ([1182bc7](https://github.com/nextgis/nextgis_frontend/commit/1182bc7b9d74f958f49804b7ceeb840869e3f232))

### types

- **ngw-connector:** rename ([0e7f0b9](https://github.com/nextgis/nextgis_frontend/commit/0e7f0b979a774ea27ad45a0f7d7576ff11ad8d56))

### BREAKING CHANGES

- **ngw-connector:** FeatureLayerFields type is now FeatureProperties

## [1.0.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0...v1.0.1) (2021-06-08)

### types

- rename interface ([b8e5f7c](https://github.com/nextgis/nextgis_frontend/commit/b8e5f7cd4a2bdb289a34fb7a11b3f560b5dd897c))

### BREAKING CHANGES

- change GetNgwLayerItemsOptions to GetNgwItemsOptions

# [1.0.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.9...v1.0.0) (2021-06-07)

### Bug Fixes

- **ngw-connect:** remove unnecessary console log ([ef6bd02](https://github.com/nextgis/nextgis_frontend/commit/ef6bd026e69132694fbc6b83fdab480712d0377e))
- **ngw-connector:** do not throw error on node data load6 use promise reject ([c33c178](https://github.com/nextgis/nextgis_frontend/commit/c33c178dadcf30cfe12e9f6bf07bbc6e59da4188))
- **ngw-kit:** fix emppty identify geometry ([9bc2342](https://github.com/nextgis/nextgis_frontend/commit/9bc2342aae5441497acf0ade2b9fc993ab6a3f09))
- **ngw-kit:** on first adapter wait while show layer ([32fe7a0](https://github.com/nextgis/nextgis_frontend/commit/32fe7a0afde48fc8a46626fac1b5f8aa0b942775))
- **ngw-uploader:** correct imports and sandbox url ([d27891d](https://github.com/nextgis/nextgis_frontend/commit/d27891db05360167842efbbfcc43ee7a15d3008f))
- **qms:** add createQmsAdapter options ([65cf6ee](https://github.com/nextgis/nextgis_frontend/commit/65cf6eec97cf9d12db118c9a0ccdb8e50bad4e88))

### Features

- **nge-kit:** add uploadFeatureAttachment util ([14fa802](https://github.com/nextgis/nextgis_frontend/commit/14fa802d237976f8b2c75584cfb0659ed31bd2b8)), closes [#CU-m356](https://github.com/nextgis/nextgis_frontend/issues/CU-m356)
- **ngw-kit:** update features request params on no geom ([352fd22](https://github.com/nextgis/nextgis_frontend/commit/352fd220dca87de7018b86206aac31008f5a7e20))
- **url-runtime-params:** remove trailing sharp from hash ([514adec](https://github.com/nextgis/nextgis_frontend/commit/514adec69c697beacb6d2aee88c0dfd50f540006))
- **utils:** add degrees to radian transform function ([9ce078a](https://github.com/nextgis/nextgis_frontend/commit/9ce078a4aef77ed58efad8a7e1736a7d49172a1d))
- **vuetify:** NgwLayersList remove layer ability ([320ce0e](https://github.com/nextgis/nextgis_frontend/commit/320ce0effd76c6562036c6558564cecc06e83231)), closes [#CU-jzby65](https://github.com/nextgis/nextgis_frontend/issues/CU-jzby65)
- **webmap:** webmap container get set functions ([f0a1491](https://github.com/nextgis/nextgis_frontend/commit/f0a1491a471ccfa2538c48c1b307d6d5fa3d713c))

# [1.0.0-beta.9](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2021-05-03)

### Bug Fixes

- **demo:** show codepen icon ([4ed6968](https://github.com/nextgis/nextgisweb_frontend/commit/4ed6968e7afac56e19c332cd02ebbb40c9043259))

### Features

- **ngw-kit:** add identify item for speedup ngw selection ([b051f9f](https://github.com/nextgis/nextgisweb_frontend/commit/b051f9f6f596f3a54645e5ccbc628907ed83fca1))

# [1.0.0-beta.8](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2021-05-02)

### Features

- **ngw-kit:** ngw webmap item bookmarks handler ([edd02b9](https://github.com/nextgis/nextgisweb_frontend/commit/edd02b9025e5d5572c9c79f627044c6f0fceab93))

# [1.0.0-beta.7](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-04-23)

### Bug Fixes

- **ngw-connector:** get resource children resourceId zero check ([73d50ec](https://github.com/nextgis/nextgisweb_frontend/commit/73d50ecd07d023ed53699ac7e4b151c6b879e1ab))
- **ngw-connector:** use `this` in fabric method ([f7d5763](https://github.com/nextgis/nextgisweb_frontend/commit/f7d5763379057623f645cbe099f4372c076def61))
- **ngw-kit:** ngw-webmap tree sublevel order ([25dc798](https://github.com/nextgis/nextgisweb_frontend/commit/25dc798f63f4f20b0bb1011c849efec11248c683))

# [1.0.0-beta.6](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-04-04)

### Bug Fixes

- **cesium:** change geojson extrude height set ([96df3c2](https://github.com/nextgis/nextgisweb_frontend/commit/96df3c257c6ef07ca9139bdb456936399f1a539f))
- **demo:** import utils from cdn ([f064e84](https://github.com/nextgis/nextgisweb_frontend/commit/f064e84214cc4347722c34e966fb67fac184db7f))
- **leafelet-map-adapter:** safe make remote options ([70dc9d6](https://github.com/nextgis/nextgisweb_frontend/commit/70dc9d66faf75d9344d2532dba16112081f13861))
- **ngw-connector:** node request write data for no POST mode ([e31533f](https://github.com/nextgis/nextgisweb_frontend/commit/e31533fb888b91e655804abb51951b0a744fe618))
- **ngw-kit:** inject item into the createRasterAdapter class factory ([567809b](https://github.com/nextgis/nextgisweb_frontend/commit/567809b366231f4b78453f52e544e6bc134cd486))
- **ngw-kit:** insert headers into createOnFirstShowAdapter addLayer method ([d230fe2](https://github.com/nextgis/nextgisweb_frontend/commit/d230fe2f484f42ff1e0a99f9ff33d60526b55bdd))
- **vue:** fix vue observable leaks ([612ea1f](https://github.com/nextgis/nextgisweb_frontend/commit/612ea1fc72898e1061d4bb3b2a107e59230afd20))
- **vue:** prop definition ([5ccbd4c](https://github.com/nextgis/nextgisweb_frontend/commit/5ccbd4c605231dabe4bbf233ab597f070f7be413))
- **vue:** set types for VueNgwMap adapter components ([d1e0782](https://github.com/nextgis/nextgisweb_frontend/commit/d1e078208701e0fe81c552e18af88a7f8cab5c06))

### Features

- **area:** add new Area package ([6658344](https://github.com/nextgis/nextgisweb_frontend/commit/665834493f2d25f2163b57bf41f9b25cc3c2e086))
- **eslint:** add prettier rules ([457c0a1](https://github.com/nextgis/nextgisweb_frontend/commit/457c0a1c6362fb99020e536ee48860ed03ca7aa7))
- **ngw-kit:** add datetime ngw formatter ([2d75cca](https://github.com/nextgis/nextgisweb_frontend/commit/2d75cca95106aa6eeeb9ae3bd8348f8e92b72bc8))
- **utils:** add getPolygons coordinates function ([ff5864b](https://github.com/nextgis/nextgisweb_frontend/commit/ff5864b9070712c62bb7060bdcb75a9c7dddff99))
- **utils:** clipbord static create may throw error ([102a843](https://github.com/nextgis/nextgisweb_frontend/commit/102a8432158a3e6c345daaea40e0055bdfd76812))

# [1.0.0-beta.5](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-02-13)

### Bug Fixes

- **cesium:** TileLayer ordering ([41a8f05](https://github.com/nextgis/nextgisweb_frontend/commit/41a8f05dc5050b54886b1bac22fbd31fb6218f14))
- **cesium:** Tilset3D adapter paint ([5f6160a](https://github.com/nextgis/nextgisweb_frontend/commit/5f6160af45867a3a31697c0b1659619a5a09fcee))

### Features

- **cesium:** add tilset3d adapter paint options ([a9caba5](https://github.com/nextgis/nextgisweb_frontend/commit/a9caba56225609202ff350e232ada5af77bbfa6a))
- **ngw-kit:** add feature request srs param ([3deb546](https://github.com/nextgis/nextgisweb_frontend/commit/3deb54649789736aacd2ebf6f3f71f388938debb))
- **ngw-kit:** improve createOnFirstShowAdapter ([7a522d7](https://github.com/nextgis/nextgisweb_frontend/commit/7a522d7ca715ef49c41e219b955b4eba573973dd))
- **utils:** add function to get coordinates from bbox ([d7b2ea7](https://github.com/nextgis/nextgisweb_frontend/commit/d7b2ea7cef1b53e01f4a8aacf929d0b115a01778))
- **webmap:** ratio in vectorlayer adapter interface ([cc3d835](https://github.com/nextgis/nextgisweb_frontend/commit/cc3d835879c5223e73e6db1026db1a419980182f))

### Performance Improvements

- **ngw-commector:** decrease get resource queries count ([598e6e8](https://github.com/nextgis/nextgisweb_frontend/commit/598e6e81c1e57b00d49dc7027ac9d3f017949814))

# [1.0.0-beta.4](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-01-17)

### Bug Fixes

- **leaflet:** remove forgotten console logs ([4954cde](https://github.com/nextgis/nextgisweb_frontend/commit/4954cdebbb5c4859126c9ac5d1599b7d8ec04f78))

### Features

- add setViewDelay options to control map update ([3c50948](https://github.com/nextgis/nextgisweb_frontend/commit/3c50948d8ce31d79879cf566f827cee78fc1af31))
- **tree:** TreeHelper ([4bd96b9](https://github.com/nextgis/nextgisweb_frontend/commit/4bd96b994beab84283dc79398ee9a9b4b98a7790))
- **utils:** geom coordinates count ([0455afa](https://github.com/nextgis/nextgisweb_frontend/commit/0455afa68865ec1759499ece16e93fed00ea541f))
- **webmap:** create webmap from TileJson ([9e84ea1](https://github.com/nextgis/nextgisweb_frontend/commit/9e84ea18653104030884f6fec76e7680436d71bd))
- **webmap:** get zoom from tilejson ([80ded2f](https://github.com/nextgis/nextgisweb_frontend/commit/80ded2f2a908b54c046dd4e4f01046edd88e398c))

### Performance Improvements

- **leaflet:** abort image overlay request on view change ([d8613f0](https://github.com/nextgis/nextgisweb_frontend/commit/d8613f0be10e730d1ec9bb4ee0f2fa27c1687009))
- **leaflet:** abort xhr tile loading on setView ([f7e9ed0](https://github.com/nextgis/nextgisweb_frontend/commit/f7e9ed044ed39fbc95c73ad381560e692dda6046))
- **leaflet:** setViewDelay for tile layer ([229ef92](https://github.com/nextgis/nextgisweb_frontend/commit/229ef9211a9aac27b5d7ca86f04118e291579d8b))

# [1.0.0-beta.3](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-12-19)

### Bug Fixes

- **cesium-map-adapter:** extent from bounding sphere ([336bbe9](https://github.com/nextgis/nextgisweb_frontend/commit/336bbe901ca8d982b32eadbdcf2d603886667815))
- **ngw-kit:** show only one enabled webmap basemap ([18a6022](https://github.com/nextgis/nextgisweb_frontend/commit/18a6022f5b58b45ee6b5bd92c6053fe3d3842866))
- **utils:** function name typos ([06d7a75](https://github.com/nextgis/nextgisweb_frontend/commit/06d7a753a26211ca4ac374d166cf457437fdccb6))
- **vue:** NgwlayersList independent mode ([57e1c35](https://github.com/nextgis/nextgisweb_frontend/commit/57e1c35b4d57f9edff31318df8036777ed8f8657))
- **vuetify:** NgwLayersList init select ([46ec3cb](https://github.com/nextgis/nextgisweb_frontend/commit/46ec3cbcd9159c27b30ceda3523a9a9c53432c98))
- provide support for map preclick event ([9400b31](https://github.com/nextgis/nextgisweb_frontend/commit/9400b31c116d15f6ae9e68b7b2c0369fa1f906b9)), closes [#8](https://github.com/nextgis/nextgisweb_frontend/issues/8)
- **webmap:** set zero zoom ([059e6ea](https://github.com/nextgis/nextgisweb_frontend/commit/059e6ea243a0ba0b6cce58905dde58485bc5d372))

### Features

- **cancelable-promise:** add timeout ([3c207b5](https://github.com/nextgis/nextgisweb_frontend/commit/3c207b54d2910a67ae71c2fa09542d1b06b97ed9))
- **cesium-map-adapter:** add watchTerrainChange geojson option ([15f1d8e](https://github.com/nextgis/nextgisweb_frontend/commit/15f1d8ef5ba427b5dc27f6c9d9b470887947ab4d))
- add new library `progress` ([5a75e8c](https://github.com/nextgis/nextgisweb_frontend/commit/5a75e8c219e0c8c0aef2f9e4f0536709b93cd59c))

# [1.0.0-beta.2](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-11-28)

### Bug Fixes

- **ngw-connector:** fixes to apiRequest cancel work ([0ac44ee](https://github.com/nextgis/nextgisweb_frontend/commit/0ac44eee447019593ae80529cc3b063171f8f88c)), closes [#6](https://github.com/nextgis/nextgisweb_frontend/issues/6)
- **ngw-kit:** clean layer adapter options ([642b1e8](https://github.com/nextgis/nextgisweb_frontend/commit/642b1e810a337231a989b323f24d0c5502efd9ee))
- **ngw-kit:** ngw webmap item childrensafe reverse ([fbcb433](https://github.com/nextgis/nextgisweb_frontend/commit/fbcb4330b193cb914fa184ccdb6ac81bc2b8a5f6))
- **ngw-kit:** not identify for not supported layer ([1fbd7dc](https://github.com/nextgis/nextgisweb_frontend/commit/1fbd7dc28c7d6bc6fa4b1ac20e894fbbd3b27a2c))
- **ngw-map:** identify order ([1635f61](https://github.com/nextgis/nextgisweb_frontend/commit/1635f61e0c38fd913a850807cd1d084320016d3a))
- **utils:** applyMixin options on no replace ([4362c4c](https://github.com/nextgis/nextgisweb_frontend/commit/4362c4cb36dcd885803bb9dde36512ced21287cb))

### Features

- **cesium-map-adapter:** add geojson adapter getExtent method ([84f0fb9](https://github.com/nextgis/nextgisweb_frontend/commit/84f0fb991c1f013d0f08e28c4e168d85cb1d31a4))
- **cesium-map-adapter:** add map click event ([90ac3ab](https://github.com/nextgis/nextgisweb_frontend/commit/90ac3ab3464341984da524306b19f0e966e1ef72))
- **cesium-map-adapter:** add subdomains for TileAdapter ([36e6b93](https://github.com/nextgis/nextgisweb_frontend/commit/36e6b932c7f1b62ece5ca2d1ff1109e3e65be97f))
- **ngw-kit:** add toGeojson in ngw layer item response ([a9f073a](https://github.com/nextgis/nextgisweb_frontend/commit/a9f073a50dac3ecf3472e7b90f4124b8e3a6b772))
- **ngw-kit:** log to get item extensions if not request param set ([b2bf132](https://github.com/nextgis/nextgisweb_frontend/commit/b2bf13205d4b2a04ca58f63b03523007dcaff199))
- **ngw-kit:** update feature request params ([4b2ffe8](https://github.com/nextgis/nextgisweb_frontend/commit/4b2ffe8170216e168bdd8f977a0d72d87277c181))
- **ngw-map:** add promise groups handler ([864fc6d](https://github.com/nextgis/nextgisweb_frontend/commit/864fc6d3a905e72136df3795f1e86046d54e0fd4))
- **qms-kit:** add subdomains support from origin_url ([8b6eb1a](https://github.com/nextgis/nextgisweb_frontend/commit/8b6eb1a7d60c27f3592b26642a4cfcd25086dcb5))
- **utils:** add debug log util ([6435c77](https://github.com/nextgis/nextgisweb_frontend/commit/6435c779050faa8b0e36945c69bbd22a55dba5ca))
- **utils:** deprecated helper utils ([9bab695](https://github.com/nextgis/nextgisweb_frontend/commit/9bab695eb840d49015c739c8f871305e57640aab))

### Performance Improvements

- **ngw-map:** identify only when listeners exist ([f591343](https://github.com/nextgis/nextgisweb_frontend/commit/f5913431b110b001e1403ee59fc97c343ea576c6))

### BREAKING CHANGES

- **ngw-kit:** `extensions` for any ngw feature request is now empty for default
- **utils:** removed latLng from MapClickEvent, use lngLat: numner[] instead

# [1.0.0-beta.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2020-11-16)

**Note:** Version bump only for package root

# [1.0.0-alpha.11](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2020-11-02)

### Bug Fixes

- **cesium:** disable zoom undergroung ([fac7bdf](https://github.com/nextgis/nextgisweb_frontend/commit/fac7bdf43fd570aba5f97ec13c77225e32e32a0b))
- **cesium:** do not clamp to ground 3d geojson ([78e1be3](https://github.com/nextgis/nextgisweb_frontend/commit/78e1be384b3a708d2c89136d3f63890315b738b8))
- **ngw-map:** constructor options for control ([7d40e0c](https://github.com/nextgis/nextgisweb_frontend/commit/7d40e0c6d52f3d734cd5f28173f03e4a1a0943df))
- **vue:** NgwLayersList selection event ([054b42a](https://github.com/nextgis/nextgisweb_frontend/commit/054b42a90559196ab4302a6607d8fad8e4d0910c))
- **vue:** NgwlayersList visibility toggle ([e5a9d5c](https://github.com/nextgis/nextgisweb_frontend/commit/e5a9d5c9d9333e155364e99a1164c805ddd29f94))
- **webmap:** constructor options; move controls options from ngw to webmap ([611b8c0](https://github.com/nextgis/nextgisweb_frontend/commit/611b8c0af120c726ccf42eca0a608edbd54bb1c1))

### Features

- **ngw-kit:** add feature request extensions param ([0a3f839](https://github.com/nextgis/nextgisweb_frontend/commit/0a3f839925b23012a406bfe088cb318c0f1b2cf0))
- **ngw-kit:** add parse date from ngw feature and store util ([6cc45de](https://github.com/nextgis/nextgisweb_frontend/commit/6cc45ded20b3e14f464c63ed02db1a385689f540))
- **utils:** add geojson eachCoordinates util ([f50e556](https://github.com/nextgis/nextgisweb_frontend/commit/f50e5568cff8af3426842201a1e9310d825424eb))
- **vue:** selection for NgwLayersList ([7029a73](https://github.com/nextgis/nextgisweb_frontend/commit/7029a73555d73b1937f44d82ce0d5942fa933c49))
- **vue:** use vuetify tree prop to NgwLayersList selection strategy ([2c5f5e6](https://github.com/nextgis/nextgisweb_frontend/commit/2c5f5e663a07b2945c7884ffb6902d0463ee225e))

# [1.0.0-alpha.10](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-10-20)

### Bug Fixes

- **ngw-kit:** remove async from NgwWebmapItem child add ([024cd13](https://github.com/nextgis/nextgisweb_frontend/commit/024cd13781f8c089af081511d8a784c4b0089405))
- **ngw-kit:** set NgwWebmap tree item property before layer load ([edb38ab](https://github.com/nextgis/nextgisweb_frontend/commit/edb38abb8a45d7ee1933a1fee633c753a52e11eb))
- **ngw-kit:** webmap item children ordering ([952f72f](https://github.com/nextgis/nextgisweb_frontend/commit/952f72fca18b6222e53d8ac3a5ad615ae40a2aa1))
- **ngw-map:** constructor options ([d78dd12](https://github.com/nextgis/nextgisweb_frontend/commit/d78dd1268c916479359a70299aa42dcfaac0e738))

### Code Refactoring

- **webmap:** change default paint ([1baea95](https://github.com/nextgis/nextgisweb_frontend/commit/1baea95158e2cd8b79ec2de6b95a377030951d0f))

### Features

- **casium:** zoomIn and zoomOut onground control ([00818d0](https://github.com/nextgis/nextgisweb_frontend/commit/00818d08489456dc0c5104191e70cf9c21c945f3))
- **vue:** NgwlayersList bubble with propagation ([2c023bd](https://github.com/nextgis/nextgisweb_frontend/commit/2c023bd29b54c47d67e1eb0afe5589772e6e3359))
- **vue:** NgwLayersList ctrl key to propagation reverse ([2ecf4a5](https://github.com/nextgis/nextgisweb_frontend/commit/2ecf4a553cd8788018b664c7e5bf3e8e4fc62b12))

### BREAKING CHANGES

- **webmap:** changed the default paint: the fill is semi-transparent, add stroke

# [1.0.0-alpha.9](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-10-15)

### Bug Fixes

- **cesium-map-adapter:** set layer adapters request headers ([eb2b570](https://github.com/nextgis/nextgisweb_frontend/commit/eb2b5702062b44b7885d3582fe953986fd4b02d9))
- **leaflet-map-adapter:** maxBounds hotfix ([18452bc](https://github.com/nextgis/nextgisweb_frontend/commit/18452bc519c15ac2e47927e6145503f5e516d3f4))
- **ngw-connector:** retunr undefined on empty apiRequest ([32bca5d](https://github.com/nextgis/nextgisweb_frontend/commit/32bca5df691840740095b62465ff58c1a05c2586))
- **ngw-kit:** not stringify null on save ngw feature ([9174017](https://github.com/nextgis/nextgisweb_frontend/commit/91740174be9086af26568e48deff3b9d3c353fe3))
- **utils:** update applyMixins util to allow babel build ([a46cb82](https://github.com/nextgis/nextgisweb_frontend/commit/a46cb82d09b955aa43ab901750aa0ed5975b9fdd))
- **webmap:** webmap constructor options ([8c92b6c](https://github.com/nextgis/nextgisweb_frontend/commit/8c92b6c17e4b0f69630abb5ad0ffa78234d50a6f))

### Code Refactoring

- change WebMap and NgwMap constructor options ([de7eaf9](https://github.com/nextgis/nextgisweb_frontend/commit/de7eaf900ece63cf91596b726ad19918f3b926b7))

### Features

- add getExtent method for all mapAdapters GeoJsonLayerAdapter ([9254c3b](https://github.com/nextgis/nextgisweb_frontend/commit/9254c3bf4b1200c69126d770525a8b6b20a9f5c2))
- **geocoder:** index for all result items ([a1c705c](https://github.com/nextgis/nextgisweb_frontend/commit/a1c705ce27681df4a7765ff746f69a3c000e70fd))
- **item:** add @nextgis/tree dependency ([a0d6cc5](https://github.com/nextgis/nextgisweb_frontend/commit/a0d6cc56d7a972d1891242feeff4e746d7e45e94))
- **ngw-connector:** add static create method ([00b58d7](https://github.com/nextgis/nextgisweb_frontend/commit/00b58d7e8be7d898142f44cd53414c45dbc4408e))
- **ngw-kit:** calculate group NgwWebMapItem init visibility ([3ec0d57](https://github.com/nextgis/nextgisweb_frontend/commit/3ec0d5719a21f4e963b8132268ed4d529edc4556))
- **ngw-map:** default bounds; add mapOption for show osm baselayer ([8df4e0e](https://github.com/nextgis/nextgisweb_frontend/commit/8df4e0ea53a41f3df7a782c973686c160c3552d6))
- **ngw-orm:** validate resource ([c8ec5f2](https://github.com/nextgis/nextgisweb_frontend/commit/c8ec5f21be1100f55d728ddfcc825a059de99520))
- **ol-map-adapter:** use add layer opacity option ([0e8aa48](https://github.com/nextgis/nextgisweb_frontend/commit/0e8aa48dd0a154c37e187cea54951f4d596ef88d))
- **utils:** add flatten and unflatten functions ([6562c34](https://github.com/nextgis/nextgisweb_frontend/commit/6562c34162b7d49e91fe1a6661457a620b737aa7))
- **vue:** add GeojsonLayer paint param ([5b19276](https://github.com/nextgis/nextgisweb_frontend/commit/5b19276c688affa99afabc3d185307e1c95af34d))
- **vue:** NgwLayersList propagation param ([636c46b](https://github.com/nextgis/nextgisweb_frontend/commit/636c46bf387be491819297e42346beea246de8f1))
- **vue:** VueNgwMap bounds param watch ([ed6cd1e](https://github.com/nextgis/nextgisweb_frontend/commit/ed6cd1e1a5919a61d7074e890e66114cbf6b77ba))

### Performance Improvements

- **vue:** Vuetify NgwLayersList set visibility only for changed ([bfddc9e](https://github.com/nextgis/nextgisweb_frontend/commit/bfddc9e062c155d3e9ea62f6df18bacbc34acadd))

### BREAKING CHANGES

- `new WebMap({ mapAdapter: new MapAdapter(), ...appOptions, mapOptions: MapOptions })` > `new WebMap(mapOptions)`
- `new NgwMap(new MapAdapter(), ngwMapOptions)` > `new NgwMap(ngwMapOptions)`
- `WebMapOptions.create` is now `true` by default

# [1.0.0-alpha.8](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-06)

### Features

- **geocoder:** add new geocoder package ([e8aa41b](https://github.com/nextgis/nextgisweb_frontend/commit/e8aa41b35a0ebd1d9a77088d219a93ed061425d8))
- **utils:** add number utils ([d2378ba](https://github.com/nextgis/nextgisweb_frontend/commit/d2378ba53a3d7b371087aba98a99f5b90e007d92))

# [1.0.0-alpha.7](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-09-22)

### Bug Fixes

- **cesium:** TileAdapter baselayer ordering ([c7805c9](https://github.com/nextgis/nextgisweb_frontend/commit/c7805c9fc44303bc936b7af96a101aecc126ed91))
- **ngw-connector:** remove requestControl ([a5a0484](https://github.com/nextgis/nextgisweb_frontend/commit/a5a0484eb23393dd44da6b55e22f0b7f6525b6bd))

### Code Refactoring

- **utils:** update geom utils ([b7e1f7a](https://github.com/nextgis/nextgisweb_frontend/commit/b7e1f7aab478603f35c49470cfff71d09f58d922))

### Features

- **cancelable-promise:** add control GetOrCreateDecorator ([77eec38](https://github.com/nextgis/nextgisweb_frontend/commit/77eec38578db300ec5b809daf348b69a2b05078e))
- **ngw-connector:** add getResourceIdOrError method ([80769c7](https://github.com/nextgis/nextgisweb_frontend/commit/80769c7d2e0a915222a20e3e08476c514f6a0826))
- **util:** add keyInObj typescript helper ([fabb5e0](https://github.com/nextgis/nextgisweb_frontend/commit/fabb5e017d6b3b228d6cdb98a3fffe0ce8e57929))
- **vues:** add onBeforeDelete hook ([be5b966](https://github.com/nextgis/nextgisweb_frontend/commit/be5b966065cdcab13f3883c0c0a65ae28045f906))

### BREAKING CHANGES

- **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead

# [1.0.0-alpha.6](https://gitlab.com/nextgis_private/aeronetservice/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)

### Bug Fixes

- **vue:** layer and control components ([6cceee9](https://gitlab.com/nextgis_private/aeronetservice/commit/6cceee96465ce962e97ee439efce6f4ebd07e821))

### Features

- **cancelable-promise:** improve PromisesControl ([ca5fabb](https://gitlab.com/nextgis_private/aeronetservice/commit/ca5fabb60e998f19713704011db58588487aebe7))
- **cancelable-promise:** create abort control ([9768157](https://gitlab.com/nextgis_private/aeronetservice/commit/976815713d25b1da20a96b678668648caf2c0489))
- **utils:** add `arrayCompareStrict` function ([9d65949](https://gitlab.com/nextgis_private/aeronetservice/commit/9d659496fbcf4dd0e2f467d3e18ad7253fcb7041))
- **utils:** add `full` method ([00eb185](https://gitlab.com/nextgis_private/aeronetservice/commit/00eb185fe1859a8bb30b2e9f8d8d10c08c88eb7f))
- **vue:** add GeojsonLayer ([eb5fded](https://gitlab.com/nextgis_private/aeronetservice/commit/eb5fded1b60e3616c51c46e723df0395dcb92d5e))
- **vue:** add VueNgwLayer component ([004b62d](https://gitlab.com/nextgis_private/aeronetservice/commit/004b62dde59f8bdadde0367544eb8f6fddf78514))
- **vue:** GeojsonLayer selected model and onClick ([b3b2ce0](https://gitlab.com/nextgis_private/aeronetservice/commit/b3b2ce0d7023bd738a2496f01d8cd9642dff2a0a))
- **vue:** vuex ResourceStore override delete function ability ([0814ccd](https://gitlab.com/nextgis_private/aeronetservice/commit/0814ccdd86d96c7bc306569fea08c2439b25e65c))
- **webmap:** remove control from promise ([fbeae95](https://gitlab.com/nextgis_private/aeronetservice/commit/fbeae956a3dc7ad01fd90ac3807f484d3ab79424))

# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)

### Bug Fixes

- **cesium:** add check for telset3d adapter addLayer ([8fbb0f3](https://github.com/nextgis/nextgis_frontend/commit/8fbb0f3741277da85aba68b8f46ab3d64c71a976))
- **ngw-kit:** webmap iten async addLayer method ([ca90340](https://github.com/nextgis/nextgis_frontend/commit/ca90340b927704d5c0101041fe1caa54d62ce164))

### Features

- **ngw-orm:** update VectorLayer.toTypescript ([81619b2](https://github.com/nextgis/nextgis_frontend/commit/81619b29d60cb7ad7da7a404e2ca48b7624a0635))

# [1.0.0-alpha.4](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)

### Bug Fixes

- **leaflet-map-adapter:** init center option ([f0cff9e](https://github.com/nextgis/nextgisweb_frontend/commit/f0cff9ee40e26043b25c85bf556b78a2a0b5366f))

### Features

- **util:** add coord format transformer ([9709333](https://github.com/nextgis/nextgisweb_frontend/commit/97093339c11b104106dc1f9aff3a3b691b02966c))
- **utils:** add DebounceDecorator ([196284c](https://github.com/nextgis/nextgisweb_frontend/commit/196284cc25033d12a3108aa87706c92c3b4317d4))
- **utils:** move some utils from ngw-kit and webmap to geom ([fbd3d91](https://github.com/nextgis/nextgisweb_frontend/commit/fbd3d913485c537e92068b5284691bb47f123b43))

# [1.0.0-alpha.3](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)

### Bug Fixes

- remove require imports ([be789b8](https://github.com/nextgis/nextgisweb_frontend/commit/be789b89f39741efe146da97eeb19460a7cca527))
- **leaflet-map-adapter:** fix BaseAdapter pane zIndex set ([f73bb6a](https://github.com/nextgis/nextgisweb_frontend/commit/f73bb6ae9b9e3e99c5a1ca7cc859570ce0ce8911))

### Features

- **webmap:** new method getCoordFromMapClick ([439d8c9](https://github.com/nextgis/nextgisweb_frontend/commit/439d8c90fe11193faafc90c9bd33fec2b335bf78))

# [1.0.0-alpha.2](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)

### Bug Fixes

- **ngw-connector:** update error response status code list ([c4d4285](https://github.com/nextgis/nextgisweb_frontend/commit/c4d4285f23490f9dcc3edac8c82b533f6c07ac01))
- improve node/browser splitting ([913a8a1](https://github.com/nextgis/nextgisweb_frontend/commit/913a8a1794890a2e46c4ec72706edf940102943c))

### Code Refactoring

- **ngw-kit:** naming ([f870925](https://github.com/nextgis/nextgisweb_frontend/commit/f8709259501b811f269a89445975969e00db2763))

### Features

- **ngw-kit:** default WebmapLayerAdapter basemap ([4756ef8](https://github.com/nextgis/nextgisweb_frontend/commit/4756ef82084f30eda51fe98e1483e815a7775132))

### BREAKING CHANGES

- **ngw-kit:** replace `import { WebMapLayerAdapter } from @nextgis/ngw-kit` to `import { NgwWebmapLayerAdapter } from @nextgis/ngw-kit` and `import { WebMapLayerItem} from @nextgis/ngw-kit` to `import { NgwWebmapLayerItem } from @nextgis/ngw-kit`

# [1.0.0-alpha.1](https://github.com/nextgis/nextgisweb_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)

### Bug Fixes

- **build:** fix item index.js error ([7a9d27f](https://github.com/nextgis/nextgisweb_frontend/commit/7a9d27f12ebd1f9e7fd974c32905faa36b858d5e))
- **ngw-connector:** improve node/browser separation ([7dd5d8d](https://github.com/nextgis/nextgisweb_frontend/commit/7dd5d8de655cd54ce03ebd77792bf46566265e9c))
- **ngw-kit:** remove unresolved variable ([e74c4c7](https://github.com/nextgis/nextgisweb_frontend/commit/e74c4c7e6ed9c39d4e9837d1830002f3d659d254))
- **ngw-kit:** wms adapter layers options from adapterOptions ([4476a55](https://github.com/nextgis/nextgisweb_frontend/commit/4476a55953a60c3bbc6b58178f90eac998897482))

# [1.0.0-alpha.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)

### Bug Fixes

- replace emitter.of by emitter.removeListener ([5a92e2b](https://github.com/nextgis/nextgisweb_frontend/commit/5a92e2b91e741346be39be87d5b9f50b9621c092))
- **cesium:** fix Tilset3D setHeight ([fb95256](https://github.com/nextgis/nextgisweb_frontend/commit/fb952565adb2734ec4a40df2c955ad51cec90c54))
- **control-container:** style url ([326f837](https://github.com/nextgis/nextgisweb_frontend/commit/326f83755e1adfe2e5ff673f50087b54297f0197))
- **mapbox:** right selected event order call ([22c4511](https://github.com/nextgis/nextgisweb_frontend/commit/22c45118ae57c9a2952725a09e26cb423965be03))
- **ngw-kit:** editing for a new layer visibility standard ([d2db4ed](https://github.com/nextgis/nextgisweb_frontend/commit/d2db4ed94648d0854321b4c3192b6cf2ab866652))
- **ngw-kit:** fix addNgwLayer resource options ([c689db1](https://github.com/nextgis/nextgisweb_frontend/commit/c689db13cb8fb2d043ef395ae56ab501cf77a350))
- **properties-filter:** add field type check for like\ilike filter ([55f5c23](https://github.com/nextgis/nextgisweb_frontend/commit/55f5c23c252f6ee1f8cd34207bdaeb43610e68fb))
- **vuetify:** pass $attrs from parent ([778f909](https://github.com/nextgis/nextgisweb_frontend/commit/778f9093dba1b15115806996b7c0984d5bfc84b0))
- **vuetify:** update items on init ([03f78ed](https://github.com/nextgis/nextgisweb_frontend/commit/03f78ed98e74fc2eb005085f1fce30b3a957ece5))
- **webmap:** editing for new layer visibility standard ([32413d0](https://github.com/nextgis/nextgisweb_frontend/commit/32413d085d30073056b8da97c8735ca13016c616))

### Build System

- qms-kit to rollup ([3831a57](https://github.com/nextgis/nextgisweb_frontend/commit/3831a57e661a85386ef14b69cc6ef682cf961394))
- wepmap to rollup ([bc66507](https://github.com/nextgis/nextgisweb_frontend/commit/bc665072f7eefacae748c2cf81f6bdef75d9f8aa))

### Code Refactoring

- rename layerAdapter baseLayer option to baselayer ([368d657](https://github.com/nextgis/nextgisweb_frontend/commit/368d6576278505ddddde2a1ab160a0849e087c70))

### Features

- **cesium:** add maximumScreenSpaceError option for tilset3d adapter ([c82c524](https://github.com/nextgis/nextgisweb_frontend/commit/c82c52452765b2e764f6c3d42bc3522bd36a4258))
- **cesium:** set custom logo ([bd05fd3](https://github.com/nextgis/nextgisweb_frontend/commit/bd05fd3f6e34e9cd7e38bbfe5bd1941583ef8fe8))
- **ngw-connector:** add check for 403 ngw error ([e344663](https://github.com/nextgis/nextgisweb_frontend/commit/e344663a974867e510b460fb00eea1775d801ee4))
- **ngw-connector:** handle network error ([7e4a687](https://github.com/nextgis/nextgisweb_frontend/commit/7e4a687934e9fd8a557a41102e70c8761f7d5d2d))
- **ngw-connector:** new getResourceBy method ([462f0db](https://github.com/nextgis/nextgisweb_frontend/commit/462f0dbed5c0b448f5be60a73e8d70e792a4f87a))
- **ngw-kit:** add webmap item method to cotrol item children order ([4c4e95a](https://github.com/nextgis/nextgisweb_frontend/commit/4c4e95a146c4aeb3d5b5e7a1868ab17e5ff68c1c))
- **ngw-kit:** ngw error handling ([490d068](https://github.com/nextgis/nextgisweb_frontend/commit/490d068021b21fb7ddcd7475d2a669a969f81480))
- **ngw-orm:** remove 3rd part libs to convers geom to wkt, use new ngw api ([01c8e21](https://github.com/nextgis/nextgisweb_frontend/commit/01c8e21321b041024584cdcb8c41998adddb3246))
- **utils:** add new tools ([25e6339](https://github.com/nextgis/nextgisweb_frontend/commit/25e6339b5d079f231f3d1fd3ac91e9d32402e0d5))
- **webmap:** add special MapAdapterOptions option to MapOptions ([e3dd2ec](https://github.com/nextgis/nextgisweb_frontend/commit/e3dd2eceb5b63bf7c19791deacd72b2e047a74f8))
- **webmap:** change default behaviour of addLayer visibility option, its now true ([0e91555](https://github.com/nextgis/nextgisweb_frontend/commit/0e91555cea9666dd3ce8c2df7364f0e588dc8c24))
- **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([430d51e](https://github.com/nextgis/nextgisweb_frontend/commit/430d51e7211c050ebeffd68b0c839d9a38170054))
- **webmap:** new static method WebMap.get(id) to get webmap instance ([658f537](https://github.com/nextgis/nextgisweb_frontend/commit/658f5372bde27b4d8502856649b2b11e9e4bade7))

### Performance Improvements

- **vuetify:** replace components gwMap param with webMapId ([59a42d3](https://github.com/nextgis/nextgisweb_frontend/commit/59a42d35029c4d713469a1ea2f339c3bb5f3747a))

### BREAKING CHANGES

- No more default export from `qms-kit`. You should replace `import QmsKit from "@nextgis/qms-kit"` to `import { QmsKit } from "@nextgis/qms-kit"` everywhere
- No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
- **webmap:** the added layer `visibility` is now `true`
- LayerAdapter option baseLayer was renamed to baselayer;
- webMap.getBaseLayers() method now return LayerAdapter, not string array of ids

# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)

### Bug Fixes

- **cesium:** fitBounds for not Scene3D modes ([8fa4155](https://github.com/nextgis/nextgis_frontend/commit/8fa41559f506a7a41372e0f0e497e215fc0f85f5))
- **cesium:** geojson terrain sample ([308d3d3](https://github.com/nextgis/nextgis_frontend/commit/308d3d352110f9496dded2464c78c663bab7a03b))
- **cesium:** Tileset3DAdapter set terrain height ([790760f](https://github.com/nextgis/nextgis_frontend/commit/790760f0b8b90b9c9d572640612cfc00dabfd5d5))
- **examples:** check paint opacity is number ([1105262](https://github.com/nextgis/nextgis_frontend/commit/1105262687d8b7e85873fe58933ced82d9cb77af))
- **examples:** set type for ngw_resource highlight layer ([13ddcdd](https://github.com/nextgis/nextgis_frontend/commit/13ddcdd3ad346cad9ae99a6f924bcd62299336c5))
- **mapbox:** geojson getSelected method ([e0d859c](https://github.com/nextgis/nextgis_frontend/commit/e0d859cd186876f0b382e1338d1793151d18dd6a))
- **ngw-kit:** check company_logo in settings ([decf777](https://github.com/nextgis/nextgis_frontend/commit/decf777de5f30f27b15265808fa85c8529021cc1))
- **ngw-kit:** set correct options when add WebmapLayerItem ([0c5cd08](https://github.com/nextgis/nextgis_frontend/commit/0c5cd08b62b46fabe88bc51c91f0616d1d8c4a25))
- **ngw-kit:** WebmapLayerItem ordering ([d4a0403](https://github.com/nextgis/nextgis_frontend/commit/d4a04038bc76257595d2eea618629a969ca9ca00))
- **vuetify:** correction for set empty BasemapSelect text ([8ab35e4](https://github.com/nextgis/nextgis_frontend/commit/8ab35e426f9333391c746849c0d2316e2cb62ec3))
- **vuetify:** NgwLayersList root item hide ([abba8cb](https://github.com/nextgis/nextgis_frontend/commit/abba8cbd8a46697ba37a768bd2576086591c344c))

### Features

- **cesium:** implement getCenter ([ea83d8e](https://github.com/nextgis/nextgis_frontend/commit/ea83d8ebd8972123ba0991388e4e53fce91b077e))
- **cesium:** skipLevelOfDetail by default ([7429870](https://github.com/nextgis/nextgis_frontend/commit/7429870fb31231fc26298240d665c4ac840f618a))
- **cesium:** tilset 3d adapter height options ([02973bf](https://github.com/nextgis/nextgis_frontend/commit/02973bfcacb6bde3b7d4e23fdd190d0e81536f57))
- **cesium:** update layer and map adapter ([c9d6a1d](https://github.com/nextgis/nextgis_frontend/commit/c9d6a1db8874586adb5ae1901153e71313aa776b))
- **ngw-kit:** add ngw basemap suppor for url ([958303e](https://github.com/nextgis/nextgis_frontend/commit/958303eed8753d18a8c8d60b72a338c1656388f6))
- **ngw-kit:** add NgwKit.utils.getCompanyLogo method ([3c6fa09](https://github.com/nextgis/nextgis_frontend/commit/3c6fa09321c0e979543b50b93c32da8725920d28))
- **ngw-kit:** add `tmsclient_layer` adapter class support ([87b5976](https://github.com/nextgis/nextgis_frontend/commit/87b59760a574ffc66b1aec1d2df3af301efe1326))
- **qms-kit:** use `y_origin_top` option ([fa02dfd](https://github.com/nextgis/nextgis_frontend/commit/fa02dfd2af3927478fd9f50de7d8173b2dc4f05b))
- **webmap:** vector layer select event ([edd18ba](https://github.com/nextgis/nextgis_frontend/commit/edd18baa3d2b0e5886812e09795de4f041be23ab))
- **webmap:** zoomIn and zoomOut MapAdapter optional methods ([70b807f](https://github.com/nextgis/nextgis_frontend/commit/70b807fd1d157b5505a3d815f24a02fbb1fff6a6))

### Performance Improvements

- **webmap:** addControl conner queue ([5c21367](https://github.com/nextgis/nextgis_frontend/commit/5c21367fc1a0142d56e443948d7d01f49549d5b1))

### BREAKING CHANGES

- Vector layer adapter types were renamed: `circle` > `point`; `fill` > `polygon`.

      The `type` parameter still optional, but it is better to specify explicitly.

  Especially when the layer is initiated empty.

```javascript
// before
webMap.addLayer('GEOJSON', { data: geojson, type: 'fill' });
// after
webMap.addLayer('GEOJSON', { data: geojson, type: 'polygon' });
```

- Updated libraries for linting. Added new rule for worning when no set return type in TypeScript functions.

# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)

### Bug Fixes

- **cesium:** GeoJsonAdapter pin color from empty string ([13ef825](https://github.com/nextgis/nextgis_frontend/commit/13ef8258afad19709cf00a055bb772f425542d1a))
- **cesium:** scene requestRender on layers visibility change ([e513a57](https://github.com/nextgis/nextgis_frontend/commit/e513a573af14660750337e951da84387fab433c2))
- **mapbox:** beforeRemove check for map exist ([e6c59cc](https://github.com/nextgis/nextgis_frontend/commit/e6c59cc2b51110c679dfa7dd6e9348926ec473f7))
- **ngw-kit:** create async adapter from parent resource ([808572b](https://github.com/nextgis/nextgis_frontend/commit/808572b5aff6b04783cd7e9edd078e2ea5404dd2))
- **ngw-kit:** resolve createGeoJsonAdapter options override II ([c65f1ee](https://github.com/nextgis/nextgis_frontend/commit/c65f1eeb2dd0974980c70455d142dba427081521))
- **ngw-kit:** webmapLayerItem options ([154d3b2](https://github.com/nextgis/nextgis_frontend/commit/154d3b201df153e9d17653fc4acd1fe8a2af9ebf))
- **nngw-kit:** resolve create geojson adapter options override ([fba851e](https://github.com/nextgis/nextgis_frontend/commit/fba851effec4402565c8c3b31ce1eaba2b0b590f))
- **ol:** css control fixes ([98f6d13](https://github.com/nextgis/nextgis_frontend/commit/98f6d13dc9af59a39b1b0a13cea24be3a2505759))
- **vuetify:** NgwLayersList visibility for webmap root item ([4f940a8](https://github.com/nextgis/nextgis_frontend/commit/4f940a854a5054070acbf9d0416f059c9f19ae7d))
- **webmap:** add check for fitBounds extent ([c78ab3e](https://github.com/nextgis/nextgis_frontend/commit/c78ab3e900f3e069401fb23b5b7646aa5cbc8e7f))
- **webmap:** addLayer adapter options set ([2d24a53](https://github.com/nextgis/nextgis_frontend/commit/2d24a5387634bbccb79875186cc7a9cf090291f2))
- **webmap:** remove addLayer dublicate id ([81a4458](https://github.com/nextgis/nextgis_frontend/commit/81a4458b9b420382d112be181d829e08f783c82b))

### Features

- **cesium:** add Tileset3dAdapter ([c5306f9](https://github.com/nextgis/nextgis_frontend/commit/c5306f9b8bb3e37f287cbd4e3d33a04d93478e2b))
- **cesium:** change layers height on terrain change ([609ac9d](https://github.com/nextgis/nextgis_frontend/commit/609ac9ddae60eb3ac9085c9f29fa93f3aa5b13b4))
- **cesium:** extrude3d paint option ([c4ce679](https://github.com/nextgis/nextgis_frontend/commit/c4ce679cd15bbc87e362048dc007a85ce42516fd))
- **cesium:** fitBounds up tp terrain ([e890d9b](https://github.com/nextgis/nextgis_frontend/commit/e890d9b5ce449dc69c8b531c33b9ce6cb58b10b4))
- **cesium:** get extent of tileset3D ([017a69a](https://github.com/nextgis/nextgis_frontend/commit/017a69afa63cec3f2b1773fb643557a2a88fa363))
- **cesium:** set scene view from new adapter option ([c35e16d](https://github.com/nextgis/nextgis_frontend/commit/c35e16ded6036fccb2edb852bebd68f41fc899eb))
- **ngw-kit:** add addLayerOptionsPriority for createGeoJsonAdapter ([f6c563e](https://github.com/nextgis/nextgis_frontend/commit/f6c563e1bc1238206bb4ba3d8081971d078ef54d))
- **ngw-kit:** add baselayers from webmap; vuetify BaseLayerSelect ([74c0749](https://github.com/nextgis/nextgis_frontend/commit/74c074929c7da864a9097fc8176825894555e0a3))
- **ngw-kit:** add feature to getIdentifyItems ([9641c8e](https://github.com/nextgis/nextgis_frontend/commit/9641c8e8b0e67ece7186ba8a6803d109e6503afd))
- **ngw-kit:** make create basemap layer adapter universal ([bbd8c9a](https://github.com/nextgis/nextgis_frontend/commit/bbd8c9a77d527921909ae9b1bf10b3580c5fa600))
- **ngw-map:** add ngw layer from resource item object ([18fb9e1](https://github.com/nextgis/nextgis_frontend/commit/18fb9e105fe733b8e1e5736cfb3afeb8e5b9e84c))
- **vue:** VueNgwControl from string kind option ([1050be8](https://github.com/nextgis/nextgis_frontend/commit/1050be8d7488713e10869e1060e76a8da313d21f))
- **webmap:** add async control in correct order ([c2eaab3](https://github.com/nextgis/nextgis_frontend/commit/c2eaab3a0d720a6b6d32fc0d6b2c76bc37e93a8f))
- **webmap:** layer adapter waitFullLoad and crossOrigin new options ([08c6b82](https://github.com/nextgis/nextgis_frontend/commit/08c6b827f6a3e5728d8b17a9c305f32cd2b28039))

### BREAKING CHANGES

- **ngw-kit:** rename NgwKit.utils.getIdentifyGeoJsonParams > NgwKit.utils.getIdentifyItems

## [0.30.2](https://github.com/nextgis/nextgis_frontend/compare/v0.30.1...v0.30.2) (2020-04-30)

### Bug Fixes

- **ngw-kit:** return raster_layer resource support ([76a435f](https://github.com/nextgis/nextgis_frontend/commit/76a435fb43d82ea8be616347010a8bd1214f106b))

## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)

### Bug Fixes

- **cesium:** cesium geojson layer style ([5f6e439](https://github.com/nextgis/nextgis_frontend/commit/5f6e43937bb9397237c43abccce5889a710716fb))
- **vue:** selection for items with properties and tree ([e2f72df](https://github.com/nextgis/nextgis_frontend/commit/e2f72df0c1800e7595c7e3e8342f15841f897eea))
- **webmap:** get layers method only string keys ([e0182c9](https://github.com/nextgis/nextgis_frontend/commit/e0182c95c81f5b76605f569bcbf2826937909889))

### Features

- **cesium:** add scale and rotate for 3d model adapter ([c6c67c1](https://github.com/nextgis/nextgis_frontend/commit/c6c67c16356a08a434f9f5482d8fa6bc0b693091))
- **ngw-kit:** extensibility increased ([77bdaf7](https://github.com/nextgis/nextgis_frontend/commit/77bdaf7df43124811a8847cad348fe6bdae6d1ed))
- **ngw-kit:** new approach to extend adapters for any resource classes ([4521db5](https://github.com/nextgis/nextgis_frontend/commit/4521db5238a380e52916f3fd8ba3f4aa3e95889a))
- **webmap:** update layer adapter options ([b0262ef](https://github.com/nextgis/nextgis_frontend/commit/b0262eff0db1ee56192bb410e8e1128cdc8b167b))

### Performance Improvements

- **ngw-kit:** abort BBOX request on map movestart ([af72df0](https://github.com/nextgis/nextgis_frontend/commit/af72df00a095ad07c0a5b495af41d8cd1dda1b90))
- **ngw-kit:** default limit to load large vector layer data ([1e88276](https://github.com/nextgis/nextgis_frontend/commit/1e8827674db30d654b6ce6c0018171b4b15db12b))

# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)

### Bug Fixes

- **ngw-connect:** properly abort request on cancel ([9ea9859](https://github.com/nextgis/nextgis_frontend/commit/9ea98591679584d7e23ef47a8bca5c4558527db4))

## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)

### Features

- **cancelable-promise:** throw CancelError instead of onCancel callback ([7b7ef11](https://github.com/nextgis/nextgis_frontend/commit/7b7ef112db2ead4fc02bac14eb61534d570b8a65))

### Performance Improvements

- **mapbox:** vector layer click event prevent by order ([e7901da](https://github.com/nextgis/nextgis_frontend/commit/e7901da34935e347de05aaf0798eb1e5dfda11ff))

### BREAKING CHANGES

- **cancelable-promise:** Removed onCancel argument from CancelablePromise. Now you should handle catch CancelError

## [0.29.10](https://github.com/nextgis/nextgis_frontend/compare/v0.29.9...v0.29.10) (2020-04-17)

### Bug Fixes

- **ngw-kit:** no load date for geojson layer if data ([4faf698](https://github.com/nextgis/nextgis_frontend/commit/4faf6988e39509af2cb8e03725741d4e0b00ad55))
- **ngw-ol:** container style ([995b409](https://github.com/nextgis/nextgis_frontend/commit/995b409e5b70bb6a750afb39dd42745d562b4b88))
- **ol:** geojson label null field ([1b93b27](https://github.com/nextgis/nextgis_frontend/commit/1b93b275566f4f2c32ba9c114fea3a0fdc3dc77b))

## [0.29.9](https://github.com/nextgis/nextgis_frontend/compare/v0.29.8...v0.29.9) (2020-04-16)

### Bug Fixes

- **ngw-orm:** vector resource geometry ([126dea7](https://github.com/nextgis/nextgis_frontend/commit/126dea73e73cf161ce6a6e88b08dde748d53ad09))

## [0.29.8](https://github.com/nextgis/nextgis_frontend/compare/v0.29.7...v0.29.8) (2020-04-16)

### Bug Fixes

- **ngw-orm:** remove console log ([345065b](https://github.com/nextgis/nextgis_frontend/commit/345065b02bbaf6f708c323ba8fea20192b99ae6c))
- **ngw-orm:** return sync resource ([d65548b](https://github.com/nextgis/nextgis_frontend/commit/d65548bcfded0a4fe8d5e7733b171fb8236af25f))

## [0.29.7](https://github.com/nextgis/nextgis_frontend/compare/v0.29.6...v0.29.7) (2020-04-16)

**Note:** Version bump only for package root

## [0.29.6](https://github.com/nextgis/nextgis_frontend/compare/v0.29.5...v0.29.6) (2020-04-16)

### Bug Fixes

- **ngw-connector:** improve for node ([cc5ead7](https://github.com/nextgis/nextgis_frontend/commit/cc5ead7d298a6dd557988a9f4ed9bba361a013d9))

## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)

### Bug Fixes

- **leaflet:** RemoteTileLayer mixin removeTile method ([af72b2b](https://github.com/nextgis/nextgis_frontend/commit/af72b2b420cb951f52b6ce56701f3e3bbbdb475d))
- **ngw:** create async adapter for webmap ([40aeb07](https://github.com/nextgis/nextgis_frontend/commit/40aeb07f4ddce2462ea82b30f8b91009535e8531))
- **ngw-connector:** getResourceByKeyname cache ([20fae26](https://github.com/nextgis/nextgis_frontend/commit/20fae266d240d51af7fe9e9a9af4f84d286f8cc2))

### Features

- eslint no-dupe off; object utils; propertiesFilter generic ([20200e7](https://github.com/nextgis/nextgis_frontend/commit/20200e79a3c7e8e45f51e6999864b9fde47d9b54))

### Performance Improvements

- **ngw-connector:** getResourceByKeyname one request ([23e0706](https://github.com/nextgis/nextgis_frontend/commit/23e0706d22502ec14a4383abe87b9bae2e4e8d26))

## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)

### Bug Fixes

- **cesium:** remove default imagery provider ([cb7d7d2](https://github.com/nextgis/nextgis_frontend/commit/cb7d7d290bf3ebc58eebbdb978150a7e7fff7ace))
- **ngw:** return support for vector layer adapter ([25f19ae](https://github.com/nextgis/nextgis_frontend/commit/25f19aef91ed361a7fc2fe96123fa4f5833df755))

### Features

- **utils:** update string util ([2bf9a92](https://github.com/nextgis/nextgis_frontend/commit/2bf9a9217ade47a19426d62a80969f9173900651))
- **vue:** VueNgwMap add onLoad event ([d2a1ecf](https://github.com/nextgis/nextgis_frontend/commit/d2a1ecf296fd001b4307179b70749811ee5e00e1))

## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

### Features

- **ngw-connector:** more improvement for Node ([c3af356](https://github.com/nextgis/nextgis_frontend/commit/c3af356f00e7095f50c463e12692b12bea605e6f))

## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

### Bug Fixes

- **ngw-connector:** improve compatibility with Node ([7b653f5](https://github.com/nextgis/nextgis_frontend/commit/7b653f559f7ecb681d0059ac42a9aecb543fbb90))

## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)

### Bug Fixes

- **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))
- **mapbox:** fix geojson adapter clean method ([a5138b6](https://github.com/nextgis/nextgis_frontend/commit/a5138b6fdd4047b3c0cc8422b3bdca33cea0e951))

### Features

- **ngw-connector:** add item_extent interface ([78f0cdd](https://github.com/nextgis/nextgis_frontend/commit/78f0cdd082ec2550bc9a442d05addaadd02f7aae))
- **ngw-connector:** new query option for response cache ([d249605](https://github.com/nextgis/nextgis_frontend/commit/d249605823a63a0b1f6b3f242b15c06fe70bd9a3))

# [0.29.0](https://github.com/nextgis/nextgis_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)

### Bug Fixes

- **properties-filte:** allow any chars for `like` and `ilike` search ([6b5b60d](https://github.com/nextgis/nextgis_frontend/commit/6b5b60d7985abb01093b649073c6e0a088f7fe0e))
- **properties-filter:** repair like and ilike operations ([ff208e0](https://github.com/nextgis/nextgis_frontend/commit/ff208e00f52fb592df32af95a6bd0cfdf04dfb65))

### chore

- build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))

### BREAKING CHANGES

- code formatting rules changed to prettier 2.0 compatibility

## [0.28.3](https://github.com/nextgis/nextgis_frontend/compare/v0.28.2...v0.28.3) (2020-03-19)

### Bug Fixes

- **examples:** repair examples ([e739de7](https://github.com/nextgis/nextgis_frontend/commit/e739de7c52c09ba17ddcf007c2604cc1e2a0e0ba))
- **ngw:** get geojson request options ([015cffc](https://github.com/nextgis/nextgis_frontend/commit/015cffc415b272f0dace009e192ef7986c699138))
- **ngw:** order_by param ([dd161fc](https://github.com/nextgis/nextgis_frontend/commit/dd161fc8d3536fe733f2c21427f897ae4d44f60f))

### Features

- **cesium:** pin paint implementation for geojson layer ([7fadb6d](https://github.com/nextgis/nextgis_frontend/commit/7fadb6d6f6a7ae8dfc0449ded1c1595ebba476ed))
- **ngw:** option to create popup content from item ([3c4a809](https://github.com/nextgis/nextgis_frontend/commit/3c4a809dc7cd9045e3ed1622b1eea0036e5205a1))
- **paint:** implement of `match`-decision expression ([cc92624](https://github.com/nextgis/nextgis_frontend/commit/cc92624c45819334b6b815dc84aed9978b784b3a))
- add library `@nextgis/paint` ([99391ec](https://github.com/nextgis/nextgis_frontend/commit/99391ec1ac9fd80508816417d9eb2ae0fd734340))

## [0.28.2](https://github.com/nextgis/nextgis_frontend/compare/v0.28.1...v0.28.2) (2020-03-12)

**Note:** Version bump only for package root

## [0.28.1](https://github.com/nextgis/nextgis_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package root

# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)

### Features

- **cesium:** geojson adapter paint ([657b411](https://github.com/nextgis/nextgis_frontend/commit/657b411f1efb9835ff9f9255c47424179e3b3caa))
- **webmap:** paint from expressions ([126a191](https://github.com/nextgis/nextgis_frontend/commit/126a191a540e12ac7ff74471a110c1fd04340516))
- add library `@nextgis/properties-filter` ([0902366](https://github.com/nextgis/nextgis_frontend/commit/09023669c963ddb4e0a319400397e5f320620573))
- **webmap:** paint from properties filter ([6645e46](https://github.com/nextgis/nextgis_frontend/commit/6645e467f1be79c0a2ed02fed65a62b5850daf70))

### BREAKING CHANGES

- **webmap:** New Paint specification may cause problems with types
- `propertiesFilter` removed from `@nextgis/utils`

## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)

### Bug Fixes

- **mapbox:** resolve geojson selection-filter conflict ([f0abd87](https://github.com/nextgis/nextgis_frontend/commit/f0abd87005176192efeac8c40bdc1a4398909eb6))

### Features

- add library `@nextgis/cancelable-promise` ([5227983](https://github.com/nextgis/nextgis_frontend/commit/5227983e03b0a5aa5807002f63914fa2d23154b0))
- add library `@nextgis/control-container` ([e68afeb](https://github.com/nextgis/nextgis_frontend/commit/e68afeb5efb1e40bf20df2effa805fe80c437478))
- add library `@nextgis/dom` ([82a645d](https://github.com/nextgis/nextgis_frontend/commit/82a645d213d0b9ef1bb3c443dc28a94866c2884b))
- **cesium:** add mapAdapter listeners and getBounds method ([3033475](https://github.com/nextgis/nextgis_frontend/commit/3033475bc1cc519efe08f18e9e741750d35a0f25))
- **control:** add universal zoom control ([1ffc089](https://github.com/nextgis/nextgis_frontend/commit/1ffc089942f1709f82cec8398d301503819be718))
- **demo:** add search for left sidebar ([d72132d](https://github.com/nextgis/nextgis_frontend/commit/d72132dc2385d8982e6a3ec91cd76c1005ed2836))

# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)

### Bug Fixes

- **ngw-map:** not block when error on add qms layer ([d06ac88](https://github.com/nextgis/nextgis_frontend/commit/d06ac88cc6088e16c38c47ef247905e84e0a5283))

### Features

- **ngw-kit:** add bbox strategy for large vector layer ([da6533b](https://github.com/nextgis/nextgis_frontend/commit/da6533b76eaf5184114ac233fa275d2398cfdf5b))
- **utils:** create universal MapControlContainer ([2f07100](https://github.com/nextgis/nextgis_frontend/commit/2f07100b8a9b178533d5e3ee17b8759d8eb62866))
- **vuetify:** allow VTree scopes for NgwLayersList ([8718f9b](https://github.com/nextgis/nextgis_frontend/commit/8718f9b6e114714523b3476a97b23934c31f2bb4))

### Performance Improvements

- **ngw-kit:** geojson adapter not blocked on data load ([1ceaf76](https://github.com/nextgis/nextgis_frontend/commit/1ceaf7688b9911727de5fa1b6fde9ae1f6b3da9e))

# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)

### Features

- add WmsLayerAdapter ([c57b66d](https://github.com/nextgis/nextgis_frontend/commit/c57b66d2278071a57182cb4dd554e370c63ffa06))

## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package root

## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.6...v0.25.7) (2020-02-24)

**Note:** Version bump only for package root

## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.5...v0.25.6) (2020-02-24)

**Note:** Version bump only for package root

## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)

### Bug Fixes

- rename Clipboard ([759f55a](https://github.com/nextgis/nextgis_frontend/commit/759f55ad35928f5212d8ed8bfaccdbebcb35246a))
- **demo:** remove layer id from ngw properties filter example ([4c3c625](https://github.com/nextgis/nextgis_frontend/commit/4c3c6253a47a4e1e55d3b19c5a75787d96705e69))
- **mapbox:** geojson getFeatures method return whole source data ([d47f893](https://github.com/nextgis/nextgis_frontend/commit/d47f8932d63c8a6d056d50aad351026464128595))
- **webmap:** ZoomState may be only integer ([c130469](https://github.com/nextgis/nextgis_frontend/commit/c13046908d63d549e3f221efc538c55d49a36450))

### Features

- **ngw-connector:** make library polymorphic for both node and browser ([b3bd42e](https://github.com/nextgis/nextgis_frontend/commit/b3bd42e1ebc3880edfecb6713d0d17166e9beed0))
- **ngw-kit:** new addNgwLayer resource option for keyname or resourceId ([f1eefd2](https://github.com/nextgis/nextgis_frontend/commit/f1eefd2703dc16126ef4b0a933a86b9a34d594a7))

### Performance Improvements

- **mapbox:** upgrade layer ordering ([58a0db0](https://github.com/nextgis/nextgis_frontend/commit/58a0db08c0fa123ede4ef0d9fc7d9e1e9b3a6526))

## [0.25.4](https://github.com/nextgis/nextgis_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)

### wip

- **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgis_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))

### BREAKING CHANGES

- **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'

## [0.25.3](https://github.com/nextgis/nextgis_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)

### Features

- **example:** new ngw_layer_properties_filter example ([066f13f](https://github.com/nextgis/nextgis_frontend/commit/066f13f4ef023f6629f1a7fc2639f8af123cce87))
- **ngw:** conditions and nesting for filtering ngw feature layer ([bc7cc34](https://github.com/nextgis/nextgis_frontend/commit/bc7cc344d83d1769476e28cb87d595a9d25d0ebd))
- **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgis_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))

## [0.25.2](https://github.com/nextgis/nextgis_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package root

## [0.25.1](https://github.com/nextgis/nextgis_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)

### Bug Fixes

- **mapbox:** disable mapbox image layer ([421a69f](https://github.com/nextgis/nextgis_frontend/commit/421a69f2e11313e8835c4d87e5091e4ef9f393d1))

### Features

- remove default MarkerLayerAdapter ([7398c1b](https://github.com/nextgis/nextgis_frontend/commit/7398c1bb61d43194ce4c7da635d386ad785ac57a))
- **demo:** add new example for simple resource table ([43fdf4f](https://github.com/nextgis/nextgis_frontend/commit/43fdf4f69898680872fedece44c812ca407d1d8b))

### BREAKING CHANGES

- `MARKER` layer adapter has been removed. Use `addLayer('GEOJSON', {data})` instead of `addLayer('MARKER', {lngLat})`

# [0.25.0](https://github.com/nextgis/nextgis_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)

### Bug Fixes

- **mapbox:** geojson adapter select ([3563359](https://github.com/nextgis/nextgis_frontend/commit/35633593586642f8d52d0fe326ebbf8b117652b3))
- **mapbox:** geojson layer selection with nativeFilter option ([ffea714](https://github.com/nextgis/nextgis_frontend/commit/ffea714bc57ece601a400ca7aa5f506aebf5f4e2))
- **mapbox:** propertyFilter for selected vector data ([6eaba47](https://github.com/nextgis/nextgis_frontend/commit/6eaba476e582af7f33e0b98d74457482a1fa0cf0))
- **mapbox:** set transformRequest option only then map is loaded ([9a2da0b](https://github.com/nextgis/nextgis_frontend/commit/9a2da0b3c11ed1f8b44d655590687fc66f51c36e))
- **mapbox:** transformRequests hotfix ([99ba257](https://github.com/nextgis/nextgis_frontend/commit/99ba2570ae1e519e4f7ea941514c342e7039b3da))
- **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgis_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))
- **ol:** no vector layer label for undefined property ([8087662](https://github.com/nextgis/nextgis_frontend/commit/80876629688c664edc6a5c7c1f5452a0b38e0cf7))
- **util:** arrayCompare typecasting ([3cca72c](https://github.com/nextgis/nextgis_frontend/commit/3cca72cdcae150829a58754a2efbe51cd6c4517f))
- **vue:** NgwLayersList webmap visibility ([919bc4e](https://github.com/nextgis/nextgis_frontend/commit/919bc4e5dd971f0f9ed501bab4266eaab8da5037))
- **vue:** saveselection of webmap in NgwLayersList ([6270793](https://github.com/nextgis/nextgis_frontend/commit/6270793f23d4c01f9a928a868301c36d53502bc2))
- **vue:** VueNgwLeaflet default icons for FF ([713d29e](https://github.com/nextgis/nextgis_frontend/commit/713d29e1054bdc21912b7b6b4a68456ca6845bdc))
- **webmap:** not use ordering for layer id ([cd09734](https://github.com/nextgis/nextgis_frontend/commit/cd0973490a2c6ca0673bd01059056dd5fd68d866))

### Features

- **ngw:** add support for `qgis_raster_style` ([959e901](https://github.com/nextgis/nextgis_frontend/commit/959e9014364947acbbbe768157d8cb5ab6d0c3ba))
- **ol:** implement labelField options for OL geojson adapter ([cd0fbf1](https://github.com/nextgis/nextgis_frontend/commit/cd0fbf145a89a07bb934ec77a21c130e0eb7eba8))
- **ol:** implemented getBounds method for OlMapAdapter ([42e9a18](https://github.com/nextgis/nextgis_frontend/commit/42e9a1835d76e211055fc66fab7ba709f4e923f9))
- **ol:** labeling for circle layer paint ([1b0c87c](https://github.com/nextgis/nextgis_frontend/commit/1b0c87c10afe49195464d346634ec1cf88bd49b8))
- **util:** add arrayCompare util ([9442c01](https://github.com/nextgis/nextgis_frontend/commit/9442c01e17dc894e97580cf32b882567066a9004))
- **util:** add debounce util ([fd45455](https://github.com/nextgis/nextgis_frontend/commit/fd45455b061b2bc6186f865d4d0a3aa13d57e01d))
- **util:** move properties filter to utils library ([4099706](https://github.com/nextgis/nextgis_frontend/commit/40997068f633faf75f15011721d9aaa5f11343dd))
- **vue:** NgwLayersList watch ngwMap change ([b2bfd34](https://github.com/nextgis/nextgis_frontend/commit/b2bfd349c86e934194424ebedf05ee9d24a6a51f))
- **webmap:** add `getBoundsPoly` webmap util ([22cb565](https://github.com/nextgis/nextgis_frontend/commit/22cb5654e6a2c2c8b84d32581faed0b293570cc2))
- **webmap:** nesting for propertiesFilter utility ([28cb9ed](https://github.com/nextgis/nextgis_frontend/commit/28cb9ed583ec96fec675f8f6c63ec18c1fe030de))
- **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgis_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))

### Performance Improvements

- **mapbox:** selection with PropertiesFilter ([e6e52e1](https://github.com/nextgis/nextgis_frontend/commit/e6e52e151f1662bb889cf89b349d566c100a2bdc))

### BREAKING CHANGES

- **util:** Use `import { propertiesFilter } from '@nextgis/utils';` instead of `Webmap.utils.propertiesFilter`

## [0.24.2](https://github.com/nextgis/nextgis_frontend/compare/v0.24.1...v0.24.2) (2020-01-14)

### Bug Fixes

- **mapbox:** transformRequests hotfix ([99ba257](https://github.com/nextgis/nextgis_frontend/commit/99ba2570ae1e519e4f7ea941514c342e7039b3da))

## [0.24.1](https://github.com/nextgis/nextgis_frontend/compare/v0.15.4...v0.24.1) (2020-01-14)

### Bug Fixes

- **mapbox:** set transformRequest option only then map is loaded ([9a2da0b](https://github.com/nextgis/nextgis_frontend/commit/9a2da0b3c11ed1f8b44d655590687fc66f51c36e))
- **ol:** no vector layer label for undefined property ([8087662](https://github.com/nextgis/nextgis_frontend/commit/80876629688c664edc6a5c7c1f5452a0b38e0cf7))

### Features

- **ol:** implement labelField options for OL geojson adapter ([cd0fbf1](https://github.com/nextgis/nextgis_frontend/commit/cd0fbf145a89a07bb934ec77a21c130e0eb7eba8))
- **ol:** implemented getBounds method for OlMapAdapter ([42e9a18](https://github.com/nextgis/nextgis_frontend/commit/42e9a1835d76e211055fc66fab7ba709f4e923f9))
- **ol:** labeling for circle layer paint ([1b0c87c](https://github.com/nextgis/nextgis_frontend/commit/1b0c87c10afe49195464d346634ec1cf88bd49b8))
- **webmap:** add `getBoundsPoly` webmap util ([22cb565](https://github.com/nextgis/nextgis_frontend/commit/22cb5654e6a2c2c8b84d32581faed0b293570cc2))

# [0.24.0](https://github.com/nextgis/nextgis_frontend/compare/v0.22.0...v0.24.0) (2020-01-11)

### BREAKING CHANGES

- Use import VueNgwMap from '@nextgis/vue-ngw-leaflet' instead of @nextgis/vue-ngw-map, vue-ngw-map is now has only abstract class for export (without any map framework). Also you can importVueNgwMap component from @nextgis/vue-ngw-mapbox and @nextgis/vue-ngw-ol.

# [0.23.0](https://github.com/nextgis/nextgis_frontend/compare/v0.22.0...v0.23.0) (2020-01-11)

### Documentation

- update changelog ([b8fe281](https://github.com/nextgis/nextgis_frontend/commit/b8fe281078b5db6593fe4a91214021ecbd5c5c2f))

### Features

- **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgis_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))

### BREAKING CHANGES

- Сhanged approach to writing commit messages. Read [convention](https://github.com/nextgis/nextgis_frontend/blob/master/.github/commit-convention.md)
