import { WebMap } from '@nextgis/webmap';
import { OlMapAdapter } from '@nextgis/ol-map-adapter';
import { NgwKit } from '@nextgis/ngw-kit';

const webMap = new WebMap({
  mapAdapter: new OlMapAdapter(),
  starterKits: [new NgwKit({
    // 'baseUrl': "http://geonote.nextgis.com",
    // 'resourceId': 1
    'baseUrl': 'http://oriental-stork.amurinfocenter.org',
    'resourceId': 5
  })],
});

webMap.create({
  target: 'map'
});
webMap.addBaseLayer('osm', 'OSM');

webMap.emitter.on('build-map', function () {
  webMap.map.showLayer('osm');
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


webMap.map.emitter.on('click', function (evt) {

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
});

window.webMap = webMap;
