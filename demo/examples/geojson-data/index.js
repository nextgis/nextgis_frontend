import NgwMap from '@nextgis/ngw-leaflet';
let ID = 0;
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  bounds: [0, -90, 180, 90],
}).then((ngwMap) => {
  ngwMap.addLayer('GEOJSON', {
    id: 'data',
    paint: { color: ['get', 'color'] },
  });
  const list = document.createElement('div');

  const dataControl = ngwMap.createControl(
    {
      onAdd: () => list,
      onRemove: () => {},
    },
    { margin: true },
  );
  ngwMap.addControl(dataControl, 'top-right');

  createItem();

  function createItem() {
    const item = document.createElement('div');
    item.id = String(ID++);
    item.className = 'data-item';
    const input = document.createElement('input');
    const btn = document.createElement('button');
    btn.innerHTML = '+';

    item.appendChild(input);
    item.appendChild(btn);

    list.appendChild(item);

    updateInputValue(input);

    btn.onclick = () => {
      if (btn.innerHTML === '+') {
        const v = input.value.split(' ');
        if (v.length > 2) {
          createItem();
          btn.innerHTML = '-';
          input.disabled = true;
          input.style.backgroundColor = v[2];
          ngwMap.addLayerData(
            'data',
            /** @type {import('geojson').Feature} */ ({
              type: 'Feature',
              id: item.id,
              geometry: {
                type: 'Point',
                coordinates: [Number(v[0]), Number(v[1])],
              },
              properties: { color: v[2] },
            }),
          );
        } else {
          updateInputValue(input);
        }
      } else {
        ngwMap.clearLayerData('data', (f) => f.id === item.id);
        item.parentNode.removeChild(item);
      }
    };
  }
});

function updateInputValue(input) {
  input.value = getRandomPointCoord() + ' ' + randomRgb();
}

function getRandomPointCoord() {
  const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
  return (
    Math.round(Math.random() * 180) +
    ' ' +
    Math.round(Math.random() * 90 * plusOrMinus)
  );
}

// Function to generate a random RGB color
function randomRgb() {
  const o = Math.round;
  const r = Math.random;
  const s = 255;
  return `rgb(${o(r() * s)},${o(r() * s)},${o(r() * s)})`;
}
