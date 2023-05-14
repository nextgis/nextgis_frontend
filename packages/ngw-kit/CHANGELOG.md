# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.16.8 (2023-05-14)


### Bug Fixes

* **build:** control-container extract css ([a02d24b](https://github.com/nextgis/nextgis_frontend/commit/a02d24bf2dbe246420803d5d1be9348e4b647c6d))
* **cesium:** TileLayer ordering ([45c6fc3](https://github.com/nextgis/nextgis_frontend/commit/45c6fc334f6ceb5a12c671c73e13210bdfd51a46))
* **examples:** rapair examples ([42a770e](https://github.com/nextgis/nextgis_frontend/commit/42a770e124a30a2670a620fb24f74da12251cb1c))
* improve node/browser splitting ([b5312bb](https://github.com/nextgis/nextgis_frontend/commit/b5312bbb2b8dde4c9d63d4450c98ca544cdc3318))
* **leafelt-map-adapter:** selected layer click event param ([aab6ed5](https://github.com/nextgis/nextgis_frontend/commit/aab6ed56037fc132f5b421206ac78ad626a7b3e9))
* **leaflet-map-adapter:** fix BaseAdapter pane zIndex set ([bd26273](https://github.com/nextgis/nextgis_frontend/commit/bd262733470962e77612e152bbaf9f5d95d3f2ab))
* **leaflet-map-adapter:** geojson selection ([d260db5](https://github.com/nextgis/nextgis_frontend/commit/d260db579912644fdb641a72e930df3575df566b))
* **mapboxgl-map-adapter:** select features by propertiesfilter improve ([c41bb2a](https://github.com/nextgis/nextgis_frontend/commit/c41bb2a1d16746c6eb2db000c1aee916c10d87b6))
* **ngw-connector:** clean cache on resource delete ([7fc716c](https://github.com/nextgis/nextgis_frontend/commit/7fc716cba13ea964cef8e23d19ab7577b1b6b86a))
* **ngw-connector:** fixes to apiRequest cancel work ([e4451d8](https://github.com/nextgis/nextgis_frontend/commit/e4451d8a7ad349ba17692a3f906677f1a29bf691)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
* **ngw-connector:** retunr undefined on empty apiRequest ([cb05fb0](https://github.com/nextgis/nextgis_frontend/commit/cb05fb099e3e051764a3039952bb9beb75d03aa0))
* **ngw-connect:** properly abort request on cancel ([a2193b7](https://github.com/nextgis/nextgis_frontend/commit/a2193b78c4d24b663b8850946b05712bce1046c4))
* **ngw-kit:** check company_logo in settings ([cb4ba04](https://github.com/nextgis/nextgis_frontend/commit/cb4ba041419a94912977b7dbefd2c68ef1a4710e))
* **ngw-kit:** clean layer adapter options ([d4a0ab6](https://github.com/nextgis/nextgis_frontend/commit/d4a0ab671505c6b7f4561ef46b4d5921d310add2))
* **ngw-kit:** create async adapter from parent resource ([5ce6394](https://github.com/nextgis/nextgis_frontend/commit/5ce6394c4d9313c79f6d540df0b1683648a6af83))
* **ngw-kit:** createGeojsonAdapter propertiesFilter ([06c109f](https://github.com/nextgis/nextgis_frontend/commit/06c109fd4ddae20db91b15fbb7c5e7d2909aaf76))
* **ngw-kit:** do not load BBOX out of min-max zoom range ([a029ca0](https://github.com/nextgis/nextgis_frontend/commit/a029ca04228998da050e47d337678b223eb86715))
* **ngw-kit:** do not reassign getExtent for geojson layer ([feca330](https://github.com/nextgis/nextgis_frontend/commit/feca330c45fd6f96ba7d2a7bb2f6d34a47de0dba))
* **ngw-kit:** duplication of the server filter by the client ([aaa9d2d](https://github.com/nextgis/nextgis_frontend/commit/aaa9d2d00c626504d94ceb0fd7e50b2fe526a9ff))
* **ngw-kit:** editing for a new layer visibility standard ([2e94979](https://github.com/nextgis/nextgis_frontend/commit/2e94979bb7d81dbe943a8d57c9c07a2decd732f1))
* **ngw-kit:** fetchNgwLayerItems client filter ([2574448](https://github.com/nextgis/nextgis_frontend/commit/25744487b8b709234764138b85c9c341632b0cc6))
* **ngw-kit:** fix addNgwLayer resource options ([e2e37d4](https://github.com/nextgis/nextgis_frontend/commit/e2e37d4f48718afbdc0619eb43e46c49b636359a))
* **ngw-kit:** fix emppty identify geometry ([f8e85af](https://github.com/nextgis/nextgis_frontend/commit/f8e85af95d68f7b5cd110f8bdc72ea4369f62934))
* **ngw-kit:** fix like and ilike filter requests ([2ddb8ff](https://github.com/nextgis/nextgis_frontend/commit/2ddb8ffc15c78578d4145c16daaec9244468385e))
* **ngw-kit:** getIdentifyItems multiple ([36381d5](https://github.com/nextgis/nextgis_frontend/commit/36381d53e761a20ac1ef51f0b1d79f9ee72edf38))
* **ngw-kit:** inject item into the createRasterAdapter class factory ([ea08e3e](https://github.com/nextgis/nextgis_frontend/commit/ea08e3e01ce7f92b3b9b7c66164d61fe334e9e72))
* **ngw-kit:** insert headers into createOnFirstShowAdapter addLayer method ([355531e](https://github.com/nextgis/nextgis_frontend/commit/355531eaace44c943d7f481b585ea2f18e133cfa))
* **ngw-kit:** make async onFirstShowAdapter hide and show methods ([502b261](https://github.com/nextgis/nextgis_frontend/commit/502b261b478872aed0bed0657b961481c22ce109))
* **ngw-kit:** ngw webmap item childrensafe reverse ([b790e3a](https://github.com/nextgis/nextgis_frontend/commit/b790e3a244e3205fc64561d30b5572b3dce0fada))
* **ngw-kit:** ngw webmap items layer order ([c5dad6b](https://github.com/nextgis/nextgis_frontend/commit/c5dad6b1db927b7ff30da21f752c4a1d1786b70e))
* **ngw-kit:** ngw-webmap tree sublevel order ([fff0dac](https://github.com/nextgis/nextgis_frontend/commit/fff0dac04a7f1a8519828da42685130e015e5c90))
* **ngw-kit:** NgwWebmapItem max min zoom calculate ([7e0af25](https://github.com/nextgis/nextgis_frontend/commit/7e0af255ca51b7fd37b72b01d76949552cd82db4))
* **ngw-kit:** NgwWebmapLayerAdapter constuctor options ([8129ca8](https://github.com/nextgis/nextgis_frontend/commit/8129ca82ca94b714976aa5c08d3141116484929d))
* **ngw-kit:** NgwWebMapLayerAdapter exent constrained ([f86d804](https://github.com/nextgis/nextgis_frontend/commit/f86d804df70d636ab01bdd70b884f833d46d5160))
* **ngw-kit:** no load date for geojson layer if data ([40968e0](https://github.com/nextgis/nextgis_frontend/commit/40968e0b054f379d4494975e9426b83bf60daa9b))
* **ngw-kit:** not identify for not supported layer ([c7f710f](https://github.com/nextgis/nextgis_frontend/commit/c7f710f0402e9b0bf035de9dee833d9289c3e13c))
* **ngw-kit:** not stringify null on save ngw feature ([b99bcf3](https://github.com/nextgis/nextgis_frontend/commit/b99bcf367efd6e49c140701f9a9ba409f947164c))
* **ngw-kit:** on first adapter wait while show layer ([77ee936](https://github.com/nextgis/nextgis_frontend/commit/77ee9360699d61b509c64586b3984a330b22eec5))
* **ngw-kit:** order_by param ([7ff4d29](https://github.com/nextgis/nextgis_frontend/commit/7ff4d29d783b906dee4f9f5c78e6b73d566641fe))
* **ngw-kit:** protect firstShowAdapter from multiple creation ([be8a0c5](https://github.com/nextgis/nextgis_frontend/commit/be8a0c588919202613d6acd04d6f82daff2b44d9))
* **ngw-kit:** remove async from NgwWebmapItem child add ([4b9a75f](https://github.com/nextgis/nextgis_frontend/commit/4b9a75f6ee64700992cd95b7b992265a0564aaed))
* **ngw-kit:** remove duplicates from a query with filter by ANY condition ([f689a21](https://github.com/nextgis/nextgis_frontend/commit/f689a2197c0e18efa27513d440485fa785c28f76))
* **ngw-kit:** remove forgotten log ([ae16ec6](https://github.com/nextgis/nextgis_frontend/commit/ae16ec6bcc1dc1fe5966fe86221526580033c059))
* **ngw-kit:** remove unresolved variable ([4299ad8](https://github.com/nextgis/nextgis_frontend/commit/4299ad85b9493d53d2d4bb8602a8b40de19220f0))
* **ngw-kit:** resolve createGeoJsonAdapter options override II ([c211843](https://github.com/nextgis/nextgis_frontend/commit/c211843d65daf40c506d641dca43ef8265745ead))
* **ngw-kit:** return raster_layer resource support ([1c93522](https://github.com/nextgis/nextgis_frontend/commit/1c9352250a97da68b3edda671e0a3cb3daa72c80))
* **ngw-kit:** set correct options when add webmaplayeritem ([dbf779b](https://github.com/nextgis/nextgis_frontend/commit/dbf779b67efa1f372ed51299123eb1c792378c72))
* **ngw-kit:** set image adapter default nd param ([758e3e1](https://github.com/nextgis/nextgis_frontend/commit/758e3e11192fd4c6569540dd47aec76ee753cc66))
* **ngw-kit:** set NgwWebmap tree item property before layer load ([5b9335e](https://github.com/nextgis/nextgis_frontend/commit/5b9335ecb097b8cacb77472ab4ffcaea27f8e3f9))
* **ngw-kit:** show only one enabled webmap basemap ([1087074](https://github.com/nextgis/nextgis_frontend/commit/10870746582396ed8f710ea07af1d45f1b517b5c))
* **ngw-kit:** webmap item children ordering ([cfb69b0](https://github.com/nextgis/nextgis_frontend/commit/cfb69b074bcfc9c817c671fc66c5a33c7da14996))
* **ngw-kit:** webmap iten async addLayer method ([21ee8ac](https://github.com/nextgis/nextgis_frontend/commit/21ee8ac0bed083a3a762f08f519d753d6dc32c38))
* **ngw-kit:** webmapLayerItem options ([d55b4d8](https://github.com/nextgis/nextgis_frontend/commit/d55b4d87c1d489b83e9afc000fa616c46c8ec28d))
* **ngw-kit:** WebmapLayerItem ordering ([5b53e44](https://github.com/nextgis/nextgis_frontend/commit/5b53e44f64870ef54843f3943ca3fcb7aa6dd632))
* **ngw-kit:** wms adapter layers options from adapterOptions ([eabe108](https://github.com/nextgis/nextgis_frontend/commit/eabe108162162f404c1b3a4da02203ab4cd32318))
* **ngw:** create async adapter for webmap ([57e1a19](https://github.com/nextgis/nextgis_frontend/commit/57e1a19d9e33a585da28f945a96c36697f5b9395))
* **ngw:** get geojson request options ([f8e4c25](https://github.com/nextgis/nextgis_frontend/commit/f8e4c258cecd4f8294e51f07cee7d0e8b09d504a))
* **ngw:** ngw webmap resource ordering ([fb0e502](https://github.com/nextgis/nextgis_frontend/commit/fb0e5023c7f17e9b6200c1406081e5691a2941f5))
* **ngw:** return support for vector layer adapter ([f646919](https://github.com/nextgis/nextgis_frontend/commit/f646919d244b8e3e9017849116dafd0c45e31dcf))
* **nngw-kit:** resolve create geojson adapter options override ([a26c611](https://github.com/nextgis/nextgis_frontend/commit/a26c611fc046bb9bcd509c34d45b0bf9338d6537))
* **qms:** add createQmsAdapter options ([52e6ae1](https://github.com/nextgis/nextgis_frontend/commit/52e6ae182d8e8d4f8195b5f0ada15d8d258a1d55))
* remove require imports ([2674a8c](https://github.com/nextgis/nextgis_frontend/commit/2674a8ce29ef4116b939283ee1f4ec02b26b8025))
* replace emitter.of by emitter.removeListener ([a92b281](https://github.com/nextgis/nextgis_frontend/commit/a92b2810df7fae74bb58f50d6791a21bb4a4ef0e))
* **utils:** applyMixin options on no replace ([904caa3](https://github.com/nextgis/nextgis_frontend/commit/904caa3c80a0bc96c7ac961ee70436052def1cfa))
* **utils:** update applyMixins util to allow babel build ([9905326](https://github.com/nextgis/nextgis_frontend/commit/99053262f9dc71236f1bcfa934fa5eb5d0072e71))
* **vue:** selection for items with properties and tree ([23f0709](https://github.com/nextgis/nextgis_frontend/commit/23f0709c9a37e755d2a11828d8b4f3a7d955745d))
* **vuetify:** NgwLayersList root item hide ([73ab6d1](https://github.com/nextgis/nextgis_frontend/commit/73ab6d180444843b9ace2bb36d2b797950762806))
* **webmap:** add check for fitBounds extent ([3f9a746](https://github.com/nextgis/nextgis_frontend/commit/3f9a7464146006e234cf69091b35f2b21d4c0464))
* **webmap:** addLayer adapter options set ([1189513](https://github.com/nextgis/nextgis_frontend/commit/1189513b3e0651af0c088a22fac5c91c878f1a79))
* **webmap:** constructor options; move controls options from ngw to webmap ([5a3b582](https://github.com/nextgis/nextgis_frontend/commit/5a3b58209126a5b1e7a802ae8503129b11602512))
* **webmap:** get layers method only string keys ([a14017b](https://github.com/nextgis/nextgis_frontend/commit/a14017bdcba2fcc2989b4d7a2cbc1b393694e6b8))


### Build System

* qms-kit to rollup ([6cf124f](https://github.com/nextgis/nextgis_frontend/commit/6cf124fde63bedac45ac679a44d920050bbb724b))


### chore

* build; eslint ([ee1e03d](https://github.com/nextgis/nextgis_frontend/commit/ee1e03d85625b02a09c2ee1e4d66007fbf57d626))


### Code Refactoring

* **ngw-kit:** naming ([434411a](https://github.com/nextgis/nextgis_frontend/commit/434411a8b2f7e63d436632821d11d0e476d410b3))
* rename layerAdapter baseLayer option to baselayer ([e5c595d](https://github.com/nextgis/nextgis_frontend/commit/e5c595d6df24b1b22906ad1e06eb60bf0327e9c0))
* **utils:** update geom utils ([43c11b0](https://github.com/nextgis/nextgis_frontend/commit/43c11b0f3c45b22ab66789bd00594d34078316f3))


### Features

* add BBOX+ strategy; extends options for setView ([309b697](https://github.com/nextgis/nextgis_frontend/commit/309b697e141adf6eedeb85c87b6fa89b9b629c13))
* add library `@nextgis/properties-filter` ([8ec97de](https://github.com/nextgis/nextgis_frontend/commit/8ec97de9bd48112211c11cb39eb2da857dd21cac))
* add library cancelable-promise ([2cfb08f](https://github.com/nextgis/nextgis_frontend/commit/2cfb08f1143a773a43f1279690e0c9a7e2b2fec5))
* add setViewDelay options to control map update ([a83e5ab](https://github.com/nextgis/nextgis_frontend/commit/a83e5ab9ed6207e0a41fd31a3c56cd14a512c50d))
* add WmsLayerAdapter ([aec0ce1](https://github.com/nextgis/nextgis_frontend/commit/aec0ce15ddb5292b6334833bcab8812400815d0b))
* **cache:** add array to match options deep compare ([6b8a096](https://github.com/nextgis/nextgis_frontend/commit/6b8a09676c40b6a3c1d86819043af4ec9aa34ce9))
* **cache:** add namespaces support ([f65b6ec](https://github.com/nextgis/nextgis_frontend/commit/f65b6ec88885af749b7095dbb7b8dc97f9d6c34d))
* **cesium-map-adapter:** add map click event ([93ec86a](https://github.com/nextgis/nextgis_frontend/commit/93ec86a808fe765576d491c6694c3fc5cffa8d7a))
* **cesium:** add heightOffset geojson option ([dd51756](https://github.com/nextgis/nextgis_frontend/commit/dd517565d251f1184d1e5b11b46850bdc3eaca77))
* **cesium:** add mapAdapter listeners and getBounds method ([3aaa0a7](https://github.com/nextgis/nextgis_frontend/commit/3aaa0a7eef959e45cf2cd86375c08677a38e4ac7))
* **cesium:** add tilset3d adapter paint options ([445e3e7](https://github.com/nextgis/nextgis_frontend/commit/445e3e717e64f2d859ecbf62b82239710d665e34))
* **cesium:** fitBounds up tp terrain ([733207a](https://github.com/nextgis/nextgis_frontend/commit/733207add48dbaa6f811673129ea6485b70de834))
* **cesium:** update layer and map adapter ([c942b1a](https://github.com/nextgis/nextgis_frontend/commit/c942b1a741618e6e3d57737dc91257a7dde6aa83))
* handle vector layer mouse over and out events ([1f537c2](https://github.com/nextgis/nextgis_frontend/commit/1f537c277b433db365b319d4bbdfb26aa44528fd))
* **item:** add @nextgis/tree dependency ([8f5f4e7](https://github.com/nextgis/nextgis_frontend/commit/8f5f4e702ee6deaab6cca7f36a90ba06ee9c000c))
* **leaflet-map-adapter:** add position to vector adapter layers definition ([053ccf0](https://github.com/nextgis/nextgis_frontend/commit/053ccf05ed8d9d76592c8ca648365e176c609277))
* **leaflet-map-adapter:** setMinZoom on maxExtent ([5e16191](https://github.com/nextgis/nextgis_frontend/commit/5e16191f7b81a29b41b2c6873cb33ccd0e84afea))
* **mapbox-map-adapter:** GeoJson layer label workaround ([6c73629](https://github.com/nextgis/nextgis_frontend/commit/6c736293bf498591d27fc050848503802e9da94e))
* **mapbox-map-adapter:** MVT match paint ([4115554](https://github.com/nextgis/nextgis_frontend/commit/41155542218ef1e28fa57803f586cfa384df4784))
* **mapbox-map-adapter:** set opacity with native paint ([4751d0b](https://github.com/nextgis/nextgis_frontend/commit/4751d0bdf178c6812590f11196e97f696a01c303))
* new @nextgis/dom library ([572d4c2](https://github.com/nextgis/nextgis_frontend/commit/572d4c2c554eb4da30be01c25a2d14cd4125d847))
* **nge-kit:** add uploadFeatureAttachment util ([da40397](https://github.com/nextgis/nextgis_frontend/commit/da40397b7cc3943c9570dc13eb3ca7420f97a6ee)), closes [#CU-m356](https://github.com/nextgis/nextgis_frontend/issues/CU-m356)
* **ngw-connector:** remove login logic from getUserInfo ([f0ca312](https://github.com/nextgis/nextgis_frontend/commit/f0ca31257a223ed32628cc83a2411e04b252164f))
* **ngw-kit:** add ability to render multilayers image adapter ([da0eef1](https://github.com/nextgis/nextgis_frontend/commit/da0eef170a8dfdc9f445703768208b61d6e9a1c1))
* **ngw-kit:** add addLayerOptionsPriority for createGeoJsonAdapter ([eb7db26](https://github.com/nextgis/nextgis_frontend/commit/eb7db2620f2bf66812ab90b03f5359c70f46ecf9))
* **ngw-kit:** add baselayers from webmap; vuetify BaseLayerSelect ([7862680](https://github.com/nextgis/nextgis_frontend/commit/78626807a6e9c7420ffffeba5c9a4f90fdba24b8))
* **ngw-kit:** add bbox strategy for large vector layer ([9641d20](https://github.com/nextgis/nextgis_frontend/commit/9641d20ed48975b59d37befad9614b27bd5594e7))
* **ngw-kit:** add bbox strategy layer preupdate event ([8156f17](https://github.com/nextgis/nextgis_frontend/commit/8156f17816779a76bf6ec7f3049ec52a62998bf5))
* **ngw-kit:** add BBOX+ strategy ([4d20810](https://github.com/nextgis/nextgis_frontend/commit/4d20810575c5b246dfadd01a5371ccd5e1b1ca1b))
* **ngw-kit:** add datetime ngw formatter ([786d2b1](https://github.com/nextgis/nextgis_frontend/commit/786d2b1b469bbd45a22eeaa43b367a985b3d0ca3))
* **ngw-kit:** add feature request extensions param ([9fec2dc](https://github.com/nextgis/nextgis_frontend/commit/9fec2dcd2a2013d35bc628d58c1994d24a7990fa))
* **ngw-kit:** add feature request srs param ([4b88e3a](https://github.com/nextgis/nextgis_frontend/commit/4b88e3a9614a15167efbe5f12a2649df4cfd7b93))
* **ngw-kit:** add feature to getIdentifyItems ([e08532a](https://github.com/nextgis/nextgis_frontend/commit/e08532ae020ef9ef2acfc2dfc552a4a92565d73c))
* **ngw-kit:** add fetchNgwLayerItems option to disable clietn filter ([ffa673c](https://github.com/nextgis/nextgis_frontend/commit/ffa673cd741f467374f3c630babfd4ced796f28f))
* **ngw-kit:** add identify item for speedup ngw selection ([4f751d0](https://github.com/nextgis/nextgis_frontend/commit/4f751d0af8b1b7973d0979fef5beaf4c5b8e17b4))
* **ngw-kit:** add new selectNgwLayerDistinct util ([eeb612f](https://github.com/nextgis/nextgis_frontend/commit/eeb612f622b7c9b4404e592ccb7c44b223590de8))
* **ngw-kit:** add ngw basemap suppor for url ([f4b1323](https://github.com/nextgis/nextgis_frontend/commit/f4b1323b04da264cae0698e48b41586e1d189bbb))
* **ngw-kit:** add NgwKit.utils.getCompanyLogo method ([301ff78](https://github.com/nextgis/nextgis_frontend/commit/301ff78d36b712e93fdfbd03f5c8f57dd93cbc14))
* **ngw-kit:** add parse date from ngw feature and store util ([73d5d7d](https://github.com/nextgis/nextgis_frontend/commit/73d5d7dc07bc9e5f6b0d55c413ede2d83ac6a8fb))
* **ngw-kit:** add polygon intersection identify util ([a378415](https://github.com/nextgis/nextgis_frontend/commit/a3784154fe9961f90b88e4ca11fc84a1393c99ff))
* **ngw-kit:** add postgis_layer cls adapter ([0417b13](https://github.com/nextgis/nextgis_frontend/commit/0417b13e0e8fbc1afb3ae3dd7456ff03e92d6483))
* **ngw-kit:** add tileNoData ngw adapter option ([162d852](https://github.com/nextgis/nextgis_frontend/commit/162d852cab33a40c3d5634e6915ea148c2490c15))
* **ngw-kit:** add tmsclient_layer adapter class support ([2c40bb3](https://github.com/nextgis/nextgis_frontend/commit/2c40bb36a0106599b2c36a5f9cd51aa247dd5345))
* **ngw-kit:** add toGeojson in ngw layer item response ([0af64ad](https://github.com/nextgis/nextgis_frontend/commit/0af64ad1f907996f357a2355a35597319ec4bb0a))
* **ngw-kit:** add useBasemap NgwWebmaplayerAdapter option ([cf8c491](https://github.com/nextgis/nextgis_frontend/commit/cf8c4918a3f0c2261f679a06dc51c82ce09b978c))
* **ngw-kit:** add webmap item method to cotrol item children order ([6387eba](https://github.com/nextgis/nextgis_frontend/commit/6387ebadabae7a1d2b68e2221b20eda81a7465e0))
* **ngw-kit:** calculate group NgwWebMapItem init visibility ([7483b43](https://github.com/nextgis/nextgis_frontend/commit/7483b438bb48ffdec4dc7b75d042afd73043fab5))
* **ngw-kit:** default WebmapLayerAdapter basemap ([12aba63](https://github.com/nextgis/nextgis_frontend/commit/12aba63a37fc75cbaed2ed0be478cc5172149190))
* **ngw-kit:** disable api clien filter without any case ([b2f7094](https://github.com/nextgis/nextgis_frontend/commit/b2f7094e1a10d4c859c66cb304993f022c2a9aeb))
* **ngw-kit:** duplication of the server filter by the client ([0978bf7](https://github.com/nextgis/nextgis_frontend/commit/0978bf778bf19b5e0620902618f45fde4c607a90))
* **ngw-kit:** export createPopupContent util ([d82c165](https://github.com/nextgis/nextgis_frontend/commit/d82c1650bbd2e3c991c2de011b5c8fb23b575d3c))
* **ngw-kit:** export getImageAdapterOptions method ([5d7bbbc](https://github.com/nextgis/nextgis_frontend/commit/5d7bbbc04454db5c87f74f57136fdc9fd0d4da21))
* **ngw-kit:** extensibility increased ([2b7286d](https://github.com/nextgis/nextgis_frontend/commit/2b7286d7aba2551e22ea72f1329b3009893af64f))
* **ngw-kit:** features request cache option ([96d5bff](https://github.com/nextgis/nextgis_frontend/commit/96d5bff0852d5f63056484ec9692adb22de7f2ca))
* **ngw-kit:** handle Infinity in fetchNgwItems query limit param ([ee530cc](https://github.com/nextgis/nextgis_frontend/commit/ee530ccae00d142eb15b7eeca2a2bc238b8c74d8))
* **ngw-kit:** id fields as number for client filter ([4bea3ef](https://github.com/nextgis/nextgis_frontend/commit/4bea3ef1835467a33aff7bd949bb0a7028f2e92e))
* **ngw-kit:** improve createOnFirstShowAdapter ([fe7e721](https://github.com/nextgis/nextgis_frontend/commit/fe7e7215b0aa2cea90d859a749b784b1e95119c0))
* **ngw-kit:** log to get item extensions if not request param set ([aef5fdf](https://github.com/nextgis/nextgis_frontend/commit/aef5fdfac6a81be98b8115bea87625a83d987a67))
* **ngw-kit:** make create basemap layer adapter universal ([b17781d](https://github.com/nextgis/nextgis_frontend/commit/b17781df8afabd9e5353a07c94a3769390ea8591))
* **ngw-kit:** new addNgwLayer resource option for keyname or resourceId ([3881c42](https://github.com/nextgis/nextgis_frontend/commit/3881c427dc2ae770634605944d1207d1ec6b2b38))
* **ngw-kit:** new approach to extend adapters for any resource classes ([392b83f](https://github.com/nextgis/nextgis_frontend/commit/392b83fc83e764730c3b031cb03d4d74fe524842))
* **ngw-kit:** ngw webmap item bookmarks handler ([88b4b8c](https://github.com/nextgis/nextgis_frontend/commit/88b4b8cbbefbe236dd475100d2a143c0b3f1deca))
* **ngw-kit:** ngwwebmap item toggle on zoom layer range ([52abb1d](https://github.com/nextgis/nextgis_frontend/commit/52abb1d2fee3b2c306b9269e8287d98362ef5128))
* **ngw-kit:** NgwWebmapItem opacity ([c7846df](https://github.com/nextgis/nextgis_frontend/commit/c7846dff298d1d1e022cdb9258ba346f86505527))
* **ngw-kit:** prepare datetime fields to ngw ([eb814c1](https://github.com/nextgis/nextgis_frontend/commit/eb814c16b242a8a0fe0d26e4159db76cf1bd96d2))
* **ngw-kit:** update feature request params ([ebceeaf](https://github.com/nextgis/nextgis_frontend/commit/ebceeafc4ccb9f95b34ddbe7ce31436ccc0cae45))
* **ngw-kit:** update features request params on no geom ([a1f27a2](https://github.com/nextgis/nextgis_frontend/commit/a1f27a28fe52a8ef7076f406273d84caeecd30fc))
* **ngw-kit:** update loaded date before property filter ([cbae69e](https://github.com/nextgis/nextgis_frontend/commit/cbae69e4fdd5863582ae015328ce323103f04d03))
* **ngw-kit:** use abort signal in fetch requests ([fe2e5cc](https://github.com/nextgis/nextgis_frontend/commit/fe2e5cc1a291e7e1ea1821a8380f4f4db68ea270))
* **ngw-map:** add ngw layer from resource item object ([e9c13f5](https://github.com/nextgis/nextgis_frontend/commit/e9c13f5ca0c1fb00106d0aa3f944cff1c92931e1))
* **ngw-map:** add promise groups handler ([2fb6ab1](https://github.com/nextgis/nextgis_frontend/commit/2fb6ab152037e04fb037313140536e3e4ac8a938))
* **ngw-mapbox:** add MVT support for addNgwlayer ([50fc868](https://github.com/nextgis/nextgis_frontend/commit/50fc868d73ca9ab5a069994991fdcb69ac0ae7c5))
* **ngw-orm:** remove 3rd part libs to convers geom to wkt, use new ngw api ([dd18c38](https://github.com/nextgis/nextgis_frontend/commit/dd18c380283e12be0e70565577a076ea8d461ecd))
* **ngw:** add support for `qgis_raster_style` ([e0f98c4](https://github.com/nextgis/nextgis_frontend/commit/e0f98c407ffec70fb3c93eda1f647356cdd523cb))
* **ngw:** conditions and nesting for filtering ngw feature layer ([90708d8](https://github.com/nextgis/nextgis_frontend/commit/90708d8deaaa5ce995caf6cc7f7b307592272114))
* **ngw:** option to create popup content from item ([509be03](https://github.com/nextgis/nextgis_frontend/commit/509be030f043719276bb464fe5f5a686cae76e21))
* **ol-map-adapter:** add srs options to draw vector layer ([7a29212](https://github.com/nextgis/nextgis_frontend/commit/7a29212eb5636194b5cc9df0602c1fb8cbb58593))
* **ol-map-adapter:** use add layer opacity option ([33dd334](https://github.com/nextgis/nextgis_frontend/commit/33dd334d76a563b147548d96fa56ed9d54a318a3))
* **paint:** add experimental paint 3d style ([25fce10](https://github.com/nextgis/nextgis_frontend/commit/25fce10064a2b38f8e50f92402b585956ce5b425))
* **util:** create typeHelpers utils ([387d5dc](https://github.com/nextgis/nextgis_frontend/commit/387d5dcda12e21fdef0c49d812a9543ed280b087))
* **utils:** deprecated helper utils ([d324e3f](https://github.com/nextgis/nextgis_frontend/commit/d324e3f9e0babdb10779a0add5d53bae78235086))
* **utils:** move some utils from ngw-kit and webmap to geom ([03ff50e](https://github.com/nextgis/nextgis_frontend/commit/03ff50e30d1562ad29561ad0741924b49c6aa907))
* **vue:** add layer toggle listener for baselayerselect ([a78a687](https://github.com/nextgis/nextgis_frontend/commit/a78a6874814740637adee39c5813015a5d7dd6eb))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([bcea6c3](https://github.com/nextgis/nextgis_frontend/commit/bcea6c35e61f6ba2aab0b25eb30da9f5f719c92e))
* **webmap:** add addLayer onAdded option ([880ccbb](https://github.com/nextgis/nextgis_frontend/commit/880ccbba94e7e0309260cce01790bd039ce3039d))
* **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([928d351](https://github.com/nextgis/nextgis_frontend/commit/928d351fea9a321c178ecbb4e03a70bd9a64fc90))
* **webmap:** layer adapter waitFullLoad and crossOrigin new options ([5e2b6d2](https://github.com/nextgis/nextgis_frontend/commit/5e2b6d2ae1db3b48775bca7f31a85338d451d61a))
* **webmap:** make propertiesFilter async ([2eca455](https://github.com/nextgis/nextgis_frontend/commit/2eca455688c06edd2433e1497c8818f5b4a765ef))
* **webmap:** new addTileLayer shortcut WebMap method ([a209dfc](https://github.com/nextgis/nextgis_frontend/commit/a209dfc8b09bde6b99ebea4604a5238f40a1f911))
* **webmap:** update layer adapter options ([7c04879](https://github.com/nextgis/nextgis_frontend/commit/7c04879dc05945e7ef28cc77f8193f627fa7b303))
* **webmap:** update PropertiesFilter interface ([8ef2e3b](https://github.com/nextgis/nextgis_frontend/commit/8ef2e3b937204a4a7440cce231d08e35c6393114))


### Performance Improvements

* **leaflet:** abort xhr tile loading on setView ([9505841](https://github.com/nextgis/nextgis_frontend/commit/9505841c1b7a458b3148c457753ec4946bcd89e1))
* **leaflet:** setViewDelay for tile layer ([3712825](https://github.com/nextgis/nextgis_frontend/commit/371282587521961c043fff404dd9b5e474e6c2e5))
* **ngw-kit:** abort BBOX request on map movestart ([a985f50](https://github.com/nextgis/nextgis_frontend/commit/a985f507d1358cc5753db2345d3b89a04c1e1847))
* **ngw-kit:** default limit to load large vector layer data ([bcdba09](https://github.com/nextgis/nextgis_frontend/commit/bcdba0973fad5204bf3b067afa9cfdb692d48a99))
* **ngw-kit:** geojson adapter not blocked on data load ([1fe9df6](https://github.com/nextgis/nextgis_frontend/commit/1fe9df685aec00c5569e3af20194c873362b3999))


### types

* **ngw-connector:** rename ([85bf430](https://github.com/nextgis/nextgis_frontend/commit/85bf430fa9fc25f427a9861e35f267d243c26ed8))
* rename interface ([d16b4c3](https://github.com/nextgis/nextgis_frontend/commit/d16b4c30c63938bf76e412ae3c968ffc8424b478))


### wip

* rename VectorLayerAdapterType ([726ab7d](https://github.com/nextgis/nextgis_frontend/commit/726ab7dd7cd112750165a9e15c5672086cd8261a))
* **util:** move CancelablePromise to util ([a687a8f](https://github.com/nextgis/nextgis_frontend/commit/a687a8fe0b8389adeb2a6d6f97db330c2f60ad48))


### BREAKING CHANGES

* **ngw-connector:** The getUserInfo mehod does not emit any more login events. Only login method does this
* **ngw-connector:** FeatureLayerFields type is now FeatureProperties
* change GetNgwLayerItemsOptions to GetNgwItemsOptions
* **ngw-kit:** `extensions` for any ngw feature request is now empty for default
* **utils:** removed latLng from MapClickEvent, use lngLat: numner[] instead
* **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead
* **ngw-kit:** replace `import { WebMapLayerAdapter } from @nextgis/ngw-kit` to `import { NgwWebmapLayerAdapter } from @nextgis/ngw-kit` and `import { WebMapLayerItem} from @nextgis/ngw-kit` to `import { NgwWebmapLayerItem } from @nextgis/ngw-kit`
* No more default export from `qms-kit`. You should replace `import QmsKit from "@nextgis/qms-kit"` to `import { QmsKit } from "@nextgis/qms-kit"` everywhere
* LayerAdapter option baseLayer was renamed to baselayer;
* webMap.getBaseLayers() method now return LayerAdapter, not string array of ids
* rename VectorLayerAdapter types: circle > point; fill > polygon
* **ngw-kit:** rename NgwKit.utils.getIdentifyGeoJsonParams > NgwKit.utils.getIdentifyItems
* code formatting rules changed to prettier 2.0 compatibility
* `propertiesFilter` removed from `@nextgis/utils`
* **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'





## [1.16.7](https://github.com/nextgis/nextgis_frontend/compare/v1.16.6...v1.16.7) (2023-04-21)

**Note:** Version bump only for package @nextgis/ngw-kit





## [1.16.6](https://github.com/nextgis/nextgis_frontend/compare/v1.16.5...v1.16.6) (2023-02-09)

**Note:** Version bump only for package @nextgis/ngw-kit

## [1.16.5](https://github.com/nextgis/nextgis_frontend/compare/v1.16.4...v1.16.5) (2023-02-09)

### Bug Fixes

- **ngw-kit:** set image adapter default nd param ([431e7b8](https://github.com/nextgis/nextgis_frontend/commit/431e7b8cc4c695309783775bf72280b5b7fc9d4f))

### Features

- **webmap:** make propertiesFilter async ([f21336b](https://github.com/nextgis/nextgis_frontend/commit/f21336b0e734c26d7dc171b49dd7788b33661402))

## [1.16.3](https://github.com/nextgis/nextgis_frontend/compare/v1.16.2...v1.16.3) (2022-09-16)

### Features

- **ngw-kit:** add postgis_layer cls adapter ([ce50b85](https://github.com/nextgis/nextgis_frontend/commit/ce50b85af31802e3abea59686786205a7cc261c4))

## [1.16.2](https://github.com/nextgis/nextgis_frontend/compare/v1.16.1...v1.16.2) (2022-09-15)

### Features

- **ngw-connector:** remove login logic from getUserInfo ([2ee3f29](https://github.com/nextgis/nextgis_frontend/commit/2ee3f29a6a694b73fe5e24ab46147aea974761ab))

### BREAKING CHANGES

- **ngw-connector:** The getUserInfo mehod does not emit any more login events. Only login method does this

## [1.16.1](https://github.com/nextgis/nextgis_frontend/compare/v1.16.0...v1.16.1) (2022-09-03)

**Note:** Version bump only for package @nextgis/ngw-kit

# [1.16.0](https://github.com/nextgis/nextgis_frontend/compare/v1.15.1...v1.16.0) (2022-08-28)

### Features

- **cesium:** add heightOffset geojson option ([caa9626](https://github.com/nextgis/nextgis_frontend/commit/caa9626457d28265ca169e97e006a23f9d6e452e))
- **paint:** add experimental paint 3d style ([74ddd65](https://github.com/nextgis/nextgis_frontend/commit/74ddd65d72fdd5539868d27da58a949ea26cd365))

## [1.15.1](https://github.com/nextgis/nextgis_frontend/compare/v1.15.0...v1.15.1) (2022-08-02)

**Note:** Version bump only for package @nextgis/ngw-kit

# [1.15.0](https://github.com/nextgis/nextgis_frontend/compare/v1.14.0...v1.15.0) (2022-07-27)

### Features

- **mapbox-map-adapter:** set opacity with native paint ([c227ee3](https://github.com/nextgis/nextgis_frontend/commit/c227ee32cb6656cdc3f2c4086b373b49e28245ca))

# [1.14.0](https://github.com/nextgis/nextgis_frontend/compare/v1.13.8...v1.14.0) (2022-07-05)

**Note:** Version bump only for package @nextgis/ngw-kit

## [1.13.8](https://github.com/nextgis/nextgis_frontend/compare/v1.13.7...v1.13.8) (2022-06-25)

### Features

- **mapbox-map-adapter:** MVT match paint ([068fe38](https://github.com/nextgis/nextgis_frontend/commit/068fe38b29d453a2710df7aa0c35d9ea697be62e))

## [1.13.7](https://github.com/nextgis/nextgis_frontend/compare/v1.13.6...v1.13.7) (2022-06-15)

### Features

- **ngw-mapbox:** add MVT support for addNgwlayer ([21f695e](https://github.com/nextgis/nextgis_frontend/commit/21f695e0f9a150b66a8c492c5bf30d31b1e21afb))

## [1.13.6](https://github.com/nextgis/nextgis_frontend/compare/v1.13.5...v1.13.6) (2022-06-05)

**Note:** Version bump only for package @nextgis/ngw-kit

## [1.13.5](https://github.com/nextgis/nextgis_frontend/compare/v1.13.4...v1.13.5) (2022-05-31)

**Note:** Version bump only for package @nextgis/ngw-kit

## [1.13.4](https://github.com/nextgis/nextgis_frontend/compare/v1.13.3...v1.13.4) (2022-05-31)

**Note:** Version bump only for package @nextgis/ngw-kit

## [1.13.3](https://github.com/nextgis/nextgis_frontend/compare/v1.13.2...v1.13.3) (2022-05-31)

**Note:** Version bump only for package @nextgis/ngw-kit

## [1.13.2](https://github.com/nextgis/nextgis_frontend/compare/v1.13.1...v1.13.2) (2022-05-30)

### Features

- **ngw-kit:** use abort signal in fetch requests ([c68a8f1](https://github.com/nextgis/nextgis_frontend/commit/c68a8f1223806ea1820428566d7b7fa6a7cb97a2))

## [1.13.1](https://github.com/nextgis/nextgis_frontend/compare/v1.13.0...v1.13.1) (2022-05-13)

### Bug Fixes

- **ngw-kit:** remove forgotten log ([5b4eaec](https://github.com/nextgis/nextgis_frontend/commit/5b4eaecd8d63e9367e6d69013498133d09533bef))

# [1.13.0](https://github.com/nextgis/nextgis_frontend/compare/v1.12.1...v1.13.0) (2022-05-13)

**Note:** Version bump only for package @nextgis/ngw-kit

## [1.12.1](https://github.com/nextgis/nextgis_frontend/compare/v1.12.0...v1.12.1) (2022-04-21)

### Bug Fixes

- **ngw-kit:** getIdentifyItems multiple ([fb058d1](https://github.com/nextgis/nextgis_frontend/commit/fb058d1ec4bca530c4908edf2039eb370d07af44))

### Features

- **ngw-kit:** disable api clien filter without any case ([8a41394](https://github.com/nextgis/nextgis_frontend/commit/8a413945ba6673027ab7f1d53f5e71e72c8fb6b3))
- **ngw-kit:** id fields as number for client filter ([b49e818](https://github.com/nextgis/nextgis_frontend/commit/b49e8189485bf1f6067b987e7532e83674b6d6d1))

# [1.12.0](https://github.com/nextgis/nextgis_frontend/compare/v1.11.10...v1.12.0) (2022-03-05)

### Bug Fixes

- **ngw-kit:** remove duplicates from a query with filter by ANY condition ([95ecce5](https://github.com/nextgis/nextgis_frontend/commit/95ecce5135a9bd534287ea1925a959fdf4edbd20))

### Features

- **ngw-kit:** add ability to render multilayers image adapter ([4aa5c6e](https://github.com/nextgis/nextgis_frontend/commit/4aa5c6e0aa56134600cfae7b43721f87b037060b))
- **ngw-kit:** add polygon intersection identify util ([7686231](https://github.com/nextgis/nextgis_frontend/commit/7686231f10fb0cd258946187a0e1dc80bb5306f8))
- **ngw-kit:** export getImageAdapterOptions method ([2cd5969](https://github.com/nextgis/nextgis_frontend/commit/2cd5969b83ad55b039a14df091bcb2a100c28777))
- **webmap:** add addLayer onAdded option ([212b7b0](https://github.com/nextgis/nextgis_frontend/commit/212b7b082e4ed6a4bec6dd96c7d63d595bbc6743))

## [1.11.10](https://github.com/nextgis/nextgis_frontend/compare/v1.11.9...v1.11.10) (2022-01-20)

### Features

- **ngw-kit:** add fetchNgwLayerItems option to disable clietn filter ([f46e2c3](https://github.com/nextgis/nextgis_frontend/commit/f46e2c3298b3c30fb21b9174b4d502785ff526bf))

## [1.11.9](https://github.com/nextgis/nextgis_frontend/compare/v1.11.8...v1.11.9) (2022-01-18)

### Bug Fixes

- **ngw-kit:** fetchNgwLayerItems client filter ([61eaf9f](https://github.com/nextgis/nextgis_frontend/commit/61eaf9f1f9f4310d3e88eb338370dc9e6b5560f3))

## [1.11.8](https://github.com/nextgis/nextgis_frontend/compare/v1.11.7...v1.11.8) (2022-01-18)

### Features

- **ngw-kit:** add new selectNgwLayerDistinct util ([cf1ee23](https://github.com/nextgis/nextgis_frontend/commit/cf1ee23e3cc7ddb401e22035710ee0d272c51096))

## [1.11.7](https://github.com/nextgis/nextgis_frontend/compare/v1.11.6...v1.11.7) (2022-01-11)

**Note:** Version bump only for package @nextgis/ngw-kit

## [1.11.3](https://github.com/nextgis/nextgis_frontend/compare/v1.11.2...v1.11.3) (2022-01-03)

**Note:** Version bump only for package @nextgis/ngw-kit

## [1.11.2](https://github.com/nextgis/nextgis_frontend/compare/v1.11.1...v1.11.2) (2021-12-20)

**Note:** Version bump only for package @nextgis/ngw-kit

# [1.11.0](https://github.com/nextgis/nextgis_frontend/compare/v1.10.0...v1.11.0) (2021-12-19)

### Bug Fixes

- **ngw-kit:** NgwWebmapLayerAdapter constuctor options ([2122b7d](https://github.com/nextgis/nextgis_frontend/commit/2122b7d3017bd896fa9c6aac204914cf2e603f39))
- **ngw-kit:** NgwWebMapLayerAdapter exent constrained ([eedbaeb](https://github.com/nextgis/nextgis_frontend/commit/eedbaeb79c13d9774c30a3dc2837e33d04328807))

### Features

- **leaflet-map-adapter:** setMinZoom on maxExtent ([56cf3b6](https://github.com/nextgis/nextgis_frontend/commit/56cf3b6eed50f9b6d8c78a21e733eb015bd67712))

# [1.10.0](https://github.com/nextgis/nextgis_frontend/compare/v1.9.7...v1.10.0) (2021-11-30)

**Note:** Version bump only for package @nextgis/ngw-kit

## [1.9.7](https://github.com/nextgis/nextgis_frontend/compare/v1.9.6...v1.9.7) (2021-11-19)

### Features

- **ngw-kit:** add useBasemap NgwWebmaplayerAdapter option ([e4716b1](https://github.com/nextgis/nextgis_frontend/commit/e4716b102c5bd289574d12908e9bb2da49807161))

## [1.9.6](https://github.com/nextgis/nextgis_frontend/compare/v1.9.5...v1.9.6) (2021-11-18)

### Bug Fixes

- **ngw-kit:** NgwWebmapItem max min zoom calculate ([5f1360f](https://github.com/nextgis/nextgis_frontend/commit/5f1360f37460a08adae45122e88ea21db74585e8))

## [1.9.4](https://github.com/nextgis/nextgis_frontend/compare/v1.9.3...v1.9.4) (2021-11-16)

### Bug Fixes

- **leafelt-map-adapter:** selected layer click event param ([751427a](https://github.com/nextgis/nextgis_frontend/commit/751427ac854a940b4d7caccb4ad602fab89133ac))

### Features

- **cache:** add namespaces support ([5426fa6](https://github.com/nextgis/nextgis_frontend/commit/5426fa63e7cc89d79824a3d0ef38881511534bf9))

## [1.9.3](https://github.com/nextgis/nextgis_frontend/compare/v1.9.2...v1.9.3) (2021-11-05)

### Bug Fixes

- **ngw-connector:** clean cache on resource delete ([0816107](https://github.com/nextgis/nextgis_frontend/commit/0816107542757838811a7ed9b9e814e51912254c))
- **ngw-kit:** fix like and ilike filter requests ([911f7e3](https://github.com/nextgis/nextgis_frontend/commit/911f7e35159b4dbe171177aa3ab014b1d505fbce))

## [1.9.2](https://github.com/nextgis/nextgis_frontend/compare/v1.9.1...v1.9.2) (2021-10-26)

**Note:** Version bump only for package @nextgis/ngw-kit

## [1.9.1](https://github.com/nextgis/nextgis_frontend/compare/v1.9.0...v1.9.1) (2021-10-25)

### Features

- **ngw-kit:** add bbox strategy layer preupdate event ([a3e2b93](https://github.com/nextgis/nextgis_frontend/commit/a3e2b93b729e361546b030b9d865dbcf66b58101))

# [1.9.0](https://github.com/nextgis/nextgis_frontend/compare/v1.8.5...v1.9.0) (2021-10-23)

### Bug Fixes

- **ngw-kit:** do not load BBOX out of min-max zoom range ([9346932](https://github.com/nextgis/nextgis_frontend/commit/93469329b210f9721f1739830cbb5095df9db9d8))

### Features

- add BBOX+ strategy; extends options for setView ([88e9d09](https://github.com/nextgis/nextgis_frontend/commit/88e9d092bcc3615b99bad13d175f62be3ff73725))
- **ngw-kit:** add BBOX+ strategy ([a954e20](https://github.com/nextgis/nextgis_frontend/commit/a954e20e93f74cc60f1abd4b3af77eef7a0a57bb))

## [1.8.4](https://github.com/nextgis/nextgis_frontend/compare/v1.8.3...v1.8.4) (2021-10-21)

### Features

- **ngw-kit:** ngwwebmap item toggle on zoom layer range ([f7c4e42](https://github.com/nextgis/nextgis_frontend/commit/f7c4e42fe323f9e4941dbc37893b3beb2ccd7751))

## [1.8.3](https://github.com/nextgis/nextgis_frontend/compare/v1.8.2...v1.8.3) (2021-10-12)

### Bug Fixes

- **ngw-kit:** make async onFirstShowAdapter hide and show methods ([e5d43b6](https://github.com/nextgis/nextgis_frontend/commit/e5d43b6156cd961619908a9100e204c36d42bcb0))

## [1.8.2](https://github.com/nextgis/nextgis_frontend/compare/v1.8.1...v1.8.2) (2021-10-05)

**Note:** Version bump only for package @nextgis/ngw-kit

## [1.8.1](https://github.com/nextgis/nextgis_frontend/compare/v1.8.0...v1.8.1) (2021-09-23)

### Features

- **ngw-kit:** NgwWebmapItem opacity ([98793f3](https://github.com/nextgis/nextgis_frontend/commit/98793f32191a113f1883fa5ddc96133aa7360c57))

# [1.8.0](https://github.com/nextgis/nextgis_frontend/compare/v1.7.0...v1.8.0) (2021-09-22)

**Note:** Version bump only for package @nextgis/ngw-kit

# [1.7.0](https://github.com/nextgis/nextgis_frontend/compare/v1.6.0...v1.7.0) (2021-09-16)

### Features

- **leaflet-map-adapter:** add position to vector adapter layers definition ([61cb7a5](https://github.com/nextgis/nextgis_frontend/commit/61cb7a591ed3ececcabed710abf1e0aec6708c1b))

# [1.6.0](https://github.com/nextgis/nextgis_frontend/compare/v1.5.1...v1.6.0) (2021-09-09)

### Features

- **webmap:** new addTileLayer shortcut WebMap method ([421198a](https://github.com/nextgis/nextgis_frontend/commit/421198a0181b8c817e3ed7736d0734f143de3eeb))

## [1.5.1](https://github.com/nextgis/nextgis_frontend/compare/v1.5.0...v1.5.1) (2021-09-06)

### Features

- **vue:** add layer toggle listener for baselayerselect ([4b5fa94](https://github.com/nextgis/nextgis_frontend/commit/4b5fa94e6a718255c8721c4fcc1d4ebb08a7ca4b))

# [1.5.0](https://github.com/nextgis/nextgis_frontend/compare/v1.4.0...v1.5.0) (2021-08-19)

**Note:** Version bump only for package @nextgis/ngw-kit

# [1.4.0](https://github.com/nextgis/nextgis_frontend/compare/v1.3.0...v1.4.0) (2021-08-17)

### Bug Fixes

- **mapboxgl-map-adapter:** select features by propertiesfilter improve ([ba0cf64](https://github.com/nextgis/nextgis_frontend/commit/ba0cf64c46611051fa0258525b9342d1a7832b65))

# [1.3.0](https://github.com/nextgis/nextgis_frontend/compare/v1.2.8...v1.3.0) (2021-08-06)

### Features

- **ol-map-adapter:** add srs options to draw vector layer ([6a76486](https://github.com/nextgis/nextgis_frontend/commit/6a76486e75bd6a6fb5e00a45b0815f3a27aba03e))

## [1.2.8](https://github.com/nextgis/nextgis_frontend/compare/v1.2.7...v1.2.8) (2021-07-27)

### Bug Fixes

- **leaflet-map-adapter:** geojson selection ([1022e71](https://github.com/nextgis/nextgis_frontend/commit/1022e71d46f5513f0ff3a60f4be7d96a84ff4f15))

## [1.2.7](https://github.com/nextgis/nextgis_frontend/compare/v1.2.6...v1.2.7) (2021-07-26)

### Bug Fixes

- **ngw-kit:** createGeojsonAdapter propertiesFilter ([8beacb0](https://github.com/nextgis/nextgis_frontend/commit/8beacb0b0f2f8599c73be934fadcf2bae5ab5f85))
- **ngw-kit:** duplication of the server filter by the client ([3561426](https://github.com/nextgis/nextgis_frontend/commit/3561426999cd58bceed008e974caeb9f0b8f5e2a))

### Features

- **ngw-kit:** duplication of the server filter by the client ([5fc0e92](https://github.com/nextgis/nextgis_frontend/commit/5fc0e92e625ecebae49a793f15e641a7a68716e7))
- **ngw-kit:** update loaded date before property filter ([b40df4d](https://github.com/nextgis/nextgis_frontend/commit/b40df4d8742e970060e3eee60c6549d53567b938))

## [1.2.4](https://github.com/nextgis/nextgis_frontend/compare/v1.2.3...v1.2.4) (2021-07-22)

### Features

- **mapbox-map-adapter:** GeoJson layer label workaround ([b7fa371](https://github.com/nextgis/nextgis_frontend/commit/b7fa371e5a22943e726962e92244d9d164da685e))

## [1.2.3](https://github.com/nextgis/nextgis_frontend/compare/v1.2.2...v1.2.3) (2021-07-21)

### Features

- **ngw-kit:** export createPopupContent util ([a7f00dc](https://github.com/nextgis/nextgis_frontend/commit/a7f00dcffbf21d5516fc27a3e704c85785fc07c0))

## [1.2.2](https://github.com/nextgis/nextgis_frontend/compare/v1.2.1...v1.2.2) (2021-07-16)

### Features

- **ngw-kit:** handle Infinity in fetchNgwItems query limit param ([8a634d7](https://github.com/nextgis/nextgis_frontend/commit/8a634d7d8fe0e1ef926802f7eec36f8b097170fd))

## [1.2.1](https://github.com/nextgis/nextgis_frontend/compare/v1.2.0...v1.2.1) (2021-07-12)

**Note:** Version bump only for package @nextgis/ngw-kit

# [1.2.0](https://github.com/nextgis/nextgis_frontend/compare/v1.1.2...v1.2.0) (2021-07-08)

### Features

- handle vector layer mouse over and out events ([2e94152](https://github.com/nextgis/nextgis_frontend/commit/2e94152fac64b8e022dab7940614487763ce57af))

## [1.1.2](https://github.com/nextgis/nextgis_frontend/compare/v1.1.1...v1.1.2) (2021-06-28)

### Bug Fixes

- **ngw-kit:** protect firstShowAdapter from multiple creation ([55061f8](https://github.com/nextgis/nextgis_frontend/commit/55061f8f1d2cb2102ca05ecf7430f40182c361f6))

## [1.1.1](https://github.com/nextgis/nextgis_frontend/compare/v1.1.0...v1.1.1) (2021-06-25)

**Note:** Version bump only for package @nextgis/ngw-kit

# [1.1.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.1...v1.1.0) (2021-06-25)

### Features

- **cache:** add array to match options deep compare ([b3e6717](https://github.com/nextgis/nextgis_frontend/commit/b3e67174977f0985678580a2ef1096220a787ff5))
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

- **ngw-kit:** fix emppty identify geometry ([9bc2342](https://github.com/nextgis/nextgis_frontend/commit/9bc2342aae5441497acf0ade2b9fc993ab6a3f09))
- **ngw-kit:** on first adapter wait while show layer ([32fe7a0](https://github.com/nextgis/nextgis_frontend/commit/32fe7a0afde48fc8a46626fac1b5f8aa0b942775))
- **qms:** add createQmsAdapter options ([65cf6ee](https://github.com/nextgis/nextgis_frontend/commit/65cf6eec97cf9d12db118c9a0ccdb8e50bad4e88))

### Features

- **nge-kit:** add uploadFeatureAttachment util ([14fa802](https://github.com/nextgis/nextgis_frontend/commit/14fa802d237976f8b2c75584cfb0659ed31bd2b8)), closes [#CU-m356](https://github.com/nextgis/nextgis_frontend/issues/CU-m356)
- **ngw-kit:** update features request params on no geom ([352fd22](https://github.com/nextgis/nextgis_frontend/commit/352fd220dca87de7018b86206aac31008f5a7e20))

# [1.0.0-beta.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2021-05-03)

### Features

- **ngw-kit:** add identify item for speedup ngw selection ([b051f9f](https://github.com/nextgis/nextgis_frontend/commit/b051f9f6f596f3a54645e5ccbc628907ed83fca1))

# [1.0.0-beta.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2021-05-02)

### Features

- **ngw-kit:** ngw webmap item bookmarks handler ([edd02b9](https://github.com/nextgis/nextgis_frontend/commit/edd02b9025e5d5572c9c79f627044c6f0fceab93))

# [1.0.0-beta.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-04-23)

### Bug Fixes

- **ngw-kit:** ngw-webmap tree sublevel order ([25dc798](https://github.com/nextgis/nextgis_frontend/commit/25dc798f63f4f20b0bb1011c849efec11248c683))

# [1.0.0-beta.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-04-04)

### Bug Fixes

- **ngw-kit:** inject item into the createRasterAdapter class factory ([567809b](https://github.com/nextgis/nextgis_frontend/commit/567809b366231f4b78453f52e544e6bc134cd486))
- **ngw-kit:** insert headers into createOnFirstShowAdapter addLayer method ([d230fe2](https://github.com/nextgis/nextgis_frontend/commit/d230fe2f484f42ff1e0a99f9ff33d60526b55bdd))

### Features

- **ngw-kit:** add datetime ngw formatter ([2d75cca](https://github.com/nextgis/nextgis_frontend/commit/2d75cca95106aa6eeeb9ae3bd8348f8e92b72bc8))

# [1.0.0-beta.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-02-13)

### Bug Fixes

- **cesium:** TileLayer ordering ([41a8f05](https://github.com/nextgis/nextgis_frontend/commit/41a8f05dc5050b54886b1bac22fbd31fb6218f14))

### Features

- **cesium:** add tilset3d adapter paint options ([a9caba5](https://github.com/nextgis/nextgis_frontend/commit/a9caba56225609202ff350e232ada5af77bbfa6a))
- **ngw-kit:** add feature request srs param ([3deb546](https://github.com/nextgis/nextgis_frontend/commit/3deb54649789736aacd2ebf6f3f71f388938debb))
- **ngw-kit:** improve createOnFirstShowAdapter ([7a522d7](https://github.com/nextgis/nextgis_frontend/commit/7a522d7ca715ef49c41e219b955b4eba573973dd))

# [1.0.0-beta.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-01-17)

### Features

- add setViewDelay options to control map update ([3c50948](https://github.com/nextgis/nextgis_frontend/commit/3c50948d8ce31d79879cf566f827cee78fc1af31))

### Performance Improvements

- **leaflet:** abort xhr tile loading on setView ([f7e9ed0](https://github.com/nextgis/nextgis_frontend/commit/f7e9ed044ed39fbc95c73ad381560e692dda6046))
- **leaflet:** setViewDelay for tile layer ([229ef92](https://github.com/nextgis/nextgis_frontend/commit/229ef9211a9aac27b5d7ca86f04118e291579d8b))

# [1.0.0-beta.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-12-19)

### Bug Fixes

- **ngw-kit:** show only one enabled webmap basemap ([18a6022](https://github.com/nextgis/nextgis_frontend/commit/18a6022f5b58b45ee6b5bd92c6053fe3d3842866))

# [1.0.0-beta.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-11-28)

### Bug Fixes

- **ngw-connector:** fixes to apiRequest cancel work ([0ac44ee](https://github.com/nextgis/nextgis_frontend/commit/0ac44eee447019593ae80529cc3b063171f8f88c)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
- **ngw-kit:** clean layer adapter options ([642b1e8](https://github.com/nextgis/nextgis_frontend/commit/642b1e810a337231a989b323f24d0c5502efd9ee))
- **ngw-kit:** ngw webmap item childrensafe reverse ([fbcb433](https://github.com/nextgis/nextgis_frontend/commit/fbcb4330b193cb914fa184ccdb6ac81bc2b8a5f6))
- **ngw-kit:** not identify for not supported layer ([1fbd7dc](https://github.com/nextgis/nextgis_frontend/commit/1fbd7dc28c7d6bc6fa4b1ac20e894fbbd3b27a2c))
- **utils:** applyMixin options on no replace ([4362c4c](https://github.com/nextgis/nextgis_frontend/commit/4362c4cb36dcd885803bb9dde36512ced21287cb))

### Features

- **cesium-map-adapter:** add map click event ([90ac3ab](https://github.com/nextgis/nextgis_frontend/commit/90ac3ab3464341984da524306b19f0e966e1ef72))
- **ngw-kit:** add toGeojson in ngw layer item response ([a9f073a](https://github.com/nextgis/nextgis_frontend/commit/a9f073a50dac3ecf3472e7b90f4124b8e3a6b772))
- **ngw-kit:** log to get item extensions if not request param set ([b2bf132](https://github.com/nextgis/nextgis_frontend/commit/b2bf13205d4b2a04ca58f63b03523007dcaff199))
- **ngw-kit:** update feature request params ([4b2ffe8](https://github.com/nextgis/nextgis_frontend/commit/4b2ffe8170216e168bdd8f977a0d72d87277c181))
- **ngw-map:** add promise groups handler ([864fc6d](https://github.com/nextgis/nextgis_frontend/commit/864fc6d3a905e72136df3795f1e86046d54e0fd4))
- **utils:** deprecated helper utils ([9bab695](https://github.com/nextgis/nextgis_frontend/commit/9bab695eb840d49015c739c8f871305e57640aab))

### BREAKING CHANGES

- **ngw-kit:** `extensions` for any ngw feature request is now empty for default
- **utils:** removed latLng from MapClickEvent, use lngLat: numner[] instead

# [1.0.0-beta.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2020-11-16)

**Note:** Version bump only for package @nextgis/ngw-kit

# [1.0.0-alpha.11](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2020-11-02)

### Bug Fixes

- **webmap:** constructor options; move controls options from ngw to webmap ([611b8c0](https://github.com/nextgis/nextgis_frontend/commit/611b8c0af120c726ccf42eca0a608edbd54bb1c1))

### Features

- **ngw-kit:** add feature request extensions param ([0a3f839](https://github.com/nextgis/nextgis_frontend/commit/0a3f839925b23012a406bfe088cb318c0f1b2cf0))
- **ngw-kit:** add parse date from ngw feature and store util ([6cc45de](https://github.com/nextgis/nextgis_frontend/commit/6cc45ded20b3e14f464c63ed02db1a385689f540))

# [1.0.0-alpha.10](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-10-20)

### Bug Fixes

- **ngw-kit:** remove async from NgwWebmapItem child add ([024cd13](https://github.com/nextgis/nextgis_frontend/commit/024cd13781f8c089af081511d8a784c4b0089405))
- **ngw-kit:** set NgwWebmap tree item property before layer load ([edb38ab](https://github.com/nextgis/nextgis_frontend/commit/edb38abb8a45d7ee1933a1fee633c753a52e11eb))
- **ngw-kit:** webmap item children ordering ([952f72f](https://github.com/nextgis/nextgis_frontend/commit/952f72fca18b6222e53d8ac3a5ad615ae40a2aa1))

# [1.0.0-alpha.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-10-15)

### Bug Fixes

- **ngw-connector:** retunr undefined on empty apiRequest ([32bca5d](https://github.com/nextgis/nextgis_frontend/commit/32bca5df691840740095b62465ff58c1a05c2586))
- **ngw-kit:** not stringify null on save ngw feature ([9174017](https://github.com/nextgis/nextgis_frontend/commit/91740174be9086af26568e48deff3b9d3c353fe3))
- **utils:** update applyMixins util to allow babel build ([a46cb82](https://github.com/nextgis/nextgis_frontend/commit/a46cb82d09b955aa43ab901750aa0ed5975b9fdd))

### Features

- **item:** add @nextgis/tree dependency ([a0d6cc5](https://github.com/nextgis/nextgis_frontend/commit/a0d6cc56d7a972d1891242feeff4e746d7e45e94))
- **ngw-kit:** calculate group NgwWebMapItem init visibility ([3ec0d57](https://github.com/nextgis/nextgis_frontend/commit/3ec0d5719a21f4e963b8132268ed4d529edc4556))
- **ol-map-adapter:** use add layer opacity option ([0e8aa48](https://github.com/nextgis/nextgis_frontend/commit/0e8aa48dd0a154c37e187cea54951f4d596ef88d))

# [1.0.0-alpha.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-06)

**Note:** Version bump only for package @nextgis/ngw-kit

# [1.0.0-alpha.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-09-22)

### Code Refactoring

- **utils:** update geom utils ([b7e1f7a](https://github.com/nextgis/nextgis_frontend/commit/b7e1f7aab478603f35c49470cfff71d09f58d922))

### BREAKING CHANGES

- **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead

# [1.0.0-alpha.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)

**Note:** Version bump only for package @nextgis/ngw-kit

# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)

### Bug Fixes

- **ngw-kit:** webmap iten async addLayer method ([ca90340](https://github.com/nextgis/nextgis_frontend/commit/ca90340b927704d5c0101041fe1caa54d62ce164))

# [1.0.0-alpha.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)

### Features

- **utils:** move some utils from ngw-kit and webmap to geom ([fbd3d91](https://github.com/nextgis/nextgis_frontend/commit/fbd3d913485c537e92068b5284691bb47f123b43))

# [1.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)

### Bug Fixes

- remove require imports ([be789b8](https://github.com/nextgis/nextgis_frontend/commit/be789b89f39741efe146da97eeb19460a7cca527))
- **leaflet-map-adapter:** fix BaseAdapter pane zIndex set ([f73bb6a](https://github.com/nextgis/nextgis_frontend/commit/f73bb6ae9b9e3e99c5a1ca7cc859570ce0ce8911))

# [1.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)

### Bug Fixes

- improve node/browser splitting ([913a8a1](https://github.com/nextgis/nextgis_frontend/commit/913a8a1794890a2e46c4ec72706edf940102943c))

### Code Refactoring

- **ngw-kit:** naming ([f870925](https://github.com/nextgis/nextgis_frontend/commit/f8709259501b811f269a89445975969e00db2763))

### Features

- **ngw-kit:** default WebmapLayerAdapter basemap ([4756ef8](https://github.com/nextgis/nextgis_frontend/commit/4756ef82084f30eda51fe98e1483e815a7775132))

### BREAKING CHANGES

- **ngw-kit:** replace `import { WebMapLayerAdapter } from @nextgis/ngw-kit` to `import { NgwWebmapLayerAdapter } from @nextgis/ngw-kit` and `import { WebMapLayerItem} from @nextgis/ngw-kit` to `import { NgwWebmapLayerItem } from @nextgis/ngw-kit`

# [1.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)

### Bug Fixes

- **ngw-kit:** remove unresolved variable ([e74c4c7](https://github.com/nextgis/nextgis_frontend/commit/e74c4c7e6ed9c39d4e9837d1830002f3d659d254))
- **ngw-kit:** wms adapter layers options from adapterOptions ([4476a55](https://github.com/nextgis/nextgis_frontend/commit/4476a55953a60c3bbc6b58178f90eac998897482))

# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)

### Bug Fixes

- replace emitter.of by emitter.removeListener ([5a92e2b](https://github.com/nextgis/nextgis_frontend/commit/5a92e2b91e741346be39be87d5b9f50b9621c092))
- **ngw-kit:** editing for a new layer visibility standard ([d2db4ed](https://github.com/nextgis/nextgis_frontend/commit/d2db4ed94648d0854321b4c3192b6cf2ab866652))
- **ngw-kit:** fix addNgwLayer resource options ([c689db1](https://github.com/nextgis/nextgis_frontend/commit/c689db13cb8fb2d043ef395ae56ab501cf77a350))

### Build System

- qms-kit to rollup ([3831a57](https://github.com/nextgis/nextgis_frontend/commit/3831a57e661a85386ef14b69cc6ef682cf961394))

### Code Refactoring

- rename layerAdapter baseLayer option to baselayer ([368d657](https://github.com/nextgis/nextgis_frontend/commit/368d6576278505ddddde2a1ab160a0849e087c70))

### Features

- **ngw-kit:** add webmap item method to cotrol item children order ([4c4e95a](https://github.com/nextgis/nextgis_frontend/commit/4c4e95a146c4aeb3d5b5e7a1868ab17e5ff68c1c))
- **ngw-orm:** remove 3rd part libs to convers geom to wkt, use new ngw api ([01c8e21](https://github.com/nextgis/nextgis_frontend/commit/01c8e21321b041024584cdcb8c41998adddb3246))
- **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([430d51e](https://github.com/nextgis/nextgis_frontend/commit/430d51e7211c050ebeffd68b0c839d9a38170054))

### BREAKING CHANGES

- No more default export from `qms-kit`. You should replace `import QmsKit from "@nextgis/qms-kit"` to `import { QmsKit } from "@nextgis/qms-kit"` everywhere
- LayerAdapter option baseLayer was renamed to baselayer;
- webMap.getBaseLayers() method now return LayerAdapter, not string array of ids

# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)

### Bug Fixes

- **ngw-kit:** check company_logo in settings ([decf777](https://github.com/nextgis/nextgis_frontend/commit/decf777de5f30f27b15265808fa85c8529021cc1))
- **ngw-kit:** set correct options when add webmaplayeritem ([0c5cd08](https://github.com/nextgis/nextgis_frontend/commit/0c5cd08b62b46fabe88bc51c91f0616d1d8c4a25))
- **ngw-kit:** WebmapLayerItem ordering ([d4a0403](https://github.com/nextgis/nextgis_frontend/commit/d4a04038bc76257595d2eea618629a969ca9ca00))
- **vuetify:** NgwLayersList root item hide ([abba8cb](https://github.com/nextgis/nextgis_frontend/commit/abba8cbd8a46697ba37a768bd2576086591c344c))

### Features

- **cesium:** update layer and map adapter ([c9d6a1d](https://github.com/nextgis/nextgis_frontend/commit/c9d6a1db8874586adb5ae1901153e71313aa776b))
- **ngw-kit:** add ngw basemap suppor for url ([958303e](https://github.com/nextgis/nextgis_frontend/commit/958303eed8753d18a8c8d60b72a338c1656388f6))
- **ngw-kit:** add NgwKit.utils.getCompanyLogo method ([3c6fa09](https://github.com/nextgis/nextgis_frontend/commit/3c6fa09321c0e979543b50b93c32da8725920d28))
- **ngw-kit:** add tmsclient_layer adapter class support ([87b5976](https://github.com/nextgis/nextgis_frontend/commit/87b59760a574ffc66b1aec1d2df3af301efe1326))

### wip

- rename VectorLayerAdapterType ([89a2c83](https://github.com/nextgis/nextgis_frontend/commit/89a2c83135e839f3eec373f93e5df777a7b81325))

### BREAKING CHANGES

- rename VectorLayerAdapter types: circle > point; fill > polygon

# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)

### Bug Fixes

- **ngw-kit:** create async adapter from parent resource ([808572b](https://github.com/nextgis/nextgis_frontend/commit/808572b5aff6b04783cd7e9edd078e2ea5404dd2))
- **ngw-kit:** resolve createGeoJsonAdapter options override II ([c65f1ee](https://github.com/nextgis/nextgis_frontend/commit/c65f1eeb2dd0974980c70455d142dba427081521))
- **ngw-kit:** webmapLayerItem options ([154d3b2](https://github.com/nextgis/nextgis_frontend/commit/154d3b201df153e9d17653fc4acd1fe8a2af9ebf))
- **nngw-kit:** resolve create geojson adapter options override ([fba851e](https://github.com/nextgis/nextgis_frontend/commit/fba851effec4402565c8c3b31ce1eaba2b0b590f))
- **webmap:** add check for fitBounds extent ([c78ab3e](https://github.com/nextgis/nextgis_frontend/commit/c78ab3e900f3e069401fb23b5b7646aa5cbc8e7f))
- **webmap:** addLayer adapter options set ([2d24a53](https://github.com/nextgis/nextgis_frontend/commit/2d24a5387634bbccb79875186cc7a9cf090291f2))

### Features

- **cesium:** fitBounds up tp terrain ([e890d9b](https://github.com/nextgis/nextgis_frontend/commit/e890d9b5ce449dc69c8b531c33b9ce6cb58b10b4))
- **ngw-kit:** add addLayerOptionsPriority for createGeoJsonAdapter ([f6c563e](https://github.com/nextgis/nextgis_frontend/commit/f6c563e1bc1238206bb4ba3d8081971d078ef54d))
- **ngw-kit:** add baselayers from webmap; vuetify BaseLayerSelect ([74c0749](https://github.com/nextgis/nextgis_frontend/commit/74c074929c7da864a9097fc8176825894555e0a3))
- **ngw-kit:** add feature to getIdentifyItems ([9641c8e](https://github.com/nextgis/nextgis_frontend/commit/9641c8e8b0e67ece7186ba8a6803d109e6503afd))
- **ngw-kit:** make create basemap layer adapter universal ([bbd8c9a](https://github.com/nextgis/nextgis_frontend/commit/bbd8c9a77d527921909ae9b1bf10b3580c5fa600))
- **ngw-map:** add ngw layer from resource item object ([18fb9e1](https://github.com/nextgis/nextgis_frontend/commit/18fb9e105fe733b8e1e5736cfb3afeb8e5b9e84c))
- **webmap:** layer adapter waitFullLoad and crossOrigin new options ([08c6b82](https://github.com/nextgis/nextgis_frontend/commit/08c6b827f6a3e5728d8b17a9c305f32cd2b28039))

### BREAKING CHANGES

- **ngw-kit:** rename NgwKit.utils.getIdentifyGeoJsonParams > NgwKit.utils.getIdentifyItems

## [0.30.2](https://github.com/nextgis/nextgis_frontend/compare/v0.30.1...v0.30.2) (2020-04-30)

### Bug Fixes

- **ngw-kit:** return raster_layer resource support ([76a435f](https://github.com/nextgis/nextgis_frontend/commit/76a435fb43d82ea8be616347010a8bd1214f106b))

## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)

### Bug Fixes

- **vue:** selection for items with properties and tree ([e2f72df](https://github.com/nextgis/nextgis_frontend/commit/e2f72df0c1800e7595c7e3e8342f15841f897eea))
- **webmap:** get layers method only string keys ([e0182c9](https://github.com/nextgis/nextgis_frontend/commit/e0182c95c81f5b76605f569bcbf2826937909889))

### Features

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

**Note:** Version bump only for package @nextgis/ngw-kit

## [0.29.10](https://github.com/nextgis/nextgis_frontend/compare/v0.29.9...v0.29.10) (2020-04-17)

### Bug Fixes

- **ngw-kit:** no load date for geojson layer if data ([4faf698](https://github.com/nextgis/nextgis_frontend/commit/4faf6988e39509af2cb8e03725741d4e0b00ad55))

## [0.29.6](https://github.com/nextgis/nextgis_frontend/compare/v0.29.5...v0.29.6) (2020-04-16)

**Note:** Version bump only for package @nextgis/ngw-kit

## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)

### Bug Fixes

- **ngw:** create async adapter for webmap ([40aeb07](https://github.com/nextgis/nextgis_frontend/commit/40aeb07f4ddce2462ea82b30f8b91009535e8531))

## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)

### Bug Fixes

- **ngw:** return support for vector layer adapter ([25f19ae](https://github.com/nextgis/nextgis_frontend/commit/25f19aef91ed361a7fc2fe96123fa4f5833df755))

## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

**Note:** Version bump only for package @nextgis/ngw-kit

## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

**Note:** Version bump only for package @nextgis/ngw-kit

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
- **ngw:** get geojson request options ([015cffc](https://github.com/nextgis/nextgis_frontend/commit/015cffc415b272f0dace009e192ef7986c699138))
- **ngw-kit:** order_by param ([dd161fc](https://github.com/nextgis/nextgis_frontend/commit/dd161fc8d3536fe733f2c21427f897ae4d44f60f))

### Features

- **ngw:** option to create popup content from item ([3c4a809](https://github.com/nextgis/nextgis_frontend/commit/3c4a809dc7cd9045e3ed1622b1eea0036e5205a1))

## [0.28.1](https://github.com/nextgis/nextgis_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package @nextgis/ngw-kit

# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)

### Features

- add library `@nextgis/properties-filter` ([0902366](https://github.com/nextgis/nextgis_frontend/commit/09023669c963ddb4e0a319400397e5f320620573))

### BREAKING CHANGES

- `propertiesFilter` removed from `@nextgis/utils`

## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)

### Features

- add library cancelable-promise ([5227983](https://github.com/nextgis/nextgis_frontend/commit/5227983e03b0a5aa5807002f63914fa2d23154b0))
- new @nextgis/dom library ([82a645d](https://github.com/nextgis/nextgis_frontend/commit/82a645d213d0b9ef1bb3c443dc28a94866c2884b))
- **cesium:** add mapAdapter listeners and getBounds method ([3033475](https://github.com/nextgis/nextgis_frontend/commit/3033475bc1cc519efe08f18e9e741750d35a0f25))

# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)

### Features

- **ngw-kit:** add bbox strategy for large vector layer ([da6533b](https://github.com/nextgis/nextgis_frontend/commit/da6533b76eaf5184114ac233fa275d2398cfdf5b))

### Performance Improvements

- **ngw-kit:** geojson adapter not blocked on data load ([1ceaf76](https://github.com/nextgis/nextgis_frontend/commit/1ceaf7688b9911727de5fa1b6fde9ae1f6b3da9e))

# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)

### Features

- add WmsLayerAdapter ([c57b66d](https://github.com/nextgis/nextgis_frontend/commit/c57b66d2278071a57182cb4dd554e370c63ffa06))

## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/ngw-kit

## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

**Note:** Version bump only for package @nextgis/ngw-kit

## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)

### Bug Fixes

- **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgis_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))

### Features

- **ngw:** add support for `qgis_raster_style` ([959e901](https://github.com/nextgis/nextgis_frontend/commit/959e9014364947acbbbe768157d8cb5ab6d0c3ba))
- **ngw:** conditions and nesting for filtering ngw feature layer ([bc7cc34](https://github.com/nextgis/nextgis_frontend/commit/bc7cc344d83d1769476e28cb87d595a9d25d0ebd))
- **ngw-kit:** new addNgwLayer resource option for keyname or resourceId ([f1eefd2](https://github.com/nextgis/nextgis_frontend/commit/f1eefd2703dc16126ef4b0a933a86b9a34d594a7))
- **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgis_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))
- **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([b9dcb88](https://github.com/nextgis/nextgis_frontend/commit/b9dcb880140480b3557cde7bb91e761741889bf5))
- **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgis_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))

### wip

- **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgis_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))

### BREAKING CHANGES

- **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'

## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)

### Features

- **ngw-kit:** new addNgwLayer resource option for keyname or resourceId ([f1eefd2](https://github.com/nextgis/nextgis_frontend/commit/f1eefd2703dc16126ef4b0a933a86b9a34d594a7))

## [0.25.4](https://github.com/nextgis/nextgis_frontend/compare/v0.25.3...v0.25.4) (2020-02-07)

### wip

- **util:** move CancelablePromise to util ([6f7f24c](https://github.com/nextgis/nextgis_frontend/commit/6f7f24c8c3046731b35bae28de20ab6452dbb9c8))

### BREAKING CHANGES

- **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'

## [0.25.3](https://github.com/nextgis/nextgis_frontend/compare/v0.25.2...v0.25.3) (2020-02-07)

### Features

- **ngw:** conditions and nesting for filtering ngw feature layer ([bc7cc34](https://github.com/nextgis/nextgis_frontend/commit/bc7cc344d83d1769476e28cb87d595a9d25d0ebd))
- **util:** create typeHelpers utils ([14ad5ec](https://github.com/nextgis/nextgis_frontend/commit/14ad5ecdfec47aae2e8e5ae6cd78871ff10d2a92))

## [0.25.2](https://github.com/nextgis/nextgis_frontend/compare/v0.25.1...v0.25.2) (2020-02-05)

**Note:** Version bump only for package @nextgis/ngw-kit

## [0.25.1](https://github.com/nextgis/nextgis_frontend/compare/v0.25.0...v0.25.1) (2020-02-05)

**Note:** Version bump only for package @nextgis/ngw-kit

# [0.25.0](https://github.com/nextgis/nextgis_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)

### Bug Fixes

- **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgis_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))

### Features

- **ngw:** add support for `qgis_raster_style` ([959e901](https://github.com/nextgis/nextgis_frontend/commit/959e9014364947acbbbe768157d8cb5ab6d0c3ba))
- **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgis_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))
