import { WebMap } from '@nextgis/webmap';
import { OlMapAdapter } from '@nextgis/ol-map-adapter';
import { NgwKit } from '@nextgis/ngw-kit';



const webMap = new WebMap({
  mapAdapter: new OlMapAdapter(),
  starterKits: [new NgwKit({
    'baseUrl': "http://geonote.nextgis.com",
    'resourceId': 1
  })],
});

webMap.create({
  target: 'map'
});
webMap.addBaseLayer('osm', 'OSM');

webMap.emitter.on('build-map', function () {
  webMap.map.showLayer('osm');
});
