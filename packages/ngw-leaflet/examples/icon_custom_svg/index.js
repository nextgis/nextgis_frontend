import NgwMap from '@nextgis/ngw-leaflet';
import { getIcon } from '@nextgis/icons';
// Initializing the NGW Map with basic parameters
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 529,
}).then((ngwMap) => {
  const svgResourceId = 9037;

  // Fetching the SVG resource from the NGW
  ngwMap.connector.getResource(svgResourceId).then((res) => {
    const promises = [];

    // Loop over the SVG files and fetch each of them
    for (const file of res.svg_marker_library.files) {
      promises.push(
        ngwMap.connector.get('resource.file_download', {
          params: { id: svgResourceId, name: file.name },
        }),
      );
    }

    // Once all SVGs are fetched, add them as layers on the map
    Promise.all(promises).then((icons) => {
      // Add SVG icon layer for cities
      ngwMap.addNgwLayer({
        resource: 9030,
        fit: true,
        adapterOptions: {
          paint: getIcon({
            svg: icons[0],
            size: 20,
          }),
          selectable: true,
          selectedPaint: getIcon({
            svg: icons[0],
            size: 30,
          }),
        },
      });
      // Add SVG icon layer for lakes
      ngwMap.addNgwLayer({
        id: 'lakes',
        resource: 9032,
        adapterOptions: {
          interactive: false,
          paint: getIcon({
            svg: icons[1],
            size: 20,
          }),
        },
      });
      // Add SVG icon layer for peaks
      ngwMap.addNgwLayer({
        id: 'lakes',
        resource: 9034,
        adapterOptions: {
          interactive: false,
          paint: getIcon({
            svg: icons[2],
            size: 20,
          }),
        },
      });
    });
  });
});
