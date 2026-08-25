import NgwMap from '@nextgis/ngw-maplibre-gl';
NgwMap.create({
  target: 'map',
  baseUrl: 'https://demo.nextgis.com',
  osm: true,
  center: [-3.645321, 40.425052],
  minZoom: 12,
  auth: { login: 'ngf_test', password: 'ngf_test' },
}).then((ngwMap) => {
  ngwMap.addNgwLayer({
    resource: 6077,
    adapter: 'MVT',
    adapterOptions: {
      selectable: true,
      paint: {
        fillOpacity: 0.3,
        stroke: true,
        strokeColor: 'white',
        weight: 2,
        color: [
          'match',
          ['get', 'ADMIN_LVL'],
          '2','#ff5053',
          '3','#ffbcfa',
          '4','#fff128',
          '5','#5857ff',
          '6','#a744b4',
          '8','#44a595',
          '9','#767676',
          'gray', // last item is default value
        ],
      },
      selectedPaint: {
        fillOpacity: 0.7,
        stroke: true,
        color: 'blue',
        strokeColor: 'white',
        weight: 2,
      }
    },
  });
  ngwMap.addNgwLayer({
    resource: 6079,
    adapter: 'MVT',
    adapterOptions: {
      paint: {
        weight: [
          'match',
          ['get', 'WATERWAY'],
          'river', 2,
          'drain', 0.5,
          1, // last item is default value
        ],
        color: '#a6cee3',
      },
    },
  });
  ngwMap.addNgwLayer({
    resource: 6082,
    adapter: 'MVT',
    adapterOptions: {
      paint: {
        color: 'black',
        stroke: true,
        strokeColor: 'white',
        weight: [
          'match',
          ['get', 'PLACE'],
          'city', 2,
          'town', 1.5,
          1, // last item is default value
        ],
        radius: [
          'match',
          ['get', 'PLACE'],
          'city', 8,
          'town', 6,
          'village', 5,
          'hamlet', 4,
          'locality', 2,
          1, // last item is default value
        ],
      },
    },
  });

});
