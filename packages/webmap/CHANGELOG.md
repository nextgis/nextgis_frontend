# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.16.8 (2023-05-14)


### Bug Fixes

* **build:** control-container extract css ([a02d24b](https://github.com/nextgis/nextgis_frontend/commit/a02d24bf2dbe246420803d5d1be9348e4b647c6d))
* **cesium:** Tileset#DAdapter set terrain height ([4245446](https://github.com/nextgis/nextgis_frontend/commit/42454467846f2f5b0aaab5c2a74178acc7ae1e37))
* **examples:** rapair examples ([42a770e](https://github.com/nextgis/nextgis_frontend/commit/42a770e124a30a2670a620fb24f74da12251cb1c))
* **leafelt-map-adapter:** selected layer click event param ([aab6ed5](https://github.com/nextgis/nextgis_frontend/commit/aab6ed56037fc132f5b421206ac78ad626a7b3e9))
* **leaflet-map-adapter:** geojson selection ([d260db5](https://github.com/nextgis/nextgis_frontend/commit/d260db579912644fdb641a72e930df3575df566b))
* **mapbox-map-adapter:** popup on hover ([c8ac81b](https://github.com/nextgis/nextgis_frontend/commit/c8ac81b69f6f224ca9d2d664de49a7f76af22fd7))
* **mapbox:** geojson getSelected method ([5e9044c](https://github.com/nextgis/nextgis_frontend/commit/5e9044cb0a5479de8e8abbaca437289a6e7a2013))
* **ngw-connector:** fixes to apiRequest cancel work ([e4451d8](https://github.com/nextgis/nextgis_frontend/commit/e4451d8a7ad349ba17692a3f906677f1a29bf691)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
* **ngw-connector:** getResourceByKeyname cache ([78262a7](https://github.com/nextgis/nextgis_frontend/commit/78262a7e3abd230f1ac35d53c49a67d5a869a679))
* **ngw-kit:** do not load BBOX out of min-max zoom range ([a029ca0](https://github.com/nextgis/nextgis_frontend/commit/a029ca04228998da050e47d337678b223eb86715))
* **ngw-kit:** insert headers into createOnFirstShowAdapter addLayer method ([355531e](https://github.com/nextgis/nextgis_frontend/commit/355531eaace44c943d7f481b585ea2f18e133cfa))
* **ngw-kit:** make async onFirstShowAdapter hide and show methods ([502b261](https://github.com/nextgis/nextgis_frontend/commit/502b261b478872aed0bed0657b961481c22ce109))
* **ngw-kit:** return raster_layer resource support ([1c93522](https://github.com/nextgis/nextgis_frontend/commit/1c9352250a97da68b3edda671e0a3cb3daa72c80))
* **ngw:** ngw webmap resource ordering ([fb0e502](https://github.com/nextgis/nextgis_frontend/commit/fb0e5023c7f17e9b6200c1406081e5691a2941f5))
* **ol-map-adapter:** geojson adapter style function type detection ([c71d83f](https://github.com/nextgis/nextgis_frontend/commit/c71d83f45822138428bdd4ebedbc67ecefaead9d))
* replace emitter.of by emitter.removeListener ([a92b281](https://github.com/nextgis/nextgis_frontend/commit/a92b2810df7fae74bb58f50d6791a21bb4a4ef0e))
* **utils:** applyMixin options on no replace ([904caa3](https://github.com/nextgis/nextgis_frontend/commit/904caa3c80a0bc96c7ac961ee70436052def1cfa))
* **webmap:** add check for fitBounds extent ([3f9a746](https://github.com/nextgis/nextgis_frontend/commit/3f9a7464146006e234cf69091b35f2b21d4c0464))
* **webmap:** add check for layer exist on properties filter ([eb8ee91](https://github.com/nextgis/nextgis_frontend/commit/eb8ee9149fb4b1bb72c6eb2a6b0e662961430d3b))
* **webmap:** addLayer adapter options set ([1189513](https://github.com/nextgis/nextgis_frontend/commit/1189513b3e0651af0c088a22fac5c91c878f1a79))
* **webmap:** constructor options; move controls options from ngw to webmap ([5a3b582](https://github.com/nextgis/nextgis_frontend/commit/5a3b58209126a5b1e7a802ae8503129b11602512))
* **webmap:** disable experimental left and right control positions ([7658504](https://github.com/nextgis/nextgis_frontend/commit/765850439199c5bd6bc961245ba8558111513132))
* **webmap:** editing for new layer visibility standard ([960cba5](https://github.com/nextgis/nextgis_frontend/commit/960cba596dc1e13de0da23b5bcd79f7581af5834))
* **webmap:** get layers method only string keys ([a14017b](https://github.com/nextgis/nextgis_frontend/commit/a14017bdcba2fcc2989b4d7a2cbc1b393694e6b8))
* **webmap:** hide the rest when base layer showing ([4cd3950](https://github.com/nextgis/nextgis_frontend/commit/4cd3950c95fd5987819a206295ba6518023c7ff2))
* **webmap:** layer upadate is async ([c59fd21](https://github.com/nextgis/nextgis_frontend/commit/c59fd21a3f5a7cd7fa2d1c2c07b33eb3ed5a5214))
* **webmap:** not use ordering for layer id ([8c912df](https://github.com/nextgis/nextgis_frontend/commit/8c912df45f49107e3bbfd1dd686f92d25d84059b))
* **webmap:** remove addLayer dublicate id ([7cb8121](https://github.com/nextgis/nextgis_frontend/commit/7cb812136d3941b43094345fdaf4b6672f25ca96))
* **webmap:** set zero zoom ([fe61b84](https://github.com/nextgis/nextgis_frontend/commit/fe61b846f95534a657a23d8fa883ac1ac4a13d94))
* **webmap:** toggle layer visibility ([11147de](https://github.com/nextgis/nextgis_frontend/commit/11147de06463fa9ec77dac7ff3057253335dada9))
* **webmap:** webmap constructor options ([e096e72](https://github.com/nextgis/nextgis_frontend/commit/e096e723d76b8db753ecdd0248b601f24fcb5026))
* **webmap:** ZoomState may be only integer ([201c647](https://github.com/nextgis/nextgis_frontend/commit/201c64766e8470fc40015bcbfb2f1cd5540f9329))


### Build System

* wepmap to rollup ([c6f038a](https://github.com/nextgis/nextgis_frontend/commit/c6f038ad6bcd2a9581f852b35600b2560381c246))


### chore

* build; eslint ([ee1e03d](https://github.com/nextgis/nextgis_frontend/commit/ee1e03d85625b02a09c2ee1e4d66007fbf57d626))


### Code Refactoring

* change WebMap and NgwMap constructor options ([3b05f95](https://github.com/nextgis/nextgis_frontend/commit/3b05f959d6285c62aa08332c9342f24b82a3e732))
* rename layerAdapter baseLayer option to baselayer ([e5c595d](https://github.com/nextgis/nextgis_frontend/commit/e5c595d6df24b1b22906ad1e06eb60bf0327e9c0))
* **utils:** update geom utils ([43c11b0](https://github.com/nextgis/nextgis_frontend/commit/43c11b0f3c45b22ab66789bd00594d34078316f3))
* **webmap:** change default paint ([e0325e9](https://github.com/nextgis/nextgis_frontend/commit/e0325e9edf723b0f6e612cf67e2b6c4cff14c06d))


### Features

* add BBOX+ strategy; extends options for setView ([309b697](https://github.com/nextgis/nextgis_frontend/commit/309b697e141adf6eedeb85c87b6fa89b9b629c13))
* add get default controls function ([f7e9c51](https://github.com/nextgis/nextgis_frontend/commit/f7e9c51f86dff8e7df12b8ec1117b78a44749d3e))
* add library `@nextgis/paint` ([0f72300](https://github.com/nextgis/nextgis_frontend/commit/0f723006c722cc0e183a3c2dcfe7b2366e63cd96))
* add library `@nextgis/properties-filter` ([8ec97de](https://github.com/nextgis/nextgis_frontend/commit/8ec97de9bd48112211c11cb39eb2da857dd21cac))
* add nativeOptions for alladdLayer adapter methods ([c98568f](https://github.com/nextgis/nextgis_frontend/commit/c98568f1f122fc67fdfc911500aa2c509149e293))
* add new library `ControlContainer` ([bf566e2](https://github.com/nextgis/nextgis_frontend/commit/bf566e218c53462f65a1e0574d812a6e1c667e06))
* add new library `progress` ([e6302cc](https://github.com/nextgis/nextgis_frontend/commit/e6302cca534fc2890dbf64a4590c224181e85d41))
* add setViewDelay options to control map update ([a83e5ab](https://github.com/nextgis/nextgis_frontend/commit/a83e5ab9ed6207e0a41fd31a3c56cd14a512c50d))
* add WmsLayerAdapter ([aec0ce1](https://github.com/nextgis/nextgis_frontend/commit/aec0ce15ddb5292b6334833bcab8812400815d0b))
* **cache:** add namespaces support ([f65b6ec](https://github.com/nextgis/nextgis_frontend/commit/f65b6ec88885af749b7095dbb7b8dc97f9d6c34d))
* **cancelable-promise:** шьзкщму PromisesControl ([e68b127](https://github.com/nextgis/nextgis_frontend/commit/e68b127779e7da634225cec6354198c67ecae874))
* **cesium-map-adapter:** add watchTerrainChange geojson option ([54a5a67](https://github.com/nextgis/nextgis_frontend/commit/54a5a670b5918a4bf41862a8a8ec7b8db1d1b28c))
* **cesium:** add heightOffset geojson option ([dd51756](https://github.com/nextgis/nextgis_frontend/commit/dd517565d251f1184d1e5b11b46850bdc3eaca77))
* **cesium:** add maximumScreenSpaceError option for tilset3d adapter ([bfb0a65](https://github.com/nextgis/nextgis_frontend/commit/bfb0a65171d44a3d32c012170ef56480f3d3566b))
* **cesium:** add Tileset3dAdapter ([872d485](https://github.com/nextgis/nextgis_frontend/commit/872d4854e76ec30a1dc3e2e397218d86465dcd7d))
* **cesium:** add tilset3d adapter paint options ([445e3e7](https://github.com/nextgis/nextgis_frontend/commit/445e3e717e64f2d859ecbf62b82239710d665e34))
* **cesium:** fitBounds up tp terrain ([733207a](https://github.com/nextgis/nextgis_frontend/commit/733207add48dbaa6f811673129ea6485b70de834))
* **cesium:** geojson adapter paint ([4de7367](https://github.com/nextgis/nextgis_frontend/commit/4de7367fc7203d0ba11328a837be1098e6e710fe))
* **cesium:** implement getCenter ([6eb5db5](https://github.com/nextgis/nextgis_frontend/commit/6eb5db52ac974a5cfcb7407ced56982b2a22dd6b))
* **cesium:** set scene view from new adapter option ([04c412f](https://github.com/nextgis/nextgis_frontend/commit/04c412f618d8252d06d238b07b6399ee92fea180))
* **cesium:** tilset 3d adapter height options ([f28f94a](https://github.com/nextgis/nextgis_frontend/commit/f28f94a90a03ea34e385f6afd9b272197198b030))
* **control:** add universal zoom control ([d1371be](https://github.com/nextgis/nextgis_frontend/commit/d1371be1f88085dcfc864de31a7d4d89f2690216))
* handle vector layer mouse over and out events ([1f537c2](https://github.com/nextgis/nextgis_frontend/commit/1f537c277b433db365b319d4bbdfb26aa44528fd))
* improve popup, add new options, ol support ([e3ea91b](https://github.com/nextgis/nextgis_frontend/commit/e3ea91b91d03a4cef471c5c92a09a7fa0640b90a))
* **leaflet-map-adapter:** add position to vector adapter layers definition ([053ccf0](https://github.com/nextgis/nextgis_frontend/commit/053ccf05ed8d9d76592c8ca648365e176c609277))
* **leaflet-map-adapter:** change geojson layer opacity ([9862e2d](https://github.com/nextgis/nextgis_frontend/commit/9862e2de02efeef0bc55102ecdac942d0687f036))
* **leaflet-map-adapter:** label redraw on map position change ([b8c926e](https://github.com/nextgis/nextgis_frontend/commit/b8c926eb0109aa4e155097c23d436de891a4fc11))
* **mapbox-map-adapter:** MVT match paint ([4115554](https://github.com/nextgis/nextgis_frontend/commit/41155542218ef1e28fa57803f586cfa384df4784))
* **mapboxgl-map-adapter:** add popup for selected feature ([bf7ee99](https://github.com/nextgis/nextgis_frontend/commit/bf7ee994ba4307c2a85bc28c985198f000c463de))
* **mapboxgl-map-adapter:** implement labelOnHover option ([2e575b3](https://github.com/nextgis/nextgis_frontend/commit/2e575b349f06adc6f6a6906b4ca592ec4b0362fc))
* **mapobxgl-map-adapter:** improve map initializing ([a15d43c](https://github.com/nextgis/nextgis_frontend/commit/a15d43c61fc56066bb505a0c841237af1c464bac))
* **ngw-kit:** add baselayers from webmap; vuetify BaseLayerSelect ([7862680](https://github.com/nextgis/nextgis_frontend/commit/78626807a6e9c7420ffffeba5c9a4f90fdba24b8))
* **ngw-kit:** add bbox strategy layer preupdate event ([8156f17](https://github.com/nextgis/nextgis_frontend/commit/8156f17816779a76bf6ec7f3049ec52a62998bf5))
* **ngw-kit:** add BBOX+ strategy ([4d20810](https://github.com/nextgis/nextgis_frontend/commit/4d20810575c5b246dfadd01a5371ccd5e1b1ca1b))
* **ngw-kit:** add identify item for speedup ngw selection ([4f751d0](https://github.com/nextgis/nextgis_frontend/commit/4f751d0af8b1b7973d0979fef5beaf4c5b8e17b4))
* **ngw-kit:** add toGeojson in ngw layer item response ([0af64ad](https://github.com/nextgis/nextgis_frontend/commit/0af64ad1f907996f357a2355a35597319ec4bb0a))
* **ngw-kit:** default WebmapLayerAdapter basemap ([12aba63](https://github.com/nextgis/nextgis_frontend/commit/12aba63a37fc75cbaed2ed0be478cc5172149190))
* **ngw-kit:** export getImageAdapterOptions method ([5d7bbbc](https://github.com/nextgis/nextgis_frontend/commit/5d7bbbc04454db5c87f74f57136fdc9fd0d4da21))
* **ngw-kit:** NgwWebmapItem opacity ([c7846df](https://github.com/nextgis/nextgis_frontend/commit/c7846dff298d1d1e022cdb9258ba346f86505527))
* **ngw-map:** add promise groups handler ([2fb6ab1](https://github.com/nextgis/nextgis_frontend/commit/2fb6ab152037e04fb037313140536e3e4ac8a938))
* **ngw-map:** default bounds; add mapOption for show osm baselayer ([b376198](https://github.com/nextgis/nextgis_frontend/commit/b376198b1b9038899a6ec46ed97e443d9f591365))
* **ngw:** option to create popup content from item ([509be03](https://github.com/nextgis/nextgis_frontend/commit/509be030f043719276bb464fe5f5a686cae76e21))
* **ol-map-adapter:** add map native adapterOptions parameter ([5128ce4](https://github.com/nextgis/nextgis_frontend/commit/5128ce4497c6d81987b7506f6500a097fe5f9095))
* **ol-map-adapter:** add position to vector adapter layers defenition ([235928f](https://github.com/nextgis/nextgis_frontend/commit/235928fc7ee497e5eab94bd037f343715d9839b5))
* **ol-map-adapter:** add srs options to draw vector layer ([7a29212](https://github.com/nextgis/nextgis_frontend/commit/7a29212eb5636194b5cc9df0602c1fb8cbb58593))
* **ol-map-adapter:** hide and show label dynamic ([1d0e842](https://github.com/nextgis/nextgis_frontend/commit/1d0e84264ffabe088e8ba4488106f63d81364193))
* **ol-map-adapter:** use geojson layer label calback option ([e05e1ba](https://github.com/nextgis/nextgis_frontend/commit/e05e1bab2568dbd31908003b77691509e96f82e2))
* **qms-kit:** update createAdapter options interface ([e349073](https://github.com/nextgis/nextgis_frontend/commit/e3490730a55e69d8df396da70ec5afbfa5393657))
* remove default MarkerLayerAdapter ([7596ec9](https://github.com/nextgis/nextgis_frontend/commit/7596ec9f86b20ce399248adc233c0a2e041da63c))
* **util:** add keyInObj typescript helper ([a978aac](https://github.com/nextgis/nextgis_frontend/commit/a978aacd3e28a5e0cc8ff5136e442d3324d67b33))
* **util:** create typeHelpers utils ([387d5dc](https://github.com/nextgis/nextgis_frontend/commit/387d5dcda12e21fdef0c49d812a9543ed280b087))
* **util:** move properties filter to utils library ([175cd56](https://github.com/nextgis/nextgis_frontend/commit/175cd56d93380591a764e2c06c011f7f6fe919c8))
* **utils:** add `arrayCompareStrict` function ([b647b10](https://github.com/nextgis/nextgis_frontend/commit/b647b10f6363462261ff13df9fcefc5cb377fdac))
* **utils:** add debug log util ([35b2173](https://github.com/nextgis/nextgis_frontend/commit/35b21732aa785ad3c16d3972be439dcef8be7e6a))
* **utils:** add flatten and unflatten functions ([9584ccb](https://github.com/nextgis/nextgis_frontend/commit/9584ccbeaa2b384ac0699c0f47be3cd97ae75d6c))
* **utils:** deprecated helper utils ([d324e3f](https://github.com/nextgis/nextgis_frontend/commit/d324e3f9e0babdb10779a0add5d53bae78235086))
* **utils:** move some utils from ngw-kit and webmap to geom ([03ff50e](https://github.com/nextgis/nextgis_frontend/commit/03ff50e30d1562ad29561ad0741924b49c6aa907))
* **utils:** update string util ([68d7a05](https://github.com/nextgis/nextgis_frontend/commit/68d7a0593a2482c47d8a181c9e7c379b4c2e78f2))
* **vue:** NgwLayersList propagation param ([65879c9](https://github.com/nextgis/nextgis_frontend/commit/65879c9f8ea141bffb4213f5e3ad590447423ddc))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([bcea6c3](https://github.com/nextgis/nextgis_frontend/commit/bcea6c35e61f6ba2aab0b25eb30da9f5f719c92e))
* **vuetify:** allow VTree scopes for NgwLayersList ([0639026](https://github.com/nextgis/nextgis_frontend/commit/063902636fa1425a1dba6bce89a40b040d042387))
* **vuetify:** NgwLayersList remove layer ability ([411b5a3](https://github.com/nextgis/nextgis_frontend/commit/411b5a32ddf0443dccc639e7cf86fb41d08f2d0a)), closes [#CU-jzby65](https://github.com/nextgis/nextgis_frontend/issues/CU-jzby65)
* **webmap:** add `getBoundsPoly` webmap util ([d286452](https://github.com/nextgis/nextgis_frontend/commit/d2864528108180a41e3ace5f3b50987c770db040))
* **webmap:** add addLayer onAdded option ([880ccbb](https://github.com/nextgis/nextgis_frontend/commit/880ccbba94e7e0309260cce01790bd039ce3039d))
* **webmap:** add async control in correct order ([e79572c](https://github.com/nextgis/nextgis_frontend/commit/e79572ca8dbe3d41eefb64e9203fa16d0c9aec9e))
* **webmap:** add getControlContainer method ([827049d](https://github.com/nextgis/nextgis_frontend/commit/827049d00b349f7e8c5bb1d19da94b793b794829))
* **webmap:** add labelVisibility layer adapter option ([7c8ed91](https://github.com/nextgis/nextgis_frontend/commit/7c8ed91192d86ed09fee46799f52aad65600f11c))
* **webmap:** add map mouse move events ([c50638c](https://github.com/nextgis/nextgis_frontend/commit/c50638ccefad63e9b21416e922ea0d4c33fc1adf))
* **webmap:** add MapAdapter map options ([15e3c50](https://github.com/nextgis/nextgis_frontend/commit/15e3c50eb61c8457e9695e527274beb6cf751a6a))
* **webmap:** add setLayerPaint method ([3cadfbf](https://github.com/nextgis/nextgis_frontend/commit/3cadfbfac802c19ad0e981e944be69a07f548414))
* **webmap:** add special MapAdapterOptions option to MapOptions ([9785d13](https://github.com/nextgis/nextgis_frontend/commit/9785d13697b091de07109f12b2f08e7e255516a5))
* **webmap:** add WebMapLayers.unSelectLayers method ([99d606a](https://github.com/nextgis/nextgis_frontend/commit/99d606a1a3d8d9b02cb1a529084754b60cf3edca))
* **webmap:** change default behaviour of addLayer visibility option, its now true ([d0f9f0e](https://github.com/nextgis/nextgis_frontend/commit/d0f9f0e76b7a4195b1b7b9e5413de7f81502bfbc))
* **webmap:** change default maxZoom option to 20 ([f93bc19](https://github.com/nextgis/nextgis_frontend/commit/f93bc193e43b010c3b5d41e02149c68d88dfdfb5))
* **webmap:** create webmap from TileJson ([07fa33e](https://github.com/nextgis/nextgis_frontend/commit/07fa33ea1ae914f6cd53ef42e4453b9c76a3a357))
* **webmap:** get zoom from tilejson ([b5b6f20](https://github.com/nextgis/nextgis_frontend/commit/b5b6f205b86850246da29f678e6cd36c68934c5b))
* **webmap:** getZoom return number or fail ([08df46d](https://github.com/nextgis/nextgis_frontend/commit/08df46dd1028743e6c9596e079db19b60c209eb4))
* **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([928d351](https://github.com/nextgis/nextgis_frontend/commit/928d351fea9a321c178ecbb4e03a70bd9a64fc90))
* **webmap:** layer adapter waitFullLoad and crossOrigin new options ([5e2b6d2](https://github.com/nextgis/nextgis_frontend/commit/5e2b6d2ae1db3b48775bca7f31a85338d451d61a))
* **webmap:** make propertiesFilter async ([2eca455](https://github.com/nextgis/nextgis_frontend/commit/2eca455688c06edd2433e1497c8818f5b4a765ef))
* **webmap:** nesting for propertiesFilter utility ([47df80c](https://github.com/nextgis/nextgis_frontend/commit/47df80c305b223b440ea9203ad6bf52707555388))
* **webmap:** new addImageLayer shortcut WebMap method ([2c697eb](https://github.com/nextgis/nextgis_frontend/commit/2c697eb824b665dde1635365373c3af5095f5ed6))
* **webmap:** new addTileLayer shortcut WebMap method ([a209dfc](https://github.com/nextgis/nextgis_frontend/commit/a209dfc8b09bde6b99ebea4604a5238f40a1f911))
* **webmap:** new method getCoordFromMapClick ([ca29bd5](https://github.com/nextgis/nextgis_frontend/commit/ca29bd55a0cc0a7e471fa3e2a928c771b39c3260))
* **webmap:** new static method WebMap.get(id) to get webmap instance ([0caea45](https://github.com/nextgis/nextgis_frontend/commit/0caea451885aa5512bca37525686f03cf4c26704))
* **webmap:** paint from expressions ([fb492d1](https://github.com/nextgis/nextgis_frontend/commit/fb492d1bab2cbd8b64944cccd52565b24efd06aa))
* **webmap:** paint from properties filter ([64ba0f7](https://github.com/nextgis/nextgis_frontend/commit/64ba0f7d957c2a902691e7245276b8f78356586c))
* **webmap:** ratio in vectorlayer adapter interface ([a001a23](https://github.com/nextgis/nextgis_frontend/commit/a001a232e2b0e08d27116ca274725521a26d4565))
* **webmap:** remove control from promise ([314b5c1](https://github.com/nextgis/nextgis_frontend/commit/314b5c10168c82c3531072779ea5f3785015d6cb))
* **webmap:** update layer adapter options ([7c04879](https://github.com/nextgis/nextgis_frontend/commit/7c04879dc05945e7ef28cc77f8193f627fa7b303))
* **webmap:** update PropertiesFilter interface ([8ef2e3b](https://github.com/nextgis/nextgis_frontend/commit/8ef2e3b937204a4a7440cce231d08e35c6393114))
* **webmap:** vector layer select event ([5bc51ac](https://github.com/nextgis/nextgis_frontend/commit/5bc51ac9c98efa785fd34db3d5e71514f269ffd1))
* **webmap:** webmap container get set functions ([5bc309e](https://github.com/nextgis/nextgis_frontend/commit/5bc309e378b93615d592025acb2f8eea0419cc4f))
* **webmap:** zoomIn and zoomOut MapAdapter optional methods ([0198102](https://github.com/nextgis/nextgis_frontend/commit/01981023a852f8c7712395da8efead0f64221e03))


### Performance Improvements

* **mapbox:** upgrade layer ordering ([125d900](https://github.com/nextgis/nextgis_frontend/commit/125d900e800f645701d63a1b5379b019feaaa186))
* **mapbox:** vector layer click event prevent by order ([3e42d44](https://github.com/nextgis/nextgis_frontend/commit/3e42d441fef0f82342406e53d8949345bba54056))
* **ngw-kit:** geojson adapter not blocked on data load ([1fe9df6](https://github.com/nextgis/nextgis_frontend/commit/1fe9df685aec00c5569e3af20194c873362b3999))
* **webmap:** addControl coner queue ([adee416](https://github.com/nextgis/nextgis_frontend/commit/adee416f29503b8acb3d37837ca68178de8258fa))


### wip

* rename VectorLayerAdapterType ([726ab7d](https://github.com/nextgis/nextgis_frontend/commit/726ab7dd7cd112750165a9e15c5672086cd8261a))


### BREAKING CHANGES

* **webmap:** webMap.getZoom() do not return undefined more; number or fail
* **utils:** removed latLng from MapClickEvent, use lngLat: numner[] instead
* **webmap:** changed the default paint: the fill is semi-transparent, add stroke
* `new WebMap({ mapAdapter: new MapAdapter(), ...appOptions, mapOptions: MapOptions })` > `new WebMap(mapOptions)`
* `new NgwMap(new MapAdapter(), ngwMapOptions)` > `new NgwMap(ngwMapOptions)`
* `WebMapOptions.create` is now `true` by default
* **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead
* No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
* **webmap:** the added layer `visibility` is now `true`
* LayerAdapter option baseLayer was renamed to baselayer;
* webMap.getBaseLayers() method now return LayerAdapter, not string array of ids
* rename VectorLayerAdapter types: circle > point; fill > polygon
* code formatting rules changed to prettier 2.0 compatibility
* **webmap:** New Paint specification may cause problems with types
* `propertiesFilter` removed from `@nextgis/utils`
* MARKER layer adapter has been removed. Use ddLayer('GEOJSON', {data}) instead of ddLayer('MARKER', {lngLat})
* **util:** Use xport { propertiesFilter } from '@nextgis/utils'; instead of Webmap.utils.propertiesFilter





## [1.16.7](https://github.com/nextgis/nextgis_frontend/compare/v1.16.6...v1.16.7) (2023-04-21)


### Features

* **ol-map-adapter:** hide and show label dynamic ([65f30c0](https://github.com/nextgis/nextgis_frontend/commit/65f30c05d0cc4e40ca0272f34b55b0481b97d448))
* **qms-kit:** update createAdapter options interface ([f1e83e7](https://github.com/nextgis/nextgis_frontend/commit/f1e83e7f2cba2af1942c80c100344d130f9d0067))
* **webmap:** add labelVisibility layer adapter option ([298a697](https://github.com/nextgis/nextgis_frontend/commit/298a697f65bc5e53f6cf0ea82e688e2f3311f01d))





## [1.16.6](https://github.com/nextgis/nextgis_frontend/compare/v1.16.5...v1.16.6) (2023-02-09)

### Bug Fixes

- **mapbox-map-adapter:** popup on hover ([d3544e3](https://github.com/nextgis/nextgis_frontend/commit/d3544e3cbf9d3a8754c58d596b8f9c240141d461))

## [1.16.5](https://github.com/nextgis/nextgis_frontend/compare/v1.16.4...v1.16.5) (2023-02-09)

### Bug Fixes

- **webmap:** toggle layer visibility ([fb8ce6a](https://github.com/nextgis/nextgis_frontend/commit/fb8ce6ae6981dc4719fa430b0073a205a5314327))

### Features

- **webmap:** make propertiesFilter async ([f21336b](https://github.com/nextgis/nextgis_frontend/commit/f21336b0e734c26d7dc171b49dd7788b33661402))

## [1.16.2](https://github.com/nextgis/nextgis_frontend/compare/v1.16.1...v1.16.2) (2022-09-15)

**Note:** Version bump only for package @nextgis/webmap

## [1.16.1](https://github.com/nextgis/nextgis_frontend/compare/v1.16.0...v1.16.1) (2022-09-03)

**Note:** Version bump only for package @nextgis/webmap

# [1.16.0](https://github.com/nextgis/nextgis_frontend/compare/v1.15.1...v1.16.0) (2022-08-28)

### Features

- **cesium:** add heightOffset geojson option ([caa9626](https://github.com/nextgis/nextgis_frontend/commit/caa9626457d28265ca169e97e006a23f9d6e452e))

## [1.15.1](https://github.com/nextgis/nextgis_frontend/compare/v1.15.0...v1.15.1) (2022-08-02)

**Note:** Version bump only for package @nextgis/webmap

# [1.15.0](https://github.com/nextgis/nextgis_frontend/compare/v1.14.0...v1.15.0) (2022-07-27)

**Note:** Version bump only for package @nextgis/webmap

# [1.14.0](https://github.com/nextgis/nextgis_frontend/compare/v1.13.8...v1.14.0) (2022-07-05)

**Note:** Version bump only for package @nextgis/webmap

## [1.13.8](https://github.com/nextgis/nextgis_frontend/compare/v1.13.7...v1.13.8) (2022-06-25)

### Features

- **mapbox-map-adapter:** MVT match paint ([068fe38](https://github.com/nextgis/nextgis_frontend/commit/068fe38b29d453a2710df7aa0c35d9ea697be62e))

## [1.13.6](https://github.com/nextgis/nextgis_frontend/compare/v1.13.5...v1.13.6) (2022-06-05)

### Features

- **mapobxgl-map-adapter:** improve map initializing ([abb4916](https://github.com/nextgis/nextgis_frontend/commit/abb49168b8706e6759368960f2e4d5543c1b78b3))

## [1.13.3](https://github.com/nextgis/nextgis_frontend/compare/v1.13.2...v1.13.3) (2022-05-31)

**Note:** Version bump only for package @nextgis/webmap

## [1.13.2](https://github.com/nextgis/nextgis_frontend/compare/v1.13.1...v1.13.2) (2022-05-30)

**Note:** Version bump only for package @nextgis/webmap

# [1.13.0](https://github.com/nextgis/nextgis_frontend/compare/v1.12.1...v1.13.0) (2022-05-13)

### Features

- **webmap:** add MapAdapter map options ([a6b48a4](https://github.com/nextgis/nextgis_frontend/commit/a6b48a499122e184ec01ad626c97f6f48b7e3984))

## [1.12.1](https://github.com/nextgis/nextgis_frontend/compare/v1.12.0...v1.12.1) (2022-04-21)

### Features

- **webmap:** add map mouse move events ([2a2eba3](https://github.com/nextgis/nextgis_frontend/commit/2a2eba3c2a582093386189106d3bb456c5eb85c0))

# [1.12.0](https://github.com/nextgis/nextgis_frontend/compare/v1.11.10...v1.12.0) (2022-03-05)

### Features

- **ngw-kit:** export getImageAdapterOptions method ([2cd5969](https://github.com/nextgis/nextgis_frontend/commit/2cd5969b83ad55b039a14df091bcb2a100c28777))
- **webmap:** add addLayer onAdded option ([212b7b0](https://github.com/nextgis/nextgis_frontend/commit/212b7b082e4ed6a4bec6dd96c7d63d595bbc6743))

## [1.11.10](https://github.com/nextgis/nextgis_frontend/compare/v1.11.9...v1.11.10) (2022-01-20)

**Note:** Version bump only for package @nextgis/webmap

## [1.11.7](https://github.com/nextgis/nextgis_frontend/compare/v1.11.6...v1.11.7) (2022-01-11)

**Note:** Version bump only for package @nextgis/webmap

# [1.11.0](https://github.com/nextgis/nextgis_frontend/compare/v1.10.0...v1.11.0) (2021-12-19)

### Features

- **ol-map-adapter:** use geojson layer label calback option ([a849ec7](https://github.com/nextgis/nextgis_frontend/commit/a849ec7012d04709ebec00bc4a40a90691b7855c))

# [1.10.0](https://github.com/nextgis/nextgis_frontend/compare/v1.9.7...v1.10.0) (2021-11-30)

### Features

- **webmap:** add setLayerPaint method ([b1ddac5](https://github.com/nextgis/nextgis_frontend/commit/b1ddac5140670aba4f40f0861d6792065653c508))

## [1.9.4](https://github.com/nextgis/nextgis_frontend/compare/v1.9.3...v1.9.4) (2021-11-16)

### Bug Fixes

- **leafelt-map-adapter:** selected layer click event param ([751427a](https://github.com/nextgis/nextgis_frontend/commit/751427ac854a940b4d7caccb4ad602fab89133ac))

### Features

- **cache:** add namespaces support ([5426fa6](https://github.com/nextgis/nextgis_frontend/commit/5426fa63e7cc89d79824a3d0ef38881511534bf9))
- **ol-map-adapter:** add map native adapterOptions parameter ([3368e27](https://github.com/nextgis/nextgis_frontend/commit/3368e2750ab1701aa914c1c288c89f5364ea029e))

## [1.9.2](https://github.com/nextgis/nextgis_frontend/compare/v1.9.1...v1.9.2) (2021-10-26)

**Note:** Version bump only for package @nextgis/webmap

## [1.9.1](https://github.com/nextgis/nextgis_frontend/compare/v1.9.0...v1.9.1) (2021-10-25)

### Features

- **ngw-kit:** add bbox strategy layer preupdate event ([a3e2b93](https://github.com/nextgis/nextgis_frontend/commit/a3e2b93b729e361546b030b9d865dbcf66b58101))

# [1.9.0](https://github.com/nextgis/nextgis_frontend/compare/v1.8.5...v1.9.0) (2021-10-23)

### Bug Fixes

- **ngw-kit:** do not load BBOX out of min-max zoom range ([9346932](https://github.com/nextgis/nextgis_frontend/commit/93469329b210f9721f1739830cbb5095df9db9d8))

### Features

- add BBOX+ strategy; extends options for setView ([88e9d09](https://github.com/nextgis/nextgis_frontend/commit/88e9d092bcc3615b99bad13d175f62be3ff73725))
- **ngw-kit:** add BBOX+ strategy ([a954e20](https://github.com/nextgis/nextgis_frontend/commit/a954e20e93f74cc60f1abd4b3af77eef7a0a57bb))
- **webmap:** getZoom return number or fail ([accc46a](https://github.com/nextgis/nextgis_frontend/commit/accc46a53d1a074b32d4ef5aa41ca2f9df07caaf))

### BREAKING CHANGES

- **webmap:** webMap.getZoom() do not return undefined more; number or fail

## [1.8.4](https://github.com/nextgis/nextgis_frontend/compare/v1.8.3...v1.8.4) (2021-10-21)

**Note:** Version bump only for package @nextgis/webmap

## [1.8.3](https://github.com/nextgis/nextgis_frontend/compare/v1.8.2...v1.8.3) (2021-10-12)

### Bug Fixes

- **ngw-kit:** make async onFirstShowAdapter hide and show methods ([e5d43b6](https://github.com/nextgis/nextgis_frontend/commit/e5d43b6156cd961619908a9100e204c36d42bcb0))

## [1.8.2](https://github.com/nextgis/nextgis_frontend/compare/v1.8.1...v1.8.2) (2021-10-05)

### Bug Fixes

- **webmap:** layer upadate is async ([764eb9c](https://github.com/nextgis/nextgis_frontend/commit/764eb9ce199d6062caf6152392ff4be26c940e91))

## [1.8.1](https://github.com/nextgis/nextgis_frontend/compare/v1.8.0...v1.8.1) (2021-09-23)

### Features

- **ngw-kit:** NgwWebmapItem opacity ([98793f3](https://github.com/nextgis/nextgis_frontend/commit/98793f32191a113f1883fa5ddc96133aa7360c57))

# [1.8.0](https://github.com/nextgis/nextgis_frontend/compare/v1.7.0...v1.8.0) (2021-09-22)

### Bug Fixes

- **webmap:** hide the rest when base layer showing ([1641f1b](https://github.com/nextgis/nextgis_frontend/commit/1641f1b2742aae7452e368b1b8312510037f7fa2))

### Features

- add nativeOptions for alladdLayer adapter methods ([c99d06e](https://github.com/nextgis/nextgis_frontend/commit/c99d06e35c5884b5969b281c98bd3742d6f427ef))

# [1.7.0](https://github.com/nextgis/nextgis_frontend/compare/v1.6.0...v1.7.0) (2021-09-16)

### Features

- **leaflet-map-adapter:** add position to vector adapter layers definition ([61cb7a5](https://github.com/nextgis/nextgis_frontend/commit/61cb7a591ed3ececcabed710abf1e0aec6708c1b))
- **ol-map-adapter:** add position to vector adapter layers defenition ([bd6fd4d](https://github.com/nextgis/nextgis_frontend/commit/bd6fd4d0e65f8a2dd1794813dafb9cf04931019b))

# [1.6.0](https://github.com/nextgis/nextgis_frontend/compare/v1.5.1...v1.6.0) (2021-09-09)

### Features

- **webmap:** new addImageLayer shortcut WebMap method ([a0e452c](https://github.com/nextgis/nextgis_frontend/commit/a0e452ccc980440c3a2b563bf8efb73f961f2ff8))
- **webmap:** new addTileLayer shortcut WebMap method ([421198a](https://github.com/nextgis/nextgis_frontend/commit/421198a0181b8c817e3ed7736d0734f143de3eeb))

## [1.5.1](https://github.com/nextgis/nextgis_frontend/compare/v1.5.0...v1.5.1) (2021-09-06)

### Bug Fixes

- **ol-map-adapter:** geojson adapter style function type detection ([b731e04](https://github.com/nextgis/nextgis_frontend/commit/b731e04977529a30515dbb86dad537f76ecc7fe3))

### Features

- **webmap:** change default maxZoom option to 20 ([11d2e99](https://github.com/nextgis/nextgis_frontend/commit/11d2e99fcc53976cfb00acc4b5d711cdf2e28fc3))

# [1.5.0](https://github.com/nextgis/nextgis_frontend/compare/v1.4.0...v1.5.0) (2021-08-19)

### Features

- **leaflet-map-adapter:** change geojson layer opacity ([3d75fb2](https://github.com/nextgis/nextgis_frontend/commit/3d75fb2f20d0759839dcaa7650c10740a1f35d22))

# [1.4.0](https://github.com/nextgis/nextgis_frontend/compare/v1.3.0...v1.4.0) (2021-08-17)

### Features

- **mapboxgl-map-adapter:** implement labelOnHover option ([b0f7507](https://github.com/nextgis/nextgis_frontend/commit/b0f75075fdbbc3d7a8cceb6ff329a1e629ac169e))
- **webmap:** add WebMapLayers.unSelectLayers method ([2e479ce](https://github.com/nextgis/nextgis_frontend/commit/2e479ceb547c99f2e1c0cc30c08c435e61298b6d))

# [1.3.0](https://github.com/nextgis/nextgis_frontend/compare/v1.2.8...v1.3.0) (2021-08-06)

### Bug Fixes

- **webmap:** disable experimental left and right control positions ([c8c6fb7](https://github.com/nextgis/nextgis_frontend/commit/c8c6fb73c33985b19ecfc908f7d25d6a2f23d778))

### Features

- improve popup, add new options, ol support ([75e73fa](https://github.com/nextgis/nextgis_frontend/commit/75e73faac7f393d0c62f9966786da78c7f54c039))
- **ol-map-adapter:** add srs options to draw vector layer ([6a76486](https://github.com/nextgis/nextgis_frontend/commit/6a76486e75bd6a6fb5e00a45b0815f3a27aba03e))
- **webmap:** add getControlContainer method ([26a51bc](https://github.com/nextgis/nextgis_frontend/commit/26a51bc53c2f2a7219ed05a4ef4d6b3eaab03560))

## [1.2.8](https://github.com/nextgis/nextgis_frontend/compare/v1.2.7...v1.2.8) (2021-07-27)

### Bug Fixes

- **leaflet-map-adapter:** geojson selection ([1022e71](https://github.com/nextgis/nextgis_frontend/commit/1022e71d46f5513f0ff3a60f4be7d96a84ff4f15))

## [1.2.7](https://github.com/nextgis/nextgis_frontend/compare/v1.2.6...v1.2.7) (2021-07-26)

**Note:** Version bump only for package @nextgis/webmap

## [1.2.4](https://github.com/nextgis/nextgis_frontend/compare/v1.2.3...v1.2.4) (2021-07-22)

### Features

- **leaflet-map-adapter:** label redraw on map position change ([241efc1](https://github.com/nextgis/nextgis_frontend/commit/241efc142ef29eef898e5b4adadff3e8208a3091))

## [1.2.3](https://github.com/nextgis/nextgis_frontend/compare/v1.2.2...v1.2.3) (2021-07-21)

### Features

- **mapboxgl-map-adapter:** add popup for selected feature ([ef87167](https://github.com/nextgis/nextgis_frontend/commit/ef87167a8df611a0e7b55c04b8090af14c053adc))

## [1.2.2](https://github.com/nextgis/nextgis_frontend/compare/v1.2.1...v1.2.2) (2021-07-16)

### Bug Fixes

- **webmap:** add check for layer exist on properties filter ([dbcd588](https://github.com/nextgis/nextgis_frontend/commit/dbcd588cd29d66f8927f1c748f8aeec74a13d9e4))

## [1.2.1](https://github.com/nextgis/nextgis_frontend/compare/v1.2.0...v1.2.1) (2021-07-12)

**Note:** Version bump only for package @nextgis/webmap

# [1.2.0](https://github.com/nextgis/nextgis_frontend/compare/v1.1.2...v1.2.0) (2021-07-08)

### Features

- handle vector layer mouse over and out events ([2e94152](https://github.com/nextgis/nextgis_frontend/commit/2e94152fac64b8e022dab7940614487763ce57af))

## [1.1.2](https://github.com/nextgis/nextgis_frontend/compare/v1.1.1...v1.1.2) (2021-06-28)

**Note:** Version bump only for package @nextgis/webmap

# [1.1.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.1...v1.1.0) (2021-06-25)

**Note:** Version bump only for package @nextgis/webmap

## [1.0.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0...v1.0.1) (2021-06-08)

**Note:** Version bump only for package @nextgis/webmap

# [1.0.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.9...v1.0.0) (2021-06-07)

### Features

- **vuetify:** NgwLayersList remove layer ability ([320ce0e](https://github.com/nextgis/nextgis_frontend/commit/320ce0effd76c6562036c6558564cecc06e83231)), closes [#CU-jzby65](https://github.com/nextgis/nextgis_frontend/issues/CU-jzby65)
- **webmap:** webmap container get set functions ([f0a1491](https://github.com/nextgis/nextgis_frontend/commit/f0a1491a471ccfa2538c48c1b307d6d5fa3d713c))

# [1.0.0-beta.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2021-05-03)

### Features

- **ngw-kit:** add identify item for speedup ngw selection ([b051f9f](https://github.com/nextgis/nextgis_frontend/commit/b051f9f6f596f3a54645e5ccbc628907ed83fca1))

# [1.0.0-beta.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2021-05-02)

**Note:** Version bump only for package @nextgis/webmap

# [1.0.0-beta.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-04-23)

**Note:** Version bump only for package @nextgis/webmap

# [1.0.0-beta.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-04-04)

### Bug Fixes

- **ngw-kit:** insert headers into createOnFirstShowAdapter addLayer method ([d230fe2](https://github.com/nextgis/nextgis_frontend/commit/d230fe2f484f42ff1e0a99f9ff33d60526b55bdd))

# [1.0.0-beta.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-02-13)

### Features

- **cesium:** add tilset3d adapter paint options ([a9caba5](https://github.com/nextgis/nextgis_frontend/commit/a9caba56225609202ff350e232ada5af77bbfa6a))
- **webmap:** ratio in vectorlayer adapter interface ([cc3d835](https://github.com/nextgis/nextgis_frontend/commit/cc3d835879c5223e73e6db1026db1a419980182f))

# [1.0.0-beta.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-01-17)

### Features

- add setViewDelay options to control map update ([3c50948](https://github.com/nextgis/nextgis_frontend/commit/3c50948d8ce31d79879cf566f827cee78fc1af31))
- **webmap:** create webmap from TileJson ([9e84ea1](https://github.com/nextgis/nextgis_frontend/commit/9e84ea18653104030884f6fec76e7680436d71bd))
- **webmap:** get zoom from tilejson ([80ded2f](https://github.com/nextgis/nextgis_frontend/commit/80ded2f2a908b54c046dd4e4f01046edd88e398c))

# [1.0.0-beta.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-12-19)

### Bug Fixes

- **webmap:** set zero zoom ([059e6ea](https://github.com/nextgis/nextgis_frontend/commit/059e6ea243a0ba0b6cce58905dde58485bc5d372))

### Features

- **cesium-map-adapter:** add watchTerrainChange geojson option ([15f1d8e](https://github.com/nextgis/nextgis_frontend/commit/15f1d8ef5ba427b5dc27f6c9d9b470887947ab4d))
- add new library `progress` ([5a75e8c](https://github.com/nextgis/nextgis_frontend/commit/5a75e8c219e0c8c0aef2f9e4f0536709b93cd59c))

# [1.0.0-beta.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-11-28)

### Bug Fixes

- **ngw-connector:** fixes to apiRequest cancel work ([0ac44ee](https://github.com/nextgis/nextgis_frontend/commit/0ac44eee447019593ae80529cc3b063171f8f88c)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
- **utils:** applyMixin options on no replace ([4362c4c](https://github.com/nextgis/nextgis_frontend/commit/4362c4cb36dcd885803bb9dde36512ced21287cb))

### Features

- **ngw-kit:** add toGeojson in ngw layer item response ([a9f073a](https://github.com/nextgis/nextgis_frontend/commit/a9f073a50dac3ecf3472e7b90f4124b8e3a6b772))
- **ngw-map:** add promise groups handler ([864fc6d](https://github.com/nextgis/nextgis_frontend/commit/864fc6d3a905e72136df3795f1e86046d54e0fd4))
- **utils:** add debug log util ([6435c77](https://github.com/nextgis/nextgis_frontend/commit/6435c779050faa8b0e36945c69bbd22a55dba5ca))
- **utils:** deprecated helper utils ([9bab695](https://github.com/nextgis/nextgis_frontend/commit/9bab695eb840d49015c739c8f871305e57640aab))

### BREAKING CHANGES

- **utils:** removed latLng from MapClickEvent, use lngLat: numner[] instead

# [1.0.0-beta.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2020-11-16)

**Note:** Version bump only for package @nextgis/webmap

# [1.0.0-alpha.11](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2020-11-02)

### Bug Fixes

- **webmap:** constructor options; move controls options from ngw to webmap ([611b8c0](https://github.com/nextgis/nextgis_frontend/commit/611b8c0af120c726ccf42eca0a608edbd54bb1c1))

# [1.0.0-alpha.10](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-10-20)

### Code Refactoring

- **webmap:** change default paint ([1baea95](https://github.com/nextgis/nextgis_frontend/commit/1baea95158e2cd8b79ec2de6b95a377030951d0f))

### BREAKING CHANGES

- **webmap:** changed the default paint: the fill is semi-transparent, add stroke

# [1.0.0-alpha.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-10-15)

### Bug Fixes

- **webmap:** webmap constructor options ([8c92b6c](https://github.com/nextgis/nextgis_frontend/commit/8c92b6c17e4b0f69630abb5ad0ffa78234d50a6f))

### Code Refactoring

- change WebMap and NgwMap constructor options ([de7eaf9](https://github.com/nextgis/nextgis_frontend/commit/de7eaf900ece63cf91596b726ad19918f3b926b7))

### Features

- **ngw-map:** default bounds; add mapOption for show osm baselayer ([8df4e0e](https://github.com/nextgis/nextgis_frontend/commit/8df4e0ea53a41f3df7a782c973686c160c3552d6))
- **utils:** add flatten and unflatten functions ([6562c34](https://github.com/nextgis/nextgis_frontend/commit/6562c34162b7d49e91fe1a6661457a620b737aa7))
- **vue:** NgwLayersList propagation param ([636c46b](https://github.com/nextgis/nextgis_frontend/commit/636c46bf387be491819297e42346beea246de8f1))

### BREAKING CHANGES

- `new WebMap({ mapAdapter: new MapAdapter(), ...appOptions, mapOptions: MapOptions })` > `new WebMap(mapOptions)`
- `new NgwMap(new MapAdapter(), ngwMapOptions)` > `new NgwMap(ngwMapOptions)`
- `WebMapOptions.create` is now `true` by default

# [1.0.0-alpha.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-06)

**Note:** Version bump only for package @nextgis/webmap

# [1.0.0-alpha.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-09-22)

### Code Refactoring

- **utils:** update geom utils ([b7e1f7a](https://github.com/nextgis/nextgis_frontend/commit/b7e1f7aab478603f35c49470cfff71d09f58d922))

### Features

- **util:** add keyInObj typescript helper ([fabb5e0](https://github.com/nextgis/nextgis_frontend/commit/fabb5e017d6b3b228d6cdb98a3fffe0ce8e57929))

### BREAKING CHANGES

- **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead

# [1.0.0-alpha.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)

### Features

- **cancelable-promise:** improve PromisesControl ([ca5fabb](https://github.com/nextgis/nextgis_frontend/commit/ca5fabb60e998f19713704011db58588487aebe7))
- **utils:** add `arrayCompareStrict` function ([9d65949](https://github.com/nextgis/nextgis_frontend/commit/9d659496fbcf4dd0e2f467d3e18ad7253fcb7041))
- **webmap:** remove control from promise ([fbeae95](https://github.com/nextgis/nextgis_frontend/commit/fbeae956a3dc7ad01fd90ac3807f484d3ab79424))

# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)

**Note:** Version bump only for package @nextgis/webmap

# [1.0.0-alpha.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)

### Features

- **utils:** move some utils from ngw-kit and webmap to geom ([fbd3d91](https://github.com/nextgis/nextgis_frontend/commit/fbd3d913485c537e92068b5284691bb47f123b43))

# [1.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)

### Features

- **webmap:** new method getCoordFromMapClick ([439d8c9](https://github.com/nextgis/nextgis_frontend/commit/439d8c90fe11193faafc90c9bd33fec2b335bf78))

# [1.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)

### Features

- **ngw-kit:** default WebmapLayerAdapter basemap ([4756ef8](https://github.com/nextgis/nextgis_frontend/commit/4756ef82084f30eda51fe98e1483e815a7775132))

# [1.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)

**Note:** Version bump only for package @nextgis/webmap

# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)

### Bug Fixes

- replace emitter.of by emitter.removeListener ([5a92e2b](https://github.com/nextgis/nextgis_frontend/commit/5a92e2b91e741346be39be87d5b9f50b9621c092))
- **webmap:** editing for new layer visibility standard ([32413d0](https://github.com/nextgis/nextgis_frontend/commit/32413d085d30073056b8da97c8735ca13016c616))

### Build System

- wepmap to rollup ([bc66507](https://github.com/nextgis/nextgis_frontend/commit/bc665072f7eefacae748c2cf81f6bdef75d9f8aa))

### Code Refactoring

- rename layerAdapter baseLayer option to baselayer ([368d657](https://github.com/nextgis/nextgis_frontend/commit/368d6576278505ddddde2a1ab160a0849e087c70))

### Features

- **cesium:** add maximumScreenSpaceError option for tilset3d adapter ([c82c524](https://github.com/nextgis/nextgis_frontend/commit/c82c52452765b2e764f6c3d42bc3522bd36a4258))
- **webmap:** add special MapAdapterOptions option to MapOptions ([e3dd2ec](https://github.com/nextgis/nextgis_frontend/commit/e3dd2eceb5b63bf7c19791deacd72b2e047a74f8))
- **webmap:** change default behaviour of addLayer visibility option, its now true ([0e91555](https://github.com/nextgis/nextgis_frontend/commit/0e91555cea9666dd3ce8c2df7364f0e588dc8c24))
- **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([430d51e](https://github.com/nextgis/nextgis_frontend/commit/430d51e7211c050ebeffd68b0c839d9a38170054))
- **webmap:** new static method WebMap.get(id) to get webmap instance ([658f537](https://github.com/nextgis/nextgis_frontend/commit/658f5372bde27b4d8502856649b2b11e9e4bade7))

### BREAKING CHANGES

- No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
- **webmap:** the added layer `visibility` is now `true`
- LayerAdapter option baseLayer was renamed to baselayer;
- webMap.getBaseLayers() method now return LayerAdapter, not string array of ids

# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)

### Bug Fixes

- **cesium:** Tileset#DAdapter set terrain height ([790760f](https://github.com/nextgis/nextgis_frontend/commit/790760f0b8b90b9c9d572640612cfc00dabfd5d5))
- **mapbox:** geojson getSelected method ([e0d859c](https://github.com/nextgis/nextgis_frontend/commit/e0d859cd186876f0b382e1338d1793151d18dd6a))

### Features

- **cesium:** implement getCenter ([ea83d8e](https://github.com/nextgis/nextgis_frontend/commit/ea83d8ebd8972123ba0991388e4e53fce91b077e))
- **cesium:** tilset 3d adapter height options ([02973bf](https://github.com/nextgis/nextgis_frontend/commit/02973bfcacb6bde3b7d4e23fdd190d0e81536f57))
- **webmap:** vector layer select event ([edd18ba](https://github.com/nextgis/nextgis_frontend/commit/edd18baa3d2b0e5886812e09795de4f041be23ab))
- **webmap:** zoomIn and zoomOut MapAdapter optional methods ([70b807f](https://github.com/nextgis/nextgis_frontend/commit/70b807fd1d157b5505a3d815f24a02fbb1fff6a6))

### Performance Improvements

- **webmap:** addControl coner queue ([5c21367](https://github.com/nextgis/nextgis_frontend/commit/5c21367fc1a0142d56e443948d7d01f49549d5b1))

### wip

- rename VectorLayerAdapterType ([89a2c83](https://github.com/nextgis/nextgis_frontend/commit/89a2c83135e839f3eec373f93e5df777a7b81325))

### BREAKING CHANGES

- rename VectorLayerAdapter types: circle > point; fill > polygon

# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)

### Bug Fixes

- **webmap:** add check for fitBounds extent ([c78ab3e](https://github.com/nextgis/nextgis_frontend/commit/c78ab3e900f3e069401fb23b5b7646aa5cbc8e7f))
- **webmap:** addLayer adapter options set ([2d24a53](https://github.com/nextgis/nextgis_frontend/commit/2d24a5387634bbccb79875186cc7a9cf090291f2))
- **webmap:** remove addLayer dublicate id ([81a4458](https://github.com/nextgis/nextgis_frontend/commit/81a4458b9b420382d112be181d829e08f783c82b))

### Features

- **cesium:** add Tileset3dAdapter ([c5306f9](https://github.com/nextgis/nextgis_frontend/commit/c5306f9b8bb3e37f287cbd4e3d33a04d93478e2b))
- **cesium:** fitBounds up tp terrain ([e890d9b](https://github.com/nextgis/nextgis_frontend/commit/e890d9b5ce449dc69c8b531c33b9ce6cb58b10b4))
- **cesium:** set scene view from new adapter option ([c35e16d](https://github.com/nextgis/nextgis_frontend/commit/c35e16ded6036fccb2edb852bebd68f41fc899eb))
- **ngw-kit:** add baselayers from webmap; vuetify BaseLayerSelect ([74c0749](https://github.com/nextgis/nextgis_frontend/commit/74c074929c7da864a9097fc8176825894555e0a3))
- **webmap:** add async control in correct order ([c2eaab3](https://github.com/nextgis/nextgis_frontend/commit/c2eaab3a0d720a6b6d32fc0d6b2c76bc37e93a8f))
- **webmap:** layer adapter waitFullLoad and crossOrigin new options ([08c6b82](https://github.com/nextgis/nextgis_frontend/commit/08c6b827f6a3e5728d8b17a9c305f32cd2b28039))

## [0.30.2](https://github.com/nextgis/nextgis_frontend/compare/v0.30.1...v0.30.2) (2020-04-30)

### Bug Fixes

- **ngw-kit:** return raster_layer resource support ([76a435f](https://github.com/nextgis/nextgis_frontend/commit/76a435fb43d82ea8be616347010a8bd1214f106b))

## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)

### Bug Fixes

- **webmap:** get layers method only string keys ([e0182c9](https://github.com/nextgis/nextgis_frontend/commit/e0182c95c81f5b76605f569bcbf2826937909889))

### Features

- **webmap:** update layer adapter options ([b0262ef](https://github.com/nextgis/nextgis_frontend/commit/b0262eff0db1ee56192bb410e8e1128cdc8b167b))

# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)

**Note:** Version bump only for package @nextgis/webmap

## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)

### Performance Improvements

- **mapbox:** vector layer click event prevent by order ([e7901da](https://github.com/nextgis/nextgis_frontend/commit/e7901da34935e347de05aaf0798eb1e5dfda11ff))

## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)

### Bug Fixes

- **ngw-connector:** getResourceByKeyname cache ([20fae26](https://github.com/nextgis/nextgis_frontend/commit/20fae266d240d51af7fe9e9a9af4f84d286f8cc2))

## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)

### Features

- **utils:** update string util ([2bf9a92](https://github.com/nextgis/nextgis_frontend/commit/2bf9a9217ade47a19426d62a80969f9173900651))

## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

**Note:** Version bump only for package @nextgis/webmap

## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

**Note:** Version bump only for package @nextgis/webmap

## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)

### Bug Fixes

- **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))

# [0.29.0](https://github.com/nextgis/nextgis_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)

### chore

- build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))

### BREAKING CHANGES

- code formatting rules changed to prettier 2.0 compatibility

## [0.28.3](https://github.com/nextgis/nextgis_frontend/compare/v0.28.2...v0.28.3) (2020-03-19)

### Bug Fixes

- **examples:** rapair examples ([e739de7](https://github.com/nextgis/nextgis_frontend/commit/e739de7c52c09ba17ddcf007c2604cc1e2a0e0ba))

### Features

- **ngw:** option to create popup content from item ([3c4a809](https://github.com/nextgis/nextgis_frontend/commit/3c4a809dc7cd9045e3ed1622b1eea0036e5205a1))
- add library `@nextgis/paint` ([99391ec](https://github.com/nextgis/nextgis_frontend/commit/99391ec1ac9fd80508816417d9eb2ae0fd734340))

## [0.28.1](https://github.com/nextgis/nextgis_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package @nextgis/webmap

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

### Features

- **control:** add universal zoom control ([1ffc089](https://github.com/nextgis/nextgis_frontend/commit/1ffc089942f1709f82cec8398d301503819be718))
- add new library `ControlContainer` ([e68afeb](https://github.com/nextgis/nextgis_frontend/commit/e68afeb5efb1e40bf20df2effa805fe80c437478))

# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)

### Features

- **vuetify:** allow VTree scopes for NgwLayersList ([8718f9b](https://github.com/nextgis/nextgis_frontend/commit/8718f9b6e114714523b3476a97b23934c31f2bb4))

### Performance Improvements

- **ngw-kit:** geojson adapter not blocked on data load ([1ceaf76](https://github.com/nextgis/nextgis_frontend/commit/1ceaf7688b9911727de5fa1b6fde9ae1f6b3da9e))

# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)

### Features

- add WmsLayerAdapter ([c57b66d](https://github.com/nextgis/nextgis_frontend/commit/c57b66d2278071a57182cb4dd554e370c63ffa06))

## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/webmap

## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/webmap

## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)

### Bug Fixes

- **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgis_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))
- **webmap:** not use ordering for layer id ([cd09734](https://github.com/nextgis/nextgis_frontend/commit/cd0973490a2c6ca0673bd01059056dd5fd68d866))
- **webmap:** ZoomState may be only integer ([c130469](https://github.com/nextgis/nextgis_frontend/commit/c13046908d63d549e3f221efc538c55d49a36450))

### Features

- **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgis_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))
- remove default MarkerLayerAdapter ([7398c1b](https://github.com/nextgis/nextgis_frontend/commit/7398c1bb61d43194ce4c7da635d386ad785ac57a))
- **util:** move properties filter to utils library ([4099706](https://github.com/nextgis/nextgis_frontend/commit/40997068f633faf75f15011721d9aaa5f11343dd))
- **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgis_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))
- **webmap:** add `getBoundsPoly` webmap util ([22cb565](https://github.com/nextgis/nextgis_frontend/commit/22cb5654e6a2c2c8b84d32581faed0b293570cc2))
- **webmap:** nesting for propertiesFilter utility ([28cb9ed](https://github.com/nextgis/nextgis_frontend/commit/28cb9ed583ec96fec675f8f6c63ec18c1fe030de))
- **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgis_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))

### Performance Improvements

- **mapbox:** upgrade layer ordering ([58a0db0](https://github.com/nextgis/nextgis_frontend/commit/58a0db08c0fa123ede4ef0d9fc7d9e1e9b3a6526))

### BREAKING CHANGES

- MARKER layer adapter has been removed. Use ddLayer('GEOJSON', {data}) instead of ddLayer('MARKER', {lngLat})
- **util:** Use xport { propertiesFilter } from '@nextgis/utils'; instead of Webmap.utils.propertiesFilter

## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)

### Bug Fixes

- **webmap:** ZoomState may be only integer ([c130469](https://github.com/nextgis/nextgis_frontend/commit/c13046908d63d549e3f221efc538c55d49a36450))

### Performance Improvements

- **mapbox:** upgrade layer ordering ([58a0db0](https://github.com/nextgis/nextgis_frontend/commit/58a0db08c0fa123ede4ef0d9fc7d9e1e9b3a6526))

## [0.25.4](https://github.com/nextgis/nextgis_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)

**Note:** Version bump only for package @nextgis/webmap

## [0.25.3](https://github.com/nextgis/nextgis_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)

### Features

- **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgis_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))

## [0.25.2](https://github.com/nextgis/nextgis_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package @nextgis/webmap

## [0.25.1](https://github.com/nextgis/nextgis_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)

### Features

- remove default MarkerLayerAdapter ([7398c1b](https://github.com/nextgis/nextgis_frontend/commit/7398c1bb61d43194ce4c7da635d386ad785ac57a))

### BREAKING CHANGES

- MARKER layer adapter has been removed. Use ddLayer('GEOJSON', {data}) instead of ddLayer('MARKER', {lngLat})

# [0.25.0](https://github.com/nextgis/nextgis_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)

### Bug Fixes

- **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgis_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))
- **webmap:** not use ordering for layer id ([cd09734](https://github.com/nextgis/nextgis_frontend/commit/cd0973490a2c6ca0673bd01059056dd5fd68d866))

### Features

- **util:** move properties filter to utils library ([4099706](https://github.com/nextgis/nextgis_frontend/commit/40997068f633faf75f15011721d9aaa5f11343dd))
- **webmap:** add `getBoundsPoly` webmap util ([22cb565](https://github.com/nextgis/nextgis_frontend/commit/22cb5654e6a2c2c8b84d32581faed0b293570cc2))
- **webmap:** nesting for propertiesFilter utility ([28cb9ed](https://github.com/nextgis/nextgis_frontend/commit/28cb9ed583ec96fec675f8f6c63ec18c1fe030de))
- **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgis_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))

### BREAKING CHANGES

- **util:** Use xport { propertiesFilter } from '@nextgis/utils'; instead of Webmap.utils.propertiesFilter
