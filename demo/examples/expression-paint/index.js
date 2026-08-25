import NgwMap from '@nextgis/ngw-leaflet';
// Initialize the NextGIS map with predefined bounds
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 1300,
  bounds: [0, 0, 170, 80],
}).then((ngwMap) => {
  // Add a GeoJSON layer to the map with dynamic styling
  ngwMap.addGeoJsonLayer({
    data: generateGeoJson(),
    paint: {
      color: ['get', 'color'], // Fetch the color property for each feature
      radius: ['get', 'radius'], // Fetch the radius property for each feature
      stroke: true,
      fillOpacity: 0.7,
    },
  });
});

// Function to generate random integer within a range
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Predefined colors for the features
const colors = ['red', 'green', 'blue', 'purple', 'yellow', 'white'];

// Function to generate random GeoJSON points
function generateGeoJson() {
  /** @type {import('geojson').FeatureCollection} */
  const points = {
    type: 'FeatureCollection',
    features: [],
  };
  for (let fry = 0; fry < 400; fry++) {
    points.features.push({
      type: 'Feature',
      properties: {
        color: colors[Math.floor(Math.random() * colors.length)], // Assign a random color
        radius: getRandomIntInclusive(3, 10), // Assign a random radius
      },
      geometry: {
        type: 'Point',
        coordinates: [
          Math.ceil(Math.random() * 170), // Random longitude
          Math.ceil(Math.random() * 80), // Random latitude
        ],
      },
    });
  }
  return points;
}
