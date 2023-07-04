# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.16.9](https://github.com/nextgis/nextgisweb_frontend/compare/v1.16.8...v1.16.9) (2023-07-04)


### Features

* **webmap:** do not use tilejson min max zoom settings for map ([ca4094c](https://github.com/nextgis/nextgisweb_frontend/commit/ca4094cebad3feb20b3791bdc69742e456685f97))





## 1.16.8 (2023-05-14)


### Bug Fixes

* **build:** control-container extract css ([a02d24b](https://github.com/nextgis/nextgisweb_frontend/commit/a02d24bf2dbe246420803d5d1be9348e4b647c6d))
* **build:** fix item index.js error ([504013e](https://github.com/nextgis/nextgisweb_frontend/commit/504013e3db832138b72f6a6359175e771e937693))
* **cancelable-promise:** do not cancel already complate promise ([f32db82](https://github.com/nextgis/nextgisweb_frontend/commit/f32db820a4a818c92187dbcb07889011d04078d8))
* **cancelable-promise:** handle error for CancelablePromise.all ([0929761](https://github.com/nextgis/nextgisweb_frontend/commit/0929761d8a70ed14fa54daadb664c1337b260edd))
* **cesium-map-adapter:** extent from bounding sphere ([65b592a](https://github.com/nextgis/nextgisweb_frontend/commit/65b592a46b8404ba301867497e3e7f7535f77e83))
* **cesium-map-adapter:** set layer adapters request headers ([38074ba](https://github.com/nextgis/nextgisweb_frontend/commit/38074ba672e67a635f6c1ea7e30f7de5489a0af3))
* **cesium-map-adapter:** update geojson adapter ([40d877f](https://github.com/nextgis/nextgisweb_frontend/commit/40d877ffb72dc7f3bcbcb963d1e87f7bb5937748))
* **cesium:** add check for telset3d adapter addLayer ([3642e69](https://github.com/nextgis/nextgisweb_frontend/commit/3642e69575a4287823cd72bee569b0c9a6089eda))
* **cesium:** cesium geojson layer style ([27f4cbe](https://github.com/nextgis/nextgisweb_frontend/commit/27f4cbe3db804f6066d955b7cbf25f6f37daa7eb))
* **cesium:** change geojson extrude height set ([b00bf53](https://github.com/nextgis/nextgisweb_frontend/commit/b00bf534bba84a03ef7a38eb2011746bf9b81ec4))
* **cesium:** disable zoom undergroung ([2455e38](https://github.com/nextgis/nextgisweb_frontend/commit/2455e3807feb242d5317c219be23eb0455d3d156))
* **cesium:** do not clamp to ground 3d geojson ([121587b](https://github.com/nextgis/nextgisweb_frontend/commit/121587b7e09d44d498f6d47f304bbec3cea6a0e4))
* **cesium:** empty default imagery provider ([17396f8](https://github.com/nextgis/nextgisweb_frontend/commit/17396f843f72ac5f6629ec82d53748c259754a0b))
* **cesium:** fitBounds for not Scene3D modes ([8fbe25c](https://github.com/nextgis/nextgisweb_frontend/commit/8fbe25ca260abbac21278c574dc87f85cfe9c8ab))
* **cesium:** fix Tilset3D setHeight ([2f93801](https://github.com/nextgis/nextgisweb_frontend/commit/2f93801a559933f9472067553b7d02d857a38c50))
* **cesium:** geojson terrainsample ([deb790c](https://github.com/nextgis/nextgisweb_frontend/commit/deb790cef81f620eeef4cca9a0398fa37fb6f99b))
* **cesium:** GeoJsonAdapter pin color from empty string ([ff9a390](https://github.com/nextgis/nextgisweb_frontend/commit/ff9a390a60c9f8ba3bfbe4b9816849f8ab267c08))
* **cesium:** remove default imagery provider ([2ee228d](https://github.com/nextgis/nextgisweb_frontend/commit/2ee228d456a0305b6b5eebc8bd2a3cba9f1187db))
* **cesium:** scene requestRender on layers visibility change ([dd0dee5](https://github.com/nextgis/nextgisweb_frontend/commit/dd0dee562575fb38eda2eca347bab27072b21e93))
* **cesium:** TileAdapter baselayer ordering ([9318a37](https://github.com/nextgis/nextgisweb_frontend/commit/9318a3780105ac8d4ea8ed6673288ff3d5385dde))
* **cesium:** TileLayer ordering ([45c6fc3](https://github.com/nextgis/nextgisweb_frontend/commit/45c6fc334f6ceb5a12c671c73e13210bdfd51a46))
* **cesium:** Tileset#DAdapter set terrain height ([4245446](https://github.com/nextgis/nextgisweb_frontend/commit/42454467846f2f5b0aaab5c2a74178acc7ae1e37))
* **cesium:** Tilset3D adapter paint ([bb71211](https://github.com/nextgis/nextgisweb_frontend/commit/bb712116bd59a59d268057bf155680db55bacd5a))
* **control-container:** style url ([af64c52](https://github.com/nextgis/nextgisweb_frontend/commit/af64c5252d1f31e2333bb8dd672f1c0fa32df381))
* **demo:** import utils from cdn ([e4db110](https://github.com/nextgis/nextgisweb_frontend/commit/e4db110229976ada8abe6b35203f9a7b86411551))
* **demo:** remove layer id from ngw properties filter example ([a47dba9](https://github.com/nextgis/nextgisweb_frontend/commit/a47dba976b80822bd92ae20a9952b140f4fa18ec))
* **demo:** show codepen icon ([8d610ea](https://github.com/nextgis/nextgisweb_frontend/commit/8d610ead66c47a0d996587337f25c03551b39cde))
* **examples:** check paint opacity is number ([1fcc9a9](https://github.com/nextgis/nextgisweb_frontend/commit/1fcc9a9bd033d53d21dab0956335bde51b73e61c))
* **examples:** rapair examples ([42a770e](https://github.com/nextgis/nextgisweb_frontend/commit/42a770e124a30a2670a620fb24f74da12251cb1c))
* **examples:** set type for ngw_resource highlight layer ([ec0ab5e](https://github.com/nextgis/nextgisweb_frontend/commit/ec0ab5efe1dc04a7b898f2f7e3af54067bcff969))
* improve node/browser splitting ([b5312bb](https://github.com/nextgis/nextgisweb_frontend/commit/b5312bbb2b8dde4c9d63d4450c98ca544cdc3318))
* **item:** protect tree children arrays from modiffy ([12f3fa1](https://github.com/nextgis/nextgisweb_frontend/commit/12f3fa115df21bf829102add2a74c2bf9b434704))
* **leafelet-map-adapter:** safe make remote options ([c84e1ae](https://github.com/nextgis/nextgisweb_frontend/commit/c84e1ae4414a4d2e2d23e04bd4e6eeab2da6dcb2))
* **leafelt-map-adapter:** selected layer click event param ([aab6ed5](https://github.com/nextgis/nextgisweb_frontend/commit/aab6ed56037fc132f5b421206ac78ad626a7b3e9))
* **leaflet-map-adapter:** add getBounds validation ([cbbfcde](https://github.com/nextgis/nextgisweb_frontend/commit/cbbfcde5f61ba8c56cf5a53a71a90da31126b5d2))
* **leaflet-map-adapter:** fix BaseAdapter pane zIndex set ([bd26273](https://github.com/nextgis/nextgisweb_frontend/commit/bd262733470962e77612e152bbaf9f5d95d3f2ab))
* **leaflet-map-adapter:** geojson selection ([d260db5](https://github.com/nextgis/nextgisweb_frontend/commit/d260db579912644fdb641a72e930df3575df566b))
* **leaflet-map-adapter:** init center option ([32793bf](https://github.com/nextgis/nextgisweb_frontend/commit/32793bf237c404232cf4056ab9f6ec35eeb73d12))
* **leaflet-map-adapter:** maxBounds hotfix ([7e51591](https://github.com/nextgis/nextgisweb_frontend/commit/7e5159150552826907ec6119007b690d834d5a0e))
* **leaflet-map-adapter:** popup content height ([1ff49ca](https://github.com/nextgis/nextgisweb_frontend/commit/1ff49ca467183f14f75e607a9eb06a6b28980eec))
* **leaflet-map-adapter:** repain unSelectOnSecondClick ([1460de0](https://github.com/nextgis/nextgisweb_frontend/commit/1460de0c7e8fa671ff3a2c0e7dd47e4a6cd18954))
* **leaflet-map-adapter:** resolve geojson adapter layerdefinition problem ([a1918e6](https://github.com/nextgis/nextgisweb_frontend/commit/a1918e6fef02a061102b70b1e5bd8b0db40c32b6))
* **leaflet-map-adapter:** return zero from getZoom ([4dfbcfb](https://github.com/nextgis/nextgisweb_frontend/commit/4dfbcfb3fe8fe0e359d1fd27385729b6b64c475c))
* **leaflet:** RemoteTileLayer mixin removeTile method ([b285a72](https://github.com/nextgis/nextgisweb_frontend/commit/b285a720981910f32eb82a99b95384ba1b351b4a))
* **leaflet:** remove forgotten console logs ([f02b571](https://github.com/nextgis/nextgisweb_frontend/commit/f02b57198108f86a8869ba4e46fd28224808d1f5))
* **mapbox-gl-js:** fix for babel build ([7caf5b9](https://github.com/nextgis/nextgisweb_frontend/commit/7caf5b9602876b9740f089fbb6db637e43e6de7e))
* **mapbox-map-adapter:** change osm adapter url ([d99a2ba](https://github.com/nextgis/nextgisweb_frontend/commit/d99a2ba150b4c5c08466973bae8b7597b90b867a))
* **mapbox-map-adapter:** point paint stroke color ([4970102](https://github.com/nextgis/nextgisweb_frontend/commit/4970102b6b494e1bcdee76a2e0f39013c93aad28))
* **mapbox-map-adapter:** popup on hover ([c8ac81b](https://github.com/nextgis/nextgisweb_frontend/commit/c8ac81b69f6f224ca9d2d664de49a7f76af22fd7))
* **mapbox-map-adapter:** remove type prop frm native paint ([1e09101](https://github.com/nextgis/nextgisweb_frontend/commit/1e09101b644a32a12a804a74700ea5424b96a748))
* **mapbox-map-adapter:** show label not only for filtered layer ([0fde977](https://github.com/nextgis/nextgisweb_frontend/commit/0fde97772541f7c2c45f445e64fd6163e5af4e8e))
* **mapbox:** beforeRemove check for map exist ([3daebb0](https://github.com/nextgis/nextgisweb_frontend/commit/3daebb06389a587557861906d3202b795f07c8e4))
* **mapbox:** disable mapbox image layer ([e30c9bb](https://github.com/nextgis/nextgisweb_frontend/commit/e30c9bb13a8fb780df69ffa9578652100051ba77))
* **mapbox:** fix geojson adapter clean method ([3363237](https://github.com/nextgis/nextgisweb_frontend/commit/33632377d0da60bafd807326a2b3aa7158a1c484))
* **mapbox:** geojson adapter select ([8975ef3](https://github.com/nextgis/nextgisweb_frontend/commit/8975ef3d664c63561942bc58d5229a80ce008f2e))
* **mapbox:** geojson getFeatures method return whole source data ([adc92f9](https://github.com/nextgis/nextgisweb_frontend/commit/adc92f9c6846e183d8b4d5679a147e5965b38b41))
* **mapbox:** geojson getSelected method ([5e9044c](https://github.com/nextgis/nextgisweb_frontend/commit/5e9044cb0a5479de8e8abbaca437289a6e7a2013))
* **mapbox:** geojson layer selection with nativeFilter option ([893305c](https://github.com/nextgis/nextgisweb_frontend/commit/893305ca09272ef5876eafa829115a5a58e048f0))
* **mapboxgl-map-adapter:** clean popup on vectorlayer remove ([2af88cf](https://github.com/nextgis/nextgisweb_frontend/commit/2af88cfbbb2f450dd858a43dd459595b6412604e))
* **mapboxgl-map-adapter:** disable unselect on label hover out ([0fcdf35](https://github.com/nextgis/nextgisweb_frontend/commit/0fcdf3535a09abdf73a1c22f0ae996d0312ada54))
* **mapboxgl-map-adapter:** fix onSelect event ([4391a8b](https://github.com/nextgis/nextgisweb_frontend/commit/4391a8b3060f7828750676f172b65571bc7291f1))
* **mapboxgl-map-adapter:** geojson addlayer protected methods ([af07060](https://github.com/nextgis/nextgisweb_frontend/commit/af0706024a5427e44a45bd5fc5d22fe7013eeee8))
* **mapboxgl-map-adapter:** parse mapAdapterOptions ([6a7a748](https://github.com/nextgis/nextgisweb_frontend/commit/6a7a7482e0fd8f8d47d63521b84eaeec65cc331d))
* **mapboxgl-map-adapter:** remove image source on layer remove ([b5e2001](https://github.com/nextgis/nextgisweb_frontend/commit/b5e2001c9438d7ba248207022ffbd5ca7e28185b))
* **mapboxgl-map-adapter:** repair unselectOnSecondClick ([997c596](https://github.com/nextgis/nextgisweb_frontend/commit/997c596fcb418b78eabb80299429ab4b7e3f00b2))
* **mapboxgl-map-adapter:** select features by propertiesfilter improve ([c41bb2a](https://github.com/nextgis/nextgisweb_frontend/commit/c41bb2a1d16746c6eb2db000c1aee916c10d87b6))
* **mapbox:** propertyFilter for selected vector data ([05d94a8](https://github.com/nextgis/nextgisweb_frontend/commit/05d94a826db91351478adcd58880ef87f09ce026))
* **mapbox:** right selected event order call ([08859e5](https://github.com/nextgis/nextgisweb_frontend/commit/08859e575c6562b9028970c614b896fbe6d9f242))
* **mapbox:** set transformRequest option only then map is loaded ([9911365](https://github.com/nextgis/nextgisweb_frontend/commit/9911365fe11575707adea8195a15f0b9289fd184))
* **mapbox:** transformRequests hotfix ([762b294](https://github.com/nextgis/nextgisweb_frontend/commit/762b2941f4ad78a9980be5bf2e41a4e0ac3a30cb))
* **mapbxo:** resolve geojson selection-filter conflict ([b1b8744](https://github.com/nextgis/nextgisweb_frontend/commit/b1b8744e424625c81da7b876f04062b87dc2a78a))
* **ngw-connector:** clean cache on resource delete ([7fc716c](https://github.com/nextgis/nextgisweb_frontend/commit/7fc716cba13ea964cef8e23d19ab7577b1b6b86a))
* **ngw-connector:** disable request params list convert to object ([64b10e8](https://github.com/nextgis/nextgisweb_frontend/commit/64b10e844281a38585f3c9a870c751a44600c195))
* **ngw-connector:** do not create new instance on same url and auth ([444b745](https://github.com/nextgis/nextgisweb_frontend/commit/444b745f021669e7ff056c5c7dd3c4f43c1c46dd))
* **ngw-connector:** do not throw error on node data load6 use promise reject ([3222e01](https://github.com/nextgis/nextgisweb_frontend/commit/3222e01be3d51db0961fe927d35a7da2d998e0cf))
* **ngw-connector:** fixes to apiRequest cancel work ([e4451d8](https://github.com/nextgis/nextgisweb_frontend/commit/e4451d8a7ad349ba17692a3f906677f1a29bf691)), closes [#6](https://github.com/nextgis/nextgisweb_frontend/issues/6)
* **ngw-connector:** get resource children resourceId zero check ([d680b01](https://github.com/nextgis/nextgisweb_frontend/commit/d680b019d49765fe323bf31c5a6c08aa86da3d0b))
* **ngw-connector:** getResource cache when keyname ([1c6ff6e](https://github.com/nextgis/nextgisweb_frontend/commit/1c6ff6ed4866e04d07165372792d7d0005597995))
* **ngw-connector:** getResourceByKeyname cache ([78262a7](https://github.com/nextgis/nextgisweb_frontend/commit/78262a7e3abd230f1ac35d53c49a67d5a869a679))
* **ngw-connector:** improve compatibility with Node ([7fdec8d](https://github.com/nextgis/nextgisweb_frontend/commit/7fdec8d92e4604a5cc89e74855df8a999a8cb64f))
* **ngw-connector:** improve for node ([def5cea](https://github.com/nextgis/nextgisweb_frontend/commit/def5cea9c75de32bdd8e1ab0826e832159dbe3c4))
* **ngw-connector:** improve node/browser separation ([4ff2ef8](https://github.com/nextgis/nextgisweb_frontend/commit/4ff2ef8de6bc59bc2806744a443e01c859d5e8ec))
* **ngw-connector:** make login on connect ([7850a14](https://github.com/nextgis/nextgisweb_frontend/commit/7850a1417b3d80348b014b0dd0972584ffb91c78))
* **ngw-connector:** node request write data for no POST mode ([abf9f63](https://github.com/nextgis/nextgisweb_frontend/commit/abf9f63f66b4ad6c3753fe0659bf1c33b63d5f90))
* **ngw-connector:** remove caching for update put request ([8ff88ae](https://github.com/nextgis/nextgisweb_frontend/commit/8ff88aee98a7d3307b99867ff7f3f3827ef9b88e))
* **ngw-connector:** remove requestControl ([b1ccdfa](https://github.com/nextgis/nextgisweb_frontend/commit/b1ccdfacefff0ff89be4c8b32b37978c321d815a))
* **ngw-connector:** retunr undefined on empty apiRequest ([cb05fb0](https://github.com/nextgis/nextgisweb_frontend/commit/cb05fb099e3e051764a3039952bb9beb75d03aa0))
* **ngw-connector:** update error response status code list ([19da260](https://github.com/nextgis/nextgisweb_frontend/commit/19da26068982e5a9ade2c1db1604f1e58e09e31e))
* **ngw-connector:** use `this` in fabric method ([3904583](https://github.com/nextgis/nextgisweb_frontend/commit/3904583a33a6aa4904d9621ed6b03312007d02b4))
* **ngw-connect:** properly abort request on cancel ([a2193b7](https://github.com/nextgis/nextgisweb_frontend/commit/a2193b78c4d24b663b8850946b05712bce1046c4))
* **ngw-connect:** remove unnecessary console log ([4c3148e](https://github.com/nextgis/nextgisweb_frontend/commit/4c3148e3fc5385970f9572907de01baf8f2766b6))
* **ngw-kit:** check company_logo in settings ([cb4ba04](https://github.com/nextgis/nextgisweb_frontend/commit/cb4ba041419a94912977b7dbefd2c68ef1a4710e))
* **ngw-kit:** clean layer adapter options ([d4a0ab6](https://github.com/nextgis/nextgisweb_frontend/commit/d4a0ab671505c6b7f4561ef46b4d5921d310add2))
* **ngw-kit:** create async adapter from parent resource ([5ce6394](https://github.com/nextgis/nextgisweb_frontend/commit/5ce6394c4d9313c79f6d540df0b1683648a6af83))
* **ngw-kit:** createGeojsonAdapter propertiesFilter ([06c109f](https://github.com/nextgis/nextgisweb_frontend/commit/06c109fd4ddae20db91b15fbb7c5e7d2909aaf76))
* **ngw-kit:** do not load BBOX out of min-max zoom range ([a029ca0](https://github.com/nextgis/nextgisweb_frontend/commit/a029ca04228998da050e47d337678b223eb86715))
* **ngw-kit:** do not reassign getExtent for geojson layer ([feca330](https://github.com/nextgis/nextgisweb_frontend/commit/feca330c45fd6f96ba7d2a7bb2f6d34a47de0dba))
* **ngw-kit:** duplication of the server filter by the client ([aaa9d2d](https://github.com/nextgis/nextgisweb_frontend/commit/aaa9d2d00c626504d94ceb0fd7e50b2fe526a9ff))
* **ngw-kit:** editing for a new layer visibility standard ([2e94979](https://github.com/nextgis/nextgisweb_frontend/commit/2e94979bb7d81dbe943a8d57c9c07a2decd732f1))
* **ngw-kit:** fetchNgwLayerItems client filter ([2574448](https://github.com/nextgis/nextgisweb_frontend/commit/25744487b8b709234764138b85c9c341632b0cc6))
* **ngw-kit:** fix addNgwLayer resource options ([e2e37d4](https://github.com/nextgis/nextgisweb_frontend/commit/e2e37d4f48718afbdc0619eb43e46c49b636359a))
* **ngw-kit:** fix emppty identify geometry ([f8e85af](https://github.com/nextgis/nextgisweb_frontend/commit/f8e85af95d68f7b5cd110f8bdc72ea4369f62934))
* **ngw-kit:** fix like and ilike filter requests ([2ddb8ff](https://github.com/nextgis/nextgisweb_frontend/commit/2ddb8ffc15c78578d4145c16daaec9244468385e))
* **ngw-kit:** getIdentifyItems multiple ([36381d5](https://github.com/nextgis/nextgisweb_frontend/commit/36381d53e761a20ac1ef51f0b1d79f9ee72edf38))
* **ngw-kit:** inject item into the createRasterAdapter class factory ([ea08e3e](https://github.com/nextgis/nextgisweb_frontend/commit/ea08e3e01ce7f92b3b9b7c66164d61fe334e9e72))
* **ngw-kit:** insert headers into createOnFirstShowAdapter addLayer method ([355531e](https://github.com/nextgis/nextgisweb_frontend/commit/355531eaace44c943d7f481b585ea2f18e133cfa))
* **ngw-kit:** make async onFirstShowAdapter hide and show methods ([502b261](https://github.com/nextgis/nextgisweb_frontend/commit/502b261b478872aed0bed0657b961481c22ce109))
* **ngw-kit:** ngw webmap item childrensafe reverse ([b790e3a](https://github.com/nextgis/nextgisweb_frontend/commit/b790e3a244e3205fc64561d30b5572b3dce0fada))
* **ngw-kit:** ngw webmap items layer order ([c5dad6b](https://github.com/nextgis/nextgisweb_frontend/commit/c5dad6b1db927b7ff30da21f752c4a1d1786b70e))
* **ngw-kit:** ngw-webmap tree sublevel order ([fff0dac](https://github.com/nextgis/nextgisweb_frontend/commit/fff0dac04a7f1a8519828da42685130e015e5c90))
* **ngw-kit:** NgwWebmapItem max min zoom calculate ([7e0af25](https://github.com/nextgis/nextgisweb_frontend/commit/7e0af255ca51b7fd37b72b01d76949552cd82db4))
* **ngw-kit:** NgwWebmapLayerAdapter constuctor options ([8129ca8](https://github.com/nextgis/nextgisweb_frontend/commit/8129ca82ca94b714976aa5c08d3141116484929d))
* **ngw-kit:** NgwWebMapLayerAdapter exent constrained ([f86d804](https://github.com/nextgis/nextgisweb_frontend/commit/f86d804df70d636ab01bdd70b884f833d46d5160))
* **ngw-kit:** no load date for geojson layer if data ([40968e0](https://github.com/nextgis/nextgisweb_frontend/commit/40968e0b054f379d4494975e9426b83bf60daa9b))
* **ngw-kit:** not identify for not supported layer ([c7f710f](https://github.com/nextgis/nextgisweb_frontend/commit/c7f710f0402e9b0bf035de9dee833d9289c3e13c))
* **ngw-kit:** not stringify null on save ngw feature ([b99bcf3](https://github.com/nextgis/nextgisweb_frontend/commit/b99bcf367efd6e49c140701f9a9ba409f947164c))
* **ngw-kit:** on first adapter wait while show layer ([77ee936](https://github.com/nextgis/nextgisweb_frontend/commit/77ee9360699d61b509c64586b3984a330b22eec5))
* **ngw-kit:** order_by param ([7ff4d29](https://github.com/nextgis/nextgisweb_frontend/commit/7ff4d29d783b906dee4f9f5c78e6b73d566641fe))
* **ngw-kit:** protect firstShowAdapter from multiple creation ([be8a0c5](https://github.com/nextgis/nextgisweb_frontend/commit/be8a0c588919202613d6acd04d6f82daff2b44d9))
* **ngw-kit:** remove async from NgwWebmapItem child add ([4b9a75f](https://github.com/nextgis/nextgisweb_frontend/commit/4b9a75f6ee64700992cd95b7b992265a0564aaed))
* **ngw-kit:** remove duplicates from a query with filter by ANY condition ([f689a21](https://github.com/nextgis/nextgisweb_frontend/commit/f689a2197c0e18efa27513d440485fa785c28f76))
* **ngw-kit:** remove forgotten log ([ae16ec6](https://github.com/nextgis/nextgisweb_frontend/commit/ae16ec6bcc1dc1fe5966fe86221526580033c059))
* **ngw-kit:** remove unresolved variable ([4299ad8](https://github.com/nextgis/nextgisweb_frontend/commit/4299ad85b9493d53d2d4bb8602a8b40de19220f0))
* **ngw-kit:** resolve createGeoJsonAdapter options override II ([c211843](https://github.com/nextgis/nextgisweb_frontend/commit/c211843d65daf40c506d641dca43ef8265745ead))
* **ngw-kit:** return raster_layer resource support ([1c93522](https://github.com/nextgis/nextgisweb_frontend/commit/1c9352250a97da68b3edda671e0a3cb3daa72c80))
* **ngw-kit:** set correct options when add webmaplayeritem ([dbf779b](https://github.com/nextgis/nextgisweb_frontend/commit/dbf779b67efa1f372ed51299123eb1c792378c72))
* **ngw-kit:** set image adapter default nd param ([758e3e1](https://github.com/nextgis/nextgisweb_frontend/commit/758e3e11192fd4c6569540dd47aec76ee753cc66))
* **ngw-kit:** set NgwWebmap tree item property before layer load ([5b9335e](https://github.com/nextgis/nextgisweb_frontend/commit/5b9335ecb097b8cacb77472ab4ffcaea27f8e3f9))
* **ngw-kit:** show only one enabled webmap basemap ([1087074](https://github.com/nextgis/nextgisweb_frontend/commit/10870746582396ed8f710ea07af1d45f1b517b5c))
* **ngw-kit:** webmap item children ordering ([cfb69b0](https://github.com/nextgis/nextgisweb_frontend/commit/cfb69b074bcfc9c817c671fc66c5a33c7da14996))
* **ngw-kit:** webmap iten async addLayer method ([21ee8ac](https://github.com/nextgis/nextgisweb_frontend/commit/21ee8ac0bed083a3a762f08f519d753d6dc32c38))
* **ngw-kit:** webmapLayerItem options ([d55b4d8](https://github.com/nextgis/nextgisweb_frontend/commit/d55b4d87c1d489b83e9afc000fa616c46c8ec28d))
* **ngw-kit:** WebmapLayerItem ordering ([5b53e44](https://github.com/nextgis/nextgisweb_frontend/commit/5b53e44f64870ef54843f3943ca3fcb7aa6dd632))
* **ngw-kit:** wms adapter layers options from adapterOptions ([eabe108](https://github.com/nextgis/nextgisweb_frontend/commit/eabe108162162f404c1b3a4da02203ab4cd32318))
* **ngw-map:** constructor options ([e6f5d44](https://github.com/nextgis/nextgisweb_frontend/commit/e6f5d4448ec3ed2435e3c804205ff91b80697f4b))
* **ngw-map:** constructor options for control ([9e71281](https://github.com/nextgis/nextgisweb_frontend/commit/9e71281139d0532e574e7f2bcfef68e819f90834))
* **ngw-map:** correct ngw:select event data for raster layer ([eac1535](https://github.com/nextgis/nextgisweb_frontend/commit/eac1535944446a8a6d818e930dc532ad82311b39))
* **ngw-map:** identify order ([bbb6a1c](https://github.com/nextgis/nextgisweb_frontend/commit/bbb6a1c7295dfcaf1146d976aa8ca87a81da1cde))
* **ngw-map:** not block when error on add qms layer ([f8035e2](https://github.com/nextgis/nextgisweb_frontend/commit/f8035e2f2cc63a471cfa5b57a9c841e8beabadad))
* **ngw-map:** return default map bounds ([4080d4a](https://github.com/nextgis/nextgisweb_frontend/commit/4080d4a51bbb9e3c6860d6b257ada14d0e46cc2b))
* **ngw-ol:** container style ([5d71e9e](https://github.com/nextgis/nextgisweb_frontend/commit/5d71e9ea1f63376e9c533d24eb45240a34c9e167))
* **ngw-ol:** layer min-max zoom options ([9985656](https://github.com/nextgis/nextgisweb_frontend/commit/998565639078e64cabf4fc3a54d16bea636a94b7))
* **ngw-orm:** remove console log ([ed3b937](https://github.com/nextgis/nextgisweb_frontend/commit/ed3b937b451ec5d4c9e15be785f88a0fd8e218df))
* **ngw-orm:** return sync resource ([d7dc600](https://github.com/nextgis/nextgisweb_frontend/commit/d7dc600ec95060dd124742f12542b22abfff5a7e))
* **ngw-orm:** vector resource geometry ([0bf7863](https://github.com/nextgis/nextgisweb_frontend/commit/0bf78638b19b2661d74c347ec257b45bbadd4e90))
* **ngw-uploader:** correct imports and sandbox url ([4d78e25](https://github.com/nextgis/nextgisweb_frontend/commit/4d78e25f758d4f4274c5914bd319e7e788e68d23))
* **ngw-uploader:** fix createGroup helper method ([7ed6a04](https://github.com/nextgis/nextgisweb_frontend/commit/7ed6a0455eeb17c4c0b6c330bbcc17bfff9df32a))
* **ngw-uploader:** fixUrlStr for tus uploader ([fcab54c](https://github.com/nextgis/nextgisweb_frontend/commit/fcab54c747c1393cfc11f95a9e854177ea75be91))
* **ngw-uploader:** unification of resource createion options ([0596e97](https://github.com/nextgis/nextgisweb_frontend/commit/0596e972ec9bdace8b43c36ecc9c4a09433d6162))
* **ngw-сщттусещк:** resource search query parent_id param ([a1079d4](https://github.com/nextgis/nextgisweb_frontend/commit/a1079d42219e4997840eb59cd7e413ccf785590b))
* **ngw:** create async adapter for webmap ([57e1a19](https://github.com/nextgis/nextgisweb_frontend/commit/57e1a19d9e33a585da28f945a96c36697f5b9395))
* **ngw:** get geojson request options ([f8e4c25](https://github.com/nextgis/nextgisweb_frontend/commit/f8e4c258cecd4f8294e51f07cee7d0e8b09d504a))
* **ngw:** ngw webmap resource ordering ([fb0e502](https://github.com/nextgis/nextgisweb_frontend/commit/fb0e5023c7f17e9b6200c1406081e5691a2941f5))
* **ngw:** return support for vector layer adapter ([f646919](https://github.com/nextgis/nextgisweb_frontend/commit/f646919d244b8e3e9017849116dafd0c45e31dcf))
* **nngw-kit:** resolve create geojson adapter options override ([a26c611](https://github.com/nextgis/nextgisweb_frontend/commit/a26c611fc046bb9bcd509c34d45b0bf9338d6537))
* **ol-map-adapter:** do not return nothing from poinermove cb ([9733170](https://github.com/nextgis/nextgisweb_frontend/commit/973317011e0fa486e4af558dace029e7834c840b))
* **ol-map-adapter:** geojson adapter layer remove ([8ec9df3](https://github.com/nextgis/nextgisweb_frontend/commit/8ec9df39941c4f1ccfbabfbe0ead2ec9138642bb))
* **ol-map-adapter:** geojson adapter style function type detection ([c71d83f](https://github.com/nextgis/nextgisweb_frontend/commit/c71d83f45822138428bdd4ebedbc67ecefaead9d))
* **ol-map-adapter:** geojson labelField only for string ([c23465b](https://github.com/nextgis/nextgisweb_frontend/commit/c23465bec5cf1f992cbb1edaf1b561b380a9e73c))
* **ol-map-adapter:** label type for geojson adapter ([2d45597](https://github.com/nextgis/nextgisweb_frontend/commit/2d45597bab4788af54facdaa17893b3f343a7bc6))
* **ol-map-adapter:** repair unselect on second click ([7fc2252](https://github.com/nextgis/nextgisweb_frontend/commit/7fc22521e07a281397f9e891c71038d0a96b7ac6))
* **ol:** css control fixes ([facf608](https://github.com/nextgis/nextgisweb_frontend/commit/facf608fa99064da1a3b817497b0317890b77915))
* **ol:** geojson label null field ([da60ffb](https://github.com/nextgis/nextgisweb_frontend/commit/da60ffbd7773ba6d0582a627e36b4476fc2c9d03))
* **ol:** no vector layer label for undefined property ([fd873e3](https://github.com/nextgis/nextgisweb_frontend/commit/fd873e3bc7a6d778bdbe73519c099553f4deb75c))
* **ol:** remove tileAdapter pixelratio option ([ad54406](https://github.com/nextgis/nextgisweb_frontend/commit/ad54406efed015c163dbc2889b4a9c0b819b5d3a))
* **properties-filte:** allow any chars for `like` and `ilike` search ([1d6ee0f](https://github.com/nextgis/nextgisweb_frontend/commit/1d6ee0ffc869b7633642eff760c413c813ba8701))
* **properties-filter:** add field type check for like\ilike filter ([d9d0489](https://github.com/nextgis/nextgisweb_frontend/commit/d9d0489fa5dcfb1b1ecd6232fac2d67ba661ac13))
* **properties-filter:** repair like and ilike operations ([d5eb13a](https://github.com/nextgis/nextgisweb_frontend/commit/d5eb13a7fa524ad81f547a0090c4a3ae4fb9b0c4))
* provide support for map preclick event ([c7b7f66](https://github.com/nextgis/nextgisweb_frontend/commit/c7b7f662f6e0507cf20fb8a43e4bb22547c9b18b)), closes [#8](https://github.com/nextgis/nextgisweb_frontend/issues/8)
* **qms-kit:** createQmsAdapter options ([04ccae9](https://github.com/nextgis/nextgisweb_frontend/commit/04ccae96a14796db00314a369f36c6f7ae40813c))
* **qms-kit:** mix layerAdapter class property ([502cdcf](https://github.com/nextgis/nextgisweb_frontend/commit/502cdcf87e40c09e8cbc31a322ab40872a813a98))
* **qms:** add createQmsAdapter options ([52e6ae1](https://github.com/nextgis/nextgisweb_frontend/commit/52e6ae182d8e8d4f8195b5f0ada15d8d258a1d55))
* remove require imports ([2674a8c](https://github.com/nextgis/nextgisweb_frontend/commit/2674a8ce29ef4116b939283ee1f4ec02b26b8025))
* rename Clipboard ([abfde3e](https://github.com/nextgis/nextgisweb_frontend/commit/abfde3ee02e7038dc106056c9458478c34e97464))
* replace emitter.of by emitter.removeListener ([a92b281](https://github.com/nextgis/nextgisweb_frontend/commit/a92b2810df7fae74bb58f50d6791a21bb4a4ef0e))
* **util:** arrayCompare typecasting ([80326b2](https://github.com/nextgis/nextgisweb_frontend/commit/80326b22e3ba78f9d33fe0006a1c5fbfe3751537))
* **utils:** applyMixin options on no replace ([904caa3](https://github.com/nextgis/nextgisweb_frontend/commit/904caa3c80a0bc96c7ac961ee70436052def1cfa))
* **utils:** fix objectDeepEqual function ([a70d626](https://github.com/nextgis/nextgisweb_frontend/commit/a70d62647d06b83a3497fb3f1dddc405903ac101))
* **utils:** function name typos ([2b86610](https://github.com/nextgis/nextgisweb_frontend/commit/2b86610669d0d1075008c0523af21159634e5f47))
* **utils:** update applyMixins util to allow babel build ([9905326](https://github.com/nextgis/nextgisweb_frontend/commit/99053262f9dc71236f1bcfa934fa5eb5d0072e71))
* **vue:** fix vue observable leaks ([53fcb88](https://github.com/nextgis/nextgisweb_frontend/commit/53fcb886ada33e8deddd40d7899cab76e48d47f6))
* **vue:** layer and control components ([a2da2df](https://github.com/nextgis/nextgisweb_frontend/commit/a2da2df66099cbd2ba3aaa2687d6a818c9fa245b))
* **vue:** NgwlayersList independent mode ([568cc1b](https://github.com/nextgis/nextgisweb_frontend/commit/568cc1b9ef3ab77ad1cdbdd9fdc4df0ce921a676))
* **vue:** NgwLayersList selection event ([be63e99](https://github.com/nextgis/nextgisweb_frontend/commit/be63e9999449acca6a9daf535fc2669c1e4e3299))
* **vue:** NgwlayersList visibility toggle ([1a85fc6](https://github.com/nextgis/nextgisweb_frontend/commit/1a85fc61cd49fc5d0d9474041d701512b993cc8b))
* **vue:** NgwLayersList webmap visibility ([90a5bc1](https://github.com/nextgis/nextgisweb_frontend/commit/90a5bc1647882f6c37a4e518fbca01f46f289368))
* **vue:** prop definition ([303dada](https://github.com/nextgis/nextgisweb_frontend/commit/303dada8e3478a5273e72abf90d6e357ee4ab57b))
* **vue:** saveselection of webmap in NgwLayersList ([1fe8c28](https://github.com/nextgis/nextgisweb_frontend/commit/1fe8c289d3b513ef2a0a85c23b6a4b5f028e3664))
* **vue:** selection for items with properties and tree ([23f0709](https://github.com/nextgis/nextgisweb_frontend/commit/23f0709c9a37e755d2a11828d8b4f3a7d955745d))
* **vue:** set types for VueNgwMap adapter components ([51361df](https://github.com/nextgis/nextgisweb_frontend/commit/51361dfd913174ec025f954aadbef9ad42302b31))
* **vuetify:** allow custom label slot for NgwLayersList ([e0b6e30](https://github.com/nextgis/nextgisweb_frontend/commit/e0b6e30b96eec6eb81e71f9b7ae239b38c8e9c4d))
* **vuetify:** correction for set empty BasemapSelect text ([7a5ac48](https://github.com/nextgis/nextgisweb_frontend/commit/7a5ac48724243c0c38b39a808561b222493bf9af))
* **vuetify:** improve BaselayerSelect ([76a047c](https://github.com/nextgis/nextgisweb_frontend/commit/76a047ce6bd4dfa591cd650a30e0f2648bd4b448))
* **vuetify:** NgwLayersList init select ([4b9cce0](https://github.com/nextgis/nextgisweb_frontend/commit/4b9cce04fe3b819a993a88bee47bad66592bd19a))
* **vuetify:** NgwLayersList root item hide ([73ab6d1](https://github.com/nextgis/nextgisweb_frontend/commit/73ab6d180444843b9ace2bb36d2b797950762806))
* **vuetify:** NgwLayersList visibility for webmap root item ([d092ba2](https://github.com/nextgis/nextgisweb_frontend/commit/d092ba21e949e46797b9ce9d60f88f1810ce1ca4))
* **vuetify:** pass $attrs from parent ([8ab3a36](https://github.com/nextgis/nextgisweb_frontend/commit/8ab3a36f609875a593739c5d9cb8de5abb0b7b28))
* **vuetify:** update items on init ([a153fd5](https://github.com/nextgis/nextgisweb_frontend/commit/a153fd5de0804e0b8e88f2a488c879883e033416))
* **vue:** VueNgwLeaflet default icons for FF ([f5bd704](https://github.com/nextgis/nextgisweb_frontend/commit/f5bd704ab7bec19807fa7fcdcd2c71cab4d991fd))
* **webmap:** add check for fitBounds extent ([3f9a746](https://github.com/nextgis/nextgisweb_frontend/commit/3f9a7464146006e234cf69091b35f2b21d4c0464))
* **webmap:** add check for layer exist on properties filter ([eb8ee91](https://github.com/nextgis/nextgisweb_frontend/commit/eb8ee9149fb4b1bb72c6eb2a6b0e662961430d3b))
* **webmap:** addLayer adapter options set ([1189513](https://github.com/nextgis/nextgisweb_frontend/commit/1189513b3e0651af0c088a22fac5c91c878f1a79))
* **webmap:** constructor options; move controls options from ngw to webmap ([5a3b582](https://github.com/nextgis/nextgisweb_frontend/commit/5a3b58209126a5b1e7a802ae8503129b11602512))
* **webmap:** disable experimental left and right control positions ([7658504](https://github.com/nextgis/nextgisweb_frontend/commit/765850439199c5bd6bc961245ba8558111513132))
* **webmap:** editing for new layer visibility standard ([960cba5](https://github.com/nextgis/nextgisweb_frontend/commit/960cba596dc1e13de0da23b5bcd79f7581af5834))
* **webmap:** get layers method only string keys ([a14017b](https://github.com/nextgis/nextgisweb_frontend/commit/a14017bdcba2fcc2989b4d7a2cbc1b393694e6b8))
* **webmap:** hide the rest when base layer showing ([4cd3950](https://github.com/nextgis/nextgisweb_frontend/commit/4cd3950c95fd5987819a206295ba6518023c7ff2))
* **webmap:** layer upadate is async ([c59fd21](https://github.com/nextgis/nextgisweb_frontend/commit/c59fd21a3f5a7cd7fa2d1c2c07b33eb3ed5a5214))
* **webmap:** not use ordering for layer id ([8c912df](https://github.com/nextgis/nextgisweb_frontend/commit/8c912df45f49107e3bbfd1dd686f92d25d84059b))
* **webmap:** remove addLayer dublicate id ([7cb8121](https://github.com/nextgis/nextgisweb_frontend/commit/7cb812136d3941b43094345fdaf4b6672f25ca96))
* **webmap:** set zero zoom ([fe61b84](https://github.com/nextgis/nextgisweb_frontend/commit/fe61b846f95534a657a23d8fa883ac1ac4a13d94))
* **webmap:** toggle layer visibility ([11147de](https://github.com/nextgis/nextgisweb_frontend/commit/11147de06463fa9ec77dac7ff3057253335dada9))
* **webmap:** webmap constructor options ([e096e72](https://github.com/nextgis/nextgisweb_frontend/commit/e096e723d76b8db753ecdd0248b601f24fcb5026))
* **webmap:** ZoomState may be only integer ([201c647](https://github.com/nextgis/nextgisweb_frontend/commit/201c64766e8470fc40015bcbfb2f1cd5540f9329))


### Build System

* qms-kit to rollup ([6cf124f](https://github.com/nextgis/nextgisweb_frontend/commit/6cf124fde63bedac45ac679a44d920050bbb724b))
* wepmap to rollup ([c6f038a](https://github.com/nextgis/nextgisweb_frontend/commit/c6f038ad6bcd2a9581f852b35600b2560381c246))


### chore

* build; eslint ([ee1e03d](https://github.com/nextgis/nextgisweb_frontend/commit/ee1e03d85625b02a09c2ee1e4d66007fbf57d626))
* **vue-ngw-map:** update dependencies ([13fc35d](https://github.com/nextgis/nextgisweb_frontend/commit/13fc35dbd959c49d62fb8fad46534eb4da1a6684))


### Code Refactoring

* change WebMap and NgwMap constructor options ([3b05f95](https://github.com/nextgis/nextgisweb_frontend/commit/3b05f959d6285c62aa08332c9342f24b82a3e732))
* **ngw-kit:** naming ([434411a](https://github.com/nextgis/nextgisweb_frontend/commit/434411a8b2f7e63d436632821d11d0e476d410b3))
* rename layerAdapter baseLayer option to baselayer ([e5c595d](https://github.com/nextgis/nextgisweb_frontend/commit/e5c595d6df24b1b22906ad1e06eb60bf0327e9c0))
* **utils:** update geom utils ([43c11b0](https://github.com/nextgis/nextgisweb_frontend/commit/43c11b0f3c45b22ab66789bd00594d34078316f3))
* **webmap:** change default paint ([e0325e9](https://github.com/nextgis/nextgisweb_frontend/commit/e0325e9edf723b0f6e612cf67e2b6c4cff14c06d))


### Documentation

* update changelog ([1ce6a32](https://github.com/nextgis/nextgisweb_frontend/commit/1ce6a3211d11ba19ebbcd5dca151be29dde2cc6c))


### Features

* add BBOX+ strategy; extends options for setView ([309b697](https://github.com/nextgis/nextgisweb_frontend/commit/309b697e141adf6eedeb85c87b6fa89b9b629c13))
* add get default controls function ([f7e9c51](https://github.com/nextgis/nextgisweb_frontend/commit/f7e9c51f86dff8e7df12b8ec1117b78a44749d3e))
* add getExtent method for all mapAdapters GeoJsonLayerAdapter ([7e8010f](https://github.com/nextgis/nextgisweb_frontend/commit/7e8010f7d5579f2b7909a31a2073479de1faa6a5))
* add library `@nextgis/paint` ([0f72300](https://github.com/nextgis/nextgisweb_frontend/commit/0f723006c722cc0e183a3c2dcfe7b2366e63cd96))
* add library `@nextgis/properties-filter` ([8ec97de](https://github.com/nextgis/nextgisweb_frontend/commit/8ec97de9bd48112211c11cb39eb2da857dd21cac))
* add library cancelable-promise ([2cfb08f](https://github.com/nextgis/nextgisweb_frontend/commit/2cfb08f1143a773a43f1279690e0c9a7e2b2fec5))
* add nativeOptions for alladdLayer adapter methods ([c98568f](https://github.com/nextgis/nextgisweb_frontend/commit/c98568f1f122fc67fdfc911500aa2c509149e293))
* add new library `ControlContainer` ([bf566e2](https://github.com/nextgis/nextgisweb_frontend/commit/bf566e218c53462f65a1e0574d812a6e1c667e06))
* add new library `progress` ([e6302cc](https://github.com/nextgis/nextgisweb_frontend/commit/e6302cca534fc2890dbf64a4590c224181e85d41))
* add react-ngw-leaflet library ([b2234aa](https://github.com/nextgis/nextgisweb_frontend/commit/b2234aa488070086481294920296e5c7211c1aae))
* add setViewDelay options to control map update ([a83e5ab](https://github.com/nextgis/nextgisweb_frontend/commit/a83e5ab9ed6207e0a41fd31a3c56cd14a512c50d))
* add WmsLayerAdapter ([aec0ce1](https://github.com/nextgis/nextgisweb_frontend/commit/aec0ce15ddb5292b6334833bcab8812400815d0b))
* **area:** add new Area package ([c723d1a](https://github.com/nextgis/nextgisweb_frontend/commit/c723d1a144d9218ae1c586ac633afaa01bcc3c94))
* **cache:** add array to match options deep compare ([6b8a096](https://github.com/nextgis/nextgisweb_frontend/commit/6b8a09676c40b6a3c1d86819043af4ec9aa34ce9))
* **cache:** add namespaces support ([f65b6ec](https://github.com/nextgis/nextgisweb_frontend/commit/f65b6ec88885af749b7095dbb7b8dc97f9d6c34d))
* **cache:** new package to cache key value with async ability ([48fce9b](https://github.com/nextgis/nextgisweb_frontend/commit/48fce9b6450556b7684731f873039ed6a22b907b))
* **cancelable-promise:** add control GetOrCreateDecorator ([c99091b](https://github.com/nextgis/nextgisweb_frontend/commit/c99091bcbe193756787879094639172e1a7a0b98))
* **cancelable-promise:** add timeout ([5b48e4b](https://github.com/nextgis/nextgisweb_frontend/commit/5b48e4b7e53a64a0f29adb4940c0d0dce2e85c7c))
* **cancelable-promise:** create abort control ([c915206](https://github.com/nextgis/nextgisweb_frontend/commit/c915206ffad61c28e1020587a41f8844862f3074))
* **cancelable-promise:** throw CancelError instead of onCancel callback ([087180a](https://github.com/nextgis/nextgisweb_frontend/commit/087180adc9bcea72d1fd02ebdaaef3fd751b0a52))
* **cancelable-promise:** шьзкщму PromisesControl ([e68b127](https://github.com/nextgis/nextgisweb_frontend/commit/e68b127779e7da634225cec6354198c67ecae874))
* **casium:** zoomIn and zoomOut onground control ([e8f9350](https://github.com/nextgis/nextgisweb_frontend/commit/e8f9350143cc9e26c364826d4534e31fd72d641b))
* **cesium-map-adapter:** add geojson adapter getExtent method ([6cd5b2b](https://github.com/nextgis/nextgisweb_frontend/commit/6cd5b2b3c936cc4bdb6c4a198b89e94a024e7663))
* **cesium-map-adapter:** add map click event ([93ec86a](https://github.com/nextgis/nextgisweb_frontend/commit/93ec86a808fe765576d491c6694c3fc5cffa8d7a))
* **cesium-map-adapter:** add subdomains for TileAdapter ([4e8eb42](https://github.com/nextgis/nextgisweb_frontend/commit/4e8eb428a3769fb95d08bf18417b03885e597fc7))
* **cesium-map-adapter:** add watchTerrainChange geojson option ([54a5a67](https://github.com/nextgis/nextgisweb_frontend/commit/54a5a670b5918a4bf41862a8a8ec7b8db1d1b28c))
* **cesium-map-adapter:** remove camera inertion ([c8e4073](https://github.com/nextgis/nextgisweb_frontend/commit/c8e40732dac3f923d6a592ce5e5d93dcd0560936))
* **cesium:** add heightOffset geojson option ([dd51756](https://github.com/nextgis/nextgisweb_frontend/commit/dd517565d251f1184d1e5b11b46850bdc3eaca77))
* **cesium:** add mapAdapter listeners and getBounds method ([3aaa0a7](https://github.com/nextgis/nextgisweb_frontend/commit/3aaa0a7eef959e45cf2cd86375c08677a38e4ac7))
* **cesium:** add maximumScreenSpaceError option for tilset3d adapter ([bfb0a65](https://github.com/nextgis/nextgisweb_frontend/commit/bfb0a65171d44a3d32c012170ef56480f3d3566b))
* **cesium:** add scale and rotate for 3d model adapter ([b443004](https://github.com/nextgis/nextgisweb_frontend/commit/b4430040a9729f23fd847a1800067b094fb2b4cb))
* **cesium:** add Tileset3dAdapter ([872d485](https://github.com/nextgis/nextgisweb_frontend/commit/872d4854e76ec30a1dc3e2e397218d86465dcd7d))
* **cesium:** add tilset3d adapter paint options ([445e3e7](https://github.com/nextgis/nextgisweb_frontend/commit/445e3e717e64f2d859ecbf62b82239710d665e34))
* **cesium:** change default screenSpaceError value ([964bbe1](https://github.com/nextgis/nextgisweb_frontend/commit/964bbe12492b4fb2bba6cec04d3a926210abe866))
* **cesium:** change layers height on terrain change ([4f67f44](https://github.com/nextgis/nextgisweb_frontend/commit/4f67f442adf5d52cd2538d26af752ee1612cd25d))
* **cesium:** extrude3d paint option ([d535fc6](https://github.com/nextgis/nextgisweb_frontend/commit/d535fc664f8acc1d99aaf2e93a70376ab4b6b7c9))
* **cesium:** fitBounds up tp terrain ([733207a](https://github.com/nextgis/nextgisweb_frontend/commit/733207add48dbaa6f811673129ea6485b70de834))
* **cesium:** geojson adapter paint ([4de7367](https://github.com/nextgis/nextgisweb_frontend/commit/4de7367fc7203d0ba11328a837be1098e6e710fe))
* **cesium:** get extent of tileset3D ([07bacb7](https://github.com/nextgis/nextgisweb_frontend/commit/07bacb7c82dfc82fd87883708b80b4a6a3443a53))
* **cesium:** implement getCenter ([6eb5db5](https://github.com/nextgis/nextgisweb_frontend/commit/6eb5db52ac974a5cfcb7407ced56982b2a22dd6b))
* **cesium:** pin paint implementation for geojson layer ([d2952ff](https://github.com/nextgis/nextgisweb_frontend/commit/d2952ff9b502575a09d53546c5a7089eff4e986f))
* **cesium:** set custom logo ([4cce1eb](https://github.com/nextgis/nextgisweb_frontend/commit/4cce1eb606b6204b03173b8359c0b3f098fc0f33))
* **cesium:** set scene view from new adapter option ([04c412f](https://github.com/nextgis/nextgisweb_frontend/commit/04c412f618d8252d06d238b07b6399ee92fea180))
* **cesium:** skipLevelOfDetail by default ([7b9bf9f](https://github.com/nextgis/nextgisweb_frontend/commit/7b9bf9f13003348d0998b4c9eb268cc74f3466b6))
* **cesium:** tilset 3d adapter height options ([f28f94a](https://github.com/nextgis/nextgisweb_frontend/commit/f28f94a90a03ea34e385f6afd9b272197198b030))
* **cesium:** update layer and map adapter ([c942b1a](https://github.com/nextgis/nextgisweb_frontend/commit/c942b1a741618e6e3d57737dc91257a7dde6aa83))
* **clipboard:** on static copy return operation status ([dac89f0](https://github.com/nextgis/nextgisweb_frontend/commit/dac89f0e82641b7b91b9d1630cadade4b857c1fd))
* **control:** add universal zoom control ([d1371be](https://github.com/nextgis/nextgisweb_frontend/commit/d1371be1f88085dcfc864de31a7d4d89f2690216))
* **demo:** add new example for simple resource table ([94d650c](https://github.com/nextgis/nextgisweb_frontend/commit/94d650ceb51096c8f632f3633052a9263b73dde8))
* **demo:** add search for left sidebar ([493bb35](https://github.com/nextgis/nextgisweb_frontend/commit/493bb35eefff92d63efcdeb27678d32db9c6d91a))
* **dom:** add new options o loadScript function ([eda94e2](https://github.com/nextgis/nextgisweb_frontend/commit/eda94e2e7fb4ce06a59f372928cffce64e5435a8))
* eslint no-dupe off; object utils; propertiesFilter generic ([6989c5c](https://github.com/nextgis/nextgisweb_frontend/commit/6989c5c03548669db771eabcbce2c3f0a8f9843e))
* **eslint:** add prettier rules ([98cd0e2](https://github.com/nextgis/nextgisweb_frontend/commit/98cd0e21e7b1300323e3a5d09a39bf71f8b40a64))
* **example:** new ngw_layer_properties_filter example ([1abc86b](https://github.com/nextgis/nextgisweb_frontend/commit/1abc86bd8683f2c533e9c808e7e4e1591b727e03))
* **geocoder:** add new geocoder package ([57279db](https://github.com/nextgis/nextgisweb_frontend/commit/57279dbbee29b25223054bb2adf4bfb5b020e9aa))
* **geocoder:** index for all result items ([b76f518](https://github.com/nextgis/nextgisweb_frontend/commit/b76f51834edd251943e5442fba90cd14fccb7807))
* handle vector layer mouse over and out events ([1f537c2](https://github.com/nextgis/nextgisweb_frontend/commit/1f537c277b433db365b319d4bbdfb26aa44528fd))
* **icons:** make ability ro use custom svg ([ad73e50](https://github.com/nextgis/nextgisweb_frontend/commit/ad73e5022ecf0c5e26153e61414a86e587fff709))
* improve geojson adapter multiselect ([2c9c01c](https://github.com/nextgis/nextgisweb_frontend/commit/2c9c01c42757c87c4d588e97802f8d2626c5b078))
* improve popup, add new options, ol support ([e3ea91b](https://github.com/nextgis/nextgisweb_frontend/commit/e3ea91b91d03a4cef471c5c92a09a7fa0640b90a))
* **item:** add @nextgis/tree dependency ([8f5f4e7](https://github.com/nextgis/nextgisweb_frontend/commit/8f5f4e702ee6deaab6cca7f36a90ba06ee9c000c))
* **leaflet-map-adapter:** add position to vector adapter layers definition ([053ccf0](https://github.com/nextgis/nextgisweb_frontend/commit/053ccf05ed8d9d76592c8ca648365e176c609277))
* **leaflet-map-adapter:** change geojson layer opacity ([9862e2d](https://github.com/nextgis/nextgisweb_frontend/commit/9862e2de02efeef0bc55102ecdac942d0687f036))
* **leaflet-map-adapter:** label redraw on map position change ([b8c926e](https://github.com/nextgis/nextgisweb_frontend/commit/b8c926eb0109aa4e155097c23d436de891a4fc11))
* **leaflet-map-adapter:** setMinZoom on maxExtent ([5e16191](https://github.com/nextgis/nextgisweb_frontend/commit/5e16191f7b81a29b41b2c6873cb33ccd0e84afea))
* **logging:** add logging package ([fac3cb8](https://github.com/nextgis/nextgisweb_frontend/commit/fac3cb8cc12ebf8a30ec3d6d83f5cb3c13364d10))
* **logging:** add new options ([d64aaa9](https://github.com/nextgis/nextgisweb_frontend/commit/d64aaa9370e32f07d58af7d2ae1bfff5282cb3c5))
* **mapbox-gl-js:** improve popup ([dbec3c5](https://github.com/nextgis/nextgisweb_frontend/commit/dbec3c5f68275e72dc91bfa4a7f21164aa9bdc62))
* **mapbox-map-adapter:** GeoJson layer label workaround ([6c73629](https://github.com/nextgis/nextgisweb_frontend/commit/6c736293bf498591d27fc050848503802e9da94e))
* **mapbox-map-adapter:** MVT match paint ([4115554](https://github.com/nextgis/nextgisweb_frontend/commit/41155542218ef1e28fa57803f586cfa384df4784))
* **mapbox-map-adapter:** set opacity with native paint ([4751d0b](https://github.com/nextgis/nextgisweb_frontend/commit/4751d0bdf178c6812590f11196e97f696a01c303))
* **mapbox-map-adapter:** upgrade maplibre to 2.x.x ([6eb84d4](https://github.com/nextgis/nextgisweb_frontend/commit/6eb84d4a5595b98f1b608f91f11d770aaa9a5867))
* **mapbox-map-adapter:** use direct mapAdapteOptions style ([80b0d7b](https://github.com/nextgis/nextgisweb_frontend/commit/80b0d7bddaed6484651604bb13bbab9a5549f36f))
* **mapboxgl-map-adapter:** add popup for selected feature ([bf7ee99](https://github.com/nextgis/nextgisweb_frontend/commit/bf7ee994ba4307c2a85bc28c985198f000c463de))
* **mapboxgl-map-adapter:** add setLayerOpacity methods ([3f84f3e](https://github.com/nextgis/nextgisweb_frontend/commit/3f84f3e44f776fb685afa66f0d8f5fa0165f3806))
* **mapboxgl-map-adapter:** implement labelOnHover option ([2e575b3](https://github.com/nextgis/nextgisweb_frontend/commit/2e575b349f06adc6f6a6906b4ca592ec4b0362fc))
* **mapboxgl-map-adapter:** label on hover improve ([63890c8](https://github.com/nextgis/nextgisweb_frontend/commit/63890c81435cf690543b1e10a83ce10f2a9284c2))
* **mapboxgl-map-adapter:** set maxBounds init map option ([29b5152](https://github.com/nextgis/nextgisweb_frontend/commit/29b5152a81d01e582f40ae2a45ec9ef165b98f6e))
* **mapobxgl-map-adapter:** improve map initializing ([a15d43c](https://github.com/nextgis/nextgisweb_frontend/commit/a15d43c61fc56066bb505a0c841237af1c464bac))
* move getIdentifyRadius from ngw-map to utils package ([159cbfc](https://github.com/nextgis/nextgisweb_frontend/commit/159cbfccb0ee32c774c2b32f5599d05146df9006))
* new @nextgis/dom library ([572d4c2](https://github.com/nextgis/nextgisweb_frontend/commit/572d4c2c554eb4da30be01c25a2d14cd4125d847))
* **nge-kit:** add uploadFeatureAttachment util ([da40397](https://github.com/nextgis/nextgisweb_frontend/commit/da40397b7cc3943c9570dc13eb3ca7420f97a6ee)), closes [#CU-m356](https://github.com/nextgis/nextgisweb_frontend/issues/CU-m356)
* **nglog:** add eachLog option ([c3605a2](https://github.com/nextgis/nextgisweb_frontend/commit/c3605a2feb9b19f33650147970799876f768a10a))
* **nglog:** add session and duration fields ([300ca5a](https://github.com/nextgis/nextgisweb_frontend/commit/300ca5ad1e6e6436d82b0b67589f4b04cd85fc94))
* **ngw-connector:** add abort signal to request options ([213b213](https://github.com/nextgis/nextgisweb_frontend/commit/213b2136612faba8b2960a466eb5c72f73ff2fd3))
* **ngw-connector:** add check for 403 ngw error ([a0069dd](https://github.com/nextgis/nextgisweb_frontend/commit/a0069dd733897a864a4450ac6dd576b0a32b14d3))
* **ngw-connector:** add getResourceIdOrError method ([b4a42e6](https://github.com/nextgis/nextgisweb_frontend/commit/b4a42e68291bfa0571efc510e7a79e15257e291a))
* **ngw-connector:** add item_extent interface ([ea56470](https://github.com/nextgis/nextgisweb_frontend/commit/ea5647005858bbea4899eed0f79ab496ecf2496f))
* **ngw-connector:** add recursive option to getChildrenOf ([b62782c](https://github.com/nextgis/nextgisweb_frontend/commit/b62782c4b33b05fc434ff2c13781a2c20becf1ca))
* **ngw-connector:** add request transform method ([4069dea](https://github.com/nextgis/nextgisweb_frontend/commit/4069dea336f9e5cf549d5955738500319802f064))
* **ngw-connector:** add static create method ([d141a1b](https://github.com/nextgis/nextgisweb_frontend/commit/d141a1bf5f5aa8693ae10c061459694cf960e07e))
* **ngw-connector:** disable transfer-encoding for node requests ([937dc9d](https://github.com/nextgis/nextgisweb_frontend/commit/937dc9dc7525c26330b0fad988aafe3a0ab58aa9))
* **ngw-connector:** disable transfer-encoding for node requests II ([1ee0692](https://github.com/nextgis/nextgisweb_frontend/commit/1ee0692096d9964e2905980f49f289f27031232a))
* **ngw-connector:** get already created connector by url only ([5487ee7](https://github.com/nextgis/nextgisweb_frontend/commit/5487ee70442bd133e061431271a334ecd13a4885))
* **ngw-connector:** handle network error ([dd555ec](https://github.com/nextgis/nextgisweb_frontend/commit/dd555ec05c94540394cf313762307296a90a8c69))
* **ngw-connector:** make library polymorphic for both node and browser ([7fa0519](https://github.com/nextgis/nextgisweb_frontend/commit/7fa05191f37c4772f0f3efcd276d5c27e86dad6a))
* **ngw-connector:** more improvement for Node ([a671057](https://github.com/nextgis/nextgisweb_frontend/commit/a671057776891f07dbbbffa95b8787acf0e1fd71))
* **ngw-connector:** new abort methods ([481988d](https://github.com/nextgis/nextgisweb_frontend/commit/481988d520a7ff882419a7677c1de5364f5af6d7))
* **ngw-connector:** new getResourceBy method ([fc355b2](https://github.com/nextgis/nextgisweb_frontend/commit/fc355b217641f0449adac0c415707091563df9a1))
* **ngw-connector:** new query option for response cache ([7f567ed](https://github.com/nextgis/nextgisweb_frontend/commit/7f567edba68eb6a7b2fbfec9a3b336e469df414e))
* **ngw-connector:** remove login logic from getUserInfo ([f0ca312](https://github.com/nextgis/nextgisweb_frontend/commit/f0ca31257a223ed32628cc83a2411e04b252164f))
* **ngw-kit:** add ability to render multilayers image adapter ([da0eef1](https://github.com/nextgis/nextgisweb_frontend/commit/da0eef170a8dfdc9f445703768208b61d6e9a1c1))
* **ngw-kit:** add addLayerOptionsPriority for createGeoJsonAdapter ([eb7db26](https://github.com/nextgis/nextgisweb_frontend/commit/eb7db2620f2bf66812ab90b03f5359c70f46ecf9))
* **ngw-kit:** add baselayers from webmap; vuetify BaseLayerSelect ([7862680](https://github.com/nextgis/nextgisweb_frontend/commit/78626807a6e9c7420ffffeba5c9a4f90fdba24b8))
* **ngw-kit:** add bbox strategy for large vector layer ([9641d20](https://github.com/nextgis/nextgisweb_frontend/commit/9641d20ed48975b59d37befad9614b27bd5594e7))
* **ngw-kit:** add bbox strategy layer preupdate event ([8156f17](https://github.com/nextgis/nextgisweb_frontend/commit/8156f17816779a76bf6ec7f3049ec52a62998bf5))
* **ngw-kit:** add BBOX+ strategy ([4d20810](https://github.com/nextgis/nextgisweb_frontend/commit/4d20810575c5b246dfadd01a5371ccd5e1b1ca1b))
* **ngw-kit:** add datetime ngw formatter ([786d2b1](https://github.com/nextgis/nextgisweb_frontend/commit/786d2b1b469bbd45a22eeaa43b367a985b3d0ca3))
* **ngw-kit:** add feature request extensions param ([9fec2dc](https://github.com/nextgis/nextgisweb_frontend/commit/9fec2dcd2a2013d35bc628d58c1994d24a7990fa))
* **ngw-kit:** add feature request srs param ([4b88e3a](https://github.com/nextgis/nextgisweb_frontend/commit/4b88e3a9614a15167efbe5f12a2649df4cfd7b93))
* **ngw-kit:** add feature to getIdentifyItems ([e08532a](https://github.com/nextgis/nextgisweb_frontend/commit/e08532ae020ef9ef2acfc2dfc552a4a92565d73c))
* **ngw-kit:** add fetchNgwLayerItems option to disable clietn filter ([ffa673c](https://github.com/nextgis/nextgisweb_frontend/commit/ffa673cd741f467374f3c630babfd4ced796f28f))
* **ngw-kit:** add identify item for speedup ngw selection ([4f751d0](https://github.com/nextgis/nextgisweb_frontend/commit/4f751d0af8b1b7973d0979fef5beaf4c5b8e17b4))
* **ngw-kit:** add new selectNgwLayerDistinct util ([eeb612f](https://github.com/nextgis/nextgisweb_frontend/commit/eeb612f622b7c9b4404e592ccb7c44b223590de8))
* **ngw-kit:** add ngw basemap suppor for url ([f4b1323](https://github.com/nextgis/nextgisweb_frontend/commit/f4b1323b04da264cae0698e48b41586e1d189bbb))
* **ngw-kit:** add NgwKit.utils.getCompanyLogo method ([301ff78](https://github.com/nextgis/nextgisweb_frontend/commit/301ff78d36b712e93fdfbd03f5c8f57dd93cbc14))
* **ngw-kit:** add parse date from ngw feature and store util ([73d5d7d](https://github.com/nextgis/nextgisweb_frontend/commit/73d5d7dc07bc9e5f6b0d55c413ede2d83ac6a8fb))
* **ngw-kit:** add polygon intersection identify util ([a378415](https://github.com/nextgis/nextgisweb_frontend/commit/a3784154fe9961f90b88e4ca11fc84a1393c99ff))
* **ngw-kit:** add postgis_layer cls adapter ([0417b13](https://github.com/nextgis/nextgisweb_frontend/commit/0417b13e0e8fbc1afb3ae3dd7456ff03e92d6483))
* **ngw-kit:** add tileNoData ngw adapter option ([162d852](https://github.com/nextgis/nextgisweb_frontend/commit/162d852cab33a40c3d5634e6915ea148c2490c15))
* **ngw-kit:** add tmsclient_layer adapter class support ([2c40bb3](https://github.com/nextgis/nextgisweb_frontend/commit/2c40bb36a0106599b2c36a5f9cd51aa247dd5345))
* **ngw-kit:** add toGeojson in ngw layer item response ([0af64ad](https://github.com/nextgis/nextgisweb_frontend/commit/0af64ad1f907996f357a2355a35597319ec4bb0a))
* **ngw-kit:** add useBasemap NgwWebmaplayerAdapter option ([cf8c491](https://github.com/nextgis/nextgisweb_frontend/commit/cf8c4918a3f0c2261f679a06dc51c82ce09b978c))
* **ngw-kit:** add webmap item method to cotrol item children order ([6387eba](https://github.com/nextgis/nextgisweb_frontend/commit/6387ebadabae7a1d2b68e2221b20eda81a7465e0))
* **ngw-kit:** calculate group NgwWebMapItem init visibility ([7483b43](https://github.com/nextgis/nextgisweb_frontend/commit/7483b438bb48ffdec4dc7b75d042afd73043fab5))
* **ngw-kit:** default WebmapLayerAdapter basemap ([12aba63](https://github.com/nextgis/nextgisweb_frontend/commit/12aba63a37fc75cbaed2ed0be478cc5172149190))
* **ngw-kit:** disable api clien filter without any case ([b2f7094](https://github.com/nextgis/nextgisweb_frontend/commit/b2f7094e1a10d4c859c66cb304993f022c2a9aeb))
* **ngw-kit:** disable default map maxBounds whole world ([f6a439d](https://github.com/nextgis/nextgisweb_frontend/commit/f6a439dde244c670994c5cb624160ffb06c3262e))
* **ngw-kit:** duplication of the server filter by the client ([0978bf7](https://github.com/nextgis/nextgisweb_frontend/commit/0978bf778bf19b5e0620902618f45fde4c607a90))
* **ngw-kit:** export createPopupContent util ([d82c165](https://github.com/nextgis/nextgisweb_frontend/commit/d82c1650bbd2e3c991c2de011b5c8fb23b575d3c))
* **ngw-kit:** export getImageAdapterOptions method ([5d7bbbc](https://github.com/nextgis/nextgisweb_frontend/commit/5d7bbbc04454db5c87f74f57136fdc9fd0d4da21))
* **ngw-kit:** extensibility increased ([2b7286d](https://github.com/nextgis/nextgisweb_frontend/commit/2b7286d7aba2551e22ea72f1329b3009893af64f))
* **ngw-kit:** features request cache option ([96d5bff](https://github.com/nextgis/nextgisweb_frontend/commit/96d5bff0852d5f63056484ec9692adb22de7f2ca))
* **ngw-kit:** handle Infinity in fetchNgwItems query limit param ([ee530cc](https://github.com/nextgis/nextgisweb_frontend/commit/ee530ccae00d142eb15b7eeca2a2bc238b8c74d8))
* **ngw-kit:** id fields as number for client filter ([4bea3ef](https://github.com/nextgis/nextgisweb_frontend/commit/4bea3ef1835467a33aff7bd949bb0a7028f2e92e))
* **ngw-kit:** improve createOnFirstShowAdapter ([fe7e721](https://github.com/nextgis/nextgisweb_frontend/commit/fe7e7215b0aa2cea90d859a749b784b1e95119c0))
* **ngw-kit:** log to get item extensions if not request param set ([aef5fdf](https://github.com/nextgis/nextgisweb_frontend/commit/aef5fdfac6a81be98b8115bea87625a83d987a67))
* **ngw-kit:** make create basemap layer adapter universal ([b17781d](https://github.com/nextgis/nextgisweb_frontend/commit/b17781df8afabd9e5353a07c94a3769390ea8591))
* **ngw-kit:** new addNgwLayer resource option for keyname or resourceId ([3881c42](https://github.com/nextgis/nextgisweb_frontend/commit/3881c427dc2ae770634605944d1207d1ec6b2b38))
* **ngw-kit:** new approach to extend adapters for any resource classes ([392b83f](https://github.com/nextgis/nextgisweb_frontend/commit/392b83fc83e764730c3b031cb03d4d74fe524842))
* **ngw-kit:** ngw error handling ([1380bb6](https://github.com/nextgis/nextgisweb_frontend/commit/1380bb6119f5c72eaf28e4f55c1def266e7c1571))
* **ngw-kit:** ngw webmap item bookmarks handler ([88b4b8c](https://github.com/nextgis/nextgisweb_frontend/commit/88b4b8cbbefbe236dd475100d2a143c0b3f1deca))
* **ngw-kit:** ngwwebmap item toggle on zoom layer range ([52abb1d](https://github.com/nextgis/nextgisweb_frontend/commit/52abb1d2fee3b2c306b9269e8287d98362ef5128))
* **ngw-kit:** NgwWebmapItem opacity ([c7846df](https://github.com/nextgis/nextgisweb_frontend/commit/c7846dff298d1d1e022cdb9258ba346f86505527))
* **ngw-kit:** prepare datetime fields to ngw ([eb814c1](https://github.com/nextgis/nextgisweb_frontend/commit/eb814c16b242a8a0fe0d26e4159db76cf1bd96d2))
* **ngw-kit:** update feature request params ([ebceeaf](https://github.com/nextgis/nextgisweb_frontend/commit/ebceeafc4ccb9f95b34ddbe7ce31436ccc0cae45))
* **ngw-kit:** update features request params on no geom ([a1f27a2](https://github.com/nextgis/nextgisweb_frontend/commit/a1f27a28fe52a8ef7076f406273d84caeecd30fc))
* **ngw-kit:** update loaded date before property filter ([cbae69e](https://github.com/nextgis/nextgisweb_frontend/commit/cbae69e4fdd5863582ae015328ce323103f04d03))
* **ngw-kit:** use abort signal in fetch requests ([fe2e5cc](https://github.com/nextgis/nextgisweb_frontend/commit/fe2e5cc1a291e7e1ea1821a8380f4f4db68ea270))
* **ngw-map:** add ngw layer from resource item object ([e9c13f5](https://github.com/nextgis/nextgisweb_frontend/commit/e9c13f5ca0c1fb00106d0aa3f944cff1c92931e1))
* **ngw-map:** add promise groups handler ([2fb6ab1](https://github.com/nextgis/nextgisweb_frontend/commit/2fb6ab152037e04fb037313140536e3e4ac8a938))
* **ngw-mapbox:** add MVT support for addNgwlayer ([50fc868](https://github.com/nextgis/nextgisweb_frontend/commit/50fc868d73ca9ab5a069994991fdcb69ac0ae7c5))
* **ngw-map:** default bounds; add mapOption for show osm baselayer ([b376198](https://github.com/nextgis/nextgisweb_frontend/commit/b376198b1b9038899a6ec46ed97e443d9f591365))
* **ngw-orm:** new updateResource conection method ([8232ddc](https://github.com/nextgis/nextgisweb_frontend/commit/8232ddc8fc5ac51ecfa50b6269663a2a745e59cc))
* **ngw-orm:** remove 3rd part libs to convers geom to wkt, use new ngw api ([dd18c38](https://github.com/nextgis/nextgisweb_frontend/commit/dd18c380283e12be0e70565577a076ea8d461ecd))
* **ngw-orm:** update VectorLayer.toTypescript ([f437527](https://github.com/nextgis/nextgisweb_frontend/commit/f4375275202790c305fba6b2620ae62b86c1e66f))
* **ngw-orm:** validate resource ([4974bf0](https://github.com/nextgis/nextgisweb_frontend/commit/4974bf0218004a394a0e036b9c7a6af65ba6a26f))
* **ngw-orm:** vector layer payload for update ([6aa85ca](https://github.com/nextgis/nextgisweb_frontend/commit/6aa85ca022a0eed425c976857bd7a37b89f64c52))
* **ngw-uplader:** save meta on upload ([376a2e5](https://github.com/nextgis/nextgisweb_frontend/commit/376a2e57195726e50669f08b9b98b11c9e5650ce))
* **ngw-uploader:** make ability to upload vector resources ([14aa7af](https://github.com/nextgis/nextgisweb_frontend/commit/14aa7af81314bca5f4e83574c8fb9b83372497bf))
* **ngw-uploader:** style resource options in upload rasetr and vector methods ([bd5103f](https://github.com/nextgis/nextgisweb_frontend/commit/bd5103f1885ce90d3d12c186c0f218bae2dda1cb))
* **ngw-uploader:** use tus for file upload ([5728627](https://github.com/nextgis/nextgisweb_frontend/commit/572862718029689a62a613893baedea3b57eb4c4))
* **ngw:** add support for `qgis_raster_style` ([e0f98c4](https://github.com/nextgis/nextgisweb_frontend/commit/e0f98c407ffec70fb3c93eda1f647356cdd523cb))
* **ngw:** conditions and nesting for filtering ngw feature layer ([90708d8](https://github.com/nextgis/nextgisweb_frontend/commit/90708d8deaaa5ce995caf6cc7f7b307592272114))
* **ngw:** option to create popup content from item ([509be03](https://github.com/nextgis/nextgisweb_frontend/commit/509be030f043719276bb464fe5f5a686cae76e21))
* **ol-map-adapter:** add map native adapterOptions parameter ([5128ce4](https://github.com/nextgis/nextgisweb_frontend/commit/5128ce4497c6d81987b7506f6500a097fe5f9095))
* **ol-map-adapter:** add position to vector adapter layers defenition ([235928f](https://github.com/nextgis/nextgisweb_frontend/commit/235928fc7ee497e5eab94bd037f343715d9839b5))
* **ol-map-adapter:** add setLayerOpacity mapAdapter and each layer methods ([0d71962](https://github.com/nextgis/nextgisweb_frontend/commit/0d71962899409203f31ff7f4fcad9e0142f6efa0))
* **ol-map-adapter:** add srs options to draw vector layer ([7a29212](https://github.com/nextgis/nextgisweb_frontend/commit/7a29212eb5636194b5cc9df0602c1fb8cbb58593))
* **ol-map-adapter:** hide and show label dynamic ([1d0e842](https://github.com/nextgis/nextgisweb_frontend/commit/1d0e84264ffabe088e8ba4488106f63d81364193))
* **ol-map-adapter:** use add layer opacity option ([33dd334](https://github.com/nextgis/nextgisweb_frontend/commit/33dd334d76a563b147548d96fa56ed9d54a318a3))
* **ol-map-adapter:** use geojson layer label calback option ([e05e1ba](https://github.com/nextgis/nextgisweb_frontend/commit/e05e1bab2568dbd31908003b77691509e96f82e2))
* **ol:** implement labelField options for OL geojson adapter ([df754ca](https://github.com/nextgis/nextgisweb_frontend/commit/df754ca43857e0ab99d925d815ffd3a186e1a98d))
* **ol:** implemented getBounds method for OlMapAdapter ([b4f93f8](https://github.com/nextgis/nextgisweb_frontend/commit/b4f93f808d0e331a33050bd7b00fd3fb900d4337))
* **ol:** labeling for circle layer paint ([6cf4f54](https://github.com/nextgis/nextgisweb_frontend/commit/6cf4f54c9e6a3b96c33e6855fc4ab874ad3f15d1))
* **paint:** add experimental paint 3d style ([25fce10](https://github.com/nextgis/nextgisweb_frontend/commit/25fce10064a2b38f8e50f92402b585956ce5b425))
* **paint:** implement of `match`-decision expression ([234195d](https://github.com/nextgis/nextgisweb_frontend/commit/234195d007965c2d2e0c3c3e23f3572f616711b9))
* **qms-kit:** add subdomains support from origin_url ([977fb6d](https://github.com/nextgis/nextgisweb_frontend/commit/977fb6d9433fd9f6511b546018996b8ddf437ed9))
* **qms-kit:** update createAdapter options interface ([e349073](https://github.com/nextgis/nextgisweb_frontend/commit/e3490730a55e69d8df396da70ec5afbfa5393657))
* **qms-kit:** use y_origin_top option ([ac9f4cb](https://github.com/nextgis/nextgisweb_frontend/commit/ac9f4cb9d252a842f11b31e3c7eccbd6e34d1387))
* **react-ngw-map:** add getContext hook to module export ([8a672b4](https://github.com/nextgis/nextgisweb_frontend/commit/8a672b4e0fb58ccdf14d69282e11a0e93640f721))
* **react:** add mapbox and ol packages ([ec5d31d](https://github.com/nextgis/nextgisweb_frontend/commit/ec5d31d7dd40a8eb9cf0794b9e15a1d289cc0764))
* **react:** add react map toggle control component ([41421e5](https://github.com/nextgis/nextgisweb_frontend/commit/41421e5d22e14432bc27d0110cf2150297520ce3))
* remove default MarkerLayerAdapter ([7596ec9](https://github.com/nextgis/nextgisweb_frontend/commit/7596ec9f86b20ce399248adc233c0a2e041da63c))
* **tree:** TreeHelper ([5e77ce9](https://github.com/nextgis/nextgisweb_frontend/commit/5e77ce9d6a8e9f71d7039fa298210e11d1a6f040))
* **url-runtime-params:** remove trailing sharp from hash ([3c0d8c7](https://github.com/nextgis/nextgisweb_frontend/commit/3c0d8c75c781b66a4752ca9c49bde7acfc231ba8))
* **util:** add arrayCompare util ([dd58235](https://github.com/nextgis/nextgisweb_frontend/commit/dd58235aecd04de213aa962e002145a65fdc2d52))
* **util:** add coord format transformer ([7d3d072](https://github.com/nextgis/nextgisweb_frontend/commit/7d3d0727cb39d3317f6d2cd60331911a1a86d36e))
* **util:** add debounce util ([c89223e](https://github.com/nextgis/nextgisweb_frontend/commit/c89223e509d79e829df2ffda086aa0ed87b30918))
* **util:** add keyInObj typescript helper ([a978aac](https://github.com/nextgis/nextgisweb_frontend/commit/a978aacd3e28a5e0cc8ff5136e442d3324d67b33))
* **util:** create typeHelpers utils ([387d5dc](https://github.com/nextgis/nextgisweb_frontend/commit/387d5dcda12e21fdef0c49d812a9543ed280b087))
* **util:** move properties filter to utils library ([175cd56](https://github.com/nextgis/nextgisweb_frontend/commit/175cd56d93380591a764e2c06c011f7f6fe919c8))
* **utils:** add `arrayCompareStrict` function ([b647b10](https://github.com/nextgis/nextgisweb_frontend/commit/b647b10f6363462261ff13df9fcefc5cb377fdac))
* **utils:** add `full` method ([39d1dee](https://github.com/nextgis/nextgisweb_frontend/commit/39d1dee32c1e5f21c079d8e8e393aa31c0794225))
* **utils:** add DebounceDecorator ([033f482](https://github.com/nextgis/nextgisweb_frontend/commit/033f4827e32a9ef9cb764e80cde6944534a5f923))
* **utils:** add debug log util ([35b2173](https://github.com/nextgis/nextgisweb_frontend/commit/35b21732aa785ad3c16d3972be439dcef8be7e6a))
* **utils:** add degrees to radian transform function ([12d0ab9](https://github.com/nextgis/nextgisweb_frontend/commit/12d0ab9cb120d0ede41c01d96e3953ce6fdcd3bd))
* **utils:** add flatten and unflatten functions ([9584ccb](https://github.com/nextgis/nextgisweb_frontend/commit/9584ccbeaa2b384ac0699c0f47be3cd97ae75d6c))
* **utils:** add function to get coordinates from bbox ([35a0d8b](https://github.com/nextgis/nextgisweb_frontend/commit/35a0d8b8bc94fba336aa32fc6ceaaac364015d78))
* **utils:** add geojson eachCoordinates util ([566aa77](https://github.com/nextgis/nextgisweb_frontend/commit/566aa77b56fab120d32408e89a9b6bdb5bd76f24))
* **utils:** add getPolygons coordinates function ([49dba46](https://github.com/nextgis/nextgisweb_frontend/commit/49dba46e498510087c5368da2fcb06cdbba6d26f))
* **utils:** add new tools ([4e534fb](https://github.com/nextgis/nextgisweb_frontend/commit/4e534fb45fb066ebeba3c586c2c448772c2df4f9))
* **utils:** add number utils ([b6b7ea5](https://github.com/nextgis/nextgisweb_frontend/commit/b6b7ea5deaa9720f9ad85e0f714a7755ffb84ca6))
* **utils:** add options to flatten ([066c09f](https://github.com/nextgis/nextgisweb_frontend/commit/066c09fce9dd21f1ddadc983a509856d09269f9c))
* **utils:** clipbord static create may throw error ([8577e78](https://github.com/nextgis/nextgisweb_frontend/commit/8577e78624f3dae0a5d73becd7c3c81d370cdfb8))
* **utils:** create universal MapControlContainer ([ce5a984](https://github.com/nextgis/nextgisweb_frontend/commit/ce5a984fd97928e1c9dda2bac81578a62a328e64))
* **utils:** deprecated helper utils ([d324e3f](https://github.com/nextgis/nextgisweb_frontend/commit/d324e3f9e0babdb10779a0add5d53bae78235086))
* **utils:** geom coordinates count ([06184f0](https://github.com/nextgis/nextgisweb_frontend/commit/06184f0d0df6db860b1f1b2cc47289c61b6f2786))
* **utils:** move some utils from ngw-kit and webmap to geom ([03ff50e](https://github.com/nextgis/nextgisweb_frontend/commit/03ff50e30d1562ad29561ad0741924b49c6aa907))
* **utils:** update string util ([68d7a05](https://github.com/nextgis/nextgisweb_frontend/commit/68d7a0593a2482c47d8a181c9e7c379b4c2e78f2))
* **vue-ngw-map:** map props priority ([8c42fb3](https://github.com/nextgis/nextgisweb_frontend/commit/8c42fb3e2f83a55b70ecdff1337f2b0c776b3d93))
* **vue:** add GeojsonLayer ([de1875b](https://github.com/nextgis/nextgisweb_frontend/commit/de1875b9f5a962d432ea00ab2e2a0a35ba6f37a9))
* **vue:** add GeojsonLayer paint param ([a2f26a8](https://github.com/nextgis/nextgisweb_frontend/commit/a2f26a8dbccae5daa3b5071e67ccc60b240c98c3))
* **vue:** add layer toggle listener for baselayerselect ([a78a687](https://github.com/nextgis/nextgisweb_frontend/commit/a78a6874814740637adee39c5813015a5d7dd6eb))
* **vue:** add load emit in VueNgwControl ([6ec5fa5](https://github.com/nextgis/nextgisweb_frontend/commit/6ec5fa587164a9de4fd8de897614286bf46f7fe7))
* **vue:** add VueNgwLayer component ([f5bf617](https://github.com/nextgis/nextgisweb_frontend/commit/f5bf6177ffb02be346584d49b3b08126a88d82b3))
* **vue:** GeojsonLayer selected model and onClick ([ca76ab8](https://github.com/nextgis/nextgisweb_frontend/commit/ca76ab877a9e48014813e36d515ae1efd7a4bc40))
* **vue:** NgwlayersList bubble with propagation ([9c7b38a](https://github.com/nextgis/nextgisweb_frontend/commit/9c7b38a5688aaa1a69e3efbcc58c99c6d4717ed9))
* **vue:** NgwLayersList ctrl key to propagation reverse ([6d5ee63](https://github.com/nextgis/nextgisweb_frontend/commit/6d5ee634b65a6064b604d6c1073d4dc471f971e8))
* **vue:** NgwLayersList propagation param ([65879c9](https://github.com/nextgis/nextgisweb_frontend/commit/65879c9f8ea141bffb4213f5e3ad590447423ddc))
* **vue:** NgwLayersList watch ngwMap change ([8496ec7](https://github.com/nextgis/nextgisweb_frontend/commit/8496ec772ec9c6998bcd1ca604d058acbea75172))
* **vues:** add onBeforeDelete hook ([833bdbf](https://github.com/nextgis/nextgisweb_frontend/commit/833bdbf836d249007d50bf95e8a370e653fcae09))
* **vue:** selection for NgwLayersList ([3ce2a7b](https://github.com/nextgis/nextgisweb_frontend/commit/3ce2a7b39ee5166ef719a718dfdc608f66b92b0f))
* **vue:** split vue-ngw-map for leaflet, ol an mapbox adapters ([bcea6c3](https://github.com/nextgis/nextgisweb_frontend/commit/bcea6c35e61f6ba2aab0b25eb30da9f5f719c92e))
* **vuetify:** allow VTree scopes for NgwLayersList ([0639026](https://github.com/nextgis/nextgisweb_frontend/commit/063902636fa1425a1dba6bce89a40b040d042387))
* **vuetify:** NgwLayersList remove layer ability ([411b5a3](https://github.com/nextgis/nextgisweb_frontend/commit/411b5a32ddf0443dccc639e7cf86fb41d08f2d0a)), closes [#CU-jzby65](https://github.com/nextgis/nextgisweb_frontend/issues/CU-jzby65)
* **vuetify:** NgwLayersList set open from ngw webmap item ([a278789](https://github.com/nextgis/nextgisweb_frontend/commit/a278789929e604059432e1a7f0967c83b3d2fee2))
* **vue:** update cache on resource store patch ([a28037a](https://github.com/nextgis/nextgisweb_frontend/commit/a28037a02a3f1f9f8935e8591f21ef7c13f6e978))
* **vue:** use vuetify tree prop to NgwLayersList selection strategy ([e1f4a95](https://github.com/nextgis/nextgisweb_frontend/commit/e1f4a95a03189f1cd50ada7dfb95fd5b4a5284aa))
* **vue:** VueNgwControl from string  kind option ([9a1a51b](https://github.com/nextgis/nextgisweb_frontend/commit/9a1a51b4ecad8f74f2bb2f54b67c34b94c4237ad))
* **vue:** VueNgwMap add onLoad event ([8dfb1b8](https://github.com/nextgis/nextgisweb_frontend/commit/8dfb1b87603af23281f73803d5fad19b6df0ef6a))
* **vue:** VueNgwMap bounds param watch ([d685f49](https://github.com/nextgis/nextgisweb_frontend/commit/d685f49d30f909b67defb2c02a19ca25b8819f2e))
* **vue:** vuex ResourceStore override delete function ability ([c31c2df](https://github.com/nextgis/nextgisweb_frontend/commit/c31c2dffeddb2687b95c1f56f752c74cfabbbb23))
* **webmap:** add `getBoundsPoly` webmap util ([d286452](https://github.com/nextgis/nextgisweb_frontend/commit/d2864528108180a41e3ace5f3b50987c770db040))
* **webmap:** add addLayer onAdded option ([880ccbb](https://github.com/nextgis/nextgisweb_frontend/commit/880ccbba94e7e0309260cce01790bd039ce3039d))
* **webmap:** add async control in correct order ([e79572c](https://github.com/nextgis/nextgisweb_frontend/commit/e79572ca8dbe3d41eefb64e9203fa16d0c9aec9e))
* **webmap:** add getControlContainer method ([827049d](https://github.com/nextgis/nextgisweb_frontend/commit/827049d00b349f7e8c5bb1d19da94b793b794829))
* **webmap:** add labelVisibility layer adapter option ([7c8ed91](https://github.com/nextgis/nextgisweb_frontend/commit/7c8ed91192d86ed09fee46799f52aad65600f11c))
* **webmap:** add map mouse move events ([c50638c](https://github.com/nextgis/nextgisweb_frontend/commit/c50638ccefad63e9b21416e922ea0d4c33fc1adf))
* **webmap:** add MapAdapter map options ([15e3c50](https://github.com/nextgis/nextgisweb_frontend/commit/15e3c50eb61c8457e9695e527274beb6cf751a6a))
* **webmap:** add setLayerPaint method ([3cadfbf](https://github.com/nextgis/nextgisweb_frontend/commit/3cadfbfac802c19ad0e981e944be69a07f548414))
* **webmap:** add special MapAdapterOptions option to MapOptions ([9785d13](https://github.com/nextgis/nextgisweb_frontend/commit/9785d13697b091de07109f12b2f08e7e255516a5))
* **webmap:** add WebMapLayers.unSelectLayers method ([99d606a](https://github.com/nextgis/nextgisweb_frontend/commit/99d606a1a3d8d9b02cb1a529084754b60cf3edca))
* **webmap:** change default behaviour of addLayer visibility option, its now true ([d0f9f0e](https://github.com/nextgis/nextgisweb_frontend/commit/d0f9f0e76b7a4195b1b7b9e5413de7f81502bfbc))
* **webmap:** change default maxZoom option to 20 ([f93bc19](https://github.com/nextgis/nextgisweb_frontend/commit/f93bc193e43b010c3b5d41e02149c68d88dfdfb5))
* **webmap:** create webmap from TileJson ([07fa33e](https://github.com/nextgis/nextgisweb_frontend/commit/07fa33ea1ae914f6cd53ef42e4453b9c76a3a357))
* **webmap:** get zoom from tilejson ([b5b6f20](https://github.com/nextgis/nextgisweb_frontend/commit/b5b6f205b86850246da29f678e6cd36c68934c5b))
* **webmap:** getZoom return number or fail ([08df46d](https://github.com/nextgis/nextgisweb_frontend/commit/08df46dd1028743e6c9596e079db19b60c209eb4))
* **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([928d351](https://github.com/nextgis/nextgisweb_frontend/commit/928d351fea9a321c178ecbb4e03a70bd9a64fc90))
* **webmap:** layer adapter waitFullLoad and crossOrigin new options ([5e2b6d2](https://github.com/nextgis/nextgisweb_frontend/commit/5e2b6d2ae1db3b48775bca7f31a85338d451d61a))
* **webmap:** make propertiesFilter async ([2eca455](https://github.com/nextgis/nextgisweb_frontend/commit/2eca455688c06edd2433e1497c8818f5b4a765ef))
* **webmap:** nesting for propertiesFilter utility ([47df80c](https://github.com/nextgis/nextgisweb_frontend/commit/47df80c305b223b440ea9203ad6bf52707555388))
* **webmap:** new addImageLayer shortcut WebMap method ([2c697eb](https://github.com/nextgis/nextgisweb_frontend/commit/2c697eb824b665dde1635365373c3af5095f5ed6))
* **webmap:** new addTileLayer shortcut WebMap method ([a209dfc](https://github.com/nextgis/nextgisweb_frontend/commit/a209dfc8b09bde6b99ebea4604a5238f40a1f911))
* **webmap:** new method getCoordFromMapClick ([ca29bd5](https://github.com/nextgis/nextgisweb_frontend/commit/ca29bd55a0cc0a7e471fa3e2a928c771b39c3260))
* **webmap:** new static method WebMap.get(id) to get webmap instance ([0caea45](https://github.com/nextgis/nextgisweb_frontend/commit/0caea451885aa5512bca37525686f03cf4c26704))
* **webmap:** paint from expressions ([fb492d1](https://github.com/nextgis/nextgisweb_frontend/commit/fb492d1bab2cbd8b64944cccd52565b24efd06aa))
* **webmap:** paint from properties filter ([64ba0f7](https://github.com/nextgis/nextgisweb_frontend/commit/64ba0f7d957c2a902691e7245276b8f78356586c))
* **webmap:** ratio in vectorlayer adapter interface ([a001a23](https://github.com/nextgis/nextgisweb_frontend/commit/a001a232e2b0e08d27116ca274725521a26d4565))
* **webmap:** remove control from promise ([314b5c1](https://github.com/nextgis/nextgisweb_frontend/commit/314b5c10168c82c3531072779ea5f3785015d6cb))
* **webmap:** update layer adapter options ([7c04879](https://github.com/nextgis/nextgisweb_frontend/commit/7c04879dc05945e7ef28cc77f8193f627fa7b303))
* **webmap:** update PropertiesFilter interface ([8ef2e3b](https://github.com/nextgis/nextgisweb_frontend/commit/8ef2e3b937204a4a7440cce231d08e35c6393114))
* **webmap:** vector layer select event ([5bc51ac](https://github.com/nextgis/nextgisweb_frontend/commit/5bc51ac9c98efa785fd34db3d5e71514f269ffd1))
* **webmap:** webmap container get set functions ([5bc309e](https://github.com/nextgis/nextgisweb_frontend/commit/5bc309e378b93615d592025acb2f8eea0419cc4f))
* **webmap:** zoomIn and zoomOut MapAdapter optional methods ([0198102](https://github.com/nextgis/nextgisweb_frontend/commit/01981023a852f8c7712395da8efead0f64221e03))


### Performance Improvements

* **leaflet:** abort image overlay request on view change ([4587532](https://github.com/nextgis/nextgisweb_frontend/commit/45875328ba48453ce5fcbe730cfa4fbd12633d2c))
* **leaflet:** abort xhr tile loading on setView ([9505841](https://github.com/nextgis/nextgisweb_frontend/commit/9505841c1b7a458b3148c457753ec4946bcd89e1))
* **leaflet:** setViewDelay for tile layer ([3712825](https://github.com/nextgis/nextgisweb_frontend/commit/371282587521961c043fff404dd9b5e474e6c2e5))
* **mapbox:** selection with PropertiesFilter ([212b052](https://github.com/nextgis/nextgisweb_frontend/commit/212b052456223774fed38156aead15b01bb947b7))
* **mapbox:** upgrade layer ordering ([125d900](https://github.com/nextgis/nextgisweb_frontend/commit/125d900e800f645701d63a1b5379b019feaaa186))
* **mapbox:** vector layer click event prevent by order ([3e42d44](https://github.com/nextgis/nextgisweb_frontend/commit/3e42d441fef0f82342406e53d8949345bba54056))
* **ngw-commector:** decrease get resource queries count ([6af4f4f](https://github.com/nextgis/nextgisweb_frontend/commit/6af4f4f4c51261c2205d59084f7c0d1e89a4d1bd))
* **ngw-connector:** getResourceByKeyname one request ([f9b6554](https://github.com/nextgis/nextgisweb_frontend/commit/f9b6554f3b7ceb1d5efcfeab09fe8ec47bebe1e3))
* **ngw-kit:** abort BBOX request on map movestart ([a985f50](https://github.com/nextgis/nextgisweb_frontend/commit/a985f507d1358cc5753db2345d3b89a04c1e1847))
* **ngw-kit:** default limit to load large vector layer data ([bcdba09](https://github.com/nextgis/nextgisweb_frontend/commit/bcdba0973fad5204bf3b067afa9cfdb692d48a99))
* **ngw-kit:** geojson adapter not blocked on data load ([1fe9df6](https://github.com/nextgis/nextgisweb_frontend/commit/1fe9df685aec00c5569e3af20194c873362b3999))
* **ngw-map:** identify only when listeners exist ([e97ad73](https://github.com/nextgis/nextgisweb_frontend/commit/e97ad730e3afa01fa36a4dc06c6acd5f66159d02))
* **ol-map-adapter:** style function for each feature ([7fc99ae](https://github.com/nextgis/nextgisweb_frontend/commit/7fc99ae96249d5d3f816abfac7b4221028459b18))
* **vuetify:** replace components gwMap param with webMapId ([e807f90](https://github.com/nextgis/nextgisweb_frontend/commit/e807f90de22cafeb4409cca11ceba863275cd542))
* **vue:** Vuetify NgwLayersList set visibility only for changed ([b7bd76c](https://github.com/nextgis/nextgisweb_frontend/commit/b7bd76c63c9338fcbbe3e9fb7ae26e61cd2b8551))
* **webmap:** addControl coner queue ([adee416](https://github.com/nextgis/nextgisweb_frontend/commit/adee416f29503b8acb3d37837ca68178de8258fa))


### types

* **ngw-connector:** rename ([85bf430](https://github.com/nextgis/nextgisweb_frontend/commit/85bf430fa9fc25f427a9861e35f267d243c26ed8))
* rename interface ([d16b4c3](https://github.com/nextgis/nextgisweb_frontend/commit/d16b4c30c63938bf76e412ae3c968ffc8424b478))


### wip

* rename VectorLayerAdapterType ([726ab7d](https://github.com/nextgis/nextgisweb_frontend/commit/726ab7dd7cd112750165a9e15c5672086cd8261a))
* **util:** move CancelablePromise to util ([a687a8f](https://github.com/nextgis/nextgisweb_frontend/commit/a687a8fe0b8389adeb2a6d6f97db330c2f60ad48))


### BREAKING CHANGES

* **ngw-connector:** The getUserInfo mehod does not emit any more login events. Only login method does this
* **vue-ngw-map:** Vue is now required as peer dependency
* **ngw-uploader:** `createInput` and `dialog` methods have been moved from the `@nextgis/ngw-uploader` to the new `@nextgis/ngw-uploader-input`
* **ngw-kit:** remove default `maxBounds` option fron ngw-kit
* **webmap:** webMap.getZoom() do not return undefined more; number or fail
* **ngw-connector:** FeatureLayerFields type is now FeatureProperties
* change GetNgwLayerItemsOptions to GetNgwItemsOptions
* **ngw-kit:** `extensions` for any ngw feature request is now empty for default
* **utils:** removed latLng from MapClickEvent, use lngLat: numner[] instead
* **webmap:** changed the default paint: the fill is semi-transparent, add stroke
* `new WebMap({ mapAdapter: new MapAdapter(), ...appOptions, mapOptions: MapOptions })` > `new WebMap(mapOptions)`
* `new NgwMap(new MapAdapter(), ngwMapOptions)` > `new NgwMap(ngwMapOptions)`
* `WebMapOptions.create` is now `true` by default
* **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead
* **ngw-kit:** replace `import { WebMapLayerAdapter } from @nextgis/ngw-kit` to `import { NgwWebmapLayerAdapter } from @nextgis/ngw-kit` and `import { WebMapLayerItem} from @nextgis/ngw-kit` to `import { NgwWebmapLayerItem } from @nextgis/ngw-kit`
* No more default export from `qms-kit`. You should replace `import QmsKit from "@nextgis/qms-kit"` to `import { QmsKit } from "@nextgis/qms-kit"` everywhere
* No more default export from `ngw-map`. You should replace `import NgwMap from "@nextgis/ngw-map"` to `import { NgwMap } from "@nextgis/ngw-map"` everywhere
* **webmap:** the added layer `visibility` is now `true`
* LayerAdapter option baseLayer was renamed to baselayer;
* webMap.getBaseLayers() method now return LayerAdapter, not string array of ids
* rename VectorLayerAdapter types: circle > point; fill > polygon
* **ngw-kit:** rename NgwKit.utils.getIdentifyGeoJsonParams > NgwKit.utils.getIdentifyItems
* **cancelable-promise:** Removed onCancel argument from CancelablePromise. Now you should handle catch CancelError
* code formatting rules changed to prettier 2.0 compatibility
* **webmap:** New Paint specification may cause problems with types
* `propertiesFilter` removed from `@nextgis/utils`
* **util:** CancelablePromise has been removed from ngw-connecter. Now you should do this: import {CancelablePromise} from '@nextgis/utils;'
* MARKER layer adapter has been removed. Use ddLayer('GEOJSON', {data}) instead of ddLayer('MARKER', {lngLat})
* **util:** Use xport { propertiesFilter } from '@nextgis/utils'; instead of Webmap.utils.propertiesFilter
* Сhanged approach to writing commit messages. Read [convention](https://github.com/nextgis/nextgisweb_frontend/blob/master/.github/commit-convention.md)





## [1.16.7](https://github.com/nextgis/nextgisweb_frontend/compare/v1.16.6...v1.16.7) (2023-04-21)


### Features

* **ol-map-adapter:** hide and show label dynamic ([65f30c0](https://github.com/nextgis/nextgisweb_frontend/commit/65f30c05d0cc4e40ca0272f34b55b0481b97d448))
* **qms-kit:** update createAdapter options interface ([f1e83e7](https://github.com/nextgis/nextgisweb_frontend/commit/f1e83e7f2cba2af1942c80c100344d130f9d0067))
* **webmap:** add labelVisibility layer adapter option ([298a697](https://github.com/nextgis/nextgisweb_frontend/commit/298a697f65bc5e53f6cf0ea82e688e2f3311f01d))





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
