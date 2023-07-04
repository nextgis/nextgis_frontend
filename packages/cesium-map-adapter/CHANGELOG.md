# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.16.9](https://github.com/nextgis/nextgis_frontend/compare/v1.16.8...v1.16.9) (2023-07-04)

**Note:** Version bump only for package @nextgis/cesium-map-adapter





## 1.16.8 (2023-05-14)


### Bug Fixes

* **build:** control-container extract css ([a02d24b](https://github.com/nextgis/nextgis_frontend/commit/a02d24bf2dbe246420803d5d1be9348e4b647c6d))
* **cesium-map-adapter:** extent from bounding sphere ([65b592a](https://github.com/nextgis/nextgis_frontend/commit/65b592a46b8404ba301867497e3e7f7535f77e83))
* **cesium-map-adapter:** set layer adapters request headers ([38074ba](https://github.com/nextgis/nextgis_frontend/commit/38074ba672e67a635f6c1ea7e30f7de5489a0af3))
* **cesium-map-adapter:** update geojson adapter ([40d877f](https://github.com/nextgis/nextgis_frontend/commit/40d877ffb72dc7f3bcbcb963d1e87f7bb5937748))
* **cesium:** add check for telset3d adapter addLayer ([3642e69](https://github.com/nextgis/nextgis_frontend/commit/3642e69575a4287823cd72bee569b0c9a6089eda))
* **cesium:** cesium geojson layer style ([27f4cbe](https://github.com/nextgis/nextgis_frontend/commit/27f4cbe3db804f6066d955b7cbf25f6f37daa7eb))
* **cesium:** change geojson extrude height set ([b00bf53](https://github.com/nextgis/nextgis_frontend/commit/b00bf534bba84a03ef7a38eb2011746bf9b81ec4))
* **cesium:** disable zoom undergroung ([2455e38](https://github.com/nextgis/nextgis_frontend/commit/2455e3807feb242d5317c219be23eb0455d3d156))
* **cesium:** do not clamp to ground 3d geojson ([121587b](https://github.com/nextgis/nextgis_frontend/commit/121587b7e09d44d498f6d47f304bbec3cea6a0e4))
* **cesium:** empty default imagery provider ([17396f8](https://github.com/nextgis/nextgis_frontend/commit/17396f843f72ac5f6629ec82d53748c259754a0b))
* **cesium:** fitBounds for not Scene3D modes ([8fbe25c](https://github.com/nextgis/nextgis_frontend/commit/8fbe25ca260abbac21278c574dc87f85cfe9c8ab))
* **cesium:** fix Tilset3D setHeight ([2f93801](https://github.com/nextgis/nextgis_frontend/commit/2f93801a559933f9472067553b7d02d857a38c50))
* **cesium:** geojson terrainsample ([deb790c](https://github.com/nextgis/nextgis_frontend/commit/deb790cef81f620eeef4cca9a0398fa37fb6f99b))
* **cesium:** GeoJsonAdapter pin color from empty string ([ff9a390](https://github.com/nextgis/nextgis_frontend/commit/ff9a390a60c9f8ba3bfbe4b9816849f8ab267c08))
* **cesium:** remove default imagery provider ([2ee228d](https://github.com/nextgis/nextgis_frontend/commit/2ee228d456a0305b6b5eebc8bd2a3cba9f1187db))
* **cesium:** scene requestRender on layers visibility change ([dd0dee5](https://github.com/nextgis/nextgis_frontend/commit/dd0dee562575fb38eda2eca347bab27072b21e93))
* **cesium:** TileAdapter baselayer ordering ([9318a37](https://github.com/nextgis/nextgis_frontend/commit/9318a3780105ac8d4ea8ed6673288ff3d5385dde))
* **cesium:** TileLayer ordering ([45c6fc3](https://github.com/nextgis/nextgis_frontend/commit/45c6fc334f6ceb5a12c671c73e13210bdfd51a46))
* **cesium:** Tileset#DAdapter set terrain height ([4245446](https://github.com/nextgis/nextgis_frontend/commit/42454467846f2f5b0aaab5c2a74178acc7ae1e37))
* **cesium:** Tilset3D adapter paint ([bb71211](https://github.com/nextgis/nextgis_frontend/commit/bb712116bd59a59d268057bf155680db55bacd5a))
* **ngw-connector:** clean cache on resource delete ([7fc716c](https://github.com/nextgis/nextgis_frontend/commit/7fc716cba13ea964cef8e23d19ab7577b1b6b86a))
* **ngw-connector:** fixes to apiRequest cancel work ([e4451d8](https://github.com/nextgis/nextgis_frontend/commit/e4451d8a7ad349ba17692a3f906677f1a29bf691)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)
* **ngw-kit:** create async adapter from parent resource ([5ce6394](https://github.com/nextgis/nextgis_frontend/commit/5ce6394c4d9313c79f6d540df0b1683648a6af83))
* **ngw-kit:** make async onFirstShowAdapter hide and show methods ([502b261](https://github.com/nextgis/nextgis_frontend/commit/502b261b478872aed0bed0657b961481c22ce109))
* **ngw-kit:** resolve createGeoJsonAdapter options override II ([c211843](https://github.com/nextgis/nextgis_frontend/commit/c211843d65daf40c506d641dca43ef8265745ead))
* **ngw-kit:** show only one enabled webmap basemap ([1087074](https://github.com/nextgis/nextgis_frontend/commit/10870746582396ed8f710ea07af1d45f1b517b5c))
* **ngw-kit:** webmap iten async addLayer method ([21ee8ac](https://github.com/nextgis/nextgis_frontend/commit/21ee8ac0bed083a3a762f08f519d753d6dc32c38))
* **qms-kit:** mix layerAdapter class property ([502cdcf](https://github.com/nextgis/nextgis_frontend/commit/502cdcf87e40c09e8cbc31a322ab40872a813a98))
* remove require imports ([2674a8c](https://github.com/nextgis/nextgis_frontend/commit/2674a8ce29ef4116b939283ee1f4ec02b26b8025))
* **vue:** fix vue observable leaks ([53fcb88](https://github.com/nextgis/nextgis_frontend/commit/53fcb886ada33e8deddd40d7899cab76e48d47f6))
* **vuetify:** correction for set empty BasemapSelect text ([7a5ac48](https://github.com/nextgis/nextgis_frontend/commit/7a5ac48724243c0c38b39a808561b222493bf9af))
* **vuetify:** NgwLayersList root item hide ([73ab6d1](https://github.com/nextgis/nextgis_frontend/commit/73ab6d180444843b9ace2bb36d2b797950762806))
* **vuetify:** update items on init ([a153fd5](https://github.com/nextgis/nextgis_frontend/commit/a153fd5de0804e0b8e88f2a488c879883e033416))
* **webmap:** webmap constructor options ([e096e72](https://github.com/nextgis/nextgis_frontend/commit/e096e723d76b8db753ecdd0248b601f24fcb5026))


### chore

* build; eslint ([ee1e03d](https://github.com/nextgis/nextgis_frontend/commit/ee1e03d85625b02a09c2ee1e4d66007fbf57d626))


### Code Refactoring

* rename layerAdapter baseLayer option to baselayer ([e5c595d](https://github.com/nextgis/nextgis_frontend/commit/e5c595d6df24b1b22906ad1e06eb60bf0327e9c0))
* **utils:** update geom utils ([43c11b0](https://github.com/nextgis/nextgis_frontend/commit/43c11b0f3c45b22ab66789bd00594d34078316f3))


### Features

* add library `@nextgis/paint` ([0f72300](https://github.com/nextgis/nextgis_frontend/commit/0f723006c722cc0e183a3c2dcfe7b2366e63cd96))
* add new library `ControlContainer` ([bf566e2](https://github.com/nextgis/nextgis_frontend/commit/bf566e218c53462f65a1e0574d812a6e1c667e06))
* **casium:** zoomIn and zoomOut onground control ([e8f9350](https://github.com/nextgis/nextgis_frontend/commit/e8f9350143cc9e26c364826d4534e31fd72d641b))
* **cesium-map-adapter:** add geojson adapter getExtent method ([6cd5b2b](https://github.com/nextgis/nextgis_frontend/commit/6cd5b2b3c936cc4bdb6c4a198b89e94a024e7663))
* **cesium-map-adapter:** add map click event ([93ec86a](https://github.com/nextgis/nextgis_frontend/commit/93ec86a808fe765576d491c6694c3fc5cffa8d7a))
* **cesium-map-adapter:** add subdomains for TileAdapter ([4e8eb42](https://github.com/nextgis/nextgis_frontend/commit/4e8eb428a3769fb95d08bf18417b03885e597fc7))
* **cesium-map-adapter:** add watchTerrainChange geojson option ([54a5a67](https://github.com/nextgis/nextgis_frontend/commit/54a5a670b5918a4bf41862a8a8ec7b8db1d1b28c))
* **cesium-map-adapter:** remove camera inertion ([c8e4073](https://github.com/nextgis/nextgis_frontend/commit/c8e40732dac3f923d6a592ce5e5d93dcd0560936))
* **cesium:** add heightOffset geojson option ([dd51756](https://github.com/nextgis/nextgis_frontend/commit/dd517565d251f1184d1e5b11b46850bdc3eaca77))
* **cesium:** add mapAdapter listeners and getBounds method ([3aaa0a7](https://github.com/nextgis/nextgis_frontend/commit/3aaa0a7eef959e45cf2cd86375c08677a38e4ac7))
* **cesium:** add maximumScreenSpaceError option for tilset3d adapter ([bfb0a65](https://github.com/nextgis/nextgis_frontend/commit/bfb0a65171d44a3d32c012170ef56480f3d3566b))
* **cesium:** add scale and rotate for 3d model adapter ([b443004](https://github.com/nextgis/nextgis_frontend/commit/b4430040a9729f23fd847a1800067b094fb2b4cb))
* **cesium:** add Tileset3dAdapter ([872d485](https://github.com/nextgis/nextgis_frontend/commit/872d4854e76ec30a1dc3e2e397218d86465dcd7d))
* **cesium:** add tilset3d adapter paint options ([445e3e7](https://github.com/nextgis/nextgis_frontend/commit/445e3e717e64f2d859ecbf62b82239710d665e34))
* **cesium:** change default screenSpaceError value ([964bbe1](https://github.com/nextgis/nextgis_frontend/commit/964bbe12492b4fb2bba6cec04d3a926210abe866))
* **cesium:** change layers height on terrain change ([4f67f44](https://github.com/nextgis/nextgis_frontend/commit/4f67f442adf5d52cd2538d26af752ee1612cd25d))
* **cesium:** extrude3d paint option ([d535fc6](https://github.com/nextgis/nextgis_frontend/commit/d535fc664f8acc1d99aaf2e93a70376ab4b6b7c9))
* **cesium:** fitBounds up tp terrain ([733207a](https://github.com/nextgis/nextgis_frontend/commit/733207add48dbaa6f811673129ea6485b70de834))
* **cesium:** geojson adapter paint ([4de7367](https://github.com/nextgis/nextgis_frontend/commit/4de7367fc7203d0ba11328a837be1098e6e710fe))
* **cesium:** get extent of tileset3D ([07bacb7](https://github.com/nextgis/nextgis_frontend/commit/07bacb7c82dfc82fd87883708b80b4a6a3443a53))
* **cesium:** implement getCenter ([6eb5db5](https://github.com/nextgis/nextgis_frontend/commit/6eb5db52ac974a5cfcb7407ced56982b2a22dd6b))
* **cesium:** pin paint implementation for geojson layer ([d2952ff](https://github.com/nextgis/nextgis_frontend/commit/d2952ff9b502575a09d53546c5a7089eff4e986f))
* **cesium:** set custom logo ([4cce1eb](https://github.com/nextgis/nextgis_frontend/commit/4cce1eb606b6204b03173b8359c0b3f098fc0f33))
* **cesium:** set scene view from new adapter option ([04c412f](https://github.com/nextgis/nextgis_frontend/commit/04c412f618d8252d06d238b07b6399ee92fea180))
* **cesium:** skipLevelOfDetail by default ([7b9bf9f](https://github.com/nextgis/nextgis_frontend/commit/7b9bf9f13003348d0998b4c9eb268cc74f3466b6))
* **cesium:** tilset 3d adapter height options ([f28f94a](https://github.com/nextgis/nextgis_frontend/commit/f28f94a90a03ea34e385f6afd9b272197198b030))
* **cesium:** update layer and map adapter ([c942b1a](https://github.com/nextgis/nextgis_frontend/commit/c942b1a741618e6e3d57737dc91257a7dde6aa83))
* **control:** add universal zoom control ([d1371be](https://github.com/nextgis/nextgis_frontend/commit/d1371be1f88085dcfc864de31a7d4d89f2690216))
* handle vector layer mouse over and out events ([1f537c2](https://github.com/nextgis/nextgis_frontend/commit/1f537c277b433db365b319d4bbdfb26aa44528fd))
* **leaflet-map-adapter:** add position to vector adapter layers definition ([053ccf0](https://github.com/nextgis/nextgis_frontend/commit/053ccf05ed8d9d76592c8ca648365e176c609277))
* new @nextgis/dom library ([572d4c2](https://github.com/nextgis/nextgis_frontend/commit/572d4c2c554eb4da30be01c25a2d14cd4125d847))
* **ngw-kit:** add addLayerOptionsPriority for createGeoJsonAdapter ([eb7db26](https://github.com/nextgis/nextgis_frontend/commit/eb7db2620f2bf66812ab90b03f5359c70f46ecf9))
* **ngw-kit:** add NgwKit.utils.getCompanyLogo method ([301ff78](https://github.com/nextgis/nextgis_frontend/commit/301ff78d36b712e93fdfbd03f5c8f57dd93cbc14))
* **ngw-kit:** improve createOnFirstShowAdapter ([fe7e721](https://github.com/nextgis/nextgis_frontend/commit/fe7e7215b0aa2cea90d859a749b784b1e95119c0))
* **ngw-kit:** make create basemap layer adapter universal ([b17781d](https://github.com/nextgis/nextgis_frontend/commit/b17781df8afabd9e5353a07c94a3769390ea8591))
* **ngw-kit:** ngwwebmap item toggle on zoom layer range ([52abb1d](https://github.com/nextgis/nextgis_frontend/commit/52abb1d2fee3b2c306b9269e8287d98362ef5128))
* **ngw-map:** add promise groups handler ([2fb6ab1](https://github.com/nextgis/nextgis_frontend/commit/2fb6ab152037e04fb037313140536e3e4ac8a938))
* **ngw:** option to create popup content from item ([509be03](https://github.com/nextgis/nextgis_frontend/commit/509be030f043719276bb464fe5f5a686cae76e21))
* **paint:** add experimental paint 3d style ([25fce10](https://github.com/nextgis/nextgis_frontend/commit/25fce10064a2b38f8e50f92402b585956ce5b425))
* **utils:** add debug log util ([35b2173](https://github.com/nextgis/nextgis_frontend/commit/35b21732aa785ad3c16d3972be439dcef8be7e6a))
* **utils:** deprecated helper utils ([d324e3f](https://github.com/nextgis/nextgis_frontend/commit/d324e3f9e0babdb10779a0add5d53bae78235086))
* **webmap:** add special MapAdapterOptions option to MapOptions ([9785d13](https://github.com/nextgis/nextgis_frontend/commit/9785d13697b091de07109f12b2f08e7e255516a5))
* **webmap:** change default maxZoom option to 20 ([f93bc19](https://github.com/nextgis/nextgis_frontend/commit/f93bc193e43b010c3b5d41e02149c68d88dfdfb5))
* **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([928d351](https://github.com/nextgis/nextgis_frontend/commit/928d351fea9a321c178ecbb4e03a70bd9a64fc90))
* **webmap:** update layer adapter options ([7c04879](https://github.com/nextgis/nextgis_frontend/commit/7c04879dc05945e7ef28cc77f8193f627fa7b303))
* **webmap:** zoomIn and zoomOut MapAdapter optional methods ([0198102](https://github.com/nextgis/nextgis_frontend/commit/01981023a852f8c7712395da8efead0f64221e03))


### BREAKING CHANGES

* **utils:** removed latLng from MapClickEvent, use lngLat: numner[] instead
* **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead
* LayerAdapter option baseLayer was renamed to baselayer;
* webMap.getBaseLayers() method now return LayerAdapter, not string array of ids
* code formatting rules changed to prettier 2.0 compatibility





## [1.16.7](https://github.com/nextgis/nextgis_frontend/compare/v1.16.6...v1.16.7) (2023-04-21)

**Note:** Version bump only for package @nextgis/cesium-map-adapter





## [1.16.6](https://github.com/nextgis/nextgis_frontend/compare/v1.16.5...v1.16.6) (2023-02-09)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.16.5](https://github.com/nextgis/nextgis_frontend/compare/v1.16.4...v1.16.5) (2023-02-09)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.16.2](https://github.com/nextgis/nextgis_frontend/compare/v1.16.1...v1.16.2) (2022-09-15)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.16.1](https://github.com/nextgis/nextgis_frontend/compare/v1.16.0...v1.16.1) (2022-09-03)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.16.0](https://github.com/nextgis/nextgis_frontend/compare/v1.15.1...v1.16.0) (2022-08-28)

### Features

- **cesium:** add heightOffset geojson option ([caa9626](https://github.com/nextgis/nextgis_frontend/commit/caa9626457d28265ca169e97e006a23f9d6e452e))
- **paint:** add experimental paint 3d style ([74ddd65](https://github.com/nextgis/nextgis_frontend/commit/74ddd65d72fdd5539868d27da58a949ea26cd365))

## [1.15.1](https://github.com/nextgis/nextgis_frontend/compare/v1.15.0...v1.15.1) (2022-08-02)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.15.0](https://github.com/nextgis/nextgis_frontend/compare/v1.14.0...v1.15.0) (2022-07-27)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.14.0](https://github.com/nextgis/nextgis_frontend/compare/v1.13.8...v1.14.0) (2022-07-05)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.13.8](https://github.com/nextgis/nextgis_frontend/compare/v1.13.7...v1.13.8) (2022-06-25)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.13.6](https://github.com/nextgis/nextgis_frontend/compare/v1.13.5...v1.13.6) (2022-06-05)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.13.3](https://github.com/nextgis/nextgis_frontend/compare/v1.13.2...v1.13.3) (2022-05-31)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.13.2](https://github.com/nextgis/nextgis_frontend/compare/v1.13.1...v1.13.2) (2022-05-30)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.13.0](https://github.com/nextgis/nextgis_frontend/compare/v1.12.1...v1.13.0) (2022-05-13)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.12.1](https://github.com/nextgis/nextgis_frontend/compare/v1.12.0...v1.12.1) (2022-04-21)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.12.0](https://github.com/nextgis/nextgis_frontend/compare/v1.11.10...v1.12.0) (2022-03-05)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.11.10](https://github.com/nextgis/nextgis_frontend/compare/v1.11.9...v1.11.10) (2022-01-20)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.11.7](https://github.com/nextgis/nextgis_frontend/compare/v1.11.6...v1.11.7) (2022-01-11)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.11.0](https://github.com/nextgis/nextgis_frontend/compare/v1.10.0...v1.11.0) (2021-12-19)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.10.0](https://github.com/nextgis/nextgis_frontend/compare/v1.9.7...v1.10.0) (2021-11-30)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.9.4](https://github.com/nextgis/nextgis_frontend/compare/v1.9.3...v1.9.4) (2021-11-16)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.9.3](https://github.com/nextgis/nextgis_frontend/compare/v1.9.2...v1.9.3) (2021-11-05)

### Bug Fixes

- **ngw-connector:** clean cache on resource delete ([0816107](https://github.com/nextgis/nextgis_frontend/commit/0816107542757838811a7ed9b9e814e51912254c))

## [1.9.2](https://github.com/nextgis/nextgis_frontend/compare/v1.9.1...v1.9.2) (2021-10-26)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.9.1](https://github.com/nextgis/nextgis_frontend/compare/v1.9.0...v1.9.1) (2021-10-25)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.9.0](https://github.com/nextgis/nextgis_frontend/compare/v1.8.5...v1.9.0) (2021-10-23)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.8.4](https://github.com/nextgis/nextgis_frontend/compare/v1.8.3...v1.8.4) (2021-10-21)

### Features

- **ngw-kit:** ngwwebmap item toggle on zoom layer range ([f7c4e42](https://github.com/nextgis/nextgis_frontend/commit/f7c4e42fe323f9e4941dbc37893b3beb2ccd7751))

## [1.8.3](https://github.com/nextgis/nextgis_frontend/compare/v1.8.2...v1.8.3) (2021-10-12)

### Bug Fixes

- **ngw-kit:** make async onFirstShowAdapter hide and show methods ([e5d43b6](https://github.com/nextgis/nextgis_frontend/commit/e5d43b6156cd961619908a9100e204c36d42bcb0))

## [1.8.2](https://github.com/nextgis/nextgis_frontend/compare/v1.8.1...v1.8.2) (2021-10-05)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.8.1](https://github.com/nextgis/nextgis_frontend/compare/v1.8.0...v1.8.1) (2021-09-23)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.8.0](https://github.com/nextgis/nextgis_frontend/compare/v1.7.0...v1.8.0) (2021-09-22)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.7.0](https://github.com/nextgis/nextgis_frontend/compare/v1.6.0...v1.7.0) (2021-09-16)

### Features

- **leaflet-map-adapter:** add position to vector adapter layers definition ([61cb7a5](https://github.com/nextgis/nextgis_frontend/commit/61cb7a591ed3ececcabed710abf1e0aec6708c1b))

# [1.6.0](https://github.com/nextgis/nextgis_frontend/compare/v1.5.1...v1.6.0) (2021-09-09)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.5.1](https://github.com/nextgis/nextgis_frontend/compare/v1.5.0...v1.5.1) (2021-09-06)

### Features

- **cesium-map-adapter:** remove camera inertion ([45924fc](https://github.com/nextgis/nextgis_frontend/commit/45924fcb8622aabab777d643278fd543f672b918))
- **webmap:** change default maxZoom option to 20 ([11d2e99](https://github.com/nextgis/nextgis_frontend/commit/11d2e99fcc53976cfb00acc4b5d711cdf2e28fc3))

# [1.5.0](https://github.com/nextgis/nextgis_frontend/compare/v1.4.0...v1.5.0) (2021-08-19)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.4.0](https://github.com/nextgis/nextgis_frontend/compare/v1.3.0...v1.4.0) (2021-08-17)

### Bug Fixes

- **cesium-map-adapter:** update geojson adapter ([a964c45](https://github.com/nextgis/nextgis_frontend/commit/a964c453b3eee87341e6f24f4df29843f41d9fb6))

# [1.3.0](https://github.com/nextgis/nextgis_frontend/compare/v1.2.8...v1.3.0) (2021-08-06)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.2.8](https://github.com/nextgis/nextgis_frontend/compare/v1.2.7...v1.2.8) (2021-07-27)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.2.7](https://github.com/nextgis/nextgis_frontend/compare/v1.2.6...v1.2.7) (2021-07-26)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.2.4](https://github.com/nextgis/nextgis_frontend/compare/v1.2.3...v1.2.4) (2021-07-22)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.2.3](https://github.com/nextgis/nextgis_frontend/compare/v1.2.2...v1.2.3) (2021-07-21)

### Bug Fixes

- **cesium:** empty default imagery provider ([f17c211](https://github.com/nextgis/nextgis_frontend/commit/f17c2113e24a2af46bd6283eb64eb10b5b987ac9))

## [1.2.2](https://github.com/nextgis/nextgis_frontend/compare/v1.2.1...v1.2.2) (2021-07-16)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.2.1](https://github.com/nextgis/nextgis_frontend/compare/v1.2.0...v1.2.1) (2021-07-12)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.2.0](https://github.com/nextgis/nextgis_frontend/compare/v1.1.2...v1.2.0) (2021-07-08)

### Features

- handle vector layer mouse over and out events ([2e94152](https://github.com/nextgis/nextgis_frontend/commit/2e94152fac64b8e022dab7940614487763ce57af))

## [1.1.2](https://github.com/nextgis/nextgis_frontend/compare/v1.1.1...v1.1.2) (2021-06-28)

### Features

- **cesium:** change default screenSpaceError value ([9a417d6](https://github.com/nextgis/nextgis_frontend/commit/9a417d6c3b64a01f6e6d94abfa08cbdd942b1038))

# [1.1.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.1...v1.1.0) (2021-06-25)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [1.0.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0...v1.0.1) (2021-06-08)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.0.0](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.9...v1.0.0) (2021-06-07)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.0.0-beta.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2021-05-03)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.0.0-beta.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2021-05-02)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.0.0-beta.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2021-04-23)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.0.0-beta.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2021-04-04)

### Bug Fixes

- **cesium:** change geojson extrude height set ([96df3c2](https://github.com/nextgis/nextgis_frontend/commit/96df3c257c6ef07ca9139bdb456936399f1a539f))
- **vue:** fix vue observable leaks ([612ea1f](https://github.com/nextgis/nextgis_frontend/commit/612ea1fc72898e1061d4bb3b2a107e59230afd20))

# [1.0.0-beta.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2021-02-13)

### Bug Fixes

- **cesium:** TileLayer ordering ([41a8f05](https://github.com/nextgis/nextgis_frontend/commit/41a8f05dc5050b54886b1bac22fbd31fb6218f14))
- **cesium:** Tilset3D adapter paint ([5f6160a](https://github.com/nextgis/nextgis_frontend/commit/5f6160af45867a3a31697c0b1659619a5a09fcee))

### Features

- **cesium:** add tilset3d adapter paint options ([a9caba5](https://github.com/nextgis/nextgis_frontend/commit/a9caba56225609202ff350e232ada5af77bbfa6a))
- **ngw-kit:** improve createOnFirstShowAdapter ([7a522d7](https://github.com/nextgis/nextgis_frontend/commit/7a522d7ca715ef49c41e219b955b4eba573973dd))

# [1.0.0-beta.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-01-17)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.0.0-beta.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-12-19)

### Bug Fixes

- **cesium-map-adapter:** extent from bounding sphere ([336bbe9](https://github.com/nextgis/nextgis_frontend/commit/336bbe901ca8d982b32eadbdcf2d603886667815))
- **ngw-kit:** show only one enabled webmap basemap ([18a6022](https://github.com/nextgis/nextgis_frontend/commit/18a6022f5b58b45ee6b5bd92c6053fe3d3842866))

### Features

- **cesium-map-adapter:** add watchTerrainChange geojson option ([15f1d8e](https://github.com/nextgis/nextgis_frontend/commit/15f1d8ef5ba427b5dc27f6c9d9b470887947ab4d))

# [1.0.0-beta.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-11-28)

### Bug Fixes

- **ngw-connector:** fixes to apiRequest cancel work ([0ac44ee](https://github.com/nextgis/nextgis_frontend/commit/0ac44eee447019593ae80529cc3b063171f8f88c)), closes [#6](https://github.com/nextgis/nextgis_frontend/issues/6)

### Features

- **cesium-map-adapter:** add geojson adapter getExtent method ([84f0fb9](https://github.com/nextgis/nextgis_frontend/commit/84f0fb991c1f013d0f08e28c4e168d85cb1d31a4))
- **cesium-map-adapter:** add map click event ([90ac3ab](https://github.com/nextgis/nextgis_frontend/commit/90ac3ab3464341984da524306b19f0e966e1ef72))
- **cesium-map-adapter:** add subdomains for TileAdapter ([36e6b93](https://github.com/nextgis/nextgis_frontend/commit/36e6b932c7f1b62ece5ca2d1ff1109e3e65be97f))
- **ngw-map:** add promise groups handler ([864fc6d](https://github.com/nextgis/nextgis_frontend/commit/864fc6d3a905e72136df3795f1e86046d54e0fd4))
- **utils:** add debug log util ([6435c77](https://github.com/nextgis/nextgis_frontend/commit/6435c779050faa8b0e36945c69bbd22a55dba5ca))
- **utils:** deprecated helper utils ([9bab695](https://github.com/nextgis/nextgis_frontend/commit/9bab695eb840d49015c739c8f871305e57640aab))

### BREAKING CHANGES

- **utils:** removed latLng from MapClickEvent, use lngLat: numner[] instead

# [1.0.0-beta.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2020-11-16)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.0.0-alpha.11](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2020-11-02)

### Bug Fixes

- **cesium:** disable zoom undergroung ([fac7bdf](https://github.com/nextgis/nextgis_frontend/commit/fac7bdf43fd570aba5f97ec13c77225e32e32a0b))
- **cesium:** do not clamp to ground 3d geojson ([78e1be3](https://github.com/nextgis/nextgis_frontend/commit/78e1be384b3a708d2c89136d3f63890315b738b8))

# [1.0.0-alpha.10](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-10-20)

### Features

- **casium:** zoomIn and zoomOut onground control ([00818d0](https://github.com/nextgis/nextgis_frontend/commit/00818d08489456dc0c5104191e70cf9c21c945f3))

# [1.0.0-alpha.9](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-10-15)

### Bug Fixes

- **cesium-map-adapter:** set layer adapters request headers ([eb2b570](https://github.com/nextgis/nextgis_frontend/commit/eb2b5702062b44b7885d3582fe953986fd4b02d9))
- **webmap:** webmap constructor options ([8c92b6c](https://github.com/nextgis/nextgis_frontend/commit/8c92b6c17e4b0f69630abb5ad0ffa78234d50a6f))

# [1.0.0-alpha.8](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-06)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.0.0-alpha.7](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-09-22)

### Bug Fixes

- **cesium:** TileAdapter baselayer ordering ([c7805c9](https://github.com/nextgis/nextgis_frontend/commit/c7805c9fc44303bc936b7af96a101aecc126ed91))

### Code Refactoring

- **utils:** update geom utils ([b7e1f7a](https://github.com/nextgis/nextgis_frontend/commit/b7e1f7aab478603f35c49470cfff71d09f58d922))

### BREAKING CHANGES

- **utils:** WebMap static property utils have been removed, import utilites from `@nextgis/webmap` library instead

# [1.0.0-alpha.6](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-09-09)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.0.0-alpha.5](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-08-25)

### Bug Fixes

- **cesium:** add check for telset3d adapter addLayer ([8fbb0f3](https://github.com/nextgis/nextgis_frontend/commit/8fbb0f3741277da85aba68b8f46ab3d64c71a976))
- **ngw-kit:** webmap iten async addLayer method ([ca90340](https://github.com/nextgis/nextgis_frontend/commit/ca90340b927704d5c0101041fe1caa54d62ce164))

# [1.0.0-alpha.4](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-08-14)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.0.0-alpha.3](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-08-08)

### Bug Fixes

- remove require imports ([be789b8](https://github.com/nextgis/nextgis_frontend/commit/be789b89f39741efe146da97eeb19460a7cca527))

# [1.0.0-alpha.2](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-07-30)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.0.0-alpha.1](https://github.com/nextgis/nextgis_frontend/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-07-28)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [1.0.0-alpha.0](https://github.com/nextgis/nextgis_frontend/compare/v0.32.0...v1.0.0-alpha.0) (2020-07-24)

### Bug Fixes

- **cesium:** fix Tilset3D setHeight ([fb95256](https://github.com/nextgis/nextgis_frontend/commit/fb952565adb2734ec4a40df2c955ad51cec90c54))
- **vuetify:** update items on init ([03f78ed](https://github.com/nextgis/nextgis_frontend/commit/03f78ed98e74fc2eb005085f1fce30b3a957ece5))

### Code Refactoring

- rename layerAdapter baseLayer option to baselayer ([368d657](https://github.com/nextgis/nextgis_frontend/commit/368d6576278505ddddde2a1ab160a0849e087c70))

### Features

- **cesium:** add maximumScreenSpaceError option for tilset3d adapter ([c82c524](https://github.com/nextgis/nextgis_frontend/commit/c82c52452765b2e764f6c3d42bc3522bd36a4258))
- **cesium:** set custom logo ([bd05fd3](https://github.com/nextgis/nextgis_frontend/commit/bd05fd3f6e34e9cd7e38bbfe5bd1941583ef8fe8))
- **webmap:** add special MapAdapterOptions option to MapOptions ([e3dd2ec](https://github.com/nextgis/nextgis_frontend/commit/e3dd2eceb5b63bf7c19791deacd72b2e047a74f8))
- **webmap:** implement WebmapLayers get Attributions onlyBaselayer option ([430d51e](https://github.com/nextgis/nextgis_frontend/commit/430d51e7211c050ebeffd68b0c839d9a38170054))

### BREAKING CHANGES

- LayerAdapter option baseLayer was renamed to baselayer;
- webMap.getBaseLayers() method now return LayerAdapter, not string array of ids

# [0.32.0](https://github.com/nextgis/nextgis_frontend/compare/v0.31.0...v0.32.0) (2020-06-03)

### Bug Fixes

- **cesium:** fitBounds for not Scene3D modes ([8fa4155](https://github.com/nextgis/nextgis_frontend/commit/8fa41559f506a7a41372e0f0e497e215fc0f85f5))
- **cesium:** geojson terrainsample ([308d3d3](https://github.com/nextgis/nextgis_frontend/commit/308d3d352110f9496dded2464c78c663bab7a03b))
- **cesium:** Tileset#DAdapter set terrain height ([790760f](https://github.com/nextgis/nextgis_frontend/commit/790760f0b8b90b9c9d572640612cfc00dabfd5d5))
- **vuetify:** correction for set empty BasemapSelect text ([8ab35e4](https://github.com/nextgis/nextgis_frontend/commit/8ab35e426f9333391c746849c0d2316e2cb62ec3))
- **vuetify:** NgwLayersList root item hide ([abba8cb](https://github.com/nextgis/nextgis_frontend/commit/abba8cbd8a46697ba37a768bd2576086591c344c))

### Features

- **cesium:** implement getCenter ([ea83d8e](https://github.com/nextgis/nextgis_frontend/commit/ea83d8ebd8972123ba0991388e4e53fce91b077e))
- **cesium:** skipLevelOfDetail by default ([7429870](https://github.com/nextgis/nextgis_frontend/commit/7429870fb31231fc26298240d665c4ac840f618a))
- **cesium:** tilset 3d adapter height options ([02973bf](https://github.com/nextgis/nextgis_frontend/commit/02973bfcacb6bde3b7d4e23fdd190d0e81536f57))
- **cesium:** update layer and map adapter ([c9d6a1d](https://github.com/nextgis/nextgis_frontend/commit/c9d6a1db8874586adb5ae1901153e71313aa776b))
- **ngw-kit:** add NgwKit.utils.getCompanyLogo method ([3c6fa09](https://github.com/nextgis/nextgis_frontend/commit/3c6fa09321c0e979543b50b93c32da8725920d28))
- **webmap:** zoomIn and zoomOut MapAdapter optional methods ([70b807f](https://github.com/nextgis/nextgis_frontend/commit/70b807fd1d157b5505a3d815f24a02fbb1fff6a6))

# [0.31.0](https://github.com/nextgis/nextgis_frontend/compare/v0.30.2...v0.31.0) (2020-05-13)

### Bug Fixes

- **cesium:** GeoJsonAdapter pin color from empty string ([13ef825](https://github.com/nextgis/nextgis_frontend/commit/13ef8258afad19709cf00a055bb772f425542d1a))
- **cesium:** scene requestRender on layers visibility change ([e513a57](https://github.com/nextgis/nextgis_frontend/commit/e513a573af14660750337e951da84387fab433c2))
- **ngw-kit:** create async adapter from parent resource ([808572b](https://github.com/nextgis/nextgis_frontend/commit/808572b5aff6b04783cd7e9edd078e2ea5404dd2))
- **ngw-kit:** resolve createGeoJsonAdapter options override II ([c65f1ee](https://github.com/nextgis/nextgis_frontend/commit/c65f1eeb2dd0974980c70455d142dba427081521))

### Features

- **cesium:** add Tileset3dAdapter ([c5306f9](https://github.com/nextgis/nextgis_frontend/commit/c5306f9b8bb3e37f287cbd4e3d33a04d93478e2b))
- **cesium:** change layers height on terrain change ([609ac9d](https://github.com/nextgis/nextgis_frontend/commit/609ac9ddae60eb3ac9085c9f29fa93f3aa5b13b4))
- **cesium:** extrude3d paint option ([c4ce679](https://github.com/nextgis/nextgis_frontend/commit/c4ce679cd15bbc87e362048dc007a85ce42516fd))
- **cesium:** fitBounds up tp terrain ([e890d9b](https://github.com/nextgis/nextgis_frontend/commit/e890d9b5ce449dc69c8b531c33b9ce6cb58b10b4))
- **cesium:** get extent of tileset3D ([017a69a](https://github.com/nextgis/nextgis_frontend/commit/017a69afa63cec3f2b1773fb643557a2a88fa363))
- **cesium:** set scene view from new adapter option ([c35e16d](https://github.com/nextgis/nextgis_frontend/commit/c35e16ded6036fccb2edb852bebd68f41fc899eb))
- **ngw-kit:** add addLayerOptionsPriority for createGeoJsonAdapter ([f6c563e](https://github.com/nextgis/nextgis_frontend/commit/f6c563e1bc1238206bb4ba3d8081971d078ef54d))
- **ngw-kit:** make create basemap layer adapter universal ([bbd8c9a](https://github.com/nextgis/nextgis_frontend/commit/bbd8c9a77d527921909ae9b1bf10b3580c5fa600))

## [0.30.2](https://github.com/nextgis/nextgis_frontend/compare/v0.30.1...v0.30.2) (2020-04-30)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [0.30.1](https://github.com/nextgis/nextgis_frontend/compare/v0.30.0...v0.30.1) (2020-04-30)

### Bug Fixes

- **cesium:** cesium geojson layer style ([5f6e439](https://github.com/nextgis/nextgis_frontend/commit/5f6e43937bb9397237c43abccce5889a710716fb))

### Features

- **cesium:** add scale and rotate for 3d model adapter ([c6c67c1](https://github.com/nextgis/nextgis_frontend/commit/c6c67c16356a08a434f9f5482d8fa6bc0b693091))
- **webmap:** update layer adapter options ([b0262ef](https://github.com/nextgis/nextgis_frontend/commit/b0262eff0db1ee56192bb410e8e1128cdc8b167b))

# [0.30.0](https://github.com/nextgis/nextgis_frontend/compare/v0.29.11...v0.30.0) (2020-04-23)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [0.29.11](https://github.com/nextgis/nextgis_frontend/compare/v0.29.10...v0.29.11) (2020-04-22)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [0.29.5](https://github.com/nextgis/nextgis_frontend/compare/v0.29.4...v0.29.5) (2020-04-15)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [0.29.4](https://github.com/nextgis/nextgis_frontend/compare/v0.29.3...v0.29.4) (2020-04-10)

### Bug Fixes

- **cesium:** remove default imagery provider ([cb7d7d2](https://github.com/nextgis/nextgis_frontend/commit/cb7d7d290bf3ebc58eebbdb978150a7e7fff7ace))

## [0.29.3](https://github.com/nextgis/nextgis_frontend/compare/v0.29.2...v0.29.3) (2020-04-02)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [0.29.2](https://github.com/nextgis/nextgis_frontend/compare/v0.29.1...v0.29.2) (2020-04-01)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [0.29.1](https://github.com/nextgis/nextgis_frontend/compare/v0.29.0...v0.29.1) (2020-03-30)

### Bug Fixes

- **build:** control-container extract css ([05d96c8](https://github.com/nextgis/nextgis_frontend/commit/05d96c8a4f4861a666244139a5903b2deb34194b))

# [0.29.0](https://github.com/nextgis/nextgis_frontend/compare/v0.28.3...v0.29.0) (2020-03-22)

### chore

- build; eslint ([97e3b07](https://github.com/nextgis/nextgis_frontend/commit/97e3b07da07b57373e6861ab6e2d6f9b60a6ec2c))

### BREAKING CHANGES

- code formatting rules changed to prettier 2.0 compatibility

## [0.28.3](https://github.com/nextgis/nextgis_frontend/compare/v0.28.2...v0.28.3) (2020-03-19)

### Features

- **cesium:** pin paint implementation for geojson layer ([7fadb6d](https://github.com/nextgis/nextgis_frontend/commit/7fadb6d6f6a7ae8dfc0449ded1c1595ebba476ed))
- **ngw:** option to create popup content from item ([3c4a809](https://github.com/nextgis/nextgis_frontend/commit/3c4a809dc7cd9045e3ed1622b1eea0036e5205a1))
- add library `@nextgis/paint` ([99391ec](https://github.com/nextgis/nextgis_frontend/commit/99391ec1ac9fd80508816417d9eb2ae0fd734340))

## [0.28.2](https://github.com/nextgis/nextgis_frontend/compare/v0.28.1...v0.28.2) (2020-03-12)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [0.28.1](https://github.com/nextgis/nextgis_frontend/compare/v0.28.0...v0.28.1) (2020-03-12)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [0.28.0](https://github.com/nextgis/nextgis_frontend/compare/v0.27.1...v0.28.0) (2020-03-12)

### Features

- **cesium:** geojson adapter paint ([657b411](https://github.com/nextgis/nextgis_frontend/commit/657b411f1efb9835ff9f9255c47424179e3b3caa))

## [0.27.1](https://github.com/nextgis/nextgis_frontend/compare/v0.27.0...v0.27.1) (2020-03-10)

### Features

- new @nextgis/dom library ([82a645d](https://github.com/nextgis/nextgis_frontend/commit/82a645d213d0b9ef1bb3c443dc28a94866c2884b))
- **control:** add universal zoom control ([1ffc089](https://github.com/nextgis/nextgis_frontend/commit/1ffc089942f1709f82cec8398d301503819be718))
- add new library `ControlContainer` ([e68afeb](https://github.com/nextgis/nextgis_frontend/commit/e68afeb5efb1e40bf20df2effa805fe80c437478))
- **cesium:** add mapAdapter listeners and getBounds method ([3033475](https://github.com/nextgis/nextgis_frontend/commit/3033475bc1cc519efe08f18e9e741750d35a0f25))

# [0.27.0](https://github.com/nextgis/nextgis_frontend/compare/v0.26.0...v0.27.0) (2020-03-06)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

# [0.26.0](https://github.com/nextgis/nextgis_frontend/compare/v0.25.8...v0.26.0) (2020-03-01)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [0.25.8](https://github.com/nextgis/nextgis_frontend/compare/v0.25.7...v0.25.8) (2020-02-29)

**Note:** Version bump only for package @nextgis/cesium-map-adapter

## [0.25.7](https://github.com/nextgis/nextgis_frontend/compare/v0.25.5...v0.25.7) (2020-02-24)

### Bug Fixes

- **qms-kit:** mix layerAdapter class property ([5bae578](https://github.com/nextgis/nextgis_frontend/commit/5bae5787174a03ebe9560152dd54576eea77448d))

## [0.25.6](https://github.com/nextgis/nextgis_frontend/compare/v0.20.3...v0.25.6) (2020-02-24)

### Bug Fixes

- **qms-kit:** mix layerAdapter class property ([5bae578](https://github.com/nextgis/nextgis_frontend/commit/5bae5787174a03ebe9560152dd54576eea77448d))

## [0.25.5](https://github.com/nextgis/nextgis_frontend/compare/v0.25.4...v0.25.5) (2020-02-20)

**Note:** Version bump only for package @nextgis/cesium-map-adapter
