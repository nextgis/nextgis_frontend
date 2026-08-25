import NgwMap from '@nextgis/ngw-leaflet';
const layers = [
  { resource: 9049, description: 'Webmap resource' },
  { resource: 9034, description: 'Vector resource' },
  {
    resource: 9034,
    description: 'First style of vector resource',
    adapter: 'IMAGE',
  },
  { resource: 9033, description: 'Style resource' },
  {
    resource: 9033,
    description: 'Vector resource from style resource parent',
    adapter: 'GEOJSON',
  },
];

const layersBlock = document.getElementById('layers');
const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
});

for (let f = 0; f < layers.length; f++) {
  const wrap = document.createElement('div');
  const layer = layers[f];
  const radio = document.createElement('input');
  radio.id = String(layer.resource);
  radio.setAttribute('name', 'layers');
  radio.setAttribute('type', 'radio');
  radio.onchange = () => {
    onRadioChange(layer);
  };
  setRadioListener(radio, layer);
  const label = document.createElement('label');
  label.innerHTML = 'id: ' + layer.resource;
  if (layer.adapter) {
    label.innerHTML += ', adapter: ' + layer.adapter;
  }
  label.setAttribute('for', radio.id);

  const description = document.createElement('div');
  description.className = 'description';
  description.innerHTML = layer.description;

  wrap.appendChild(radio);
  wrap.appendChild(label);
  wrap.appendChild(description);

  layersBlock.appendChild(wrap);
}

function setRadioListener(radio, layer) {
  radio.onchange = () => {
    onRadioChange(layer);
  };
}

function onRadioChange(options) {
  ngwMap.removeOverlays();
  ngwMap.addNgwLayer(options).then((layer) => {
    Promise.resolve(layer.getExtent()).then((extent) => {
      if (extent) {
        ngwMap.fitBounds(extent);
      }
    });
  });
}
