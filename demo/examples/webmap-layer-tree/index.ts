import NgwMap from '@nextgis/ngw-leaflet';

import type { NgwWebmapItem } from '@nextgis/ngw-kit';

const tree = document.getElementById('tree') as HTMLDivElement;
const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
});
ngwMap.onLoad().then(() => {
  ngwMap
    .addNgwLayer({
      resource: 4355,
      adapter: 'NGW:WEBMAP',
      fit: true,
    })
    .then((webmap) => {
      if (webmap?.layer) {
        tree.appendChild(createTreeItem(webmap.layer));
      }
    });
});

function createTreeBranch(layers: NgwWebmapItem[]) {
  const elem = document.createElement('div');
  elem.className = 'tree-container__item-children';
  for (const x of layers) {
    if (x.item) {
      const item = createTreeItem(x);
      elem.appendChild(item);
    }
  }
  return elem;
}

function createTreeItem(layer: NgwWebmapItem) {
  const item = layer.item;
  const elem = document.createElement('div');
  elem.className = 'tree-container__item';
  if (item.display_name) {
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    const value = item.item_type === 'layer' ? item.layer_enabled : true;
    input.checked = value;

    const visibility = layer.properties.property('visibility');
    if (visibility) {
      visibility.emitter.on('change', (ev) => {
        input.checked = ev.value;
      });
      input.onclick = () => {
        visibility.set(input.checked, {
          propagation: NgwMap.keys.pressed('ctrl'),
        });
      };
    }
    elem.appendChild(input);
    const slider = createLayerOpacitySlider(layer);
    elem.appendChild(slider);

    const name = document.createElement('span');
    name.innerHTML = item.display_name;
    elem.appendChild(name);
  }

  if (
    (item.item_type === 'group' || item.item_type === 'root') &&
    item.children.length
  ) {
    const children = layer.tree.getChildren();
    const treeBranch = createTreeBranch(children.reverse());
    elem.appendChild(treeBranch);
  }
  return elem;
}

function createLayerOpacitySlider(layer: NgwWebmapItem) {
  const wrapper = document.createElement('span');
  const slider = document.createElement('input');
  slider.style.width = '30px';
  slider.id = String(layer.id);
  slider.type = 'range';
  slider.min = '0';
  slider.max = '1';
  slider.step = '0.1';
  slider.value = String(layer.properties.get('opacity') ?? 1);

  slider.onchange = () => {
    layer.properties.set('opacity', Number(slider.value));
  };
  wrapper.appendChild(slider);
  return wrapper;
}
