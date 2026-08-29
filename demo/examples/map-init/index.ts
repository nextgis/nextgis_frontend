import NgwMap from '@nextgis/ngw-leaflet';
// Map 1: Initialization with specific zoom and center
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map1',
  osm: true,
  zoom: 10,
  center: [2.3522, 48.8566], // Paris, France
}).then(addMapControl);

// Map 2: Initialization with bounds
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map2',
  osm: true,
  bounds: [12.34, 45.433, 12.376, 45.444], // Venice, Italy
}).then(addMapControl);

// Map 3: Initialization with maxBounds and zoom
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map3',
  osm: true,
  zoom: 12,
  center: [-74.006, 40.7128], // New York City, USA
  maxBounds: [-75, 40, -73, 41], // Around New York City
}).then(addMapControl);

// Map 4: Initialization with minZoom and maxZoom
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map4',
  osm: true,
  zoom: 11,
  minZoom: 8,
  maxZoom: 16,
  center: [37.6173, 55.7558], // Moscow, Russia
}).then(addMapControl);

// Map 5: Initialization with zoom and maxBounds
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map5',
  osm: true,
  zoom: 14,
  center: [-0.1278, 51.5074], // London, UK
  maxBounds: [-0.38, 51.28, 0.15, 51.74], // Greater London Area
}).then(addMapControl);

// Map 6: Initialization with bounds and maxZoom
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map6',
  osm: true,
  zoom: 2, // Initial zoom level for a world overview
  maxZoom: 2, // Prevent zooming in beyond the world overview
}).then(addMapControl);

function addMapControl(ngwMap: NgwMap) {
  const zoomControl = ngwMap.createControl(
    {
      onAdd() {
        const element = document.createElement('div');
        const updateElement = () => {
          const zoom = ngwMap.getZoom();
          if (zoom === undefined) return;
          element.innerHTML = String(Math.round(zoom));
        };
        ngwMap.emitter.on('zoom', updateElement);
        updateElement();
        return element;
      },
      onRemove: () => {},
    },
    { bar: true },
  );
  ngwMap.addControl(zoomControl, 'top-right');
}
