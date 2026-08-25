import NgwMap from '@nextgis/ngw-leaflet';
import {
  degrees2meters,
  degrees2Radian,
  meters2degrees,
} from '@nextgis/utils';
// initialize map
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  maxZoom: 22,
}).then((ngwMap) => {
  // add ngw layer with cameras
  ngwMap.addNgwLayer({
    resource: 5021,
    id: 'cameras',
    fit: true,
    adapterOptions: {
      paint: { color: 'red', radius: 5 },
      selectedPaint: { color: 'green', radius: 5 },
      selectable: true,
    },
  });
  // add empty geojson to show highlighted cameras sector
  ngwMap.addGeoJsonLayer({
    id: 'sectors',
    type: 'polygon',
    paint: { color: 'green' },
  });
  ngwMap.emitter.on('layer:click', (e) => {
    if (e.layer.id === 'cameras') {
      if (e.selected) {
        updateCameraPanel(e.feature);
      } else {
        updateCameraPanel();
      }
    }
  });

  // create camera element
  const cameraPanel = document.createElement('div');
  cameraPanel.className = 'camera-panel';
  cameraPanel.innerHTML =
    '<div class="camera-wrapper" style="display: none;">' +
    '<p class="camera-title"></p>' +
    '<video-js id="vid1" width="250" height="250" class="vjs-default-skin" controls></video-js>' +
    '</div>' +
    '<div class="no-active-camera-block">Select camera</div>';

  // create camera panel control
  const cameraPanelControl = ngwMap.createControl(
    {
      onAdd: () => {
        return cameraPanel;
      },
      onRemove: () => {},
    },
    { bar: true },
  );
  // add control to the map
  ngwMap.addControl(cameraPanelControl, 'bottom-right');

  // define some element after the panel is added to the DOM
  /** @type {HTMLElement} */
  const wrapper = cameraPanel.querySelector('.camera-wrapper');
  /** @type {HTMLElement} */
  const title = cameraPanel.querySelector('.camera-title');
  const player = videojs(cameraPanel.querySelector('#vid1'));

  async function updateCameraPanel(feature) {
    if (feature) {
      try {
        const resp = await fetch(feature.properties.tokenPage);
        const text = await resp.text();
        const regex = /token=([a-zA-Z0-9._-]+)/;
        const match = text.match(regex);
        const token = match ? match[1] : null;

        wrapper.style.display = 'block';
        title.innerHTML = 'Camera #' + feature.properties.name;
        player.src({
          src: `${feature.properties.camera}?token=${token}`,
          type: 'application/x-mpegURL',
          overrideNative: true,
        });
        player.play();
        ngwMap.setLayerData('sectors', cameraSectorPoly(feature));
      } catch (error) {
        console.error('Error fetching camera token:', error);
        wrapper.style.display = 'none';
        title.innerHTML = 'Error loading camera';
        ngwMap.clearLayerData('sectors');
      }
    } else {
      ngwMap.clearLayerData('sectors');
      wrapper.style.display = 'none';
      player.pause();
    }
  }

  function cameraSectorPoly(feature) {
    const props = feature.properties;
    const xy = degrees2meters.apply(this, feature.geometry.coordinates);
    const x = xy[0];
    const y = xy[1];
    const azimuth = degrees2Radian(
      90 - (props.azimuth !== undefined ? props.azimuth : 90),
    );
    const angle = degrees2Radian(
      props.angle !== undefined ? props.angle : 60,
    );
    const focalLength =
      props.focalLength !== undefined ? props.focalLength : 300;

    // get a formula from the NextGIS best mathematician
    const l = focalLength * Math.tan(angle / 2);
    const coordinates = [feature.geometry.coordinates].concat(
      [
        [
          -l * Math.sin(azimuth) + x + focalLength * Math.cos(azimuth),
          l * Math.cos(azimuth) + y + focalLength * Math.sin(azimuth),
        ],
        [
          l * Math.sin(azimuth) + x + focalLength * Math.cos(azimuth),
          -l * Math.cos(azimuth) + y + focalLength * Math.sin(azimuth),
        ],
      ].map((x) => {
        return meters2degrees.apply(this, x);
      }),
      [feature.geometry.coordinates],
    );
    return /** @type {import('geojson').Feature} */ ({
      type: 'Feature',
      properties: feature.properties,
      geometry: { type: 'Polygon', coordinates: [coordinates] },
    });
  }
});
