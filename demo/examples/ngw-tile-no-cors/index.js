import NgwMap from '@nextgis/ngw-leaflet';
NgwMap.create({
  target: 'map',
  center: [-115.149631, 36.161019],
  zoom: 15,
  osm: true,
}).then((ngwMap) => {
  ngwMap.addTileLayer(
    'https://demo.nextgis.com/api/component/render/tile?resource=10049,10047,10045,10043&nd=204&z={z}&x={x}&y={y}',
  );
});
