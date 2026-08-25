import NgwMap from '@nextgis/ngw-leaflet';
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
}).then((ngwMap) => {
  const legendContainer = document.createElement('div');
  legendContainer.className = 'legend-container';
  ngwMap.addNgwLayer({ resource: 7183, fit: true }).then((layer) => {
    if (layer.getLegend) {
      layer.getLegend().then((legend) => {
        displayLegend(legend, legendContainer, ngwMap);
      });
    }
  });
  const legendPanel = ngwMap.createControl(
    {
      onAdd: () => legendContainer,
      onRemove: () => {},
    },
    { bar: true },
  );
  ngwMap.addControl(legendPanel, 'top-right');
});

function displayLegend(legend, legendContainer, webMap) {
  legendContainer.innerHTML = '';

  legend.forEach((layerLegend) => {
    const layerSection = document.createElement('div');
    layerSection.classList.add('layer-section');

    // Add a title for the layer with a checkbox
    const layerTitleContainer = document.createElement('div');
    layerTitleContainer.className = 'layer-title';

    const layerCheckbox = document.createElement('input');
    layerCheckbox.type = 'checkbox';
    layerCheckbox.checked = webMap.isLayerVisible(layerLegend.layerId);
    layerCheckbox.onchange = () => {
      webMap.toggleLayer(layerLegend.layerId, layerCheckbox.checked);
    };

    const layerTitle = document.createElement('label');
    layerTitle.textContent =
      webMap.getLayer(layerLegend.layerId).options.name ||
      `Layer ID: ${layerLegend.layerId}`;

    layerTitleContainer.appendChild(layerCheckbox);
    layerTitleContainer.appendChild(layerTitle);
    layerSection.appendChild(layerTitleContainer);

    // Iterate through each LegendItem in the current LayerLegend
    layerLegend.legend.forEach((item) => {
      if (item.icon.format === 'png') {
        // Create an image element for the PNG symbol
        const img = document.createElement('img');
        img.src = `data:image/png;base64,${item.icon.data}`;
        img.alt = item.display_name;
        if (!item.render) {
          img.className = 'disabled';
        }
        img.onclick = () => {
          layerLegend.setSymbolRender(item.index, !item.render);
          displayLegend(legend, legendContainer, webMap);
        };

        // Create a label for the legend item
        const label = document.createElement('span');
        label.textContent = item.display_name;

        // Append the image and label to the layer section
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('legend-item');
        itemContainer.appendChild(img);
        itemContainer.appendChild(label);

        layerSection.appendChild(itemContainer);
      }
    });

    legendContainer.appendChild(layerSection);
  });
}
