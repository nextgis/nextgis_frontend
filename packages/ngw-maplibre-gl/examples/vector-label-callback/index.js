import NgwMap from '@nextgis/ngw-maplibre-gl';

NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  resources: [
    {
      resource: 4224,
      fit: true,
      adapterOptions: {
        interactive: false,
        // Custom label function for vector layer
        label: ({ feature, getBounds, getCenter }) => {
          // Constructing a label string with feature ID, name, bounding box, and center
          return `#${feature.id} ${feature.properties.NAME}
          BBOX: ${getBounds()
            .map((c) => c.toFixed(4))
            .join(' ')};
          Center: ${getCenter()
            .map((c) => c.toFixed(4))
            .join(' ')}`;
        },
      },
    },
  ],
  osm: true,
});
