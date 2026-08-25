import NgwMap from '@nextgis/ngw-leaflet';
import { debounce } from '@nextgis/utils';

const bounds = [-3.71133, 40.4117, -3.6978, 40.42115];

NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  bounds,
  osm: true,
}).then((ngwMap) => {
  ngwMap.addNgwLayer({
    resource: 6098,
    id: 'building',
    adapterOptions: { interactive: false, intersects: bounds },
  });

  const paintControl = ngwMap.createControl(
    {
      onAdd: () => {
        const elem = document.createElement('div');
        elem.innerHTML = `
        <div class="">
          <input id="fill-color-select" type="color" />
          <label for="fill-color-select">Fill color</label>
        </div>
        <div>
          <input id="stroke-color-select" type="color" />
          <label for="stroke-color-select">Stroke color</label>
        </div>
        <div>
          <input id="stroke-weight-select" type="range" min="1" max="5" step="1"/>
          <label for="stroke-weight-select">Stroke weight</label>
        </div>
        `;
        /** @type {HTMLInputElement} */
        const fillColorSelect = elem.querySelector('#fill-color-select');
        /** @type {HTMLInputElement} */
        const strokeWeightSelect = elem.querySelector(
          '#stroke-weight-select',
        );
        /** @type {HTMLInputElement} */
        const strokeColorSelect = elem.querySelector(
          '#stroke-color-select',
        );
        fillColorSelect.value = String(ngwMap.options.paint.color);
        strokeColorSelect.value = String(ngwMap.options.paint.color);
        strokeWeightSelect.value = String(ngwMap.options.paint.weight);

        const updatePaint = debounce(() => {
          ngwMap.updateLayerPaint('building', {
            fillColor: fillColorSelect.value,
            strokeColor: strokeColorSelect.value,
            weight: Number(strokeWeightSelect.value),
          });
        }, 300);

        fillColorSelect.oninput = () => {
          updatePaint();
        };
        strokeColorSelect.oninput = () => {
          updatePaint();
        };
        strokeWeightSelect.oninput = () => {
          updatePaint();
        };

        return elem;
      },
      onRemove: () => {},
    },
    { bar: true, addClass: 'paint-control' },
  );

  ngwMap.addControl(paintControl, 'top-right');
});
