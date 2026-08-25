import NgwMap from '@nextgis/ngw-ol';

NgwMap.create({
  baseUrl: 'https://demo.nextgis.com/',
  target: 'map',
  center: [104, 52],
  zoom: 6,
}).then((ngwMap) => {
  ngwMap.addLayer('TILE', {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    subdomains: ['a', 'b', 'c'],
  });
});
