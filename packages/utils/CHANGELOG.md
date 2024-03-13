# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v2.0.0-alpha.0...v2.0.0-alpha.1) (2024-03-13)

**Note:** Version bump only for package @nextgis/utils





# [2.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v1.19.5...v2.0.0-alpha.0) (2024-03-04)

**Note:** Version bump only for package @nextgis/utils





# [1.19.0](https://github.com/nextgis/nextgis_frontend/compare/v1.18.21...v1.19.0) (2023-11-24)

**Note:** Version bump only for package @nextgis/utils





## [1.18.21](https://github.com/nextgis/nextgis_frontend/compare/v1.18.20...v1.18.21) (2023-11-18)

**Note:** Version bump only for package @nextgis/utils





## [1.18.12](https://github.com/nextgis/nextgis_frontend/compare/v1.18.11...v1.18.12) (2023-10-17)


### Features

* **util:** add getSquarePolygon function ([823c3a8](https://github.com/nextgis/nextgis_frontend/commit/823c3a84293ca78b1d7e9a2e317dbf174108285f))





# [1.17.0](https://github.com/nextgis/nextgis_frontend/compare/v0.5.0...v1.17.0) (2023-09-25)


### Bug Fixes

* **build:** control-container extract css ([ff15f22](https://github.com/nextgis/nextgis_frontend/commit/ff15f221bd46de3d0e32aaa2735f7224d49b24fc))
* **leaflet-map-adapter:** geojson selection ([933507a](https://github.com/nextgis/nextgis_frontend/commit/933507a7fe61825c4742617073cd2c21deabe69d))
* **leaflet-map-adapter:** init center option ([98bf77b](https://github.com/nextgis/nextgis_frontend/commit/98bf77bf84f6f13ed23e50d0a8d7e4e5b87ce673))
* **mapbox:** geojson getFeatures method return whole source data ([d5b2afa](https://github.com/nextgis/nextgis_frontend/commit/d5b2afa83077052daffcd622721204c2e0fdea75))
* **ngw-connector:** node request write data for no POST mode ([c7cc7e9](https://github.com/nextgis/nextgis_frontend/commit/c7cc7e91b8b49bd71bf344b7ca81ef23adcae875))
* **ngw-kit:** createGeojsonAdapter propertiesFilter ([c053f3c](https://github.com/nextgis/nextgis_frontend/commit/c053f3c2c57bcf6919c2082c5c624c47ed1c4413))
* **ngw-kit:** do not reassign getExtent for geojson layer ([efcb4c9](https://github.com/nextgis/nextgis_frontend/commit/efcb4c9ee767e78bc36628e4244516a23f18ef4a))
* **ngw-map:** identify order ([05152e5](https://github.com/nextgis/nextgis_frontend/commit/05152e5b1513a44576873c14350444a3a7b43a58))
* **ol-map-adapter:** geojson adapter layer remove ([e9de53b](https://github.com/nextgis/nextgis_frontend/commit/e9de53b952fcfb237137e213b97dea99984f7810))
* **ol-map-adapter:** geojson adapter style function type detection ([29452d1](https://github.com/nextgis/nextgis_frontend/commit/29452d1389794bc188bcc5da9d32082065e6cb43))
* **properties-filte:** allow any chars for `like` and `ilike` search ([5845943](https://github.com/nextgis/nextgis_frontend/commit/584594307301fd62603015bce08205840698758a))
* remove require imports ([c227e90](https://github.com/nextgis/nextgis_frontend/commit/c227e9003e209ea88ed86bab2903fa88492083f4))
* rename Clipboard ([483689c](https://github.com/nextgis/nextgis_frontend/commit/483689c3275a40999e7dbc438f5c7fa5e56bc075))
* **util:** arrayCompare typecasting ([93b1b95](https://github.com/nextgis/nextgis_frontend/commit/93b1b95731aba4fface7d86909c80288b65b9afe))
* **utils:** applyMixin options on no replace ([10869d1](https://github.com/nextgis/nextgis_frontend/commit/10869d12d0834cfad5159b32b2b94ab00cc283ef))
* **utils:** fix objectDeepEqual function ([e2a88f9](https://github.com/nextgis/nextgis_frontend/commit/e2a88f98b5b5faebadb911ebedd22e7de3d89e98))
* **utils:** function name typos ([f581fe3](https://github.com/nextgis/nextgis_frontend/commit/f581fe3b51ddb22647e61d731a3982e7d3e0001a))
* **utils:** update applyMixins util to allow babel build ([97aea6d](https://github.com/nextgis/nextgis_frontend/commit/97aea6db46e5c7b4ba4eaa8f88dbb2118557d33a))
* **webmap:** constructor options; move controls options from ngw to webmap ([10ad07e](https://github.com/nextgis/nextgis_frontend/commit/10ad07ed1342dd3a1301e4c48255e16d65751c0d))


### chore

* build; eslint ([f9a736e](https://github.com/nextgis/nextgis_frontend/commit/f9a736ef43d07f295a9c63015ce745416584bd25))


### Code Refactoring

* **utils:** update geom utils ([caebd68](https://github.com/nextgis/nextgis_frontend/commit/caebd68833967eeb23f78c35bdaa3c83bdf7442d))


### Features

* add getExtent method for all mapAdapters GeoJsonLayerAdapter ([d5d90ef](https://github.com/nextgis/nextgis_frontend/commit/d5d90ef9c758ebd8195bbaa1e50d6fe5fbe36c15))
* add library `@nextgis/properties-filter` ([5f874e8](https://github.com/nextgis/nextgis_frontend/commit/5f874e8d2a28bf873e61273bcf55ae29e60e16d0))
* add library cancelable-promise ([7a0d99f](https://github.com/nextgis/nextgis_frontend/commit/7a0d99f7ae874c058068141e8a8634032004195f))
* add new library `ControlContainer` ([db89d97](https://github.com/nextgis/nextgis_frontend/commit/db89d974a4548c84b311b8e5f2517115511ed03d))
* **area:** add new Area package ([2062f17](https://github.com/nextgis/nextgis_frontend/commit/2062f179fd8cbb5f75a6c8f78e440444f424ada8))
* **cache:** add array to match options deep compare ([a8c773f](https://github.com/nextgis/nextgis_frontend/commit/a8c773f3f3b55470c6dbd46040e5203ab8ba7816))
* **cache:** add namespaces support ([8e7498b](https://github.com/nextgis/nextgis_frontend/commit/8e7498bf12685b1226c2d8daa033471e6e74a4b1))
* **cache:** new package to cache key value with async ability ([3606d7e](https://github.com/nextgis/nextgis_frontend/commit/3606d7ea891e60e2993823bde8bf8f37ce76e383))
* **cancelable-promise:** create abort control ([e5f8c8a](https://github.com/nextgis/nextgis_frontend/commit/e5f8c8a54ab71bc10f17335511abb97fe1c4ae1f))
* **cancelable-promise:** throw CancelError instead of onCancel callback ([0da1cc9](https://github.com/nextgis/nextgis_frontend/commit/0da1cc98645ec337bd9a869730991c7635e341af))
* **clipboard:** on static copy return operation status ([d09698b](https://github.com/nextgis/nextgis_frontend/commit/d09698b6c6e23a24c5b2be7a27882eb57b207d58))
* **control:** add universal zoom control ([6941bb5](https://github.com/nextgis/nextgis_frontend/commit/6941bb5fdd290b788d819f0c64acdaa63d561d8b))
* eslint no-dupe off; object utils; propertiesFilter generic ([e0678f0](https://github.com/nextgis/nextgis_frontend/commit/e0678f04ac73c1e8204b089fbc2443eb5892d80a))
* improve popup, add new options, ol support ([c0da880](https://github.com/nextgis/nextgis_frontend/commit/c0da8801931c3db3b860f0f06f4ac2dc16668faf))
* **mapboxgl-map-adapter:** set maxBounds init map option ([e1ea779](https://github.com/nextgis/nextgis_frontend/commit/e1ea779ce3481ec71845125df8f079fd54df151b))
* move getIdentifyRadius from ngw-map to utils package ([5976907](https://github.com/nextgis/nextgis_frontend/commit/5976907003adf0514004c4ae8c72dbeaf02d7e9a))
* new @nextgis/dom library ([1cf0044](https://github.com/nextgis/nextgis_frontend/commit/1cf004410146a6232e36beb0c72ed51ba7592c3b))
* **ngw-connector:** add static create method ([6d67857](https://github.com/nextgis/nextgis_frontend/commit/6d67857e018d28cf3b7efda4ea8890d253d07b44))
* **ngw-connector:** new getResourceBy method ([3014d39](https://github.com/nextgis/nextgis_frontend/commit/3014d396d9e35d05b6e5587b7fe444bb3b772269))
* **ngw-kit:** add polygon intersection identify util ([439cf4a](https://github.com/nextgis/nextgis_frontend/commit/439cf4a213314d2e1c6479a99d67b939e6742ef3))
* **ngw-kit:** log to get item extensions if not request param set ([3e4b31c](https://github.com/nextgis/nextgis_frontend/commit/3e4b31cae4e5c8a036c427cc1fd18b053bdf1a6a))
* **ngw-orm:** update VectorLayer.toTypescript ([483a59a](https://github.com/nextgis/nextgis_frontend/commit/483a59a4ad6c53ae8bcd5cdeb2bf478fb2e2ae65))
* **util:** add arrayCompare util ([c3db8c7](https://github.com/nextgis/nextgis_frontend/commit/c3db8c79e00373ba17d2faac5f68433d37d46e27))
* **util:** add coord format transformer ([47216bc](https://github.com/nextgis/nextgis_frontend/commit/47216bc48e29f190cae530bff21b62152748bbf0))
* **util:** add debounce util ([a996c15](https://github.com/nextgis/nextgis_frontend/commit/a996c15041c417344bf6162bf6c2b93802bac448))
* **util:** add keyInObj typescript helper ([c45743d](https://github.com/nextgis/nextgis_frontend/commit/c45743d6c6aa9ee29ec6fda98bd631cb0fb737e6))
* **util:** create typeHelpers utils ([12a946d](https://github.com/nextgis/nextgis_frontend/commit/12a946d99a83250355a5862d9ac3f14de1b9459f))
* **util:** move properties filter to utils library ([f378af1](https://github.com/nextgis/nextgis_frontend/commit/f378af1f29a102f27f3146cc1148d8baee5c8e36))
* **utils:** add `arrayCompareStrict` function ([c043fcf](https://github.com/nextgis/nextgis_frontend/commit/c043fcfbd4731c3a9f6a33454b9fc0278ff55a52))
* **utils:** add `full` method ([f29aa3e](https://github.com/nextgis/nextgis_frontend/commit/f29aa3e9ccf324d9044489bd311c12c765148fe9))
* **utils:** add DebounceDecorator ([4f17758](https://github.com/nextgis/nextgis_frontend/commit/4f17758c3c6b2ebf2f3802b74049478a5ae3a157))
* **utils:** add debug log util ([aad775f](https://github.com/nextgis/nextgis_frontend/commit/aad775f48feffd9316306a6de8dc5f2e596a3b78))
* **utils:** add degrees to radian transform function ([8316f97](https://github.com/nextgis/nextgis_frontend/commit/8316f972641c55fa5b84cf9eccedccd9cd20855b))
* **utils:** add flatten and unflatten functions ([b4c3aa3](https://github.com/nextgis/nextgis_frontend/commit/b4c3aa3d32bdfd74847f397d5d54e5eadd8398b8))
* **utils:** add function to get coordinates from bbox ([cef7c78](https://github.com/nextgis/nextgis_frontend/commit/cef7c78bbea8d7e72ed9606dc4602a1a8253e754))
* **utils:** add geojson eachCoordinates util ([d7cc041](https://github.com/nextgis/nextgis_frontend/commit/d7cc0419aacaced2eeeb2360c7eb89add90ca923))
* **utils:** add getPolygons coordinates function ([457a297](https://github.com/nextgis/nextgis_frontend/commit/457a297024bc0a7e3b4d944e72e11bc1a45ccc21))
* **utils:** add new tools ([03d6b20](https://github.com/nextgis/nextgis_frontend/commit/03d6b204287720fcd1eb5620fb5f38161fbe1a07))
* **utils:** add number utils ([ae1a8ba](https://github.com/nextgis/nextgis_frontend/commit/ae1a8ba8265695563ddd3af49684f765a89ad9da))
* **utils:** add options to flatten ([eebf648](https://github.com/nextgis/nextgis_frontend/commit/eebf648f4deaf4743c0afc859c2793c9d77a4922))
* **utils:** clipbord static create may throw error ([01eb17b](https://github.com/nextgis/nextgis_frontend/commit/01eb17b0b5c0c691f6cdb5b463e33c5d771c9393))
* **utils:** create universal MapControlContainer ([20c2510](https://github.com/nextgis/nextgis_frontend/commit/20c25102ba7adc9c9be3eb87407c6c8f604e401f))
* **utils:** deprecated helper utils ([c10ecb9](https://github.com/nextgis/nextgis_frontend/commit/c10ecb9bc3067257a5c2ae9927ecc1d26fbfefda))
* **utils:** geom coordinates count ([01bb2cf](https://github.com/nextgis/nextgis_frontend/commit/01bb2cfbbf9d9f8694da6b837527bfd3f4ee2d11))
* **utils:** move some utils from ngw-kit and webmap to geom ([78c0e05](https://github.com/nextgis/nextgis_frontend/commit/78c0e05c9ee91fb947c3cab9c2e084815b469f31))
* **utils:** update string util ([79cb0d8](https://github.com/nextgis/nextgis_frontend/commit/79cb0d876a49b61b878b213ec928c4ac713abdfc))
* **vue:** GeojsonLayer selected model and onClick ([d29c601](https://github.com/nextgis/nextgis_frontend/commit/d29c60173cc77b380d52817c2463302ff0dd3b28))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([4e2d149](https://github.com/nextgis/nextgis_frontend/commit/4e2d1495810480af84fee0644061157df1b6f0b5))
* **webmap:** create webmap from TileJson ([18b9cf8](https://github.com/nextgis/nextgis_frontend/commit/18b9cf8a2bc995d922e8eaa2caaebbeb513ba1d9))
* **webmap:** layer adapter waitFullLoad and crossOrigin new options ([2ab3789](https://github.com/nextgis/nextgis_frontend/commit/2ab378949c26d3eb2360dea3f7052d6348ccd9a2))


### Performance Improvements

* **leaflet:** abort image overlay request on view change ([44f2acd](https://github.com/nextgis/nextgis_frontend/commit/44f2acd067dc264229ddca28e0e5d03d33cc57d0))


### wip

* **util:** move CancelablePromise to util ([9d7a645](https://github.com/nextgis/nextgis_frontend/commit/9d7a6454b273edf228b8bf8be353ddb8a8bc250e))


### BREAKING CHANGES

* **utils:** removed latLng from MapClickEvent, use lngLat: numner[] instead
* **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead
* **cancelable-promise:** Removed onCancel argument from CancelablePromise. Now you should handle catch CancelError
* code formatting rules changed to prettier 2.0 compatibility
* `propertiesFilter` removed from `@nextgis/utils`
* **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'
* **util:** Use xport { propertiesFilter } from '@nextgis/utils'; instead of Webmap.utils.propertiesFilter





## 1.16.8 (2023-05-14)


### Bug Fixes

* **build:** control-container extract css ([a02d24b](https://github.com/nextgis/nextgis_frontend/commit/a02d24bf2dbe246420803d5d1be9348e4b647c6d))
* **leaflet-map-adapter:** geojson selection ([d260db5](https://github.com/nextgis/nextgis_frontend/commit/d260db579912644fdb641a72e930df3575df566b))
* **leaflet-map-adapter:** init center option ([32793bf](https://github.com/nextgis/nextgis_frontend/commit/32793bf237c404232cf4056ab9f6ec35eeb73d12))
* **mapbox:** geojson getFeatures method return whole source data ([adc92f9](https://github.com/nextgis/nextgis_frontend/commit/adc92f9c6846e183d8b4d5679a147e5965b38b41))
* **ngw-connector:** node request write data for no POST mode ([abf9f63](https://github.com/nextgis/nextgis_frontend/commit/abf9f63f66b4ad6c3753fe0659bf1c33b63d5f90))
* **ngw-kit:** createGeojsonAdapter propertiesFilter ([06c109f](https://github.com/nextgis/nextgis_frontend/commit/06c109fd4ddae20db91b15fbb7c5e7d2909aaf76))
* **ngw-kit:** do not reassign getExtent for geojson layer ([feca330](https://github.com/nextgis/nextgis_frontend/commit/feca330c45fd6f96ba7d2a7bb2f6d34a47de0dba))
* **ngw-map:** identify order ([bbb6a1c](https://github.com/nextgis/nextgis_frontend/commit/bbb6a1c7295dfcaf1146d976aa8ca87a81da1cde))
* **ol-map-adapter:** geojson adapter layer remove ([8ec9df3](https://github.com/nextgis/nextgis_frontend/commit/8ec9df39941c4f1ccfbabfbe0ead2ec9138642bb))
* **ol-map-adapter:** geojson adapter style function type detection ([c71d83f](https://github.com/nextgis/nextgis_frontend/commit/c71d83f45822138428bdd4ebedbc67ecefaead9d))
* **properties-filte:** allow any chars for `like` and `ilike` search ([1d6ee0f](https://github.com/nextgis/nextgis_frontend/commit/1d6ee0ffc869b7633642eff760c413c813ba8701))
* remove require imports ([2674a8c](https://github.com/nextgis/nextgis_frontend/commit/2674a8ce29ef4116b939283ee1f4ec02b26b8025))
* rename Clipboard ([abfde3e](https://github.com/nextgis/nextgis_frontend/commit/abfde3ee02e7038dc106056c9458478c34e97464))
* **util:** arrayCompare typecasting ([80326b2](https://github.com/nextgis/nextgis_frontend/commit/80326b22e3ba78f9d33fe0006a1c5fbfe3751537))
* **utils:** applyMixin options on no replace ([904caa3](https://github.com/nextgis/nextgis_frontend/commit/904caa3c80a0bc96c7ac961ee70436052def1cfa))
* **utils:** fix objectDeepEqual function ([a70d626](https://github.com/nextgis/nextgis_frontend/commit/a70d62647d06b83a3497fb3f1dddc405903ac101))
* **utils:** function name typos ([2b86610](https://github.com/nextgis/nextgis_frontend/commit/2b86610669d0d1075008c0523af21159634e5f47))
* **utils:** update applyMixins util to allow babel build ([9905326](https://github.com/nextgis/nextgis_frontend/commit/99053262f9dc71236f1bcfa934fa5eb5d0072e71))
* **webmap:** constructor options; move controls options from ngw to webmap ([5a3b582](https://github.com/nextgis/nextgis_frontend/commit/5a3b58209126a5b1e7a802ae8503129b11602512))


### chore

* build; eslint ([ee1e03d](https://github.com/nextgis/nextgis_frontend/commit/ee1e03d85625b02a09c2ee1e4d66007fbf57d626))


### Code Refactoring

* **utils:** update geom utils ([43c11b0](https://github.com/nextgis/nextgis_frontend/commit/43c11b0f3c45b22ab66789bd00594d34078316f3))


### Features

* add getExtent method for all mapAdapters GeoJsonLayerAdapter ([7e8010f](https://github.com/nextgis/nextgis_frontend/commit/7e8010f7d5579f2b7909a31a2073479de1faa6a5))
* add library `@nextgis/properties-filter` ([8ec97de](https://github.com/nextgis/nextgis_frontend/commit/8ec97de9bd48112211c11cb39eb2da857dd21cac))
* add library cancelable-promise ([2cfb08f](https://github.com/nextgis/nextgis_frontend/commit/2cfb08f1143a773a43f1279690e0c9a7e2b2fec5))
* add new library `ControlContainer` ([bf566e2](https://github.com/nextgis/nextgis_frontend/commit/bf566e218c53462f65a1e0574d812a6e1c667e06))
* **area:** add new Area package ([c723d1a](https://github.com/nextgis/nextgis_frontend/commit/c723d1a144d9218ae1c586ac633afaa01bcc3c94))
* **cache:** add array to match options deep compare ([6b8a096](https://github.com/nextgis/nextgis_frontend/commit/6b8a09676c40b6a3c1d86819043af4ec9aa34ce9))
* **cache:** add namespaces support ([f65b6ec](https://github.com/nextgis/nextgis_frontend/commit/f65b6ec88885af749b7095dbb7b8dc97f9d6c34d))
* **cache:** new package to cache key value with async ability ([48fce9b](https://github.com/nextgis/nextgis_frontend/commit/48fce9b6450556b7684731f873039ed6a22b907b))
* **cancelable-promise:** create abort control ([c915206](https://github.com/nextgis/nextgis_frontend/commit/c915206ffad61c28e1020587a41f8844862f3074))
* **cancelable-promise:** throw CancelError instead of onCancel callback ([087180a](https://github.com/nextgis/nextgis_frontend/commit/087180adc9bcea72d1fd02ebdaaef3fd751b0a52))
* **clipboard:** on static copy return operation status ([dac89f0](https://github.com/nextgis/nextgis_frontend/commit/dac89f0e82641b7b91b9d1630cadade4b857c1fd))
* **control:** add universal zoom control ([d1371be](https://github.com/nextgis/nextgis_frontend/commit/d1371be1f88085dcfc864de31a7d4d89f2690216))
* eslint no-dupe off; object utils; propertiesFilter generic ([6989c5c](https://github.com/nextgis/nextgis_frontend/commit/6989c5c03548669db771eabcbce2c3f0a8f9843e))
* improve popup, add new options, ol support ([e3ea91b](https://github.com/nextgis/nextgis_frontend/commit/e3ea91b91d03a4cef471c5c92a09a7fa0640b90a))
* **mapboxgl-map-adapter:** set maxBounds init map option ([29b5152](https://github.com/nextgis/nextgis_frontend/commit/29b5152a81d01e582f40ae2a45ec9ef165b98f6e))
* move getIdentifyRadius from ngw-map to utils package ([159cbfc](https://github.com/nextgis/nextgis_frontend/commit/159cbfccb0ee32c774c2b32f5599d05146df9006))
* new @nextgis/dom library ([572d4c2](https://github.com/nextgis/nextgis_frontend/commit/572d4c2c554eb4da30be01c25a2d14cd4125d847))
* **ngw-connector:** add static create method ([d141a1b](https://github.com/nextgis/nextgis_frontend/commit/d141a1bf5f5aa8693ae10c061459694cf960e07e))
* **ngw-connector:** new getResourceBy method ([fc355b2](https://github.com/nextgis/nextgis_frontend/commit/fc355b217641f0449adac0c415707091563df9a1))
* **ngw-kit:** add polygon intersection identify util ([a378415](https://github.com/nextgis/nextgis_frontend/commit/a3784154fe9961f90b88e4ca11fc84a1393c99ff))
* **ngw-kit:** log to get item extensions if not request param set ([aef5fdf](https://github.com/nextgis/nextgis_frontend/commit/aef5fdfac6a81be98b8115bea87625a83d987a67))
* **ngw-orm:** update VectorLayer.toTypescript ([f437527](https://github.com/nextgis/nextgis_frontend/commit/f4375275202790c305fba6b2620ae62b86c1e66f))
* **util:** add arrayCompare util ([dd58235](https://github.com/nextgis/nextgis_frontend/commit/dd58235aecd04de213aa962e002145a65fdc2d52))
* **util:** add coord format transformer ([7d3d072](https://github.com/nextgis/nextgis_frontend/commit/7d3d0727cb39d3317f6d2cd60331911a1a86d36e))
* **util:** add debounce util ([c89223e](https://github.com/nextgis/nextgis_frontend/commit/c89223e509d79e829df2ffda086aa0ed87b30918))
* **util:** add keyInObj typescript helper ([a978aac](https://github.com/nextgis/nextgis_frontend/commit/a978aacd3e28a5e0cc8ff5136e442d3324d67b33))
* **util:** create typeHelpers utils ([387d5dc](https://github.com/nextgis/nextgis_frontend/commit/387d5dcda12e21fdef0c49d812a9543ed280b087))
* **util:** move properties filter to utils library ([175cd56](https://github.com/nextgis/nextgis_frontend/commit/175cd56d93380591a764e2c06c011f7f6fe919c8))
* **utils:** add `arrayCompareStrict` function ([b647b10](https://github.com/nextgis/nextgis_frontend/commit/b647b10f6363462261ff13df9fcefc5cb377fdac))
* **utils:** add `full` method ([39d1dee](https://github.com/nextgis/nextgis_frontend/commit/39d1dee32c1e5f21c079d8e8e393aa31c0794225))
* **utils:** add DebounceDecorator ([033f482](https://github.com/nextgis/nextgis_frontend/commit/033f4827e32a9ef9cb764e80cde6944534a5f923))
* **utils:** add debug log util ([35b2173](https://github.com/nextgis/nextgis_frontend/commit/35b21732aa785ad3c16d3972be439dcef8be7e6a))
* **utils:** add degrees to radian transform function ([12d0ab9](https://github.com/nextgis/nextgis_frontend/commit/12d0ab9cb120d0ede41c01d96e3953ce6fdcd3bd))
* **utils:** add flatten and unflatten functions ([9584ccb](https://github.com/nextgis/nextgis_frontend/commit/9584ccbeaa2b384ac0699c0f47be3cd97ae75d6c))
* **utils:** add function to get coordinates from bbox ([35a0d8b](https://github.com/nextgis/nextgis_frontend/commit/35a0d8b8bc94fba336aa32fc6ceaaac364015d78))
* **utils:** add geojson eachCoordinates util ([566aa77](https://github.com/nextgis/nextgis_frontend/commit/566aa77b56fab120d32408e89a9b6bdb5bd76f24))
* **utils:** add getPolygons coordinates function ([49dba46](https://github.com/nextgis/nextgis_frontend/commit/49dba46e498510087c5368da2fcb06cdbba6d26f))
* **utils:** add new tools ([4e534fb](https://github.com/nextgis/nextgis_frontend/commit/4e534fb45fb066ebeba3c586c2c448772c2df4f9))
* **utils:** add number utils ([b6b7ea5](https://github.com/nextgis/nextgis_frontend/commit/b6b7ea5deaa9720f9ad85e0f714a7755ffb84ca6))
* **utils:** add options to flatten ([066c09f](https://github.com/nextgis/nextgis_frontend/commit/066c09fce9dd21f1ddadc983a509856d09269f9c))
* **utils:** clipbord static create may throw error ([8577e78](https://github.com/nextgis/nextgis_frontend/commit/8577e78624f3dae0a5d73becd7c3c81d370cdfb8))
* **utils:** create universal MapControlContainer ([ce5a984](https://github.com/nextgis/nextgis_frontend/commit/ce5a984fd97928e1c9dda2bac81578a62a328e64))
* **utils:** deprecated helper utils ([d324e3f](https://github.com/nextgis/nextgis_frontend/commit/d324e3f9e0babdb10779a0add5d53bae78235086))
* **utils:** geom coordinates count ([06184f0](https://github.com/nextgis/nextgis_frontend/commit/06184f0d0df6db860b1f1b2cc47289c61b6f2786))
* **utils:** move some utils from ngw-kit and webmap to geom ([03ff50e](https://github.com/nextgis/nextgis_frontend/commit/03ff50e30d1562ad29561ad0741924b49c6aa907))
* **utils:** update string util ([68d7a05](https://github.com/nextgis/nextgis_frontend/commit/68d7a0593a2482c47d8a181c9e7c379b4c2e78f2))
* **vue:** GeojsonLayer selected model and onClick ([ca76ab8](https://github.com/nextgis/nextgis_frontend/commit/ca76ab877a9e48014813e36d515ae1efd7a4bc40))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([bcea6c3](https://github.com/nextgis/nextgis_frontend/commit/bcea6c35e61f6ba2aab0b25eb30da9f5f719c92e))
* **webmap:** create webmap from TileJson ([07fa33e](https://github.com/nextgis/nextgis_frontend/commit/07fa33ea1ae914f6cd53ef42e4453b9c76a3a357))
* **webmap:** layer adapter waitFullLoad and crossOrigin new options ([5e2b6d2](https://github.com/nextgis/nextgis_frontend/commit/5e2b6d2ae1db3b48775bca7f31a85338d451d61a))


### Performance Improvements

* **leaflet:** abort image overlay request on view change ([4587532](https://github.com/nextgis/nextgis_frontend/commit/45875328ba48453ce5fcbe730cfa4fbd12633d2c))


### wip

* **util:** move CancelablePromise to util ([a687a8f](https://github.com/nextgis/nextgis_frontend/commit/a687a8fe0b8389adeb2a6d6f97db330c2f60ad48))


### BREAKING CHANGES

* **utils:** removed latLng from MapClickEvent, use lngLat: numner[] instead
* **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead
* **cancelable-promise:** Removed onCancel argument from CancelablePromise. Now you should handle catch CancelError
* code formatting rules changed to prettier 2.0 compatibility
* `propertiesFilter` removed from `@nextgis/utils`
* **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'
* **util:** Use xport { propertiesFilter } from '@nextgis/utils'; instead of Webmap.utils.propertiesFilter





## [1.16.6](https://github.com/nextgis/nextgis_frontend/compare/v1.16.5...v1.16.6) (2023-02-09)

**Note:** Version bump only for package @nextgis/utils

## [1.16.5](https://github.com/nextgis/nextgis_frontend/compare/v1.16.4...v1.16.5) (2023-02-09)

**Note:** Version bump only for package @nextgis/utils

## [1.16.2](https://github.com/nextgis/nextgis_frontend/compare/v1.16.1...v1.16.2) (2022-09-15)

**Note:** Version bump only for package @nextgis/utils

## [1.16.1](https://github.com/nextgis/nextgis_frontend/compare/v1.16.0...v1.16.1) (2022-09-03)

### Features

- **mapboxgl-map-adapter:** set maxBounds init map option ([c90447a](https://github.com/nextgis/nextgis_frontend/commit/c90447aea7e7adbc13a827c9f5517040012970f8))
- move getIdentifyRadius from ngw-map to utils package ([40d1103](https://github.com/nextgis/nextgis_frontend/commit/40d1103fd658ed6ffc7f530d47e36f569ad33ba4))

## [1.15.1](https://github.com/nextgis/nextgis_frontend/compare/v1.15.0...v1.15.1) (2022-08-02)

**Note:** Version bump only for package @nextgis/utils

# [1.15.0](https://github.com/nextgis/nextgis_frontend/compare/v1.14.0...v1.15.0) (2022-07-27)

**Note:** Version bump only for package @nextgis/utils

## [1.13.3](https://github.com/nextgis/nextgis_frontend/compare/v1.13.2...v1.13.3) (2022-05-31)

**Note:** Version bump only for package @nextgis/utils

## [1.13.2](https://github.com/nextgis/nextgis_frontend/compare/v1.13.1...v1.13.2) (2022-05-30)

**Note:** Version bump only for package @nextgis/utils

# [1.12.0](https://github.com/nextgis/nextgis_frontend/compare/v1.11.10...v1.12.0) (2022-03-05)

### Features

- **ngw-kit:** add polygon intersection identify util ([7686231](https://github.com/nextgis/nextgis_frontend/commit/7686231f10fb0cd258946187a0e1dc80bb5306f8))

## [1.11.10](https://github.com/nextgis/nextgis_frontend/compare/v1.11.9...v1.11.10) (2022-01-20)

**Note:** Version bump only for package @nextgis/utils

# [1.11.0](https://github.com/nextgis/nextgis_frontend/compare/v1.10.0...v1.11.0) (2021-12-19)

**Note:** Version bump only for package @nextgis/utils

## [1.9.4](https://github.com/nextgis/nextgis_frontend/compare/v1.9.3...v1.9.4) (2021-11-16)

### Features

- **cache:** add namespaces support ([5426fa6](https://github.com/nextgis/nextgis_frontend/commit/5426fa63e7cc89d79824a3d0ef38881511534bf9))

## [1.8.4](https://github.com/nextgis/nextgis_frontend/compare/v1.8.3...v1.8.4) (2021-10-21)

**Note:** Version bump only for package @nextgis/utils

## [1.8.3](https://github.com/nextgis/nextgis_frontend/compare/v1.8.2...v1.8.3) (2021-10-12)

**Note:** Version bump only for package @nextgis/utils

## [1.8.2](https://github.com/nextgis/nextgis_frontend/compare/v1.8.1...v1.8.2) (2021-10-05)

### Features

- **utils:** add options to flatten ([53a182c](https://github.com/nextgis/nextgis_frontend/commit/53a182c13f5f874f2521ac9c2a728f5fc7dff96a))

# [1.7.0](https://github.com/nextgis/nextgis_frontend/compare/v1.6.0...v1.7.0) (2021-09-16)

**Note:** Version bump only for package @nextgis/utils

## [1.5.1](https://github.com/nextgis/nextgis_frontend/compare/v1.5.0...v1.5.1) (2021-09-06)

### Bug Fixes

- **ol-map-adapter:** geojson adapter style function type detection ([b731e04](https://github.com/nextgis/nextgis_frontend/commit/b731e04977529a30515dbb86dad537f76ecc7fe3))

### Features

- **clipboard:** on static copy return operation status ([251d722](https://github.com/nextgis/nextgis_frontend/commit/251d722f29a3d0e2d672f258412bf9b7a901a59f))

# [1.4.0](https://github.com/nextgis/nextgis_frontend/compare/v1.3.0...v1.4.0) (2021-08-17)

**Note:** Version bump only for package @nextgis/utils

# [1.3.0](https://github.com/nextgis/nextgis_frontend/compare/v1.2.8...v1.3.0) (2021-08-06)

### Features

- improve popup, add new options, ol support ([75e73fa](https://github.com/nextgis/nextgis_frontend/commit/75e73faac7f393d0c62f9966786da78c7f54c039))

## [1.2.8](https://github.com/nextgis/nextgis_frontend/compare/v1.2.7...v1.2.8) (2021-07-27)

### Bug Fixes

- **leaflet-map-adapter:** geojson selection ([1022e71](https://github.com/nextgis/nextgis_frontend/commit/1022e71d46f5513f0ff3a60f4be7d96a84ff4f15))

## [1.2.7](https://github.com/nextgis/nextgis_frontend/compare/v1.2.6...v1.2.7) (2021-07-26)

### Bug Fixes

- **ngw-kit:** createGeojsonAdapter propertiesFilter ([8beacb0](https://github.com/nextgis/nextgis_frontend/commit/8beacb0b0f2f8599c73be934fadcf2bae5ab5f85))

## [1.2.2](https://github.com/nextgis/nextgis_frontend/compare/v1.2.1...v1.2.2) (2021-07-16)

**Note:** Version bump only for package @nextgis/utils

## [1.2.1](https://github.com/nextgis/nextgis_frontend/compare/v1.2.0...v1.2.1) (2021-07-12)

### Bug Fixes

- **ol-map-adapter:** geojson adapter layer remove ([3705f27](https://github.com/nextgis/nextgis_frontend/commit/3705f27c5d75aba9f385ceda27aa26ef94cb0533))
- **utils:** fix objectDeepEqual function ([720eabe](https://github.com/nextgis/nextgis_frontend/commit/720eabe7645a66fc3addd118c724679af6264652))

# [1.2.0](https://github.com/nextgis/nextgis_frontend/compare/v1.1.2...v1.2.0) (2021-07-08)

**Note:** Version bump only for package @nextgis/utils

# [1.1.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.1...v1.1.0) (2021-06-25)

### Features

- **cache:** add array to match options deep compare ([b3e6717](https://github.com/nextgis/nextgis_frontend/commit/b3e67174977f0985678580a2ef1096220a787ff5))
- **cache:** new package to cache key value with async ability ([4b429a9](https://github.com/nextgis/nextgis_frontend/commit/4b429a93f2ef7d5a362ae708375ee87c18e2c464))

## [1.0.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0...v1.0.1) (2021-06-08)

**Note:** Version bump only for package @nextgis/utils

# [1.0.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.9...v1.0.0) (2021-06-07)

### Features

- **utils:** add degrees to radian transform function ([9ce078a](https://github.com/nextgis/nextgis_frontend/commit/9ce078a4aef77ed58efad8a7e1736a7d49172a1d))

# [1.0.0-beta.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2021-05-02)

**Note:** Version bump only for package @nextgis/utils

# [1.0.0-beta.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-04-23)

**Note:** Version bump only for package @nextgis/utils

# [1.0.0-beta.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-04-04)

### Bug Fixes

- **ngw-connector:** node request write data for no POST mode ([e31533f](https://github.com/nextgis/nextgis_frontend/commit/e31533fb888b91e655804abb51951b0a744fe618))

### Features

- **area:** add new Area package ([6658344](https://github.com/nextgis/nextgis_frontend/commit/665834493f2d25f2163b57bf41f9b25cc3c2e086))
- **utils:** add getPolygons coordinates function ([ff5864b](https://github.com/nextgis/nextgis_frontend/commit/ff5864b9070712c62bb7060bdcb75a9c7dddff99))
- **utils:** clipbord static create may throw error ([102a843](https://github.com/nextgis/nextgis_frontend/commit/102a8432158a3e6c345daaea40e0055bdfd76812))

# [1.0.0-beta.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-02-13)

### Features

- **utils:** add function to get coordinates from bbox ([d7b2ea7](https://github.com/nextgis/nextgis_frontend/commit/d7b2ea7cef1b53e01f4a8aacf929d0b115a01778))

# [1.0.0-beta.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-01-17)

### Features

- **utils:** geom coordinates count ([0455afa](https://github.com/nextgis/nextgis_frontend/commit/0455afa68865ec1759499ece16e93fed00ea541f))
- **webmap:** create webmap from TileJson ([9e84ea1](https://github.com/nextgis/nextgis_frontend/commit/9e84ea18653104030884f6fec76e7680436d71bd))

### Performance Improvements

- **leaflet:** abort image overlay request on view change ([d8613f0](https://github.com/nextgis/nextgis_frontend/commit/d8613f0be10e730d1ec9bb4ee0f2fa27c1687009))

# [1.0.0-beta.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-12-19)

### Bug Fixes

- **utils:** function name typos ([06d7a75](https://github.com/nextgis/nextgis_frontend/commit/06d7a753a26211ca4ac374d166cf457437fdccb6))

# [1.0.0-beta.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-11-28)

### Bug Fixes

- **ngw-map:** identify order ([1635f61](https://github.com/nextgis/nextgis_frontend/commit/1635f61e0c38fd913a850807cd1d084320016d3a))
- **utils:** applyMixin options on no replace ([4362c4c](https://github.com/nextgis/nextgis_frontend/commit/4362c4cb36dcd885803bb9dde36512ced21287cb))

### Features

- **ngw-kit:** log to get item extensions if not request param set ([b2bf132](https://github.com/nextgis/nextgis_frontend/commit/b2bf13205d4b2a04ca58f63b03523007dcaff199))
- **utils:** add debug log util ([6435c77](https://github.com/nextgis/nextgis_frontend/commit/6435c779050faa8b0e36945c69bbd22a55dba5ca))
- **utils:** deprecated helper utils ([9bab695](https://github.com/nextgis/nextgis_frontend/commit/9bab695eb840d49015c739c8f871305e57640aab))

### BREAKING CHANGES

- **utils:** removed latLng from MapClickEvent, use lngLat: numner[] instead

# [1.0.0-beta.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2020-11-16)

**Note:** Version bump only for package @nextgis/utils

# [1.0.0-alpha.11](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2020-11-02)

### Bug Fixes

- **webmap:** constructor options; move controls options from ngw to webmap ([611b8c0](https://github.com/nextgis/nextgis_frontend/commit/611b8c0af120c726ccf42eca0a608edbd54bb1c1))

### Features

- **utils:** add geojson eachCoordinates util ([f50e556](https://github.com/nextgis/nextgis_frontend/commit/f50e5568cff8af3426842201a1e9310d825424eb))

# [1.0.0-alpha.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-10-15)

### Bug Fixes

- **utils:** update applyMixins util to allow babel build ([a46cb82](https://github.com/nextgis/nextgis_frontend/commit/a46cb82d09b955aa43ab901750aa0ed5975b9fdd))

### Features

- add getExtent method for all mapAdapters GeoJsonLayerAdapter ([9254c3b](https://github.com/nextgis/nextgis_frontend/commit/9254c3bf4b1200c69126d770525a8b6b20a9f5c2))
- **ngw-connector:** add static create method ([00b58d7](https://github.com/nextgis/nextgis_frontend/commit/00b58d7e8be7d898142f44cd53414c45dbc4408e))
- **utils:** add flatten and unflatten functions ([6562c34](https://github.com/nextgis/nextgis_frontend/commit/6562c34162b7d49e91fe1a6661457a620b737aa7))

# [1.0.0-alpha.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-06)

### Features

- **utils:** add number utils ([d2378ba](https://github.com/nextgis/nextgis_frontend/commit/d2378ba53a3d7b371087aba98a99f5b90e007d92))

# [1.0.0-alpha.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-09-22)

### Code Refactoring

- **utils:** update geom utils ([b7e1f7a](https://github.com/nextgis/nextgis_frontend/commit/b7e1f7aab478603f35c49470cfff71d09f58d922))

### Features

- **util:** add keyInObj typescript helper ([fabb5e0](https://github.com/nextgis/nextgis_frontend/commit/fabb5e017d6b3b228d6cdb98a3fffe0ce8e57929))

### BREAKING CHANGES

- **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead

# [1.0.0-alpha.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)

### Features

- **cancelable-promise:** create abort control ([9768157](https://github.com/nextgis/nextgis_frontend/commit/976815713d25b1da20a96b678668648caf2c0489))
- **utils:** add `arrayCompareStrict` function ([9d65949](https://github.com/nextgis/nextgis_frontend/commit/9d659496fbcf4dd0e2f467d3e18ad7253fcb7041))
- **utils:** add `full` method ([00eb185](https://github.com/nextgis/nextgis_frontend/commit/00eb185fe1859a8bb30b2e9f8d8d10c08c88eb7f))
- **vue:** GeojsonLayer selected model and onClick ([b3b2ce0](https://github.com/nextgis/nextgis_frontend/commit/b3b2ce0d7023bd738a2496f01d8cd9642dff2a0a))

# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)

### Features

- **ngw-orm:** update VectorLayer.toTypescript ([81619b2](https://github.com/nextgis/nextgis_frontend/commit/81619b29d60cb7ad7da7a404e2ca48b7624a0635))

# [1.0.0-alpha.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)

### Bug Fixes

- **leaflet-map-adapter:** init center option ([f0cff9e](https://github.com/nextgis/nextgis_frontend/commit/f0cff9ee40e26043b25c85bf556b78a2a0b5366f))

### Features

- **util:** add coord format transformer ([9709333](https://github.com/nextgis/nextgis_frontend/commit/97093339c11b104106dc1f9aff3a3b691b02966c))
- **utils:** add DebounceDecorator ([196284c](https://github.com/nextgis/nextgis_frontend/commit/196284cc25033d12a3108aa87706c92c3b4317d4))
- **utils:** move some utils from ngw-kit and webmap to geom ([fbd3d91](https://github.com/nextgis/nextgis_frontend/commit/fbd3d913485c537e92068b5284691bb47f123b43))

# [1.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)

### Bug Fixes

- remove require imports ([be789b8](https://github.com/nextgis/nextgis_frontend/commit/be789b89f39741efe146da97eeb19460a7cca527))

# [1.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)

**Note:** Version bump only for package @nextgis/utils

# [1.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)

**Note:** Version bump only for package @nextgis/utils

# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)

### Features

- **ngw-connector:** new getResourceBy method ([462f0db](https://github.com/nextgis/nextgis_frontend/commit/462f0dbed5c0b448f5be60a73e8d70e792a4f87a))
- **utils:** add new tools ([25e6339](https://github.com/nextgis/nextgis_frontend/commit/25e6339b5d079f231f3d1fd3ac91e9d32402e0d5))

# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)

**Note:** Version bump only for package @nextgis/utils

# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)

### Features

- **webmap:** layer adapter waitFullLoad and crossOrigin new options ([08c6b82](https://github.com/nextgis/nextgis_frontend/commit/08c6b827f6a3e5728d8b17a9c305f32cd2b28039))

## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)

**Note:** Version bump only for package @nextgis/utils

# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)

**Note:** Version bump only for package @nextgis/utils

## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)

### Features

- **cancelable-promise:** throw CancelError instead of onCancel callback ([7b7ef11](https://github.com/nextgis/nextgis_frontend/commit/7b7ef112db2ead4fc02bac14eb61534d570b8a65))

### BREAKING CHANGES

- **cancelable-promise:** Removed onCancel argument from CancelablePromise. Now you should handle catch CancelError

## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)

### Features

- eslint no-dupe off; object utils; propertiesFilter generic ([20200e7](https://github.com/nextgis/nextgis_frontend/commit/20200e79a3c7e8e45f51e6999864b9fde47d9b54))

## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)

### Features

- **utils:** update string util ([2bf9a92](https://github.com/nextgis/nextgis_frontend/commit/2bf9a9217ade47a19426d62a80969f9173900651))

## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

**Note:** Version bump only for package @nextgis/utils

## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

**Note:** Version bump only for package @nextgis/utils

## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)

### Bug Fixes

- **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))

# [0.29.0](https://github.com/nextgis/nextgis_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)

### Bug Fixes

- **properties-filte:** allow any chars for `like` and `ilike` search ([6b5b60d](https://github.com/nextgis/nextgis_frontend/commit/6b5b60d7985abb01093b649073c6e0a088f7fe0e))

### chore

- build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))

### BREAKING CHANGES

- code formatting rules changed to prettier 2.0 compatibility

## [0.28.3](https://github.com/nextgis/nextgis_frontend/compare/v0.28.2...v0.28.3) (2020-03-19)

**Note:** Version bump only for package @nextgis/utils

# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)

### Features

- add library `@nextgis/properties-filter` ([0902366](https://github.com/nextgis/nextgis_frontend/commit/09023669c963ddb4e0a319400397e5f320620573))

### BREAKING CHANGES

- `propertiesFilter` removed from `@nextgis/utils`

## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)

### Features

- add library cancelable-promise ([5227983](https://github.com/nextgis/nextgis_frontend/commit/5227983e03b0a5aa5807002f63914fa2d23154b0))
- add new library `ControlContainer` ([e68afeb](https://github.com/nextgis/nextgis_frontend/commit/e68afeb5efb1e40bf20df2effa805fe80c437478))
- new @nextgis/dom library ([82a645d](https://github.com/nextgis/nextgis_frontend/commit/82a645d213d0b9ef1bb3c443dc28a94866c2884b))
- **control:** add universal zoom control ([1ffc089](https://github.com/nextgis/nextgis_frontend/commit/1ffc089942f1709f82cec8398d301503819be718))

# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)

### Features

- **utils:** create universal MapControlContainer ([2f07100](https://github.com/nextgis/nextgis_frontend/commit/2f07100b8a9b178533d5e3ee17b8759d8eb62866))

# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)

**Note:** Version bump only for package @nextgis/utils

## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/utils

## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/utils

## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)

### Bug Fixes

- rename Clipboard ([759f55a](https://github.com/nextgis/nextgis_frontend/commit/759f55ad35928f5212d8ed8bfaccdbebcb35246a))
- **mapbox:** geojson getFeatures method return whole source data ([d47f893](https://github.com/nextgis/nextgis_frontend/commit/d47f8932d63c8a6d056d50aad351026464128595))
- **util:** arrayCompare typecasting ([3cca72c](https://github.com/nextgis/nextgis_frontend/commit/3cca72cdcae150829a58754a2efbe51cd6c4517f))

### Features

- **util:** add arrayCompare util ([9442c01](https://github.com/nextgis/nextgis_frontend/commit/9442c01e17dc894e97580cf32b882567066a9004))
- **util:** add debounce util ([fd45455](https://github.com/nextgis/nextgis_frontend/commit/fd45455b061b2bc6186f865d4d0a3aa13d57e01d))
- **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgis_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))
- **util:** move properties filter to utils library ([4099706](https://github.com/nextgis/nextgis_frontend/commit/40997068f633faf75f15011721d9aaa5f11343dd))
- **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgis_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))

### wip

- **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgis_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))

### BREAKING CHANGES

- **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'
- **util:** Use xport { propertiesFilter } from '@nextgis/utils'; instead of Webmap.utils.propertiesFilter

## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)

### Bug Fixes

- rename Clipboard ([759f55a](https://github.com/nextgis/nextgis_frontend/commit/759f55ad35928f5212d8ed8bfaccdbebcb35246a))
- **mapbox:** geojson getFeatures method return whole source data ([d47f893](https://github.com/nextgis/nextgis_frontend/commit/d47f8932d63c8a6d056d50aad351026464128595))

## [0.25.4](https://github.com/nextgis/nextgis_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)

### wip

- **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgis_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))

### BREAKING CHANGES

- **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'

## [0.25.3](https://github.com/nextgis/nextgis_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)

### Features

- **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgis_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))

# [0.25.0](https://github.com/nextgis/nextgis_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)

### Bug Fixes

- **util:** arrayCompare typecasting ([3cca72c](https://github.com/nextgis/nextgis_frontend/commit/3cca72cdcae150829a58754a2efbe51cd6c4517f))

### Features

- **util:** add arrayCompare util ([9442c01](https://github.com/nextgis/nextgis_frontend/commit/9442c01e17dc894e97580cf32b882567066a9004))
- **util:** add debounce util ([fd45455](https://github.com/nextgis/nextgis_frontend/commit/fd45455b061b2bc6186f865d4d0a3aa13d57e01d))
- **util:** move properties filter to utils library ([4099706](https://github.com/nextgis/nextgis_frontend/commit/40997068f633faf75f15011721d9aaa5f11343dd))

### BREAKING CHANGES

- **util:** Use `import { propertiesFilter } from '@nextgis/utils';` instead of `Webmap.utils.propertiesFilter`
