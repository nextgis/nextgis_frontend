import NgwMap from '@nextgis/ngw-leaflet';

import type { LayerAdapter } from '@nextgis/webmap';

NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
  resources: [
    { resource: 7160, fit: true, adapterOptions: { opacity: 0.5 } },
    {
      resource: 7152,
      adapterOptions: { paint: { color: 'orange' } },
    },
  ],
}).then((ngwMap) => {
  ngwMap.addControl('CONTROL', 'top-right', {
    control: {
      onAdd: () => createOpacityControlPanel(ngwMap.orderedLayers().reverse()),
    },
    options: { bar: true },
  });

  function createOpacityControlPanel(layers: LayerAdapter[]) {
    const block = document.createElement('div');
    block.className = 'opacity-control-panel';
    for (const l of layers) {
      block.appendChild(createLayerOpacitySlider(l));
    }
    return block;
  }

  function createLayerOpacitySlider(layer: LayerAdapter) {
    const wrapper = document.createElement('div');
    if (!layer.id) throw new Error('Layer id is missing');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = ngwMap.isLayerVisible(layer);
    checkbox.onchange = () => {
      ngwMap.toggleLayer(layer, checkbox.checked);
    };
    wrapper.appendChild(checkbox);

    const slider = document.createElement('input');
    slider.id = layer.id;
    slider.type = 'range';
    slider.min = '0';
    slider.max = '1';
    slider.step = '0.1';
    slider.value = String(layer.options.opacity ?? 1);

    // Set opacity dynamically during slider movement
    slider.oninput = () => {
      ngwMap.setLayerOpacity(layer, Number(slider.value));
    };
    wrapper.appendChild(slider);

    const label = document.createElement('label');
    label.setAttribute('for', layer.id);
    label.innerHTML = layer.options.name ?? layer.id;
    wrapper.appendChild(label);
    return wrapper;
  }
});
