import { WebMap } from '@nextgis/webmap';
import { OlMapAdapter } from '@nextgis/ol-map-adapter';
import { NgwKit } from '@nextgis/ngw-kit';
import { QmsKit } from '@nextgis/qms-kit';

const ngwKit = new NgwKit({
  'baseUrl': "http://geonote.nextgis.com",
  'resourceId': 1,
  // 'pixelRadius': 10,
  // auth: {
  //   login: 'administrator',
  //   password: '',
  // }
})

const webMap = new WebMap({
  mapAdapter: new OlMapAdapter(),
  starterKits: [new QmsKit(), ngwKit],
});

webMap.create({
  target: 'map'
}).then(() => {
  // webMap.addBaseLayer('sputnik', 'QMS', {
  //   qmsid: 487
  // }).then((layer) => {
  //   webMap.map.showLayer(layer.name);
  // });
});

webMap.addBaseLayer('osm', 'OSM').then((layer) => {
  webMap.map.showLayer(layer.name);
});


webMap.emitter.on('add-layers', function () {
  // webMap.layers.tree.getDescendants().forEach(function (x) {
  //   // x.properties.set('visibility', false);
  //   x.properties.set('visibility', true);
  // })
  // const layerE = webMap.layers.tree.getDescendants(function (x) {
  //   return x.item.display_name === 'E' && x.item.item_type === 'layer';
  // })[0];
  // layerE.properties.set('visibility', true, { bubble: true });
})


webMap.emitter.on('click', function (evt) {

  // Map lat lng coordinates
  console.log('latlang', evt.latLng);

  // Display pixel coordinates
  console.log('pixel', evt.pixel);

  // Open layers click event data
  console.log('OL evt', evt.source);

  webMap.map.addLayer('MARKER', {
    latLng: evt.latLng
  }).then((x) => {
    webMap.map.showLayer(x.name);
  });

  // TODO layer_style_id - 1 is hardcode to get layers id for geonote.nextgis.com instant
  const layers = webMap.layers.tree.getDescendants().filter((x) => {
    return x.item.item_type === 'layer' && x.properties.get('visibility');
  }).map((x) => x.item.layer_style_id - 1);

  ngwKit.sendIdentifyRequest(evt, webMap, { layers: layers })
    .then((resp) => console.log(resp))
    .catch((er) => console.log(er));
});

// better use this subscribe to future compatibility
webMap.emitter.on('identify', function (data) {
  console.log(data);
});

window.webMap = webMap;
