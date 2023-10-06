# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.18.3](https://github.com/nextgis/nextgis_frontend/compare/v1.18.2...v1.18.3) (2023-10-06)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [1.18.2](https://github.com/nextgis/nextgis_frontend/compare/v1.18.1...v1.18.2) (2023-10-04)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [1.18.1](https://github.com/nextgis/nextgis_frontend/compare/v1.18.0...v1.18.1) (2023-10-03)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





# [1.18.0](https://github.com/nextgis/nextgis_frontend/compare/v1.17.0...v1.18.0) (2023-10-02)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





# [1.17.0](https://github.com/nextgis/nextgis_frontend/compare/v0.5.0...v1.17.0) (2023-09-25)


### Bug Fixes

* **build:** control-container extract css ([ff15f22](https://github.com/nextgis/nextgis_frontend/commit/ff15f221bd46de3d0e32aaa2735f7224d49b24fc))
* **cesium-map-adapter:** set layer adapters request headers ([1430387](https://github.com/nextgis/nextgis_frontend/commit/1430387627af0b6a593ff1b64c9f86979344de5c))
* **ngw-connector:** fixes to apiRequest cancel work ([40fee1a](https://github.com/nextgis/nextgis_frontend/commit/40fee1a96a389a0d617bd35b6140db4f4a097eb6)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
* **ngw-kit:** create async adapter from parent resource ([3a5b1a0](https://github.com/nextgis/nextgis_frontend/commit/3a5b1a0d08fc2fd7e8f654d7070dbfb22063a72f))
* **ngw-kit:** make async onFirstShowAdapter hide and show methods ([95362a8](https://github.com/nextgis/nextgis_frontend/commit/95362a89085ecda4a6225cd58bc9347ff970fd81))
* **ngw-kit:** ngw webmap item childrensafe reverse ([056c9c7](https://github.com/nextgis/nextgis_frontend/commit/056c9c77d771976bbff13ec54da4a75138ec7302))
* **ngw-kit:** ngw webmap items layer order ([0c7028b](https://github.com/nextgis/nextgis_frontend/commit/0c7028b821121a54d82106000d21b1cac76d79f6))
* **ngw-kit:** remove async from NgwWebmapItem child add ([8667c88](https://github.com/nextgis/nextgis_frontend/commit/8667c88d8ca560444e5f09e497090ca5834fcf7b))
* **ngw-kit:** set NgwWebmap tree item property before layer load ([3b6a137](https://github.com/nextgis/nextgis_frontend/commit/3b6a137213a8478193078c1e88c781e83326f149))
* **ngw-kit:** webmap item children ordering ([b4136f8](https://github.com/nextgis/nextgis_frontend/commit/b4136f839102319beb3a23f2b81da14195cffa23))
* **ngw-map:** constructor options for control ([7801315](https://github.com/nextgis/nextgis_frontend/commit/780131541a0b08113f2d838ed3aa8070bc0b10e6))
* **ngw:** ngw webmap resource ordering ([f00e010](https://github.com/nextgis/nextgis_frontend/commit/f00e010bffaadb9db5f512c048ef83a6e271018f))
* **ol:** css control fixes ([7ba4c05](https://github.com/nextgis/nextgis_frontend/commit/7ba4c05a7a592aaf7a8acc45ad24d8b40046218a))
* remove require imports ([c227e90](https://github.com/nextgis/nextgis_frontend/commit/c227e9003e209ea88ed86bab2903fa88492083f4))
* replace emitter.of by emitter.removeListener ([e31a4e0](https://github.com/nextgis/nextgis_frontend/commit/e31a4e09c0e414314e98c84caca9322e4e4f39a9))
* **util:** arrayCompare typecasting ([93b1b95](https://github.com/nextgis/nextgis_frontend/commit/93b1b95731aba4fface7d86909c80288b65b9afe))
* **utils:** applyMixin options on no replace ([10869d1](https://github.com/nextgis/nextgis_frontend/commit/10869d12d0834cfad5159b32b2b94ab00cc283ef))
* **vue:** NgwlayersList independent mode ([1b78bd6](https://github.com/nextgis/nextgis_frontend/commit/1b78bd6b1e800a599a5a6b66922c244457b2a773))
* **vue:** NgwLayersList selection event ([c00f830](https://github.com/nextgis/nextgis_frontend/commit/c00f830db0ae197d582e8fd2f476606b5b1d847c))
* **vue:** NgwlayersList visibility toggle ([f1317e9](https://github.com/nextgis/nextgis_frontend/commit/f1317e987011c2e214725385fae745138469f63e))
* **vue:** NgwLayersList webmap visibility ([8555dfe](https://github.com/nextgis/nextgis_frontend/commit/8555dfea4bd6ba76c0382ecdfe864aebfc35257c))
* **vue:** saveselection of webmap in NgwLayersList ([e840903](https://github.com/nextgis/nextgis_frontend/commit/e8409031585bda0d319314385cccd0b4878befdf))
* **vue:** selection for items with properties and tree ([9ab628a](https://github.com/nextgis/nextgis_frontend/commit/9ab628a70e67e22377242a02b73eef5758fd9d40))
* **vuetify:** allow custom label slot for NgwLayersList ([17fc145](https://github.com/nextgis/nextgis_frontend/commit/17fc145a7d261564fc94c41487c1094e807cd354))
* **vuetify:** correction for set empty BasemapSelect text ([445c6a5](https://github.com/nextgis/nextgis_frontend/commit/445c6a571496ce936bffcb542d2f67b9580215da))
* **vuetify:** improve BaselayerSelect ([cc4a577](https://github.com/nextgis/nextgis_frontend/commit/cc4a5776975e0900d5ad3af0e8dd05db2c4ea807))
* **vuetify:** NgwLayersList init select ([001bbb4](https://github.com/nextgis/nextgis_frontend/commit/001bbb4ca10a2c78076f2a19ab9770b599870514))
* **vuetify:** NgwLayersList root item hide ([3eabbe4](https://github.com/nextgis/nextgis_frontend/commit/3eabbe4b35657cae6c59bff559ffc6671c47fb38))
* **vuetify:** NgwLayersList visibility for webmap root item ([7090cc1](https://github.com/nextgis/nextgis_frontend/commit/7090cc191581121d428c4393c1bac546903cc149))
* **vuetify:** pass $attrs from parent ([2d36966](https://github.com/nextgis/nextgis_frontend/commit/2d369664ab1eff9d6999ca2660b574891a3795ae))
* **vuetify:** update items on init ([78298ef](https://github.com/nextgis/nextgis_frontend/commit/78298efbb68da09ba644d4bcb00d09b47bc4a6ac))
* **webmap:** constructor options; move controls options from ngw to webmap ([10ad07e](https://github.com/nextgis/nextgis_frontend/commit/10ad07ed1342dd3a1301e4c48255e16d65751c0d))
* **webmap:** get layers method only string keys ([631a684](https://github.com/nextgis/nextgis_frontend/commit/631a68428b544f64e68d7727a709bb6bebc9afb1))


### Build System

* wepmap to rollup ([8b27550](https://github.com/nextgis/nextgis_frontend/commit/8b27550fc396a032d637996d43679362baa2d0c4))


### chore

* build; eslint ([f9a736e](https://github.com/nextgis/nextgis_frontend/commit/f9a736ef43d07f295a9c63015ce745416584bd25))


### Code Refactoring

* **ngw-kit:** naming ([53a80b7](https://github.com/nextgis/nextgis_frontend/commit/53a80b742c0462f744fc0884d1499a09b51f2b18))
* rename layerAdapter baseLayer option to baselayer ([e5428f1](https://github.com/nextgis/nextgis_frontend/commit/e5428f1f5bc6148ffb3c933a6ac96a4b373b6a02))


### Features

* add getExtent method for all mapAdapters GeoJsonLayerAdapter ([d5d90ef](https://github.com/nextgis/nextgis_frontend/commit/d5d90ef9c758ebd8195bbaa1e50d6fe5fbe36c15))
* handle vector layer mouse over and out events ([82700e2](https://github.com/nextgis/nextgis_frontend/commit/82700e2e9fddd85a4282126a6c8b917a6f29d9ca))
* **leaflet-map-adapter:** add position to vector adapter layers definition ([3a20a8c](https://github.com/nextgis/nextgis_frontend/commit/3a20a8c2bedbd953e7e29446e1acf28a5ce68a4d))
* **ngw-kit:** add addLayerOptionsPriority for createGeoJsonAdapter ([7498e3d](https://github.com/nextgis/nextgis_frontend/commit/7498e3df0849f0f7958f74194e04149569d70ba3))
* **ngw-kit:** add baselayers from webmap; vuetify BaseLayerSelect ([e060be1](https://github.com/nextgis/nextgis_frontend/commit/e060be1e47750362032cffc0a41d81d20cdb4cd5))
* **ngw-kit:** extensibility increased ([19869de](https://github.com/nextgis/nextgis_frontend/commit/19869de87b61f0c28586d8be560b95ca3f783f06))
* **ngw-kit:** make create basemap layer adapter universal ([182da50](https://github.com/nextgis/nextgis_frontend/commit/182da506f649a86c425a30db649fb49efa76e4d9))
* **ngw-kit:** ngwwebmap item toggle on zoom layer range ([4c64a8c](https://github.com/nextgis/nextgis_frontend/commit/4c64a8c15deb3f73a3f948610d06b3877f9577ab))
* **util:** add arrayCompare util ([c3db8c7](https://github.com/nextgis/nextgis_frontend/commit/c3db8c79e00373ba17d2faac5f68433d37d46e27))
* **vue:** add layer toggle listener for baselayerselect ([c343fec](https://github.com/nextgis/nextgis_frontend/commit/c343fecca6f64ec8dd2c663837dedf9d3b2d1cbf))
* **vue:** NgwlayersList bubble with propagation ([33e8d4b](https://github.com/nextgis/nextgis_frontend/commit/33e8d4bc8c97d993092a1f3b4621d8a39c6eda4e))
* **vue:** NgwLayersList ctrl key to propagation reverse ([27d9fbd](https://github.com/nextgis/nextgis_frontend/commit/27d9fbde4e4b7b979584c0a5889b8c2daf5ec350))
* **vue:** NgwLayersList propagation param ([7d45590](https://github.com/nextgis/nextgis_frontend/commit/7d45590d1cf2721f41a3e874536b54c5b6f78a09))
* **vue:** NgwLayersList watch ngwMap change ([3e2f037](https://github.com/nextgis/nextgis_frontend/commit/3e2f037ff83dcedabd7502eb65f686657a645667))
* **vue:** selection for NgwLayersList ([27f1317](https://github.com/nextgis/nextgis_frontend/commit/27f13174bdf1c60545ed16c7169eaa0817e784b5))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([4e2d149](https://github.com/nextgis/nextgis_frontend/commit/4e2d1495810480af84fee0644061157df1b6f0b5))
* **vuetify:** allow VTree scopes for NgwLayersList ([f95a842](https://github.com/nextgis/nextgis_frontend/commit/f95a84228006c48023d8e208b50b003332b77b3f))
* **vuetify:** NgwLayersList remove layer ability ([23553d4](https://github.com/nextgis/nextgis_frontend/commit/23553d4afcf31847e9b7a79519b97f35a26cf90d)), closes [#CU-jzby65](https://github.com/nextgis/nextgis_frontend/issues/CU-jzby65)
* **vuetify:** NgwLayersList set open from ngw webmap item ([e22a1b8](https://github.com/nextgis/nextgis_frontend/commit/e22a1b82f63e8b85f5fa1a9d2b8a3ac04d14ab8c))
* **vue:** use vuetify tree prop to NgwLayersList selection strategy ([0bcf72a](https://github.com/nextgis/nextgis_frontend/commit/0bcf72a002513dc56924b26a42450d3fa8c01002))


### Performance Improvements

* **ngw-kit:** default limit to load large vector layer data ([4dcfdf8](https://github.com/nextgis/nextgis_frontend/commit/4dcfdf8c1eb5a6905f17d84c2a8d971b721b4fa2))
* **vuetify:** replace components gwMap param with webMapId ([c7c96c2](https://github.com/nextgis/nextgis_frontend/commit/c7c96c2539e77b59be92420049ef177cfd8ccd51))
* **vue:** Vuetify NgwLayersList set visibility only for changed ([bf7d361](https://github.com/nextgis/nextgis_frontend/commit/bf7d36174a30105a92daf3ba99397093dac4d70f))


### BREAKING CHANGES

* **ngw-kit:** replace `import { WebMapLayerAdapter } from @nextgis/ngw-kit` to `import { NgwWebmapLayerAdapter } from @nextgis/ngw-kit` and `import { WebMapLayerItem} from @nextgis/ngw-kit` to `import { NgwWebmapLayerItem } from @nextgis/ngw-kit`
* No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
* LayerAdapter option baseLayer was renamed to baselayer;
* webMap.getBaseLayers() method now return LayerAdapter, not string array of ids
* code formatting rules changed to prettier 2.0 compatibility





## [1.16.9](https://github.com/nextgis/nextgis_frontend/compare/v1.16.8...v1.16.9) (2023-07-04)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## 1.16.8 (2023-05-14)


### Bug Fixes

* **build:** control-container extract css ([a02d24b](https://github.com/nextgis/nextgis_frontend/commit/a02d24bf2dbe246420803d5d1be9348e4b647c6d))
* **cesium-map-adapter:** set layer adapters request headers ([38074ba](https://github.com/nextgis/nextgis_frontend/commit/38074ba672e67a635f6c1ea7e30f7de5489a0af3))
* **ngw-connector:** fixes to apiRequest cancel work ([e4451d8](https://github.com/nextgis/nextgis_frontend/commit/e4451d8a7ad349ba17692a3f906677f1a29bf691)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
* **ngw-kit:** create async adapter from parent resource ([5ce6394](https://github.com/nextgis/nextgis_frontend/commit/5ce6394c4d9313c79f6d540df0b1683648a6af83))
* **ngw-kit:** make async onFirstShowAdapter hide and show methods ([502b261](https://github.com/nextgis/nextgis_frontend/commit/502b261b478872aed0bed0657b961481c22ce109))
* **ngw-kit:** ngw webmap item childrensafe reverse ([b790e3a](https://github.com/nextgis/nextgis_frontend/commit/b790e3a244e3205fc64561d30b5572b3dce0fada))
* **ngw-kit:** ngw webmap items layer order ([c5dad6b](https://github.com/nextgis/nextgis_frontend/commit/c5dad6b1db927b7ff30da21f752c4a1d1786b70e))
* **ngw-kit:** remove async from NgwWebmapItem child add ([4b9a75f](https://github.com/nextgis/nextgis_frontend/commit/4b9a75f6ee64700992cd95b7b992265a0564aaed))
* **ngw-kit:** set NgwWebmap tree item property before layer load ([5b9335e](https://github.com/nextgis/nextgis_frontend/commit/5b9335ecb097b8cacb77472ab4ffcaea27f8e3f9))
* **ngw-kit:** webmap item children ordering ([cfb69b0](https://github.com/nextgis/nextgis_frontend/commit/cfb69b074bcfc9c817c671fc66c5a33c7da14996))
* **ngw-map:** constructor options for control ([9e71281](https://github.com/nextgis/nextgis_frontend/commit/9e71281139d0532e574e7f2bcfef68e819f90834))
* **ngw:** ngw webmap resource ordering ([fb0e502](https://github.com/nextgis/nextgis_frontend/commit/fb0e5023c7f17e9b6200c1406081e5691a2941f5))
* **ol:** css control fixes ([facf608](https://github.com/nextgis/nextgis_frontend/commit/facf608fa99064da1a3b817497b0317890b77915))
* remove require imports ([2674a8c](https://github.com/nextgis/nextgis_frontend/commit/2674a8ce29ef4116b939283ee1f4ec02b26b8025))
* replace emitter.of by emitter.removeListener ([a92b281](https://github.com/nextgis/nextgis_frontend/commit/a92b2810df7fae74bb58f50d6791a21bb4a4ef0e))
* **util:** arrayCompare typecasting ([80326b2](https://github.com/nextgis/nextgis_frontend/commit/80326b22e3ba78f9d33fe0006a1c5fbfe3751537))
* **utils:** applyMixin options on no replace ([904caa3](https://github.com/nextgis/nextgis_frontend/commit/904caa3c80a0bc96c7ac961ee70436052def1cfa))
* **vue:** NgwlayersList independent mode ([568cc1b](https://github.com/nextgis/nextgis_frontend/commit/568cc1b9ef3ab77ad1cdbdd9fdc4df0ce921a676))
* **vue:** NgwLayersList selection event ([be63e99](https://github.com/nextgis/nextgis_frontend/commit/be63e9999449acca6a9daf535fc2669c1e4e3299))
* **vue:** NgwlayersList visibility toggle ([1a85fc6](https://github.com/nextgis/nextgis_frontend/commit/1a85fc61cd49fc5d0d9474041d701512b993cc8b))
* **vue:** NgwLayersList webmap visibility ([90a5bc1](https://github.com/nextgis/nextgis_frontend/commit/90a5bc1647882f6c37a4e518fbca01f46f289368))
* **vue:** saveselection of webmap in NgwLayersList ([1fe8c28](https://github.com/nextgis/nextgis_frontend/commit/1fe8c289d3b513ef2a0a85c23b6a4b5f028e3664))
* **vue:** selection for items with properties and tree ([23f0709](https://github.com/nextgis/nextgis_frontend/commit/23f0709c9a37e755d2a11828d8b4f3a7d955745d))
* **vuetify:** allow custom label slot for NgwLayersList ([e0b6e30](https://github.com/nextgis/nextgis_frontend/commit/e0b6e30b96eec6eb81e71f9b7ae239b38c8e9c4d))
* **vuetify:** correction for set empty BasemapSelect text ([7a5ac48](https://github.com/nextgis/nextgis_frontend/commit/7a5ac48724243c0c38b39a808561b222493bf9af))
* **vuetify:** improve BaselayerSelect ([76a047c](https://github.com/nextgis/nextgis_frontend/commit/76a047ce6bd4dfa591cd650a30e0f2648bd4b448))
* **vuetify:** NgwLayersList init select ([4b9cce0](https://github.com/nextgis/nextgis_frontend/commit/4b9cce04fe3b819a993a88bee47bad66592bd19a))
* **vuetify:** NgwLayersList root item hide ([73ab6d1](https://github.com/nextgis/nextgis_frontend/commit/73ab6d180444843b9ace2bb36d2b797950762806))
* **vuetify:** NgwLayersList visibility for webmap root item ([d092ba2](https://github.com/nextgis/nextgis_frontend/commit/d092ba21e949e46797b9ce9d60f88f1810ce1ca4))
* **vuetify:** pass $attrs from parent ([8ab3a36](https://github.com/nextgis/nextgis_frontend/commit/8ab3a36f609875a593739c5d9cb8de5abb0b7b28))
* **vuetify:** update items on init ([a153fd5](https://github.com/nextgis/nextgis_frontend/commit/a153fd5de0804e0b8e88f2a488c879883e033416))
* **webmap:** constructor options; move controls options from ngw to webmap ([5a3b582](https://github.com/nextgis/nextgis_frontend/commit/5a3b58209126a5b1e7a802ae8503129b11602512))
* **webmap:** get layers method only string keys ([a14017b](https://github.com/nextgis/nextgis_frontend/commit/a14017bdcba2fcc2989b4d7a2cbc1b393694e6b8))


### Build System

* wepmap to rollup ([c6f038a](https://github.com/nextgis/nextgis_frontend/commit/c6f038ad6bcd2a9581f852b35600b2560381c246))


### chore

* build; eslint ([ee1e03d](https://github.com/nextgis/nextgis_frontend/commit/ee1e03d85625b02a09c2ee1e4d66007fbf57d626))


### Code Refactoring

* **ngw-kit:** naming ([434411a](https://github.com/nextgis/nextgis_frontend/commit/434411a8b2f7e63d436632821d11d0e476d410b3))
* rename layerAdapter baseLayer option to baselayer ([e5c595d](https://github.com/nextgis/nextgis_frontend/commit/e5c595d6df24b1b22906ad1e06eb60bf0327e9c0))


### Features

* add getExtent method for all mapAdapters GeoJsonLayerAdapter ([7e8010f](https://github.com/nextgis/nextgis_frontend/commit/7e8010f7d5579f2b7909a31a2073479de1faa6a5))
* handle vector layer mouse over and out events ([1f537c2](https://github.com/nextgis/nextgis_frontend/commit/1f537c277b433db365b319d4bbdfb26aa44528fd))
* **leaflet-map-adapter:** add position to vector adapter layers definition ([053ccf0](https://github.com/nextgis/nextgis_frontend/commit/053ccf05ed8d9d76592c8ca648365e176c609277))
* **ngw-kit:** add addLayerOptionsPriority for createGeoJsonAdapter ([eb7db26](https://github.com/nextgis/nextgis_frontend/commit/eb7db2620f2bf66812ab90b03f5359c70f46ecf9))
* **ngw-kit:** add baselayers from webmap; vuetify BaseLayerSelect ([7862680](https://github.com/nextgis/nextgis_frontend/commit/78626807a6e9c7420ffffeba5c9a4f90fdba24b8))
* **ngw-kit:** extensibility increased ([2b7286d](https://github.com/nextgis/nextgis_frontend/commit/2b7286d7aba2551e22ea72f1329b3009893af64f))
* **ngw-kit:** make create basemap layer adapter universal ([b17781d](https://github.com/nextgis/nextgis_frontend/commit/b17781df8afabd9e5353a07c94a3769390ea8591))
* **ngw-kit:** ngwwebmap item toggle on zoom layer range ([52abb1d](https://github.com/nextgis/nextgis_frontend/commit/52abb1d2fee3b2c306b9269e8287d98362ef5128))
* **util:** add arrayCompare util ([dd58235](https://github.com/nextgis/nextgis_frontend/commit/dd58235aecd04de213aa962e002145a65fdc2d52))
* **vue:** add layer toggle listener for baselayerselect ([a78a687](https://github.com/nextgis/nextgis_frontend/commit/a78a6874814740637adee39c5813015a5d7dd6eb))
* **vue:** NgwlayersList bubble with propagation ([9c7b38a](https://github.com/nextgis/nextgis_frontend/commit/9c7b38a5688aaa1a69e3efbcc58c99c6d4717ed9))
* **vue:** NgwLayersList ctrl key to propagation reverse ([6d5ee63](https://github.com/nextgis/nextgis_frontend/commit/6d5ee634b65a6064b604d6c1073d4dc471f971e8))
* **vue:** NgwLayersList propagation param ([65879c9](https://github.com/nextgis/nextgis_frontend/commit/65879c9f8ea141bffb4213f5e3ad590447423ddc))
* **vue:** NgwLayersList watch ngwMap change ([8496ec7](https://github.com/nextgis/nextgis_frontend/commit/8496ec772ec9c6998bcd1ca604d058acbea75172))
* **vue:** selection for NgwLayersList ([3ce2a7b](https://github.com/nextgis/nextgis_frontend/commit/3ce2a7b39ee5166ef719a718dfdc608f66b92b0f))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([bcea6c3](https://github.com/nextgis/nextgis_frontend/commit/bcea6c35e61f6ba2aab0b25eb30da9f5f719c92e))
* **vuetify:** allow VTree scopes for NgwLayersList ([0639026](https://github.com/nextgis/nextgis_frontend/commit/063902636fa1425a1dba6bce89a40b040d042387))
* **vuetify:** NgwLayersList remove layer ability ([411b5a3](https://github.com/nextgis/nextgis_frontend/commit/411b5a32ddf0443dccc639e7cf86fb41d08f2d0a)), closes [#CU-jzby65](https://github.com/nextgis/nextgis_frontend/issues/CU-jzby65)
* **vuetify:** NgwLayersList set open from ngw webmap item ([a278789](https://github.com/nextgis/nextgis_frontend/commit/a278789929e604059432e1a7f0967c83b3d2fee2))
* **vue:** use vuetify tree prop to NgwLayersList selection strategy ([e1f4a95](https://github.com/nextgis/nextgis_frontend/commit/e1f4a95a03189f1cd50ada7dfb95fd5b4a5284aa))


### Performance Improvements

* **ngw-kit:** default limit to load large vector layer data ([bcdba09](https://github.com/nextgis/nextgis_frontend/commit/bcdba0973fad5204bf3b067afa9cfdb692d48a99))
* **vuetify:** replace components gwMap param with webMapId ([e807f90](https://github.com/nextgis/nextgis_frontend/commit/e807f90de22cafeb4409cca11ceba863275cd542))
* **vue:** Vuetify NgwLayersList set visibility only for changed ([b7bd76c](https://github.com/nextgis/nextgis_frontend/commit/b7bd76c63c9338fcbbe3e9fb7ae26e61cd2b8551))


### BREAKING CHANGES

* **ngw-kit:** replace `import { WebMapLayerAdapter } from @nextgis/ngw-kit` to `import { NgwWebmapLayerAdapter } from @nextgis/ngw-kit` and `import { WebMapLayerItem} from @nextgis/ngw-kit` to `import { NgwWebmapLayerItem } from @nextgis/ngw-kit`
* No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
* LayerAdapter option baseLayer was renamed to baselayer;
* webMap.getBaseLayers() method now return LayerAdapter, not string array of ids
* code formatting rules changed to prettier 2.0 compatibility





## [1.16.7](https://github.com/nextgis/nextgis_frontend/compare/v1.16.6...v1.16.7) (2023-04-21)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components





## [1.16.6](https://github.com/nextgis/nextgis_frontend/compare/v1.16.5...v1.16.6) (2023-02-09)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.16.5](https://github.com/nextgis/nextgis_frontend/compare/v1.16.4...v1.16.5) (2023-02-09)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.16.4](https://github.com/nextgis/nextgis_frontend/compare/v1.16.3...v1.16.4) (2022-09-21)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.16.3](https://github.com/nextgis/nextgis_frontend/compare/v1.16.2...v1.16.3) (2022-09-16)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.16.2](https://github.com/nextgis/nextgis_frontend/compare/v1.16.1...v1.16.2) (2022-09-15)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.16.1](https://github.com/nextgis/nextgis_frontend/compare/v1.16.0...v1.16.1) (2022-09-03)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.16.0](https://github.com/nextgis/nextgis_frontend/compare/v1.15.1...v1.16.0) (2022-08-28)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.15.1](https://github.com/nextgis/nextgis_frontend/compare/v1.15.0...v1.15.1) (2022-08-02)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.15.0](https://github.com/nextgis/nextgis_frontend/compare/v1.14.0...v1.15.0) (2022-07-27)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.14.0](https://github.com/nextgis/nextgis_frontend/compare/v1.13.8...v1.14.0) (2022-07-05)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.13.8](https://github.com/nextgis/nextgis_frontend/compare/v1.13.7...v1.13.8) (2022-06-25)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.13.7](https://github.com/nextgis/nextgis_frontend/compare/v1.13.6...v1.13.7) (2022-06-15)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.13.6](https://github.com/nextgis/nextgis_frontend/compare/v1.13.5...v1.13.6) (2022-06-05)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.13.5](https://github.com/nextgis/nextgis_frontend/compare/v1.13.4...v1.13.5) (2022-05-31)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.13.4](https://github.com/nextgis/nextgis_frontend/compare/v1.13.3...v1.13.4) (2022-05-31)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.13.3](https://github.com/nextgis/nextgis_frontend/compare/v1.13.2...v1.13.3) (2022-05-31)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.13.2](https://github.com/nextgis/nextgis_frontend/compare/v1.13.1...v1.13.2) (2022-05-30)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.13.1](https://github.com/nextgis/nextgis_frontend/compare/v1.13.0...v1.13.1) (2022-05-13)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.13.0](https://github.com/nextgis/nextgis_frontend/compare/v1.12.1...v1.13.0) (2022-05-13)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.12.1](https://github.com/nextgis/nextgis_frontend/compare/v1.12.0...v1.12.1) (2022-04-21)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.12.0](https://github.com/nextgis/nextgis_frontend/compare/v1.11.10...v1.12.0) (2022-03-05)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.11.10](https://github.com/nextgis/nextgis_frontend/compare/v1.11.9...v1.11.10) (2022-01-20)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.11.9](https://github.com/nextgis/nextgis_frontend/compare/v1.11.8...v1.11.9) (2022-01-18)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.11.8](https://github.com/nextgis/nextgis_frontend/compare/v1.11.7...v1.11.8) (2022-01-18)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.11.7](https://github.com/nextgis/nextgis_frontend/compare/v1.11.6...v1.11.7) (2022-01-11)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.11.3](https://github.com/nextgis/nextgis_frontend/compare/v1.11.2...v1.11.3) (2022-01-03)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.11.2](https://github.com/nextgis/nextgis_frontend/compare/v1.11.1...v1.11.2) (2021-12-20)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.11.0](https://github.com/nextgis/nextgis_frontend/compare/v1.10.0...v1.11.0) (2021-12-19)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.10.0](https://github.com/nextgis/nextgis_frontend/compare/v1.9.7...v1.10.0) (2021-11-30)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.9.7](https://github.com/nextgis/nextgis_frontend/compare/v1.9.6...v1.9.7) (2021-11-19)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.9.6](https://github.com/nextgis/nextgis_frontend/compare/v1.9.5...v1.9.6) (2021-11-18)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.9.5](https://github.com/nextgis/nextgis_frontend/compare/v1.9.4...v1.9.5) (2021-11-18)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.9.4](https://github.com/nextgis/nextgis_frontend/compare/v1.9.3...v1.9.4) (2021-11-16)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.9.3](https://github.com/nextgis/nextgis_frontend/compare/v1.9.2...v1.9.3) (2021-11-05)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.9.2](https://github.com/nextgis/nextgis_frontend/compare/v1.9.1...v1.9.2) (2021-10-26)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.9.1](https://github.com/nextgis/nextgis_frontend/compare/v1.9.0...v1.9.1) (2021-10-25)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.9.0](https://github.com/nextgis/nextgis_frontend/compare/v1.8.5...v1.9.0) (2021-10-23)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.8.4](https://github.com/nextgis/nextgis_frontend/compare/v1.8.3...v1.8.4) (2021-10-21)

### Features

- **ngw-kit:** ngwwebmap item toggle on zoom layer range ([f7c4e42](https://github.com/nextgis/nextgis_frontend/commit/f7c4e42fe323f9e4941dbc37893b3beb2ccd7751))

## [1.8.3](https://github.com/nextgis/nextgis_frontend/compare/v1.8.2...v1.8.3) (2021-10-12)

### Bug Fixes

- **ngw-kit:** make async onFirstShowAdapter hide and show methods ([e5d43b6](https://github.com/nextgis/nextgis_frontend/commit/e5d43b6156cd961619908a9100e204c36d42bcb0))

## [1.8.2](https://github.com/nextgis/nextgis_frontend/compare/v1.8.1...v1.8.2) (2021-10-05)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.8.1](https://github.com/nextgis/nextgis_frontend/compare/v1.8.0...v1.8.1) (2021-09-23)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.8.0](https://github.com/nextgis/nextgis_frontend/compare/v1.7.0...v1.8.0) (2021-09-22)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.7.0](https://github.com/nextgis/nextgis_frontend/compare/v1.6.0...v1.7.0) (2021-09-16)

### Features

- **leaflet-map-adapter:** add position to vector adapter layers definition ([61cb7a5](https://github.com/nextgis/nextgis_frontend/commit/61cb7a591ed3ececcabed710abf1e0aec6708c1b))

# [1.6.0](https://github.com/nextgis/nextgis_frontend/compare/v1.5.1...v1.6.0) (2021-09-09)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.5.1](https://github.com/nextgis/nextgis_frontend/compare/v1.5.0...v1.5.1) (2021-09-06)

### Features

- **vue:** add layer toggle listener for baselayerselect ([4b5fa94](https://github.com/nextgis/nextgis_frontend/commit/4b5fa94e6a718255c8721c4fcc1d4ebb08a7ca4b))

# [1.5.0](https://github.com/nextgis/nextgis_frontend/compare/v1.4.0...v1.5.0) (2021-08-19)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.4.0](https://github.com/nextgis/nextgis_frontend/compare/v1.3.0...v1.4.0) (2021-08-17)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.3.0](https://github.com/nextgis/nextgis_frontend/compare/v1.2.8...v1.3.0) (2021-08-06)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.2.8](https://github.com/nextgis/nextgis_frontend/compare/v1.2.7...v1.2.8) (2021-07-27)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.2.7](https://github.com/nextgis/nextgis_frontend/compare/v1.2.6...v1.2.7) (2021-07-26)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.2.6](https://github.com/nextgis/nextgis_frontend/compare/v1.2.5...v1.2.6) (2021-07-23)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.2.4](https://github.com/nextgis/nextgis_frontend/compare/v1.2.3...v1.2.4) (2021-07-22)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.2.3](https://github.com/nextgis/nextgis_frontend/compare/v1.2.2...v1.2.3) (2021-07-21)

### Bug Fixes

- **vuetify:** improve BaselayerSelect ([89d8ef5](https://github.com/nextgis/nextgis_frontend/commit/89d8ef5c25b6858fae345e4061f471ba52bb2c7d))

## [1.2.2](https://github.com/nextgis/nextgis_frontend/compare/v1.2.1...v1.2.2) (2021-07-16)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.2.1](https://github.com/nextgis/nextgis_frontend/compare/v1.2.0...v1.2.1) (2021-07-12)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.2.0](https://github.com/nextgis/nextgis_frontend/compare/v1.1.2...v1.2.0) (2021-07-08)

### Features

- handle vector layer mouse over and out events ([2e94152](https://github.com/nextgis/nextgis_frontend/commit/2e94152fac64b8e022dab7940614487763ce57af))

## [1.1.2](https://github.com/nextgis/nextgis_frontend/compare/v1.1.1...v1.1.2) (2021-06-28)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.1.1](https://github.com/nextgis/nextgis_frontend/compare/v1.1.0...v1.1.1) (2021-06-25)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.1.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.1...v1.1.0) (2021-06-25)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [1.0.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0...v1.0.1) (2021-06-08)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.0.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.9...v1.0.0) (2021-06-07)

### Features

- **vuetify:** NgwLayersList remove layer ability ([320ce0e](https://github.com/nextgis/nextgis_frontend/commit/320ce0effd76c6562036c6558564cecc06e83231)), closes [#CU-jzby65](https://github.com/nextgis/nextgis_frontend/issues/CU-jzby65)

# [1.0.0-beta.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2021-05-03)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.0.0-beta.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2021-05-02)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.0.0-beta.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-04-23)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.0.0-beta.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-04-04)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.0.0-beta.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-02-13)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.0.0-beta.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-01-17)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.0.0-beta.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-12-19)

### Bug Fixes

- **vue:** NgwlayersList independent mode ([57e1c35](https://github.com/nextgis/nextgis_frontend/commit/57e1c35b4d57f9edff31318df8036777ed8f8657))
- **vuetify:** NgwLayersList init select ([46ec3cb](https://github.com/nextgis/nextgis_frontend/commit/46ec3cbcd9159c27b30ceda3523a9a9c53432c98))

# [1.0.0-beta.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-11-28)

### Bug Fixes

- **ngw-connector:** fixes to apiRequest cancel work ([0ac44ee](https://github.com/nextgis/nextgis_frontend/commit/0ac44eee447019593ae80529cc3b063171f8f88c)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
- **ngw-kit:** ngw webmap item childrensafe reverse ([fbcb433](https://github.com/nextgis/nextgis_frontend/commit/fbcb4330b193cb914fa184ccdb6ac81bc2b8a5f6))
- **utils:** applyMixin options on no replace ([4362c4c](https://github.com/nextgis/nextgis_frontend/commit/4362c4cb36dcd885803bb9dde36512ced21287cb))

# [1.0.0-beta.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2020-11-16)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.0.0-alpha.11](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2020-11-02)

### Bug Fixes

- **ngw-map:** constructor options for control ([7d40e0c](https://github.com/nextgis/nextgis_frontend/commit/7d40e0c6d52f3d734cd5f28173f03e4a1a0943df))
- **vue:** NgwLayersList selection event ([054b42a](https://github.com/nextgis/nextgis_frontend/commit/054b42a90559196ab4302a6607d8fad8e4d0910c))
- **vue:** NgwlayersList visibility toggle ([e5a9d5c](https://github.com/nextgis/nextgis_frontend/commit/e5a9d5c9d9333e155364e99a1164c805ddd29f94))
- **webmap:** constructor options; move controls options from ngw to webmap ([611b8c0](https://github.com/nextgis/nextgis_frontend/commit/611b8c0af120c726ccf42eca0a608edbd54bb1c1))

### Features

- **vue:** selection for NgwLayersList ([7029a73](https://github.com/nextgis/nextgis_frontend/commit/7029a73555d73b1937f44d82ce0d5942fa933c49))
- **vue:** use vuetify tree prop to NgwLayersList selection strategy ([2c5f5e6](https://github.com/nextgis/nextgis_frontend/commit/2c5f5e663a07b2945c7884ffb6902d0463ee225e))

# [1.0.0-alpha.10](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-10-20)

### Bug Fixes

- **ngw-kit:** remove async from NgwWebmapItem child add ([024cd13](https://github.com/nextgis/nextgis_frontend/commit/024cd13781f8c089af081511d8a784c4b0089405))
- **ngw-kit:** set NgwWebmap tree item property before layer load ([edb38ab](https://github.com/nextgis/nextgis_frontend/commit/edb38abb8a45d7ee1933a1fee633c753a52e11eb))
- **ngw-kit:** webmap item children ordering ([952f72f](https://github.com/nextgis/nextgis_frontend/commit/952f72fca18b6222e53d8ac3a5ad615ae40a2aa1))

### Features

- **vue:** NgwlayersList bubble with propagation ([2c023bd](https://github.com/nextgis/nextgis_frontend/commit/2c023bd29b54c47d67e1eb0afe5589772e6e3359))
- **vue:** NgwLayersList ctrl key to propagation reverse ([2ecf4a5](https://github.com/nextgis/nextgis_frontend/commit/2ecf4a553cd8788018b664c7e5bf3e8e4fc62b12))

# [1.0.0-alpha.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-10-15)

### Bug Fixes

- **cesium-map-adapter:** set layer adapters request headers ([eb2b570](https://github.com/nextgis/nextgis_frontend/commit/eb2b5702062b44b7885d3582fe953986fd4b02d9))

### Features

- add getExtent method for all mapAdapters GeoJsonLayerAdapter ([9254c3b](https://github.com/nextgis/nextgis_frontend/commit/9254c3bf4b1200c69126d770525a8b6b20a9f5c2))
- **vue:** NgwLayersList propagation param ([636c46b](https://github.com/nextgis/nextgis_frontend/commit/636c46bf387be491819297e42346beea246de8f1))

### Performance Improvements

- **vue:** Vuetify NgwLayersList set visibility only for changed ([bfddc9e](https://github.com/nextgis/nextgis_frontend/commit/bfddc9e062c155d3e9ea62f6df18bacbc34acadd))

# [1.0.0-alpha.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-06)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.0.0-alpha.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-09-22)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.0.0-alpha.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.0.0-alpha.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)

### Bug Fixes

- remove require imports ([be789b8](https://github.com/nextgis/nextgis_frontend/commit/be789b89f39741efe146da97eeb19460a7cca527))

# [1.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)

### Code Refactoring

- **ngw-kit:** naming ([f870925](https://github.com/nextgis/nextgis_frontend/commit/f8709259501b811f269a89445975969e00db2763))

### BREAKING CHANGES

- **ngw-kit:** replace `import { WebMapLayerAdapter } from @nextgis/ngw-kit` to `import { NgwWebmapLayerAdapter } from @nextgis/ngw-kit` and `import { WebMapLayerItem} from @nextgis/ngw-kit` to `import { NgwWebmapLayerItem } from @nextgis/ngw-kit`

# [1.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)

### Bug Fixes

- replace emitter.of by emitter.removeListener ([5a92e2b](https://github.com/nextgis/nextgis_frontend/commit/5a92e2b91e741346be39be87d5b9f50b9621c092))
- **vuetify:** pass $attrs from parent ([778f909](https://github.com/nextgis/nextgis_frontend/commit/778f9093dba1b15115806996b7c0984d5bfc84b0))
- **vuetify:** update items on init ([03f78ed](https://github.com/nextgis/nextgis_frontend/commit/03f78ed98e74fc2eb005085f1fce30b3a957ece5))

### Build System

- wepmap to rollup ([bc66507](https://github.com/nextgis/nextgis_frontend/commit/bc665072f7eefacae748c2cf81f6bdef75d9f8aa))

### Code Refactoring

- rename layerAdapter baseLayer option to baselayer ([368d657](https://github.com/nextgis/nextgis_frontend/commit/368d6576278505ddddde2a1ab160a0849e087c70))

### Performance Improvements

- **vuetify:** replace components gwMap param with webMapId ([59a42d3](https://github.com/nextgis/nextgis_frontend/commit/59a42d35029c4d713469a1ea2f339c3bb5f3747a))

### BREAKING CHANGES

- No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
- LayerAdapter option baseLayer was renamed to baselayer;
- webMap.getBaseLayers() method now return LayerAdapter, not string array of ids

# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)

### Bug Fixes

- **vuetify:** correction for set empty BasemapSelect text ([8ab35e4](https://github.com/nextgis/nextgis_frontend/commit/8ab35e426f9333391c746849c0d2316e2cb62ec3))
- **vuetify:** NgwLayersList root item hide ([abba8cb](https://github.com/nextgis/nextgis_frontend/commit/abba8cbd8a46697ba37a768bd2576086591c344c))

# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)

### Bug Fixes

- **ngw-kit:** create async adapter from parent resource ([808572b](https://github.com/nextgis/nextgis_frontend/commit/808572b5aff6b04783cd7e9edd078e2ea5404dd2))
- **ol:** css control fixes ([98f6d13](https://github.com/nextgis/nextgis_frontend/commit/98f6d13dc9af59a39b1b0a13cea24be3a2505759))
- **vuetify:** NgwLayersList visibility for webmap root item ([4f940a8](https://github.com/nextgis/nextgis_frontend/commit/4f940a854a5054070acbf9d0416f059c9f19ae7d))

### Features

- **ngw-kit:** add addLayerOptionsPriority for createGeoJsonAdapter ([f6c563e](https://github.com/nextgis/nextgis_frontend/commit/f6c563e1bc1238206bb4ba3d8081971d078ef54d))
- **ngw-kit:** add baselayers from webmap; vuetify BaseLayerSelect ([74c0749](https://github.com/nextgis/nextgis_frontend/commit/74c074929c7da864a9097fc8176825894555e0a3))
- **ngw-kit:** make create basemap layer adapter universal ([bbd8c9a](https://github.com/nextgis/nextgis_frontend/commit/bbd8c9a77d527921909ae9b1bf10b3580c5fa600))

## [0.30.2](https://github.com/nextgis/nextgis_frontend/compare/v0.30.1...v0.30.2) (2020-04-30)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)

### Bug Fixes

- **vue:** selection for items with properties and tree ([e2f72df](https://github.com/nextgis/nextgis_frontend/commit/e2f72df0c1800e7595c7e3e8342f15841f897eea))
- **webmap:** get layers method only string keys ([e0182c9](https://github.com/nextgis/nextgis_frontend/commit/e0182c95c81f5b76605f569bcbf2826937909889))

### Features

- **ngw-kit:** extensibility increased ([77bdaf7](https://github.com/nextgis/nextgis_frontend/commit/77bdaf7df43124811a8847cad348fe6bdae6d1ed))

### Performance Improvements

- **ngw-kit:** default limit to load large vector layer data ([1e88276](https://github.com/nextgis/nextgis_frontend/commit/1e8827674db30d654b6ce6c0018171b4b15db12b))

# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.29.10](https://github.com/nextgis/nextgis_frontend/compare/v0.29.9...v0.29.10) (2020-04-17)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.29.6](https://github.com/nextgis/nextgis_frontend/compare/v0.29.5...v0.29.6) (2020-04-16)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)

### Bug Fixes

- **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))

# [0.29.0](https://github.com/nextgis/nextgis_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)

### chore

- build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))

### BREAKING CHANGES

- code formatting rules changed to prettier 2.0 compatibility

## [0.28.3](https://github.com/nextgis/nextgis_frontend/compare/v0.28.2...v0.28.3) (2020-03-19)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.28.1](https://github.com/nextgis/nextgis_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)

### Features

- **vuetify:** allow VTree scopes for NgwLayersList ([8718f9b](https://github.com/nextgis/nextgis_frontend/commit/8718f9b6e114714523b3476a97b23934c31f2bb4))

# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)

### Bug Fixes

- **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgis_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))
- **util:** arrayCompare typecasting ([3cca72c](https://github.com/nextgis/nextgis_frontend/commit/3cca72cdcae150829a58754a2efbe51cd6c4517f))
- **vue:** NgwLayersList webmap visibility ([919bc4e](https://github.com/nextgis/nextgis_frontend/commit/919bc4e5dd971f0f9ed501bab4266eaab8da5037))
- **vue:** saveselection of webmap in NgwLayersList ([6270793](https://github.com/nextgis/nextgis_frontend/commit/6270793f23d4c01f9a928a868301c36d53502bc2))

### Features

- **util:** add arrayCompare util ([9442c01](https://github.com/nextgis/nextgis_frontend/commit/9442c01e17dc894e97580cf32b882567066a9004))
- **vue:** NgwLayersList watch ngwMap change ([b2bfd34](https://github.com/nextgis/nextgis_frontend/commit/b2bfd349c86e934194424ebedf05ee9d24a6a51f))
- **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgis_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))

## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.25.4](https://github.com/nextgis/nextgis_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.25.3](https://github.com/nextgis/nextgis_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.25.2](https://github.com/nextgis/nextgis_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

## [0.25.1](https://github.com/nextgis/nextgis_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)

**Note:** Version bump only for package @nextgis/vuetify-ngw-components

# [0.25.0](https://github.com/nextgis/nextgis_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)

### Bug Fixes

- **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgis_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))
- **util:** arrayCompare typecasting ([3cca72c](https://github.com/nextgis/nextgis_frontend/commit/3cca72cdcae150829a58754a2efbe51cd6c4517f))
- **vue:** NgwLayersList webmap visibility ([919bc4e](https://github.com/nextgis/nextgis_frontend/commit/919bc4e5dd971f0f9ed501bab4266eaab8da5037))
- **vue:** saveselection of webmap in NgwLayersList ([6270793](https://github.com/nextgis/nextgis_frontend/commit/6270793f23d4c01f9a928a868301c36d53502bc2))

### Features

- **util:** add arrayCompare util ([9442c01](https://github.com/nextgis/nextgis_frontend/commit/9442c01e17dc894e97580cf32b882567066a9004))
- **vue:** NgwLayersList watch ngwMap change ([b2bfd34](https://github.com/nextgis/nextgis_frontend/commit/b2bfd349c86e934194424ebedf05ee9d24a6a51f))
