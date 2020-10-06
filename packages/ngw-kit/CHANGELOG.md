# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-alpha.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-06)

**Note:** Version bump only for package @nextgis/ngw-kit





# [1.0.0-alpha.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-09-22)


### Code Refactoring

* **utils:** update geom utils ([b7e1f7a](https://github.com/nextgis/nextgis_frontend/commit/b7e1f7aab478603f35c49470cfff71d09f58d922))


### BREAKING CHANGES

* **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead





# [1.0.0-alpha.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)

**Note:** Version bump only for package @nextgis/ngw-kit





# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)


### Bug Fixes

* **ngw-kit:** webmap iten async addLayer method ([ca90340](https://github.com/nextgis/nextgis_frontend/commit/ca90340b927704d5c0101041fe1caa54d62ce164))





# [1.0.0-alpha.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)


### Features

* **utils:** move some utils from ngw-kit and webmap to geom ([fbd3d91](https://github.com/nextgis/nextgis_frontend/commit/fbd3d913485c537e92068b5284691bb47f123b43))





# [1.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)


### Bug Fixes

* remove require imports ([be789b8](https://github.com/nextgis/nextgis_frontend/commit/be789b89f39741efe146da97eeb19460a7cca527))
* **leaflet-map-adapter:** fix BaseAdapter pane zIndex set ([f73bb6a](https://github.com/nextgis/nextgis_frontend/commit/f73bb6ae9b9e3e99c5a1ca7cc859570ce0ce8911))





# [1.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)


### Bug Fixes

* improve node/browser splitting ([913a8a1](https://github.com/nextgis/nextgis_frontend/commit/913a8a1794890a2e46c4ec72706edf940102943c))


### Code Refactoring

* **ngw-kit:** naming ([f870925](https://github.com/nextgis/nextgis_frontend/commit/f8709259501b811f269a89445975969e00db2763))


### Features

* **ngw-kit:** default WebmapLayerAdapter basemap ([4756ef8](https://github.com/nextgis/nextgis_frontend/commit/4756ef82084f30eda51fe98e1483e815a7775132))


### BREAKING CHANGES

* **ngw-kit:** replace `import { WebMapLayerAdapter } from @nextgis/ngw-kit` to `import { NgwWebmapLayerAdapter } from @nextgis/ngw-kit` and `import { WebMapLayerItem} from @nextgis/ngw-kit` to `import { NgwWebmapLayerItem } from @nextgis/ngw-kit`





# [1.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)


### Bug Fixes

* **ngw-kit:** remove unresolved variable ([e74c4c7](https://github.com/nextgis/nextgis_frontend/commit/e74c4c7e6ed9c39d4e9837d1830002f3d659d254))
* **ngw-kit:** wms adapter layers options from adapterOptions ([4476a55](https://github.com/nextgis/nextgis_frontend/commit/4476a55953a60c3bbc6b58178f90eac998897482))





# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)


### Bug Fixes

* replace emitter.of by emitter.removeListener ([5a92e2b](https://github.com/nextgis/nextgis_frontend/commit/5a92e2b91e741346be39be87d5b9f50b9621c092))
* **ngw-kit:** editing for a new layer visibility standard ([d2db4ed](https://github.com/nextgis/nextgis_frontend/commit/d2db4ed94648d0854321b4c3192b6cf2ab866652))
* **ngw-kit:** fix addNgwLayer resource options ([c689db1](https://github.com/nextgis/nextgis_frontend/commit/c689db13cb8fb2d043ef395ae56ab501cf77a350))


### Build System

* qms-kit to rollup ([3831a57](https://github.com/nextgis/nextgis_frontend/commit/3831a57e661a85386ef14b69cc6ef682cf961394))


### Code Refactoring

* rename layerAdapter baseLayer option to baselayer ([368d657](https://github.com/nextgis/nextgis_frontend/commit/368d6576278505ddddde2a1ab160a0849e087c70))


### Features

* **ngw-kit:** add webmap item method to cotrol item children order ([4c4e95a](https://github.com/nextgis/nextgis_frontend/commit/4c4e95a146c4aeb3d5b5e7a1868ab17e5ff68c1c))
* **ngw-orm:** remove 3rd part libs to convers geom to wkt, use new ngw api ([01c8e21](https://github.com/nextgis/nextgis_frontend/commit/01c8e21321b041024584cdcb8c41998adddb3246))
* **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([430d51e](https://github.com/nextgis/nextgis_frontend/commit/430d51e7211c050ebeffd68b0c839d9a38170054))


### BREAKING CHANGES

* No more default export from `qms-kit`. You should replace `import QmsKit from "@nextgis/qms-kit"` to `import { QmsKit } from "@nextgis/qms-kit"` everywhere
* LayerAdapter option baseLayer was renamed to baselayer;
* webMap.getBaseLayers() method now return LayerAdapter, not string array of ids





# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)


### Bug Fixes

* **ngw-kit:** check company_logo in settings ([decf777](https://github.com/nextgis/nextgis_frontend/commit/decf777de5f30f27b15265808fa85c8529021cc1))
* **ngw-kit:** set correct options when add webmaplayeritem ([0c5cd08](https://github.com/nextgis/nextgis_frontend/commit/0c5cd08b62b46fabe88bc51c91f0616d1d8c4a25))
* **ngw-kit:** WebmapLayerItem ordering ([d4a0403](https://github.com/nextgis/nextgis_frontend/commit/d4a04038bc76257595d2eea618629a969ca9ca00))
* **vuetify:** NgwLayersList root item hide ([abba8cb](https://github.com/nextgis/nextgis_frontend/commit/abba8cbd8a46697ba37a768bd2576086591c344c))


### Features

* **cesium:** update layer and map adapter ([c9d6a1d](https://github.com/nextgis/nextgis_frontend/commit/c9d6a1db8874586adb5ae1901153e71313aa776b))
* **ngw-kit:** add ngw basemap suppor for url ([958303e](https://github.com/nextgis/nextgis_frontend/commit/958303eed8753d18a8c8d60b72a338c1656388f6))
* **ngw-kit:** add NgwKit.utils.getCompanyLogo method ([3c6fa09](https://github.com/nextgis/nextgis_frontend/commit/3c6fa09321c0e979543b50b93c32da8725920d28))
* **ngw-kit:** add tmsclient_layer adapter class support ([87b5976](https://github.com/nextgis/nextgis_frontend/commit/87b59760a574ffc66b1aec1d2df3af301efe1326))


### wip

* rename VectorLayerAdapterType ([89a2c83](https://github.com/nextgis/nextgis_frontend/commit/89a2c83135e839f3eec373f93e5df777a7b81325))


### BREAKING CHANGES

* rename VectorLayerAdapter types: circle > point; fill > polygon





# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)


### Bug Fixes

* **ngw-kit:** create async adapter from parent resource ([808572b](https://github.com/nextgis/nextgis_frontend/commit/808572b5aff6b04783cd7e9edd078e2ea5404dd2))
* **ngw-kit:** resolve createGeoJsonAdapter options override II ([c65f1ee](https://github.com/nextgis/nextgis_frontend/commit/c65f1eeb2dd0974980c70455d142dba427081521))
* **ngw-kit:** webmapLayerItem options ([154d3b2](https://github.com/nextgis/nextgis_frontend/commit/154d3b201df153e9d17653fc4acd1fe8a2af9ebf))
* **nngw-kit:** resolve create geojson adapter options override ([fba851e](https://github.com/nextgis/nextgis_frontend/commit/fba851effec4402565c8c3b31ce1eaba2b0b590f))
* **webmap:** add check for fitBounds extent ([c78ab3e](https://github.com/nextgis/nextgis_frontend/commit/c78ab3e900f3e069401fb23b5b7646aa5cbc8e7f))
* **webmap:** addLayer adapter options set ([2d24a53](https://github.com/nextgis/nextgis_frontend/commit/2d24a5387634bbccb79875186cc7a9cf090291f2))


### Features

* **cesium:** fitBounds up tp terrain ([e890d9b](https://github.com/nextgis/nextgis_frontend/commit/e890d9b5ce449dc69c8b531c33b9ce6cb58b10b4))
* **ngw-kit:** add addLayerOptionsPriority for createGeoJsonAdapter ([f6c563e](https://github.com/nextgis/nextgis_frontend/commit/f6c563e1bc1238206bb4ba3d8081971d078ef54d))
* **ngw-kit:** add baselayers from webmap; vuetify BaseLayerSelect ([74c0749](https://github.com/nextgis/nextgis_frontend/commit/74c074929c7da864a9097fc8176825894555e0a3))
* **ngw-kit:** add feature to getIdentifyItems ([9641c8e](https://github.com/nextgis/nextgis_frontend/commit/9641c8e8b0e67ece7186ba8a6803d109e6503afd))
* **ngw-kit:** make create basemap layer adapter universal ([bbd8c9a](https://github.com/nextgis/nextgis_frontend/commit/bbd8c9a77d527921909ae9b1bf10b3580c5fa600))
* **ngw-map:** add ngw layer from resource item object ([18fb9e1](https://github.com/nextgis/nextgis_frontend/commit/18fb9e105fe733b8e1e5736cfb3afeb8e5b9e84c))
* **webmap:** layer adapter waitFullLoad and crossOrigin new options ([08c6b82](https://github.com/nextgis/nextgis_frontend/commit/08c6b827f6a3e5728d8b17a9c305f32cd2b28039))


### BREAKING CHANGES

* **ngw-kit:** rename NgwKit.utils.getIdentifyGeoJsonParams > NgwKit.utils.getIdentifyItems





## [0.30.2](https://github.com/nextgis/nextgis_frontend/compare/v0.30.1...v0.30.2) (2020-04-30)


### Bug Fixes

* **ngw-kit:** return raster_layer resource support ([76a435f](https://github.com/nextgis/nextgis_frontend/commit/76a435fb43d82ea8be616347010a8bd1214f106b))





## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)


### Bug Fixes

* **vue:** selection for items with properties and tree ([e2f72df](https://github.com/nextgis/nextgis_frontend/commit/e2f72df0c1800e7595c7e3e8342f15841f897eea))
* **webmap:** get layers method only string keys ([e0182c9](https://github.com/nextgis/nextgis_frontend/commit/e0182c95c81f5b76605f569bcbf2826937909889))


### Features

* **ngw-kit:** extensibility increased ([77bdaf7](https://github.com/nextgis/nextgis_frontend/commit/77bdaf7df43124811a8847cad348fe6bdae6d1ed))
* **ngw-kit:** new approach to extend adapters for any resource classes ([4521db5](https://github.com/nextgis/nextgis_frontend/commit/4521db5238a380e52916f3fd8ba3f4aa3e95889a))
* **webmap:** update layer adapter options ([b0262ef](https://github.com/nextgis/nextgis_frontend/commit/b0262eff0db1ee56192bb410e8e1128cdc8b167b))


### Performance Improvements

* **ngw-kit:** abort BBOX request on map movestart ([af72df0](https://github.com/nextgis/nextgis_frontend/commit/af72df00a095ad07c0a5b495af41d8cd1dda1b90))
* **ngw-kit:** default limit to load large vector layer data ([1e88276](https://github.com/nextgis/nextgis_frontend/commit/1e8827674db30d654b6ce6c0018171b4b15db12b))





# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)


### Bug Fixes

* **ngw-connect:** properly abort request on cancel ([9ea9859](https://github.com/nextgis/nextgis_frontend/commit/9ea98591679584d7e23ef47a8bca5c4558527db4))





## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)

**Note:** Version bump only for package @nextgis/ngw-kit





## [0.29.10](https://github.com/nextgis/nextgis_frontend/compare/v0.29.9...v0.29.10) (2020-04-17)


### Bug Fixes

* **ngw-kit:** no load date for geojson layer if data ([4faf698](https://github.com/nextgis/nextgis_frontend/commit/4faf6988e39509af2cb8e03725741d4e0b00ad55))





## [0.29.6](https://github.com/nextgis/nextgis_frontend/compare/v0.29.5...v0.29.6) (2020-04-16)

**Note:** Version bump only for package @nextgis/ngw-kit





## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)


### Bug Fixes

* **ngw:** create async adapter for webmap ([40aeb07](https://github.com/nextgis/nextgis_frontend/commit/40aeb07f4ddce2462ea82b30f8b91009535e8531))





## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)


### Bug Fixes

* **ngw:** return support for vector layer adapter ([25f19ae](https://github.com/nextgis/nextgis_frontend/commit/25f19aef91ed361a7fc2fe96123fa4f5833df755))





## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

**Note:** Version bump only for package @nextgis/ngw-kit





## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

**Note:** Version bump only for package @nextgis/ngw-kit





## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)


### Bug Fixes

* **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))





# [0.29.0](https://github.com/nextgis/nextgis_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)


### chore

* build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))


### BREAKING CHANGES

* code formatting rules changed to prettier 2.0 compatibility





## [0.28.3](https://github.com/nextgis/nextgis_frontend/compare/v0.28.2...v0.28.3) (2020-03-19)


### Bug Fixes

* **examples:** rapair examples ([e739de7](https://github.com/nextgis/nextgis_frontend/commit/e739de7c52c09ba17ddcf007c2604cc1e2a0e0ba))
* **ngw:** get geojson request options ([015cffc](https://github.com/nextgis/nextgis_frontend/commit/015cffc415b272f0dace009e192ef7986c699138))
* **ngw-kit:** order_by param ([dd161fc](https://github.com/nextgis/nextgis_frontend/commit/dd161fc8d3536fe733f2c21427f897ae4d44f60f))


### Features

* **ngw:** option to create popup content from item ([3c4a809](https://github.com/nextgis/nextgis_frontend/commit/3c4a809dc7cd9045e3ed1622b1eea0036e5205a1))





## [0.28.1](https://github.com/nextgis/nextgis_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package @nextgis/ngw-kit





# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)


### Features

* add library `@nextgis/properties-filter` ([0902366](https://github.com/nextgis/nextgis_frontend/commit/09023669c963ddb4e0a319400397e5f320620573))


### BREAKING CHANGES

* `propertiesFilter` removed from `@nextgis/utils`





## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)


### Features

* add library cancelable-promise ([5227983](https://github.com/nextgis/nextgis_frontend/commit/5227983e03b0a5aa5807002f63914fa2d23154b0))
* new @nextgis/dom library ([82a645d](https://github.com/nextgis/nextgis_frontend/commit/82a645d213d0b9ef1bb3c443dc28a94866c2884b))
* **cesium:** add mapAdapter listeners and getBounds method ([3033475](https://github.com/nextgis/nextgis_frontend/commit/3033475bc1cc519efe08f18e9e741750d35a0f25))





# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)


### Features

* **ngw-kit:** add bbox strategy for large vector layer ([da6533b](https://github.com/nextgis/nextgis_frontend/commit/da6533b76eaf5184114ac233fa275d2398cfdf5b))


### Performance Improvements

* **ngw-kit:** geojson adapter not blocked on data load ([1ceaf76](https://github.com/nextgis/nextgis_frontend/commit/1ceaf7688b9911727de5fa1b6fde9ae1f6b3da9e))





# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)


### Features

* add WmsLayerAdapter ([c57b66d](https://github.com/nextgis/nextgis_frontend/commit/c57b66d2278071a57182cb4dd554e370c63ffa06))





## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/ngw-kit





## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/ngw-kit





## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)


### Bug Fixes

* **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgis_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))


### Features

* **ngw:** add support for `qgis_raster_style` ([959e901](https://github.com/nextgis/nextgis_frontend/commit/959e9014364947acbbbe768157d8cb5ab6d0c3ba))
* **ngw:** conditions and nesting for filtering ngw feature layer ([bc7cc34](https://github.com/nextgis/nextgis_frontend/commit/bc7cc344d83d1769476e28cb87d595a9d25d0ebd))
* **ngw-kit:** new addNgwLayer resource option for keyname or resourceId ([f1eefd2](https://github.com/nextgis/nextgis_frontend/commit/f1eefd2703dc16126ef4b0a933a86b9a34d594a7))
* **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgis_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgis_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))
* **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgis_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))


### wip

* **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgis_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))


### BREAKING CHANGES

* **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'





## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)


### Features

* **ngw-kit:** new addNgwLayer resource option for keyname or resourceId ([f1eefd2](https://github.com/nextgis/nextgis_frontend/commit/f1eefd2703dc16126ef4b0a933a86b9a34d594a7))





## [0.25.4](https://github.com/nextgis/nextgis_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)


### wip

* **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgis_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))


### BREAKING CHANGES

* **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'





## [0.25.3](https://github.com/nextgis/nextgis_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)


### Features

* **ngw:** conditions and nesting for filtering ngw feature layer ([bc7cc34](https://github.com/nextgis/nextgis_frontend/commit/bc7cc344d83d1769476e28cb87d595a9d25d0ebd))
* **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgis_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))





## [0.25.2](https://github.com/nextgis/nextgis_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package @nextgis/ngw-kit





## [0.25.1](https://github.com/nextgis/nextgis_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)

**Note:** Version bump only for package @nextgis/ngw-kit





# [0.25.0](https://github.com/nextgis/nextgis_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)


### Bug Fixes

* **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgis_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))


### Features

* **ngw:** add support for `qgis_raster_style` ([959e901](https://github.com/nextgis/nextgis_frontend/commit/959e9014364947acbbbe768157d8cb5ab6d0c3ba))
* **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgis_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))
