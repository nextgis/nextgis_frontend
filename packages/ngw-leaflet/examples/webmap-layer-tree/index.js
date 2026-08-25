import NgwMap from '@nextgis/ngw-leaflet';
const tree = document.getElementById('tree');
const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
});
ngwMap.onLoad().then(() => {
  const webMapLayer = ngwMap
    .addNgwLayer({
      resource: 4355,
      fit: true,
    })
    .then((webmap) => {
      tree.appendChild(createTreeItem(webmap.layer));
    });
});

function createTreeBranch(layers) {
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

function createTreeItem(layer) {
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

  const itemHasChildren =
    ['group', 'root'].includes(item.item_type) && item.children.length;
  if (itemHasChildren) {
    const children = layer.tree.getChildren();
    const treeBranch = createTreeBranch(children.reverse());
    elem.appendChild(treeBranch);
  }
  return elem;
}

function createLayerOpacitySlider(layer) {
  const wrapper = document.createElement('span');
  const slider = document.createElement('input');
  slider.style.width = '30px';
  slider.id = layer.id;
  slider.type = 'range';
  slider.min = '0';
  slider.max = '1';
  slider.step = '0.1';
  slider.value = String(layer.options.opacity ?? 1);

  slider.onchange = () => {
    layer.properties.set('opacity', Number(slider.value));
  };
  wrapper.appendChild(slider);
  return wrapper;
}
